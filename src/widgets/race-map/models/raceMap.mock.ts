import { redbullracingLogo, mclarenLogo, ferrariLogo, mercedesLogo, astonMartinLogo, haasLogo } from "@/shared/assets/images/teams";

export interface DriverMock {
    id: number;
    teamLogo: string;
    code: string;
    color: string;
    progress: number;
}

export const raceMapMock: DriverMock[] = [
    { id: 1, teamLogo: redbullracingLogo ,code: "VER", color: "#1E5BC6",  progress: 0.00 },
    { id: 2, teamLogo: mclarenLogo, code: "NOR", color: "#FF8700",  progress: 0.23 },
    { id: 3, teamLogo: mclarenLogo, code: "PIA", color: "#FF8700",  progress: 0.25 },
    { id: 4, teamLogo: ferrariLogo, code: "LEC", color: "#DC0000",  progress: 0.35 },
    { id: 5, teamLogo: mercedesLogo, code: "RUS", color: "#00D2BE",  progress: 0.43 },
    { id: 6, teamLogo: ferrariLogo, code: "HAM", color: "#DC0000",  progress: 0.50 },
    { id: 8, teamLogo: astonMartinLogo, code: "ALO", color: "#006F62",  progress: 0.70 },
    { id: 7, teamLogo: mercedesLogo, code: "ANT", color: "#00D2BE",  progress: 0.71 },
    { id: 9, teamLogo: haasLogo, code: "OCO", color: "#FFFFFF",  progress: 0.72 },
    { id: 10, teamLogo: redbullracingLogo, code: "HAD", color: "#1E5BC6", progress: 0.73 },
];