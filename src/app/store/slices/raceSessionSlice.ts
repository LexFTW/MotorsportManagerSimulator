import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { RaceStatus, WeatherCondition } from '@entities';
import type { RaceSession, RaceWeather } from '@entities';

const initialState: RaceSession = {
    circuitId: 'monza',
    totalLaps: 53,
    currentLap: 0,
    status: RaceStatus.PRE_RACE,
    weather: {
        condition: WeatherCondition.SUNNY,
        trackTemperature: 43,
        airTemperature: 22,
    },
};

const raceSessionSlice = createSlice({
    name: 'raceSession',
    initialState,
    reducers: {
        setStatus: (state, action: PayloadAction<RaceSession['status']>) => {
            state.status = action.payload;
        },
        advanceLap: (state) => {
            state.currentLap += 1;
        },
        setWeather: (state, action: PayloadAction<RaceWeather>) => {
            state.weather = action.payload;
        },
        setCircuit: (state, action: PayloadAction<string>) => {
            state.circuitId = action.payload;
        },
    },
});

export const { setStatus, advanceLap, setWeather, setCircuit } = raceSessionSlice.actions;
export const raceSessionReducer = raceSessionSlice.reducer;
