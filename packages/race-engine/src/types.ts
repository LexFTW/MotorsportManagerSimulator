// ─── Tyre ────────────────────────────────────────────────────────────────────

export const TyreCompound = {
    Soft:   'Soft',
    Medium: 'Medium',
    Hard:   'Hard',
    Wet:    'Wet',
} as const;
export type TyreCompound = typeof TyreCompound[keyof typeof TyreCompound];

// ─── Driver / Team stats (mirrored from entities, no React deps) ──────────────

export interface DriverSkills {
    pace:           number;
    consistency:    number;
    tyreManagement: number;
    aggressiveness: number;
    wetSkills:      number;
    starts:         number;
    experience:     number;
}

export interface TeamStats {
    pace:          number;
    reliability:   number;
    downforce:     number;
    topSpeed:      number;
    tyreUsage:     number;
    pitCrewSpeed:  number;
    ersEfficiency: number;
}

// ─── Engine internal driver state ─────────────────────────────────────────────

export interface EngineDriver {
    id:                  string;
    teamId:              string;
    progress:            number;        // 0–1 position along the track
    lapsCompleted:       number;
    sector:              1 | 2 | 3;
    speedMultiplier:     number;        // normalised 0.85–1.15
    tyre:                TyreCompound;
    tyreWear:            number;        // 0–100
    tyreAge:             number;        // laps on current set
    tyreDegradationRate: number;        // effective %/lap
    position:            number;        // 1-based race position
    skills:              DriverSkills;
    teamStats:           TeamStats;
}

export interface RaceTickResult {
    tick:    number;
    drivers: DriverDelta[];
    events:  RaceEvent[];
}

export interface DriverDelta {
    driverId:      string;
    position:      number;
    progress:      number;
    lapsCompleted: number;
    sector:        1 | 2 | 3;
    gap:           number;     // seconds behind leader
    tyreWear:      number;
    tyreAge:       number;
}

export interface RaceEvent {
    lap:         number;
    type:        RaceEventType;
    driverId:    string;
    description: string;
}

export const RaceEventType = {
    OVERTAKE:             'OVERTAKE',
    PIT_STOP:             'PIT_STOP',
    CRASH:                'CRASH',
    MECHANICAL_FAILURE:   'MECHANICAL_FAILURE',
    PENALTY:              'PENALTY',
} as const;
export type RaceEventType = typeof RaceEventType[keyof typeof RaceEventType];

export interface RaceResult {
    driverId:      string;
    teamId:        string;
    userId:        string | null;   // null = AI-only driver (no human assigned)
    finalPosition: number;
    totalTime:     number;
    fastestLap:    number;
    pitStops:      PitStopRecord[];
}

export interface PitStopRecord {
    lap:      number;
    compound: TyreCompound;
}

// ─── Multiplayer: player strategy profile ─────────────────────────────────────

export interface TeamStrategyProfile {
    /** Pit when tyre wear reaches this percentage. */
    wearThreshold: number;
    /** Earliest lap to consider a planned pit stop. */
    lapWindowStart: number;
    /** Latest lap to consider a planned pit stop. */
    lapWindowEnd: number;
    /** Mirror a rival pit stop to defend undercut. */
    reactToUndercut: boolean;
    /** Compounds to use in order (index 0 = starting compound). */
    tyreStrategy:   TyreCompound[];
    raceStyle:      'aggressive' | 'balanced' | 'conservative';
    ersMode:        'attack' | 'harvest' | 'balanced';
}

export const DEFAULT_STRATEGY: TeamStrategyProfile = {
    wearThreshold:  70,
    lapWindowStart: 10,
    lapWindowEnd:   40,
    reactToUndercut: true,
    tyreStrategy:  [TyreCompound.Soft, TyreCompound.Medium],
    raceStyle:     'balanced',
    ersMode:       'balanced',
};

// ─── Multiplayer session ──────────────────────────────────────────────────────

export type PlayerConnectionStatus = 'CONNECTED' | 'DISCONNECTED' | 'NOT_JOINED';

export interface PlayerSlot {
    userId:   string;
    teamId:   string;
    status:   PlayerConnectionStatus;
    strategy: TeamStrategyProfile;
}

export interface FullRaceState {
    tick:      number;
    totalLaps: number;
    currentLap: number;
    status:    RaceStatus;
    drivers:   DriverDelta[];
    events:    RaceEvent[];
    players:   PlayerSlot[];
}

export const RaceStatus = {
    LOBBY:      'LOBBY',
    COUNTDOWN:  'COUNTDOWN',
    RACING:     'RACING',
    SAFETY_CAR: 'SAFETY_CAR',
    FINISHED:   'FINISHED',
} as const;
export type RaceStatus = typeof RaceStatus[keyof typeof RaceStatus];

// ─── WebSocket messages ───────────────────────────────────────────────────────

/** Client → Server */
export type C2SMessage =
    | { type: 'JOIN';         sessionId: string; teamId: string; strategy: TeamStrategyProfile }
    | { type: 'RECONNECT';    sessionId: string }
    | { type: 'SET_STRATEGY'; strategy: TeamStrategyProfile }
    | { type: 'PIT_STOP';     driverId: string; compound: TyreCompound }
    | { type: 'START_RACE' }
    | { type: 'PING' };

/** Server → Client */
export type S2CMessage =
    | { type: 'SESSION_JOINED';     yourTeam: string; state: FullRaceState }
    | { type: 'FULL_STATE';         state: FullRaceState }
    | { type: 'DELTA';              tick: number; drivers: DriverDelta[]; events?: RaceEvent[] }
    | { type: 'PLAYER_CONNECTED';   teamId: string; userId: string }
    | { type: 'PLAYER_DISCONNECTED';  teamId: string; userId: string }
    | { type: 'PLAYER_RECONNECTED';   teamId: string; userId: string }
    | { type: 'PIT_EXECUTED';       driverId: string; compound: TyreCompound; lap: number }
    | { type: 'RACE_FINISHED';      results: RaceResult[] }
    | { type: 'ERROR';              message: string }
    | { type: 'PONG';               serverTime: number };
