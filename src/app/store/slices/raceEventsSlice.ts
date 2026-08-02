import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RaceEvent } from '@entities';

const initialState: RaceEvent[] = [];

const raceEventsSlice = createSlice({
    name: 'raceEvents',
    initialState,
    reducers: {
        addEvent: (state, action: PayloadAction<RaceEvent>) => {
            state.push(action.payload);
        },
        addEvents: (state, action: PayloadAction<RaceEvent[]>) => {
            state.push(...action.payload);
        },
        clearEvents: () => [],
    },
});

export const { addEvent, addEvents, clearEvents } = raceEventsSlice.actions;
export const raceEventsReducer = raceEventsSlice.reducer;
