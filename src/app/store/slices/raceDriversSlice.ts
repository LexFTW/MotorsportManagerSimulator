import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RaceDriverState, PitStop } from '@entities';
import { initialRaceDrivers } from '../data/initialRaceDrivers';

const initialState: RaceDriverState[] = initialRaceDrivers;

const raceDriversSlice = createSlice({
    name: 'raceDrivers',
    initialState,
    reducers: {
        initializeDrivers: (_state, action: PayloadAction<RaceDriverState[]>) => {
            return action.payload;
        },
        updateDriver: (state, action: PayloadAction<Partial<RaceDriverState> & { driverId: string }>) => {
            const { driverId, ...updates } = action.payload;
            const driver = state.find(d => d.driverId === driverId);
            if (driver) Object.assign(driver, updates);
        },
        tickDrivers: (_state, action: PayloadAction<RaceDriverState[]>) => {
            return action.payload;
        },
        batchUpdateDrivers: (state, action: PayloadAction<Array<Partial<RaceDriverState> & { driverId: string }>>) => {
            for (const update of action.payload) {
                const driver = state.find(d => d.driverId === update.driverId);
                if (driver) Object.assign(driver, update);
            }
        },
        recordPitStop: (state, action: PayloadAction<{ driverId: string; stop: PitStop }>) => {
            const driver = state.find(d => d.driverId === action.payload.driverId);
            if (driver) driver.pitStops.push(action.payload.stop);
        },
    },
});

export const { initializeDrivers, updateDriver, tickDrivers, batchUpdateDrivers, recordPitStop } = raceDriversSlice.actions;
export const raceDriversReducer = raceDriversSlice.reducer;
