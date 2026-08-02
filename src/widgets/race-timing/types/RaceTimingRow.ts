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
    lastLap: string;
    bestLap: string;
    ers: number;
    fuel: number;
    pitStops: number;
}

export interface TeamTiming {
    name: string;
    color: string;
    logo: string;
}