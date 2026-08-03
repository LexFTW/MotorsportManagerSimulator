import type * as Party from 'partykit/server';
import {
    RaceEngine,
    AIStrategyManager,
    calcSpeedMultipliers,
    calcEffectiveDegradationRate,
    RaceStatus,
    RaceEventType,
    TyreCompound,
    DEFAULT_STRATEGY,
    type C2SMessage,
    type S2CMessage,
    type EngineDriver,
    type PlayerSlot,
    type FullRaceState,
    type TeamStrategyProfile,
    type DriverDelta,
} from '@motorsport/race-engine';
import { buildSpeedMapFromPath } from '../../../packages/race-engine/src/buildSpeedMapServer';

// ─── Types stored in Party durable storage ───────────────────────────────────

interface PartyStorage {
    circuitPath: string;
    totalLaps:   number;
    sectorThresholds: [number, number];
    players:     PlayerSlot[];
    status:      typeof RaceStatus[keyof typeof RaceStatus];
    /** Serialised engine driver state for mid-race reconnects. */
    driverSnapshot: EngineDriver[];
    tick:        number;
}

const TICK_INTERVAL_MS  = 16;   // ~60 ticks/s
const BROADCAST_EVERY   = 12;   // broadcast every 12 ticks (~200ms)

export default class RaceParty implements Party.Server {
    private engine:     RaceEngine | null = null;
    private aiManagers: Map<string, AIStrategyManager> = new Map();
    // connectionId → userId
    private connUsers:  Map<string, string> = new Map();
    private intervalId: ReturnType<typeof setInterval> | null = null;
    private tick = 0;

    constructor(readonly party: Party.Party) {}

    // ─── Connection lifecycle ─────────────────────────────────────────────────

