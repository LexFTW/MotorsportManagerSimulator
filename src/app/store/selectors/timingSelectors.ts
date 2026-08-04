import { createSelector } from '@reduxjs/toolkit';
import { DRIVERS, TEAMS } from '@entities';
import type { RaceTimingRow } from '@widgets/race-timing/types/RaceTimingRow';
import type { RootState } from '../index';

const formatLapTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(3).padStart(6, '0');
    return `${mins}:${secs}`;
};

// Must match GAP_SCALE in useRaceEngine — one simulated lap ≈ 80 seconds
const SECS_PER_LAP = 80;

const formatGap = (gap: number): string => {
    const lapsDown = Math.floor(gap / SECS_PER_LAP);
    if (lapsDown >= 1) return lapsDown === 1 ? '+1 LAP' : `+${lapsDown} LAPS`;
    return `+${gap.toFixed(3)}`;
};

export const selectTimingRows = createSelector(
    (state: RootState) => state.drivers,
    (drivers): RaceTimingRow[] => {
        const sorted = [...drivers].sort((a, b) => a.position - b.position);

        return sorted.map((d, i) => {
                const driver = DRIVERS.find(dr => dr.id === d.driverId);
                const team = TEAMS.find(t => t.id === driver?.team);
                const carAhead = i > 0 ? sorted[i - 1] : null;
                const gapToAhead = carAhead ? d.gap - carAhead.gap : 0;
                const interval = d.position === 1 ? 'Leader' : formatGap(d.gap);
                const intervalToAhead = d.position === 1 ? 'Leader' : formatGap(gapToAhead);
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
                    intervalToAhead,
                    lastLap: formatLapTime(d.lastLapTime),
                    bestLap: formatLapTime(d.bestLapTime),
                    ers: d.ers,
                    fuel: d.fuel,
                    pitStops: d.pitStops.length,
                    tyreWear: d.tyreWear,
                    drsActive: d.drsActive ?? false,
                };
            });
    }
);
