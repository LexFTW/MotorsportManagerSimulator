export interface Circuit {
    id: number;
    name: string;
    location: string;
    country: string;
    trackPath: TrackPath;
    totalLaps: number;
    lapDistanceKm: number;
    type: TrackType;
    downforceLevel: TrackDownforceLevel;
    tyreDegradation: number;
    overtakingDifficulty: TrackOvertakingDifficulty;
    sectors: TrackSector[];
}

export enum TrackType {
    Street = 'Street',
    Permanent = 'Permanent',
    Hybrid = 'Hybrid',
}

export enum TrackDownforceLevel {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
}
export enum TrackOvertakingDifficulty {
    Easy = 'Easy',
    Medium = 'Medium',
    Hard = 'Hard',
}

export interface TrackPath {
    d: string;
    viewBox: string;
}

export interface TrackSector {
    id: number;
    name: string;
    distanceKm: number;
}