    async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext): Promise<void> {
        // Send current state so the client can render immediately on connect
        const storage = await this.loadStorage();
        if (!storage) return;

        const state = this.buildFullState(storage);
        this.send(conn, { type: 'FULL_STATE', state });
    }

    async onMessage(raw: string, sender: Party.Connection): Promise<void> {
        let msg: C2SMessage;
        try {
            msg = JSON.parse(raw) as C2SMessage;
        } catch {
            this.send(sender, { type: 'ERROR', message: 'Invalid JSON' });
            return;
        }

        switch (msg.type) {
            case 'JOIN':        await this.handleJoin(msg, sender);        break;
            case 'RECONNECT':   await this.handleReconnect(msg, sender);   break;
            case 'SET_STRATEGY': await this.handleSetStrategy(msg, sender); break;
            case 'PIT_STOP':    await this.handlePitStop(msg, sender);     break;
            case 'START_RACE':  await this.handleStartRace(sender);        break;
            case 'PING':
                this.send(sender, { type: 'PONG', serverTime: Date.now() });
                break;
        }
    }

    async onClose(conn: Party.Connection): Promise<void> {
        const userId = this.connUsers.get(conn.id);
        if (!userId) return;
        this.connUsers.delete(conn.id);

        const storage = await this.loadStorage();
        if (!storage) return;

        const slot = storage.players.find(p => p.userId === userId);
        if (slot && slot.status === 'CONNECTED') {
            slot.status = 'DISCONNECTED';
            await this.saveStorage(storage);
            // AI takes over for this team
            this.party.broadcast(JSON.stringify({
                type:   'PLAYER_DISCONNECTED',
                teamId: slot.teamId,
                userId,
            } satisfies S2CMessage));
        }
    }

    // ─── Message handlers ─────────────────────────────────────────────────────

    private async handleJoin(
        msg: Extract<C2SMessage, { type: 'JOIN' }>,
        conn: Party.Connection,
    ): Promise<void> {
        const storage = await this.loadStorage();
        if (!storage) {
            this.send(conn, { type: 'ERROR', message: 'Session not initialised' });
            return;
        }
        if (storage.status !== 'LOBBY') {
            this.send(conn, { type: 'ERROR', message: 'Race already started' });
            return;
        }

        let slot = storage.players.find(p => p.teamId === msg.teamId);
        if (!slot) {
            slot = { userId: msg.userId ?? conn.id, teamId: msg.teamId, status: 'CONNECTED', strategy: msg.strategy };
            storage.players.push(slot);
        } else {
            slot.userId   = msg.userId ?? conn.id;
            slot.status   = 'CONNECTED';
            slot.strategy = msg.strategy;
        }

        this.connUsers.set(conn.id, slot.userId);
        this.aiManagers.set(slot.teamId, new AIStrategyManager(msg.strategy));
        await this.saveStorage(storage);

        this.send(conn, {
            type:     'SESSION_JOINED',
            yourTeam: msg.teamId,
            state:    this.buildFullState(storage),
        });

        this.party.broadcast(JSON.stringify({
            type:   'PLAYER_CONNECTED',
            teamId: msg.teamId,
            userId: slot.userId,
        } satisfies S2CMessage), [conn.id]);
    }

    private async handleReconnect(
        msg: Extract<C2SMessage, { type: 'RECONNECT' }>,
        conn: Party.Connection,
    ): Promise<void> {
        const storage = await this.loadStorage();
        if (!storage) return;

        // Identify player by sessionId (userId stored in URL param or storage lookup)
        // For simplicity, sessionId doubles as userId here
        const slot = storage.players.find(p => p.userId === msg.sessionId);
        if (!slot) {
            this.send(conn, { type: 'ERROR', message: 'No slot found for that session' });
            return;
        }

        slot.status = 'CONNECTED';
        this.connUsers.set(conn.id, slot.userId);
        await this.saveStorage(storage);

        // Restore engine snapshot into driver states
        if (this.engine) {
            this.send(conn, {
                type:     'SESSION_JOINED',
                yourTeam: slot.teamId,
                state:    this.buildFullState(storage, this.engine.getDrivers()),
            });
        }

        this.party.broadcast(JSON.stringify({
            type:   'PLAYER_RECONNECTED',
            teamId: slot.teamId,
            userId: slot.userId,
        } satisfies S2CMessage), [conn.id]);
    }

    private async handleSetStrategy(
        msg: Extract<C2SMessage, { type: 'SET_STRATEGY' }>,
        conn: Party.Connection,
    ): Promise<void> {
        const userId = this.connUsers.get(conn.id);
        if (!userId) return;

        const storage = await this.loadStorage();
        if (!storage) return;

        const slot = storage.players.find(p => p.userId === userId);
        if (!slot) return;

        slot.strategy = msg.strategy;
        this.aiManagers.get(slot.teamId)?.updateProfile(msg.strategy);
        await this.saveStorage(storage);
    }

    private async handlePitStop(
        msg: Extract<C2SMessage, { type: 'PIT_STOP' }>,
        conn: Party.Connection,
    ): Promise<void> {
        if (!this.engine) return;

        const userId = this.connUsers.get(conn.id);
        if (!userId) return;

        const storage = await this.loadStorage();
        const slot = storage?.players.find(p => p.userId === userId);
        if (!slot) return;

        // Validate the driver belongs to this player's team
        const driver = this.engine.getDrivers().find(d => d.id === msg.driverId && d.teamId === slot.teamId);
        if (!driver) {
            this.send(conn, { type: 'ERROR', message: 'Driver not in your team' });
            return;
        }

        const ok = this.engine.applyPitStop(msg.driverId, msg.compound);
        if (ok) {
            this.party.broadcast(JSON.stringify({
                type:     'PIT_EXECUTED',
                driverId: msg.driverId,
                compound: msg.compound,
                lap:      driver.lapsCompleted,
            } satisfies S2CMessage));
        }
    }

    private async handleStartRace(sender: Party.Connection): Promise<void> {
        const storage = await this.loadStorage();
        if (!storage || storage.status !== 'LOBBY') return;

        storage.status = 'RACING';
        await this.saveStorage(storage);
        this.startEngineLoop(storage);
    }

    // ─── Engine loop ──────────────────────────────────────────────────────────

    private startEngineLoop(storage: PartyStorage): void {
        if (this.intervalId) return;

        const speedMap = buildSpeedMapFromPath(storage.circuitPath);

        // Build initial EngineDriver list from snapshot or fresh init
        const drivers = storage.driverSnapshot.length > 0
            ? storage.driverSnapshot
            : this.buildInitialDrivers(storage);

        this.engine = new RaceEngine({
            drivers,
            speedMap,
            totalLaps:        storage.totalLaps,
            sectorThresholds: storage.sectorThresholds,
        });

        this.intervalId = setInterval(() => void this.engineTick(), TICK_INTERVAL_MS);
    }

    private async engineTick(): Promise<void> {
        if (!this.engine) return;

        const result = this.engine.step();
        this.tick = result.tick;

        // AI pit stop evaluation on every lap completion
        const storage = await this.loadStorage();
        if (storage) {
            for (const driver of this.engine.getDrivers()) {
                const slot = storage.players.find(p => p.teamId === driver.teamId);
                // Only use AI for disconnected/not-joined players
                if (!slot || slot.status === 'CONNECTED') continue;

                const ai = this.aiManagers.get(driver.teamId);
                if (!ai) continue;

                // Evaluate on each lap completion (tyreAge just incremented)
                if (driver.tyreAge > 0 && driver.lapsCompleted > 0) {
                    const decision = ai.evaluatePitStop(driver, {
                        totalLaps:  storage.totalLaps,
                        leaderLap:  this.engine.getLeaderLap(),
                        allDrivers: this.engine.getDrivers(),
                    });
                    if (decision) {
                        const ok = this.engine.applyPitStop(driver.id, decision.compound);
                        if (ok) {
                            this.party.broadcast(JSON.stringify({
                                type:     'PIT_EXECUTED',
                                driverId: driver.id,
                                compound: decision.compound,
                                lap:      driver.lapsCompleted,
                            } satisfies S2CMessage));
                        }
                    }
                }
            }
        }

        // Broadcast delta every BROADCAST_EVERY ticks
        if (result.tick % BROADCAST_EVERY === 0) {
            this.party.broadcast(JSON.stringify({
                type:    'DELTA',
                tick:    result.tick,
                drivers: result.drivers,
                ...(result.events.length > 0 ? { events: result.events } : {}),
            } satisfies S2CMessage));
        }

        // Race finished
        if (this.engine.isFinished()) {
            clearInterval(this.intervalId!);
            this.intervalId = null;

            const results = this.engine.buildResults();
            // Attach userId from player slots
            if (storage) {
                for (const r of results) {
                    r.userId = storage.players.find(p => p.teamId === r.teamId)?.userId ?? null;
                }
            }

            this.party.broadcast(JSON.stringify({
                type: 'RACE_FINISHED',
                results,
            } satisfies S2CMessage));
        }
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private buildInitialDrivers(storage: PartyStorage): EngineDriver[] {
        // In a real scenario these come from the DB / lobby setup.
        // Returning the snapshot as-is; concrete driver seeding handled by lobby.
        return storage.driverSnapshot;
    }

    private buildFullState(
        storage: PartyStorage,
        liveDrivers?: EngineDriver[],
    ): FullRaceState {
        const drivers: DriverDelta[] = (liveDrivers ?? storage.driverSnapshot).map(d => ({
            driverId:      d.id,
            position:      d.position,
            progress:      d.progress,
            lapsCompleted: d.lapsCompleted,
            sector:        d.sector,
            gap:           0,
            tyreWear:      d.tyreWear,
            tyreAge:       d.tyreAge,
        }));

        return {
            tick:       this.tick,
            totalLaps:  storage.totalLaps,
            currentLap: this.engine?.getLeaderLap() ?? 0,
            status:     storage.status as typeof RaceStatus[keyof typeof RaceStatus],
            drivers,
            events:     [],
            players:    storage.players,
        };
    }

    private send(conn: Party.Connection, msg: S2CMessage): void {
        conn.send(JSON.stringify(msg));
    }

    private async loadStorage(): Promise<PartyStorage | null> {
        return (await this.party.storage.get<PartyStorage>('state')) ?? null;
    }

    private async saveStorage(state: PartyStorage): Promise<void> {
        await this.party.storage.put('state', state);
    }
}

RaceParty satisfies Party.Worker;
