import type { TyreCompound } from "../tyres";

export interface RaceSession {
    circuitId: string;
    totalLaps: number;
    currentLap: number;
    status: RaceStatus;
    weather: RaceWeather;
}

export const RaceStatus = {
    PRE_RACE: 'PRE_RACE',
    FORMATION_LAP: 'FORMATION_LAP',
    RACING: 'RACING',
    SAFETY_CAR: 'SAFETY_CAR',
    VIRTUAL_SAFETY_CAR: 'VIRTUAL_SAFETY_CAR',
    RED_FLAG: 'RED_FLAG',
    FINISHED: 'FINISHED',
} as const;
export type RaceStatus = typeof RaceStatus[keyof typeof RaceStatus];

export interface RaceWeather {
    condition: WeatherCondition;
    trackTemperature: number; // in Celsius
    airTemperature: number; // in Celsius
}

export const WeatherCondition = {
    SUNNY: 'SUNNY',
    CLOUDY: 'CLOUDY',
    RAINY: 'RAINY',
    STORMY: 'STORMY',
    FOGGY: 'FOGGY',
} as const;
export type WeatherCondition = typeof WeatherCondition[keyof typeof WeatherCondition];

export const DriverStatus = {
    RACING: 'RACING',
    PIT: 'PIT',
    RETIRED: 'RETIRED',
    DNF: 'DNF',
} as const;
export type DriverStatus = typeof DriverStatus[keyof typeof DriverStatus];

export interface RaceDriverState {
    driverId: string;
    position: number;
    gap: number; // in seconds
    interval: number; // in seconds
    currentLap: number;
    lastLapTime: number; // in seconds
    bestLapTime: number; // in seconds
    progress: number; // percentage of race completed
    tyre: TyreCompound;
    tyreAge: number; // in laps
    tyreWear: number; // percentage of tyre wear
    fuel: number; // percentage remaining
    ers: number; // percentage remaining
    pitStops: PitStop[];
    status: DriverStatus;
}

export interface PitStop {
    lap: number;
    duration: number; // in seconds
    newTyre: TyreCompound;
    tyreLapsIn: number;
}

export interface RaceEvent {
    lap: number;
    type: RaceEventType;
    driverId: string;
    description: string;
}

export const RaceEventType = {
    OVERTAKE: 'OVERTAKE',
    PIT_STOP: 'PIT_STOP',
    CRASH: 'CRASH',
    MECHANICAL_FAILURE: 'MECHANICAL_FAILURE',
    PENALTY: 'PENALTY',
} as const;
export type RaceEventType = typeof RaceEventType[keyof typeof RaceEventType];