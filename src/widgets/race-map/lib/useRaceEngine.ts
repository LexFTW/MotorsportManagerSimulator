import { useEffect, useRef, type RefObject } from 'react';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { selectMapDrivers } from '@app/store/selectors/raceMapSelectors';
import { batchUpdateDrivers } from '@app/store/slices/raceDriversSlice';
import { addEvents } from '@app/store/slices/raceEventsSlice';
import { advanceLap, setStatus } from '@app/store/slices/raceSessionSlice';
import { RaceEventType, RaceStatus } from '@entities';
import { SPEED_SAMPLES } from './buildSpeedMap';
import { calcTyreSpeedDelta } from './calcDriverSpeed';

const BASE_STEP = 0.0005;
const GAP_SCALE = 80; // one lap ≈ 80 simulated seconds at Barcelona

// sectorThresholds[0] = progress value at S1/S2 boundary (decreasing progress scale)
// sectorThresholds[1] = progress value at S2/S3 boundary
// sector 1: progress > thresholds[0]  (just after S/F crossing)
// sector 2: thresholds[1] < progress ≤ thresholds[0]
// sector 3: progress ≤ thresholds[1]  (approaching S/F)
function getSector(progress: number, thresholds: [number, number]): 1 | 2 | 3 {
    if (progress > thresholds[0]) return 1;
    if (progress > thresholds[1]) return 2;
    return 3;
}

// Stable rank: laps*3 + (sector-1) - progress
// Guarantees no overlap between sectors; higher value = further ahead in the race
function driverRank(lapsCompleted: number, sector: 1 | 2 | 3, progress: number): number {
    return lapsCompleted * 3 + (sector - 1) - progress;
}

interface EngineDriver {
    id: string;
    progress: number;
    lapsCompleted: number;
    sector: 1 | 2 | 3;
    speedMultiplier: number;
    tyre: string;
    tyreWear: number;
    tyreAge: number;
    tyreDegradationRate: number;
    position: number;
}

export interface ScreenPosition {
    id: string;
    code: string;
    color: string;
    teamLogo: string;
    position: number;
    x: number;
    y: number;
}

