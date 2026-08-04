export interface RaceTimingRow {
    position: number;
    number: number;
    code: string;
    name: string;
    country: string;
    team: TeamTiming;
    tyre: "Soft" | "Medium" | "Hard";
    laps: number;
    interval: string;
    intervalToAhead: string;
    lastLap: string;
    bestLap: string;
    ers: number;
    fuel: number;
    pitStops: number;
    tyreWear: number;
    drsActive: boolean;
}

export interface TeamTiming {
    name: string;
    color: string;
    logo: string;
}