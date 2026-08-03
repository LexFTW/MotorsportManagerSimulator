import { TyreCompound } from '@entities';

// Base number of laps each compound can last at neutral degradation
const COMPOUND_BASE_LIFE: Record<string, number> = {
    Soft:   20,
    Medium: 30,
    Hard:   40,
};

// Lap time advantage/cost relative to Medium (seconds per lap)
const COMPOUND_LAP_TIME_COST: Record<string, number> = {
    Soft:  -0.3,
    Medium: 0.0,
    Hard:   0.6,
};

// Overhead per pit stop in scoring (pit lane time approximation for strategy comparison)
const PIT_STOP_OVERHEAD_SECS = 25;

export interface DriverStrategyPlan {
    compounds: TyreCompound[];  // full sequence e.g. ['Hard', 'Medium']
    pitLaps: number[];          // planned lap number for each stop
}

type OneStop  = [TyreCompound, TyreCompound];
type TwoStop  = [TyreCompound, TyreCompound, TyreCompound];

const ONE_STOP_STRATEGIES: OneStop[] = [
    [TyreCompound.Soft,   TyreCompound.Medium],
    [TyreCompound.Soft,   TyreCompound.Hard],
    [TyreCompound.Medium, TyreCompound.Soft],
    [TyreCompound.Medium, TyreCompound.Hard],
    [TyreCompound.Hard,   TyreCompound.Soft],
    [TyreCompound.Hard,   TyreCompound.Medium],
];

const TWO_STOP_STRATEGIES: TwoStop[] = [
    [TyreCompound.Soft,   TyreCompound.Hard,   TyreCompound.Medium],
    [TyreCompound.Soft,   TyreCompound.Medium, TyreCompound.Hard],
    [TyreCompound.Medium, TyreCompound.Soft,   TyreCompound.Hard],
    [TyreCompound.Medium, TyreCompound.Hard,   TyreCompound.Soft],
    [TyreCompound.Hard,   TyreCompound.Soft,   TyreCompound.Medium],
    [TyreCompound.Hard,   TyreCompound.Medium, TyreCompound.Soft],
];

/** Estimated laps before critical wear, factoring driver/team tyre skill and circuit. */
function estimateStintLaps(compound: TyreCompound, effectiveDegRate: number, circuitDeg: number): number {
    const base = COMPOUND_BASE_LIFE[compound] ?? 30;
    // effectiveDegRate is % wear per lap; a tyre is critically worn at ~80%
    const criticalWear = 80;
    const lapsToWear = criticalWear / (effectiveDegRate * circuitDeg);
    return Math.max(5, Math.min(base, Math.floor(lapsToWear)));
}

/** Lower score = faster total race. */
function scoreStrategy(
    compounds: TyreCompound[],
    pitLaps: number[],
    totalLaps: number,
    effectiveDegRate: number,
    circuitDeg: number,
): number {
    let score = 0;
    let stintStart = 0;
    for (let s = 0; s < compounds.length; s++) {
        const stintEnd  = s < pitLaps.length ? pitLaps[s] : totalLaps;
        const stintLaps = Math.max(1, stintEnd - stintStart);
        const lapCost   = COMPOUND_LAP_TIME_COST[compounds[s]] ?? 0;
        // Average wear midway through stint → average lap time loss from degradation
        const avgWear       = (stintLaps / 2) * effectiveDegRate * circuitDeg;
        const avgWearPenalty = avgWear * 0.01;
        score += stintLaps * (lapCost + avgWearPenalty);
        stintStart = stintEnd;
    }
    score += pitLaps.length * PIT_STOP_OVERHEAD_SECS;
    return score;
}

/**
 * Selects the optimal pit strategy for a driver before the race starts.
 * Adds per-driver lap jitter to avoid all cars pitting on the same lap.
 */
