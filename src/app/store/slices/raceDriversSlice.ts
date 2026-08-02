import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RaceDriverState } from '@entities';
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
        // Dispatched by the race engine each lap with the full updated standings
        tickDrivers: (_state, action: PayloadAction<RaceDriverState[]>) => {
            return action.payload;
        },
    },
});

export const { initializeDrivers, updateDriver, tickDrivers } = raceDriversSlice.actions;
export const raceDriversReducer = raceDriversSlice.reducer;
