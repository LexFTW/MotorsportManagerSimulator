import { raceTimingMock } from '@widgets/race-timing/models/raceTiming.mock';
import { DriverStatus } from '@entities';
import type { RaceDriverState } from '@entities';

const parseLapTime = (time: string): number => {
    const [mins, secs] = time.split(':');
    return parseInt(mins, 10) * 60 + parseFloat(secs);
};

const parseGap = (interval: string): number => {
    if (interval === 'Leader') return 0;
    return parseFloat(interval.replace('+', ''));
};

// Place leader at 0.5 (mid-circuit); each second of gap = 1/80 of a lap further back
const LAP_TIME_SECS = 85;
// const gapToProgress = (gap: number): number => (0.5 + gap / LAP_TIME_SECS) % 1;

export const initialRaceDrivers: RaceDriverState[] = raceTimingMock.map(row => ({
    driverId: row.code,
    position: row.position,
    gap: parseGap(row.interval),
    interval: 0,
    currentLap: row.laps,
    lapsCompleted: 0,
    sector: 1 as const,
    lastLapTime: parseLapTime(row.lastLap),
    bestLapTime: parseLapTime(row.bestLap),
    progress: 0.83,
    tyre: row.tyre,
    tyreAge: 10,
    tyreWear: 30,
    fuel: row.fuel,
    ers: row.ers,
    pitStops: [],
    status: DriverStatus.RACING,
}));
