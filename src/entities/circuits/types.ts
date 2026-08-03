import type React from 'react';

export interface Circuit {
    id: string;
    name: string;
    location: string;
    country: string;
    countryCode: string;
    trackBackground: string;
    trackSvg: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    trackPath: TrackPath;
    totalLaps: number;
    lapDistanceKm: number;
    type: TrackType;
    downforceLevel: TrackDownforceLevel;
    tyreDegradation: number;
    pitLaneTimeSecs: number;
    overtakingDifficulty: TrackOvertakingDifficulty;
    sectors: TrackSector[];
    startFinishProgress: number;
    styles: CircuitStyles;
}

export const TrackType = {
    Street: 'Street',
    Permanent: 'Permanent',
    Hybrid: 'Hybrid',
} as const;
export type TrackType = typeof TrackType[keyof typeof TrackType];

export const TrackDownforceLevel = {
    Low: 'Low',
    Medium: 'Medium',
    High: 'High',
} as const;
export type TrackDownforceLevel = typeof TrackDownforceLevel[keyof typeof TrackDownforceLevel];

export const TrackOvertakingDifficulty = {
    Easy: 'Easy',
    Medium: 'Medium',
    Hard: 'Hard',
} as const;
export type TrackOvertakingDifficulty = typeof TrackOvertakingDifficulty[keyof typeof TrackOvertakingDifficulty];

export interface TrackPath {
    d: string;
    viewBox: string;
}

export interface TrackSector {
    id: number;
    name: string;
    distanceKm: number;
}

export interface CircuitDeviceStyles {
    top: string;
    left: string;
    width: string;
    height: string;
    transform?: string;
}

export interface CircuitStyles {
    mobile: CircuitDeviceStyles;
    tablet: CircuitDeviceStyles;
    desktop: CircuitDeviceStyles;
    /** landscape phones/tablets (e.g. 873×393) */
    landscape: CircuitDeviceStyles;
}
