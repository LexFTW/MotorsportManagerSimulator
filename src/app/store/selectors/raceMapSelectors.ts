import { createSelector } from '@reduxjs/toolkit';
import { DRIVERS, TEAMS } from '@entities';
import type { DriverMock } from '@widgets/race-map/models/raceMap.mock';
import type { RootState } from '../index';

export const selectMapDrivers = createSelector(
    (state: RootState) => state.drivers,
    (drivers): DriverMock[] =>
        [...drivers]
            .sort((a, b) => a.position - b.position)
            .map(d => {
                const driver = DRIVERS.find(dr => dr.id === d.driverId);
                const team = TEAMS.find(t => t.id === driver?.team);
                return {
                    id: d.driverId,
                    code: driver?.identity.code ?? d.driverId,
                    teamLogo: team?.logo ?? '',
                    color: team?.color ?? '#FFFFFF',
                    progress: d.progress,
                };
            })
);
