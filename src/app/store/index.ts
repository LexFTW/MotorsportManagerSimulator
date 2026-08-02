import { configureStore } from '@reduxjs/toolkit';
import { raceSessionReducer } from './slices/raceSessionSlice';
import { raceDriversReducer } from './slices/raceDriversSlice';
import { raceEventsReducer } from './slices/raceEventsSlice';

export const store = configureStore({
    reducer: {
        session: raceSessionReducer,
        drivers: raceDriversReducer,
        events: raceEventsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
