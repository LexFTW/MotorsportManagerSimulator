import { redbullracingLogo, mclarenLogo, ferrariLogo, mercedesLogo, astonMartinLogo, haasLogo } from "@/shared/assets/images/teams";

export interface DriverMock {
    id: string;
    teamLogo: string;
    code: string;
    color: string;
    progress: number;
    speedMultiplier: number;
}

export const raceMapMock: DriverMock[] = [
    { id: "VER", teamLogo: redbullracingLogo, code: "VER", color: "#1E5BC6", progress: 0.00, speedMultiplier: 1.15 },
    { id: "NOR", teamLogo: mclarenLogo,       code: "NOR", color: "#FF8700", progress: 0.23, speedMultiplier: 1.13 },
    { id: "PIA", teamLogo: mclarenLogo,       code: "PIA", color: "#FF8700", progress: 0.25, speedMultiplier: 1.10 },
    { id: "LEC", teamLogo: ferrariLogo,       code: "LEC", color: "#DC0000", progress: 0.35, speedMultiplier: 1.08 },
    { id: "RUS", teamLogo: mercedesLogo,      code: "RUS", color: "#00D2BE", progress: 0.43, speedMultiplier: 1.05 },
    { id: "HAM", teamLogo: ferrariLogo,       code: "HAM", color: "#DC0000", progress: 0.50, speedMultiplier: 1.07 },
    { id: "ALO", teamLogo: astonMartinLogo,   code: "ALO", color: "#006F62", progress: 0.70, speedMultiplier: 1.00 },
    { id: "ANT", teamLogo: mercedesLogo,      code: "ANT", color: "#00D2BE", progress: 0.71, speedMultiplier: 0.97 },
    { id: "OCO", teamLogo: haasLogo,          code: "OCO", color: "#FFFFFF", progress: 0.72, speedMultiplier: 0.88 },
    { id: "PER", teamLogo: redbullracingLogo, code: "PER", color: "#1E41FF", progress: 0.73, speedMultiplier: 1.06 },
];