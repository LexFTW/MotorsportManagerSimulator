import { SPEED_SAMPLES } from './buildSpeedMapServer';
import { calcTyreSpeedDelta } from './calcDriverSpeed';
import {
    type EngineDriver,
    type RaceTickResult,
    type DriverDelta,
    type RaceEvent,
    type PitStopRecord,
    type RaceResult,
    RaceEventType,
    TyreCompound,
} from './types';

const BASE_STEP = 0.0005;
const GAP_SCALE = 80; // one lap ≈ 80 simulated seconds

function getSector(progress: number, thresholds: [number, number]): 1 | 2 | 3 {
    if (progress > thresholds[0]) return 1;
    if (progress > thresholds[1]) return 2;
    return 3;
}

// Higher value = further ahead in the race
function driverRank(lapsCompleted: number, sector: 1 | 2 | 3, progress: number): number {
    return lapsCompleted * 3 + (sector - 1) - progress;
}

export interface RaceEngineOptions {
    drivers:          EngineDriver[];
    speedMap:         Float32Array;
    totalLaps:        number;
    sectorThresholds: [number, number];
}

export class RaceEngine {
    private drivers:          EngineDriver[];
    private speedMap:         Float32Array;
    private totalLaps:        number;
    private thresholds:       [number, number];
    private tick:             number = 0;
    private prevLeaderLaps:   number = 0;
    private pitStopHistory:   Map<string, PitStopRecord[]> = new Map();
    private fastestLap:       Map<string, number> = new Map();
    private lapStartTick:     Map<string, number> = new Map();

    constructor(options: RaceEngineOptions) {
        this.speedMap   = options.speedMap;
        this.totalLaps  = options.totalLaps;
        this.thresholds = options.sectorThresholds;

        // Sort and assign initial positions
        this.drivers = [...options.drivers]
            .sort((a, b) =>
                driverRank(b.lapsCompleted, b.sector, b.progress) -
                driverRank(a.lapsCompleted, a.sector, a.progress)
            )
            .map((d, i) => ({ ...d, position: i + 1 }));

        this.prevLeaderLaps = this.drivers[0]?.lapsCompleted ?? 0;
        for (const d of this.drivers) {
            this.pitStopHistory.set(d.id, []);
            this.lapStartTick.set(d.id, 0);
        }
    }

    /** Advance simulation by one tick. Returns the state diff to broadcast. */
    step(): RaceTickResult {
        this.tick++;
        const events: RaceEvent[] = [];
        const prevPositions = new Map(this.drivers.map(d => [d.id, d.position]));

        for (const d of this.drivers) {
            const idx = Math.floor(d.progress * SPEED_SAMPLES) % SPEED_SAMPLES;
            const effectiveMultiplier = d.speedMultiplier + calcTyreSpeedDelta(d.tyre, d.tyreWear);
            const step = BASE_STEP * this.speedMap[idx] * Math.max(0.5, effectiveMultiplier);
            const newProgress = ((d.progress - step) + 1) % 1;

            // Start/Finish crossing
            if (newProgress > d.progress + 0.5) {
                const lapTicks = this.tick - (this.lapStartTick.get(d.id) ?? 0);
                const lapTime  = lapTicks * (1 / 60); // approximate seconds at ~60 ticks/s
                const prev     = this.fastestLap.get(d.id) ?? Infinity;
                if (lapTime < prev) this.fastestLap.set(d.id, lapTime);
                this.lapStartTick.set(d.id, this.tick);

                d.lapsCompleted += 1;
                d.tyreAge       += 1;
                d.tyreWear       = Math.min(100, d.tyreWear + d.tyreDegradationRate);
            }

            d.progress = newProgress;
            d.sector   = getSector(newProgress, this.thresholds);
        }

        // Re-rank
        const ranked = [...this.drivers].sort((a, b) =>
            driverRank(b.lapsCompleted, b.sector, b.progress) -
            driverRank(a.lapsCompleted, a.sector, a.progress)
        );
        ranked.forEach((d, i) => { d.position = i + 1; });

        const leader = ranked[0];

        // Detect overtakes
        for (const d of this.drivers) {
            const prev = prevPositions.get(d.id)!;
            if (d.position < prev) {
                const overtakee = this.drivers.find(
                    o => o.id !== d.id && prevPositions.get(o.id) === d.position
                );
                events.push({
                    lap:         leader.lapsCompleted,
                    type:        RaceEventType.OVERTAKE,
                    driverId:    d.id,
                    description: `${d.id} adelantó a ${overtakee?.id ?? '?'}`,
                });
            }
        }

        // Advance session lap counter
        if (leader.lapsCompleted > this.prevLeaderLaps) {
            this.prevLeaderLaps = leader.lapsCompleted;
        }

        const deltas: DriverDelta[] = this.drivers.map(d => ({
            driverId:      d.id,
            position:      d.position,
            progress:      d.progress,
            lapsCompleted: d.lapsCompleted,
            sector:        d.sector,
            gap:           (leader.lapsCompleted - d.lapsCompleted) * GAP_SCALE
                           + (d.progress - leader.progress) * GAP_SCALE,
            tyreWear:      d.tyreWear,
            tyreAge:       d.tyreAge,
        }));

        return { tick: this.tick, drivers: deltas, events };
    }

    applyPitStop(driverId: string, compound: TyreCompound): boolean {
        const driver = this.drivers.find(d => d.id === driverId);
        if (!driver) return false;

        const history = this.pitStopHistory.get(driverId) ?? [];
        history.push({ lap: driver.lapsCompleted, compound });
        this.pitStopHistory.set(driverId, history);

        driver.tyre    = compound;
        driver.tyreAge  = 0;
        driver.tyreWear = 0;
        return true;
    }

    getLeaderLap(): number {
        return this.prevLeaderLaps;
    }

    isFinished(): boolean {
        const last = [...this.drivers].sort((a, b) =>
            driverRank(b.lapsCompleted, b.sector, b.progress) -
            driverRank(a.lapsCompleted, a.sector, a.progress)
        ).at(-1);
        return (last?.lapsCompleted ?? 0) >= this.totalLaps;
    }

    buildResults(): RaceResult[] {
        return [...this.drivers]
            .sort((a, b) => a.position - b.position)
            .map(d => ({
                driverId:      d.id,
                teamId:        d.teamId,
                userId:        null,
                finalPosition: d.position,
                totalTime:     0,
                fastestLap:    this.fastestLap.get(d.id) ?? 0,
                pitStops:      this.pitStopHistory.get(d.id) ?? [],
            }));
    }

    getDrivers(): EngineDriver[] {
        return this.drivers;
    }

    getTick(): number {
        return this.tick;
    }
}
