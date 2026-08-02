export { TEAMS } from './teams.data';

export interface Team {
    id: string;
    name: string;
    country: string;
    color: string;
    logo: string;
    stats: TeamStats;
}

export interface TeamStats {
    pace: number;
    reliability: number;
    downforce: number;
    topSpeed: number;
    tyreUsage: number;
    pitCrewSpeed: number;
    ersEfficiency: number;
}