export function planPitStrategy(params: {
    totalLaps: number;
    circuitDegradation: number;
    effectiveDegRate: number;
    startCompound: TyreCompound;
    jitterSeed?: number;  // 0-1, used for ±2 lap randomisation
}): DriverStrategyPlan {
    const { totalLaps, circuitDegradation, effectiveDegRate, startCompound, jitterSeed = 0.5 } = params;
    const jitter = Math.round((jitterSeed - 0.5) * 4); // ±2 laps

    const hardLife = estimateStintLaps(TyreCompound.Hard, effectiveDegRate, circuitDegradation);
    const consider2Stop = hardLife < totalLaps * 0.6;

    let bestScore = Infinity;
    let bestPlan: DriverStrategyPlan = {
        compounds: [startCompound, TyreCompound.Medium],
        pitLaps: [Math.max(5, Math.floor(totalLaps * 0.5) + jitter)],
    };

    for (const [c1, c2] of ONE_STOP_STRATEGIES) {
        if (c1 !== startCompound) continue;
        const stintLen   = estimateStintLaps(c1, effectiveDegRate, circuitDegradation);
        const rawPitLap  = Math.min(stintLen, Math.floor(totalLaps * 0.55));
        const pitLap     = Math.max(5, Math.min(totalLaps - 5, rawPitLap + jitter));
        const score      = scoreStrategy([c1, c2], [pitLap], totalLaps, effectiveDegRate, circuitDegradation);
        if (score < bestScore) {
            bestScore = score;
            bestPlan  = { compounds: [c1, c2], pitLaps: [pitLap] };
        }
    }

    if (consider2Stop) {
        for (const [c1, c2, c3] of TWO_STOP_STRATEGIES) {
            if (c1 !== startCompound) continue;
            const pit1  = Math.max(5, Math.floor(totalLaps * 0.33) + jitter);
            const pit2  = Math.min(totalLaps - 5, Math.floor(totalLaps * 0.66) + jitter);
            const score = scoreStrategy([c1, c2, c3], [pit1, pit2], totalLaps, effectiveDegRate, circuitDegradation);
            if (score < bestScore) {
                bestScore = score;
                bestPlan  = { compounds: [c1, c2, c3], pitLaps: [pit1, pit2] };
            }
        }
    }

    return bestPlan;
}

/** Returns the compound to fit at stop index `stopsDone`. */
export function getNextCompound(plan: DriverStrategyPlan, stopsDone: number): TyreCompound {
    return plan.compounds[stopsDone + 1] ?? TyreCompound.Medium;
}

/**
 * Evaluates whether a driver should pit this lap.
 * Called once per lap completion inside the engine tick loop.
 */
export function shouldPitNow(
    driver: { lapsCompleted: number; tyreWear: number; pitStopsDone: number },
    plan: DriverStrategyPlan,
    totalLaps: number,
): { pit: boolean; compound: TyreCompound } {
    const stopIndex    = driver.pitStopsDone;
    const nextCompound = getNextCompound(plan, stopIndex);

    // All planned stops already done
    if (stopIndex >= plan.pitLaps.length) return { pit: false, compound: nextCompound };

    const remainingLaps = totalLaps - driver.lapsCompleted;
    // Never pit in the final 3 laps
    if (remainingLaps <= 3) return { pit: false, compound: nextCompound };

    const plannedLap = plan.pitLaps[stopIndex];

    // Critical wear: box immediately
    if (driver.tyreWear >= 82) return { pit: true, compound: nextCompound };

    // Planned lap reached with at least moderate wear
    if (driver.lapsCompleted >= plannedLap && driver.tyreWear >= 40)
        return { pit: true, compound: nextCompound };

    // Early-pit window: 3 laps before plan with high wear (undercut opportunity)
    if (driver.lapsCompleted >= plannedLap - 3 && driver.tyreWear >= 68)
        return { pit: true, compound: nextCompound };

    return { pit: false, compound: nextCompound };
}
