export interface Tyre {
    compound: TyreCompound;
    gripLevel: TyreGripLevel;
    degradationRate: number; // % wear per lap
    optimalLapRange: [number, number];
    thermalSensitivity: number;
}

export const TyreCompound = {
    Soft: 'Soft',
    Medium: 'Medium',
    Hard: 'Hard',
    Wet: 'Wet',
} as const;
export type TyreCompound = typeof TyreCompound[keyof typeof TyreCompound];

export const TyreGripLevel = {
    Low: 'Low',
    Medium: 'Medium',
    High: 'High',
} as const;
export type TyreGripLevel = typeof TyreGripLevel[keyof typeof TyreGripLevel];