import type * as Party from 'partykit/server';
import { DEFAULT_STRATEGY, type TeamStrategyProfile } from '@motorsport/race-engine';

interface LobbySession {
    id:         string;
    circuitId:  string;
    totalLaps:  number;
    hostUserId: string;
    slots: Array<{
        teamId:   string;
        userId:   string | null;
        ready:    boolean;
        strategy: TeamStrategyProfile;
    }>;
    createdAt: number;
}

type LobbyC2S =
    | { type: 'CREATE_SESSION'; circuitId: string; totalLaps: number; availableTeams: string[] }
    | { type: 'CLAIM_TEAM';     teamId: string; userId: string; strategy: TeamStrategyProfile }
    | { type: 'SET_READY';      ready: boolean }
    | { type: 'GET_SESSIONS' };

type LobbyS2C =
    | { type: 'SESSION_CREATED'; session: LobbySession }
    | { type: 'SESSION_STATE';   session: LobbySession }
    | { type: 'SESSIONS_LIST';   sessions: LobbySession[] }
    | { type: 'ALL_READY';       sessionId: string }
    | { type: 'ERROR';           message: string };

export default class LobbyParty implements Party.Server {
    constructor(readonly party: Party.Party) {}

    async onMessage(raw: string, sender: Party.Connection): Promise<void> {
        let msg: LobbyC2S;
        try {
            msg = JSON.parse(raw) as LobbyC2S;
        } catch {
            sender.send(JSON.stringify({ type: 'ERROR', message: 'Invalid JSON' } satisfies LobbyS2C));
            return;
        }

        switch (msg.type) {
            case 'CREATE_SESSION': await this.handleCreate(msg, sender); break;
            case 'CLAIM_TEAM':     await this.handleClaim(msg, sender);  break;
            case 'SET_READY':      await this.handleReady(msg, sender);  break;
            case 'GET_SESSIONS':   await this.handleList(sender);        break;
        }
    }

    private async handleCreate(
        msg: Extract<LobbyC2S, { type: 'CREATE_SESSION' }>,
        conn: Party.Connection,
    ): Promise<void> {
        const session: LobbySession = {
            id:         this.party.id,
            circuitId:  msg.circuitId,
            totalLaps:  msg.totalLaps,
            hostUserId: conn.id,
            slots:      msg.availableTeams.map(teamId => ({
                teamId,
                userId:   null,
                ready:    false,
                strategy: DEFAULT_STRATEGY,
            })),
            createdAt:  Date.now(),
        };
        await this.party.storage.put('session', session);
        this.party.broadcast(JSON.stringify({ type: 'SESSION_CREATED', session } satisfies LobbyS2C));
    }

    private async handleClaim(
        msg: Extract<LobbyC2S, { type: 'CLAIM_TEAM' }>,
        conn: Party.Connection,
    ): Promise<void> {
        const session = await this.party.storage.get<LobbySession>('session');
        if (!session) { conn.send(JSON.stringify({ type: 'ERROR', message: 'No session' } satisfies LobbyS2C)); return; }

        const slot = session.slots.find(s => s.teamId === msg.teamId);
        if (!slot) { conn.send(JSON.stringify({ type: 'ERROR', message: 'Team not found' } satisfies LobbyS2C)); return; }
        if (slot.userId && slot.userId !== msg.userId) {
            conn.send(JSON.stringify({ type: 'ERROR', message: 'Team already taken' } satisfies LobbyS2C));
            return;
        }

        slot.userId   = msg.userId;
        slot.strategy = msg.strategy;
        await this.party.storage.put('session', session);
        this.party.broadcast(JSON.stringify({ type: 'SESSION_STATE', session } satisfies LobbyS2C));
    }

    private async handleReady(
        msg: Extract<LobbyC2S, { type: 'SET_READY' }>,
        conn: Party.Connection,
    ): Promise<void> {
        const session = await this.party.storage.get<LobbySession>('session');
        if (!session) return;

        const slot = session.slots.find(s => s.userId === conn.id);
        if (slot) slot.ready = msg.ready;

        await this.party.storage.put('session', session);
        this.party.broadcast(JSON.stringify({ type: 'SESSION_STATE', session } satisfies LobbyS2C));

        // All claimed slots are ready → notify host to start
        const claimed = session.slots.filter(s => s.userId !== null);
        if (claimed.length > 0 && claimed.every(s => s.ready)) {
            this.party.broadcast(JSON.stringify({ type: 'ALL_READY', sessionId: session.id } satisfies LobbyS2C));
        }
    }

    private async handleList(conn: Party.Connection): Promise<void> {
        const session = await this.party.storage.get<LobbySession>('session');
        conn.send(JSON.stringify({ type: 'SESSIONS_LIST', sessions: session ? [session] : [] } satisfies LobbyS2C));
    }
}

LobbyParty satisfies Party.Worker;
