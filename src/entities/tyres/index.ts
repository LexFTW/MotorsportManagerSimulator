export interface Tyre {
    compound: TyreCompound;
    gripLevel: TyreGripLevel;
    optimalLapRange: [number, number];
    thermalSensitivity: number;
}

export enum TyreCompound {
    Soft = 'Soft',
    Medium = 'Medium',
    Hard = 'Hard',
    Wet = 'Wet',
}

export enum TyreGripLevel {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
}