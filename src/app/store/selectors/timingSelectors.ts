import { createSelector } from '@reduxjs/toolkit';
import { DRIVERS, TEAMS } from '@entities';
import type { RaceTimingRow } from '@widgets/race-timing/types/RaceTimingRow';
import type { RootState } from '../index';

const formatLapTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(3).padStart(6, '0');
    return `${mins}:${secs}`;
};

export const selectTimingRows = createSelector(
    (state: RootState) => state.drivers,
    (drivers): RaceTimingRow[] => {
        const sorted = [...drivers].sort((a, b) => a.position - b.position);
        const leaderLaps = sorted[0]?.lapsCompleted ?? 0;

        return sorted.map(d => {
                const driver = DRIVERS.find(dr => dr.id === d.driverId);
                const team = TEAMS.find(t => t.id === driver?.team);
                const lapsBehind = leaderLaps - d.lapsCompleted;
                const interval = d.position === 1
                    ? 'Leader'
                    : lapsBehind >= 1
                        ? lapsBehind === 1 ? '+1 LAP' : `+${lapsBehind} LAPS`
                        : `+${d.gap.toFixed(3)}`;
                return {
                    position: d.position,
                    number: driver?.identity.dorsal ?? 0,
                    code: driver?.identity.code ?? d.driverId,
                    name: driver ? `${driver.identity.firstName} ${driver.identity.lastName}` : d.driverId,
                    country: driver?.identity.country ?? '',
                    team: {
                        name: team?.name ?? '',
                        color: team?.color ?? '#FFFFFF',
                        logo: team?.logo ?? '',
                    },
                    tyre: d.tyre as RaceTimingRow['tyre'],
                    laps: d.currentLap,
                    interval,
                    lastLap: formatLapTime(d.lastLapTime),
                    bestLap: formatLapTime(d.bestLapTime),
                    ers: d.ers,
                    fuel: d.fuel,
                    pitStops: d.pitStops.length,
                    tyreWear: d.tyreWear,
                };
            });
    }
);