export function useRaceEngine(
    pathRef: RefObject<SVGPathElement | null>,
    totalLengthRef: RefObject<number>,
    speedMapRef: RefObject<Float32Array | null>,
    pathReady: boolean,
    sectorThresholds: [number, number],
    onPositionsUpdate: (positions: ScreenPosition[]) => void,
) {
    const dispatch = useAppDispatch();
    const mapDrivers = useAppSelector(selectMapDrivers);
    const mapDriversRef = useRef(mapDrivers);

    const totalLaps = useAppSelector(state => state.session.totalLaps);
    const totalLapsRef = useRef(totalLaps);

    const thresholdsRef = useRef(sectorThresholds);

    const engineRef = useRef<EngineDriver[] | null>(null);
    const prevLeaderLapsRef = useRef(0);
    const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Sync all "latest value" refs after every render so interval callbacks read current values
    useEffect(() => {
        mapDriversRef.current = mapDrivers;
        totalLapsRef.current = totalLaps;
        thresholdsRef.current = sectorThresholds;
    });

    useEffect(() => {
        if (!pathReady) return;

        const initial = mapDriversRef.current;
        const thresholds = thresholdsRef.current;
        engineRef.current = initial
            .map(d => {
                const sector = getSector(d.progress, thresholds);
                return {
                    id: d.id,
                    progress: d.progress,
                    lapsCompleted: d.lapsCompleted,
                    sector,
                    speedMultiplier: d.speedMultiplier,
                    tyre: d.tyre,
                    tyreWear: d.tyreWear,
                    tyreAge: d.tyreAge,
                    tyreDegradationRate: d.tyreDegradationRate,
                    position: 0,
                };
            })
            .sort((a, b) =>
                driverRank(b.lapsCompleted, b.sector, b.progress) -
                driverRank(a.lapsCompleted, a.sector, a.progress)
            )
            .map((d, i) => ({ ...d, position: i + 1 }));

        // Sync prevLeaderLaps so the first real crossing is detected correctly
        prevLeaderLapsRef.current = engineRef.current[0]?.lapsCompleted ?? 0;
    }, [pathReady]);

    useEffect(() => {
        if (!pathReady) return;

        const path = pathRef.current!;
        const total = totalLengthRef.current!;
        const speedMap = speedMapRef.current!;

        intervalIdRef.current = setInterval(() => {
            const engine = engineRef.current;
            if (!engine) return;

            const thresholds = thresholdsRef.current;
            const prevPositions = new Map(engine.map(d => [d.id, d.position]));

            for (const d of engine) {
                const idx = Math.floor(d.progress * SPEED_SAMPLES) % SPEED_SAMPLES;
                const effectiveMultiplier = d.speedMultiplier + calcTyreSpeedDelta(d.tyre, d.tyreWear);
                const step = BASE_STEP * speedMap[idx] * Math.max(0.5, effectiveMultiplier);
                const newProgress = ((d.progress - step) + 1) % 1;

                // S/F crossing: progress wraps from near-0 back to near-1
                if (newProgress > d.progress + 0.5) {
                    d.lapsCompleted += 1;
                    d.tyreAge += 1;
                    d.tyreWear = Math.min(100, d.tyreWear + d.tyreDegradationRate);
                }

                d.progress = newProgress;
                d.sector = getSector(newProgress, thresholds);
            }

            const ranked = [...engine].sort((a, b) =>
                driverRank(b.lapsCompleted, b.sector, b.progress) -
                driverRank(a.lapsCompleted, a.sector, a.progress)
            );
            ranked.forEach((d, i) => { d.position = i + 1; });

            const leader = ranked[0];

            const overtakeEvents = [];
            for (const d of engine) {
                const prev = prevPositions.get(d.id)!;
                if (d.position < prev) {
                    const overtakee = engine.find(
                        o => o.id !== d.id && prevPositions.get(o.id) === d.position
                    );
                    overtakeEvents.push({
                        lap: leader.lapsCompleted,
                        type: RaceEventType.OVERTAKE,
                        driverId: d.id,
                        description: `${d.id} adelantó a ${overtakee?.id ?? '?'}`,
                    });
                }
            }

            if (overtakeEvents.length > 0) {
                dispatch(addEvents(overtakeEvents));
            }

            dispatch(batchUpdateDrivers(
                engine.map(d => ({
                    driverId: d.id,
                    position: d.position,
                    progress: d.progress,
                    lapsCompleted: d.lapsCompleted,
                    sector: d.sector,
                    gap: (leader.lapsCompleted - d.lapsCompleted) * GAP_SCALE
                        + (d.progress - leader.progress) * GAP_SCALE,
                    tyreWear: d.tyreWear,
                    tyreAge: d.tyreAge,
                }))
            ));

            const screenPositions: ScreenPosition[] = engine.map(d => {
                const pt = path.getPointAtLength(d.progress * total);
                const driver = mapDriversRef.current.find(md => md.id === d.id);
                return {
                    id: d.id,
                    code: driver?.code ?? d.id,
                    color: driver?.color ?? '#FFFFFF',
                    teamLogo: driver?.teamLogo ?? '',
                    position: d.position,
                    x: pt.x,
                    y: pt.y,
                };
            });

            onPositionsUpdate(screenPositions);

            // Advance session lap counter each time the leader crosses S/F
            if (leader.lapsCompleted > prevLeaderLapsRef.current) {
                prevLeaderLapsRef.current = leader.lapsCompleted;
                dispatch(advanceLap());
            }

            // Race over when the last driver completes all laps
            const lastDriver = ranked[ranked.length - 1];
            if (lastDriver.lapsCompleted >= totalLapsRef.current) {
                dispatch(setStatus(RaceStatus.FINISHED));
                if (intervalIdRef.current) clearInterval(intervalIdRef.current);
            }
        }, 16);

        return () => {
            if (intervalIdRef.current) clearInterval(intervalIdRef.current);
        };
    // onPositionsUpdate is a stable callback — intentionally excluded from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathReady, dispatch]);
}

