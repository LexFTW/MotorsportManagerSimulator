import { createSelector } from '@reduxjs/toolkit';
import { DRIVERS, TEAMS } from '@entities';
import type { DriverMock } from '@widgets/race-map/models/raceMap.mock';
import { calcSpeedMultipliers } from '@widgets/race-map/lib/calcDriverSpeed';
import type { RootState } from '../index';

export const selectMapDrivers = createSelector(
    (state: RootState) => state.drivers,
    (drivers): DriverMock[] => {
        const sorted = [...drivers].sort((a, b) => a.position - b.position);

        const entries = sorted.map(d => {
            const driver = DRIVERS.find(dr => dr.id === d.driverId);
            const team = TEAMS.find(t => t.id === driver?.team);
            return { driver, team };
        });

        const multipliers = calcSpeedMultipliers(
            entries.map(({ driver, team }) => ({
                skills: driver?.skills ?? { pace: 80, consistency: 80, tyreManagement: 80, aggressiveness: 80, wetSkills: 80, starts: 80, experience: 80 },
                teamStats: team?.stats ?? { pace: 80, reliability: 80, downforce: 80, topSpeed: 80, tyreUsage: 80, pitCrewSpeed: 80, ersEfficiency: 80 },
            }))
        );

        return sorted.map((d, i) => ({
            id: d.driverId,
            code: entries[i].driver?.identity.code ?? d.driverId,
            teamLogo: entries[i].team?.logo ?? '',
            color: entries[i].team?.color ?? '#FFFFFF',
            progress: d.progress,
            speedMultiplier: multipliers[i],
        }));
    }
);
