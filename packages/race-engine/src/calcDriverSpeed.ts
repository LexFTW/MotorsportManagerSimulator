import type { DriverSkills, TeamStats, TyreCompound } from './types';

const MIN_MULTIPLIER = 0.85;
const MAX_MULTIPLIER = 1.15;

const TYRE_COMPOUND_BONUS: Record<string, number> = {
    Soft:   0.04,
    Medium: 0.00,
    Hard:  -0.02,
    Wet:    0.00,
};

export const TYRE_DEGRADATION_PER_LAP: Record<string, number> = {
    Soft:   4.0,
    Medium: 2.5,
    Hard:   1.5,
    Wet:    2.0,
};

const WEAR_SPEED_PENALTY = 0.0015;

export function calcTyreSpeedDelta(tyre: string, tyreWear: number): number {
    const bonus = TYRE_COMPOUND_BONUS[tyre] ?? 0;
    return bonus - tyreWear * WEAR_SPEED_PENALTY;
}

/**
 * Effective wear per lap adjusted by driver tyre management and team tyre usage.
 * Both are 0–100; 80 is the neutral baseline.
 */
export function calcEffectiveDegradationRate(
    tyre: TyreCompound | string,
    tyreManagement: number,
    tyreUsage: number,
): number {
    const base = TYRE_DEGRADATION_PER_LAP[tyre] ?? 2.5;
    const driverFactor = 1 - (tyreManagement - 80) * 0.005;
    const teamFactor   = 1 - (tyreUsage   - 80) * 0.003;
    return base * Math.max(0.5, driverFactor) * Math.max(0.7, teamFactor);
}

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

    return driverScore * 0.40 + teamScore * 0.60;
}

export function calcSpeedMultipliers(
    entries: Array<{ skills: DriverSkills; teamStats: TeamStats }>
): number[] {
    const raw = entries.map(({ skills, teamStats }) => calcRawSpeed(skills, teamStats));
    const min = Math.min(...raw);
    const max = Math.max(...raw);
    const range = max - min || 1;
    return raw.map(s => MIN_MULTIPLIER + ((s - min) / range) * (MAX_MULTIPLIER - MIN_MULTIPLIER));
}
