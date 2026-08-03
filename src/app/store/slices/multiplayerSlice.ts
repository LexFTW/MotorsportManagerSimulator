import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_STRATEGY, type TeamStrategyProfile, type PlayerSlot } from '@features/multiplayer';

interface MultiplayerState {
    sessionId:    string | null;
    userId:       string | null;
    myTeamId:     string | null;
    status:       'IDLE' | 'CONNECTING' | 'LOBBY' | 'RACING' | 'DISCONNECTED' | 'FINISHED';
    players:      PlayerSlot[];
    myStrategy:   TeamStrategyProfile;
}

const initialState: MultiplayerState = {
    sessionId:    null,
    userId:       null,
    myTeamId:     null,
    status:       'IDLE',
    players:      [],
    myStrategy:   DEFAULT_STRATEGY,
};

const multiplayerSlice = createSlice({
    name: 'multiplayer',
    initialState,
    reducers: {
        setSession: (state, action: PayloadAction<{ sessionId: string; userId: string; teamId: string }>) => {
            state.sessionId = action.payload.sessionId;
            state.userId    = action.payload.userId;
            state.myTeamId  = action.payload.teamId;
        },
        setConnectionStatus: (state, action: PayloadAction<MultiplayerState['status']>) => {
            state.status = action.payload;
        },
        setPlayers: (state, action: PayloadAction<PlayerSlot[]>) => {
            state.players = action.payload;
        },
        setMyStrategy: (state, action: PayloadAction<TeamStrategyProfile>) => {
            state.myStrategy = action.payload;
        },
        resetMultiplayer: () => initialState,
    },
});

export const {
    setSession,
    setConnectionStatus,
    setPlayers,
    setMyStrategy,
    resetMultiplayer,
} = multiplayerSlice.actions;

export const multiplayerReducer = multiplayerSlice.reducer;
