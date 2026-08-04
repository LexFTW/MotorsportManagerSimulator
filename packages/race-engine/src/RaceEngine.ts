import { RaceEventType } from './types';
import type { EngineDriver, DriverDelta, RaceEvent, RaceResult, TyreCompound } from './types';

const BASE_STEP     = 0.0005;
const GAP_SCALE     = 80;
const SPEED_SAMPLES = 1200;

const TYRE_COMPOUND_BONUS: Record<string, number> = {
    Soft:   0.015,
    Medium: 0.000,
    Hard:  -0.005,
    Wet:    0.000,
};
const BASE_WEAR_PENALTY = 0.0004;

function calcTyreSpeedDelta(tyre: string, tyreWear: number): number {
    const bonus = TYRE_COMPOUND_BONUS[tyre] ?? 0;
    const wearFactor = Math.max(0, 1 - tyreWear / 100);
    return bonus * wearFactor - tyreWear * BASE_WEAR_PENALTY;
}

function getSector(progress: number, thresholds: [number, number]): 1 | 2 | 3 {
    if (progress > thresholds[0]) return 1;
    if (progress > thresholds[1]) return 2;
    return 3;
}

function driverRank(lapsCompleted: number, sector: 1 | 2 | 3, progress: number): number {
    return lapsCompleted * 3 + (sector - 1) - progress;
}

export interface RaceEngineOptions {
    drivers:          EngineDriver[];
    speedMap:         Float32Array;
    totalLaps:        number;
    sectorThresholds: [number, number];
}

export interface StepResult {
    tick:    number;
    drivers: DriverDelta[];
    events:  RaceEvent[];
}

export class RaceEngine {
    private drivers:          EngineDriver[];
    private readonly speedMap:         Float32Array;
    private readonly totalLaps:        number;
    private readonly sectorThresholds: [number, number];
    private tick_ = 0;
    private finished = false;

    constructor(opts: RaceEngineOptions) {
        this.drivers          = opts.drivers.map(d => ({ ...d }));
        this.speedMap         = opts.speedMap;
        this.totalLaps        = opts.totalLaps;
        this.sectorThresholds = opts.sectorThresholds;
    }

    step(): StepResult {
        this.tick_++;
        const prevPositions = new Map(this.drivers.map(d => [d.id, d.position]));
        const thresholds    = this.sectorThresholds;

        for (const d of this.drivers) {
            const idx = Math.floor(d.progress * SPEED_SAMPLES) % SPEED_SAMPLES;
            const effectiveMultiplier = d.speedMultiplier + calcTyreSpeedDelta(d.tyre, d.tyreWear);
            const step = BASE_STEP * this.speedMap[idx] * Math.max(0.5, effectiveMultiplier);
            const newProgress = ((d.progress - step) + 1) % 1;

            // S/F crossing: progress wraps from near-0 back to near-1
            if (newProgress > d.progress + 0.5) {
                d.lapsCompleted += 1;
                d.tyreAge       += 1;
                d.tyreWear = Math.min(100, d.tyreWear + d.tyreDegradationRate);
            }

            d.progress = newProgress;
            d.sector   = getSector(newProgress, thresholds);
        }

        const ranked = [...this.drivers].sort((a, b) =>
            driverRank(b.lapsCompleted, b.sector, b.progress) -
            driverRank(a.lapsCompleted, a.sector, a.progress)
        );
        ranked.forEach((d, i) => { d.position = i + 1; });

        const leader = ranked[0];

        const events: RaceEvent[] = [];
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

        if (leader.lapsCompleted >= this.totalLaps) {
            this.finished = true;
        }

        const drivers: DriverDelta[] = this.drivers.map(d => ({
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

        return { tick: this.tick_, drivers, events };
    }

    getDrivers(): EngineDriver[] {
        return this.drivers;
    }

    getLeaderLap(): number {
        if (this.drivers.length === 0) return 0;
        return this.drivers.reduce((leader, d) =>
            driverRank(d.lapsCompleted, d.sector, d.progress) >
            driverRank(leader.lapsCompleted, leader.sector, leader.progress) ? d : leader
        , this.drivers[0]).lapsCompleted;
    }

    isFinished(): boolean {
        return this.finished;
    }

    applyPitStop(driverId: string, compound: TyreCompound): boolean {
        const driver = this.drivers.find(d => d.id === driverId);
        if (!driver) return false;
        driver.tyre    = compound;
        driver.tyreWear = 0;
        driver.tyreAge  = 0;
        return true;
    }

    buildResults(): RaceResult[] {
        return [...this.drivers]
            .sort((a, b) => a.position - b.position)
            .map(d => ({
                driverId: d.id,
                teamId:   d.teamId,
                position: d.position,
                userId:   null,
            }));
    }
}
