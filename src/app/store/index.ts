import { configureStore } from '@reduxjs/toolkit';
import { raceSessionReducer } from './slices/raceSessionSlice';
import { raceDriversReducer } from './slices/raceDriversSlice';
import { raceEventsReducer } from './slices/raceEventsSlice';
import { multiplayerReducer } from './slices/multiplayerSlice';

export const store = configureStore({
    reducer: {
        session:     raceSessionReducer,
        drivers:     raceDriversReducer,
        events:      raceEventsReducer,
        multiplayer: multiplayerReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
