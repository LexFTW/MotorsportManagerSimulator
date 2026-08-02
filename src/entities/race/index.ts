import type { TyreCompound } from "../tyres";

export interface RaceSession {
    circuitId: string;
    totalLaps: number;
    currentLap: number;
    status: RaceStatus;
    weather: RaceWeather;
}

export enum RaceStatus {
    PRE_RACE = 'PRE_RACE',
    FORMATION_LAP = 'FORMATION_LAP',
    RACING = 'RACING',
    SAFETY_CAR = 'SAFETY_CAR',
    VIRTUAL_SAFETY_CAR = 'VIRTUAL_SAFETY_CAR',
    RED_FLAG = 'RED_FLAG',
    FINISHED = 'FINISHED',
}

export interface RaceWeather {
    condition: WeatherCondition;
    trackTemperature: number; // in Celsius
    airTemperature: number; // in Celsius
}

export enum WeatherCondition {
    SUNNY = 'SUNNY',
    CLOUDY = 'CLOUDY',
    RAINY = 'RAINY',
    STORMY = 'STORMY',
    FOGGY = 'FOGGY',
}

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
    ers: number; // in percentage
    pitStops: PitStop[];
    status: RaceStatus;
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

export enum RaceEventType {
    OVERTAKE = 'OVERTAKE',
    PIT_STOP = 'PIT_STOP',
    CRASH = 'CRASH',
    MECHANICAL_FAILURE = 'MECHANICAL_FAILURE',
    PENALTY = 'PENALTY',
}