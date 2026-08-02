import { redbullracingLogo, mclarenLogo, ferrariLogo, mercedesLogo, astonMartinLogo, haasLogo } from "@/shared/assets/images/teams";

export interface DriverMock {
    id: string;
    teamLogo: string;
    code: string;
    color: string;
    progress: number;
}

export const raceMapMock: DriverMock[] = [
    { id: "VER", teamLogo: redbullracingLogo, code: "VER", color: "#1E5BC6", progress: 0.00 },
    { id: "NOR", teamLogo: mclarenLogo,       code: "NOR", color: "#FF8700", progress: 0.23 },
    { id: "PIA", teamLogo: mclarenLogo,       code: "PIA", color: "#FF8700", progress: 0.25 },
    { id: "LEC", teamLogo: ferrariLogo,       code: "LEC", color: "#DC0000", progress: 0.35 },
    { id: "RUS", teamLogo: mercedesLogo,      code: "RUS", color: "#00D2BE", progress: 0.43 },
    { id: "HAM", teamLogo: ferrariLogo,       code: "HAM", color: "#DC0000", progress: 0.50 },
    { id: "ALO", teamLogo: astonMartinLogo,   code: "ALO", color: "#006F62", progress: 0.70 },
    { id: "ANT", teamLogo: mercedesLogo,      code: "ANT", color: "#00D2BE", progress: 0.71 },
    { id: "OCO", teamLogo: haasLogo,          code: "OCO", color: "#FFFFFF", progress: 0.72 },
    { id: "PER", teamLogo: redbullracingLogo, code: "PER", color: "#1E41FF", progress: 0.73 },
];