import type { DriverSkills, TeamStats } from '@entities';

const MIN_MULTIPLIER = 0.97;
const MAX_MULTIPLIER = 1.03;

// Speed bonus on the normalised multiplier granted by each compound when tyre is fresh
const TYRE_COMPOUND_BONUS: Record<string, number> = {
    Soft:   0.015,
    Medium: 0.000,
    Hard:  -0.005,
    Wet:    0.000,
};

// Wear added per lap (percentage points)
export const TYRE_DEGRADATION_PER_LAP: Record<string, number> = {
    Soft:   4.0,
    Medium: 2.5,
    Hard:   1.5,
    Wet:    2.0,
};

// 100% worn tyre = -0.040 speed loss (~3.2s/lap); 50% worn = -0.020 (~1.6s/lap)
const BASE_WEAR_PENALTY = 0.0004;

/**
 * Compound bonus scales from full value at 0% wear to 0 at 100% wear.
 * A small base penalty also applies to all compounds as they degrade.
 */
export function calcTyreSpeedDelta(tyre: string, tyreWear: number): number {
    const bonus = TYRE_COMPOUND_BONUS[tyre] ?? 0;
    const wearFactor = Math.max(0, 1 - tyreWear / 100);
    return bonus * wearFactor - tyreWear * BASE_WEAR_PENALTY;
}

/**
 * Returns the effective wear added per lap, reduced by driver and team tyre management.
 * Both skills are 0-100; 80 is the neutral baseline.
 * Driver: ±0.5% per point away from 80 → at 100 = −10%, at 60 = +10%
 * Team:   ±0.3% per point away from 80 → at 100 = −6%,  at 60 = +6%
 */
export function calcEffectiveDegradationRate(
    tyre: string,
    tyreManagement: number,
    tyreUsage: number,
): number {
    const base = TYRE_DEGRADATION_PER_LAP[tyre] ?? 2.5;
    const driverFactor = 1 - (tyreManagement - 80) * 0.005;
    const teamFactor   = 1 - (tyreUsage   - 80) * 0.003;
    return base * Math.max(0.5, driverFactor) * Math.max(0.7, teamFactor);
}

/** Combines driver skills and team stats into a single raw speed score. */
function calcRawSpeed(skills: DriverSkills, teamStats: TeamStats): number {
    const driverScore =
        skills.pace           * 0.50 +
        skills.consistency    * 0.20 +
        skills.experience     * 0.10 +
        skills.starts         * 0.10 +
        skills.aggressiveness * 0.10;

    const teamScore =
        teamStats.pace          * 0.60 +
        teamStats.topSpeed      * 0.20 +
        teamStats.downforce     * 0.10 +
        teamStats.ersEfficiency * 0.10;

    return driverScore * 0.30 + teamScore * 0.70;
}

/**
 * Returns a speed multiplier in [MIN_MULTIPLIER, MAX_MULTIPLIER] for each driver,
 * normalised across the whole grid so the fastest combo is MAX and the slowest is MIN.
 */
export function calcSpeedMultipliers(
    entries: Array<{ skills: DriverSkills; teamStats: TeamStats }>
): number[] {
    const raw = entries.map(({ skills, teamStats }) => calcRawSpeed(skills, teamStats));
    const min = Math.min(...raw);
    const max = Math.max(...raw);
    const range = max - min || 1;
    return raw.map(s => MIN_MULTIPLIER + ((s - min) / range) * (MAX_MULTIPLIER - MIN_MULTIPLIER));
}
