import type { DriverSkills, TeamStats } from '@entities';

const MIN_MULTIPLIER = 0.85;
const MAX_MULTIPLIER = 1.15;

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

    return driverScore * 0.40 + teamScore * 0.60;
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
