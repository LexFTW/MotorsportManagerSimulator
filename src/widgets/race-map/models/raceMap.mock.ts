import { redbullracingLogo, mclarenLogo, ferrariLogo, mercedesLogo, astonMartinLogo, haasLogo } from "@/shared/assets/images/teams";

export interface DriverMock {
    id: string;
    teamLogo: string;
    code: string;
    color: string;
    progress: number;
    lapsCompleted: number;
    speedMultiplier: number;
    tyre: string;
    tyreWear: number;
    tyreAge: number;
    tyreDegradationRate: number;
    pitCrewSpeed: number;
    tyreManagement: number;
    tyreUsage: number;
}

export const raceMapMock: DriverMock[] = [
    {
        id: "VER", teamLogo: redbullracingLogo, code: "VER", color: "#1E5BC6", progress: 0.00, lapsCompleted: 0, speedMultiplier: 1.15,
        tyre: "",
        tyreWear: 0,
        tyreAge: 0,
        tyreDegradationRate: 0
    },
    {
        id: "NOR", teamLogo: mclarenLogo, code: "NOR", color: "#FF8700", progress: 0.23, lapsCompleted: 0, speedMultiplier: 1.13,
        tyre: "",
        tyreWear: 0,
        tyreAge: 0,
        tyreDegradationRate: 0
    },
    {
        id: "PIA", teamLogo: mclarenLogo, code: "PIA", color: "#FF8700", progress: 0.25, lapsCompleted: 0, speedMultiplier: 1.10,
        tyre: "",
        tyreWear: 0,
        tyreAge: 0,
        tyreDegradationRate: 0
    },
    {
        id: "LEC", teamLogo: ferrariLogo, code: "LEC", color: "#DC0000", progress: 0.35, lapsCompleted: 0, speedMultiplier: 1.08,
        tyre: "",
        tyreWear: 0,
        tyreAge: 0,
        tyreDegradationRate: 0
    },
    {
        id: "RUS", teamLogo: mercedesLogo, code: "RUS", color: "#00D2BE", progress: 0.43, lapsCompleted: 0, speedMultiplier: 1.05,
        tyre: "",
        tyreWear: 0,
        tyreAge: 0,
        tyreDegradationRate: 0
    },
    {
        id: "HAM", teamLogo: ferrariLogo, code: "HAM", color: "#DC0000", progress: 0.50, lapsCompleted: 0, speedMultiplier: 1.07,
        tyre: "",
        tyreWear: 0,
        tyreAge: 0,
        tyreDegradationRate: 0
    },
    {
        id: "ALO", teamLogo: astonMartinLogo, code: "ALO", color: "#006F62", progress: 0.70, lapsCompleted: 0, speedMultiplier: 1.00,
        tyre: "",
        tyreWear: 0,
        tyreAge: 0,
        tyreDegradationRate: 0
    },
    {
        id: "ANT", teamLogo: mercedesLogo, code: "ANT", color: "#00D2BE", progress: 0.71, lapsCompleted: 0, speedMultiplier: 0.97,
        tyre: "",
        tyreWear: 0,
        tyreAge: 0,
        tyreDegradationRate: 0
    },
    {
        id: "OCO", teamLogo: haasLogo, code: "OCO", color: "#FFFFFF", progress: 0.72, lapsCompleted: 0, speedMultiplier: 0.88,
        tyre: "",
        tyreWear: 0,
        tyreAge: 0,
        tyreDegradationRate: 0
    },
    {
        id: "PER", teamLogo: redbullracingLogo, code: "PER", color: "#1E41FF", progress: 0.73, lapsCompleted: 0, speedMultiplier: 1.06,
        tyre: "",
        tyreWear: 0,
        tyreAge: 0,
        tyreDegradationRate: 0
    },
];