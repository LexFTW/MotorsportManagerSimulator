import { useEffect, useRef, type RefObject } from 'react';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { selectMapDrivers } from '@app/store/selectors/raceMapSelectors';
import { batchUpdateDrivers } from '@app/store/slices/raceDriversSlice';
import { addEvents } from '@app/store/slices/raceEventsSlice';
import { RaceEventType } from '@entities';
import { SPEED_SAMPLES } from './buildSpeedMap';

const BASE_STEP = 0.0005;
// progress units map ~1:1 to lap fractions; one lap ≈ 80 simulated seconds at Barcelona
const GAP_SCALE = 80;

interface EngineDriver {
    id: string;
    progress: number;
    // Seeded with initialProgress so initial rank matches the store; incremented by step each tick
    // and by 1.0 on each lap completion — no wrap-around ambiguity
    cumulativeDistance: number;
    lapsCompleted: number;
    speedMultiplier: number;
    position: number;
}

export interface ScreenPosition {
    id: string;
    code: string;
    color: string;
    teamLogo: string;
    x: number;
    y: number;
}

export function useRaceEngine(
    pathRef: RefObject<SVGPathElement | null>,
    totalLengthRef: RefObject<number>,
    speedMapRef: RefObject<Float32Array | null>,
    pathReady: boolean,
    onPositionsUpdate: (positions: ScreenPosition[]) => void,
) {
    const dispatch = useAppDispatch();
    const mapDrivers = useAppSelector(selectMapDrivers);
    const mapDriversRef = useRef(mapDrivers);
    mapDriversRef.current = mapDrivers;

    const engineRef = useRef<EngineDriver[] | null>(null);

    useEffect(() => {
        if (!pathReady) return;

        const initial = mapDriversRef.current;
        // Sort descending: higher progress = further ahead on track at t=0
        const sorted = [...initial].sort((a, b) => b.progress - a.progress);
        engineRef.current = sorted.map((d, i) => ({
            id: d.id,
            progress: d.progress,
            // Seed with initial track offset so ranking is correct from tick 0
            cumulativeDistance: d.progress,
            lapsCompleted: 0,
            speedMultiplier: d.speedMultiplier,
            position: i + 1,
        }));
    }, [pathReady]);

    useEffect(() => {
        if (!pathReady) return;

        const path = pathRef.current!;
        const total = totalLengthRef.current!;
        const speedMap = speedMapRef.current!;

        const intervalId = setInterval(() => {
            const engine = engineRef.current;
            if (!engine) return;

            const prevPositions = new Map(engine.map(d => [d.id, d.position]));

            for (const d of engine) {
                const idx = Math.floor(d.progress * SPEED_SAMPLES) % SPEED_SAMPLES;
                const step = BASE_STEP * speedMap[idx] * d.speedMultiplier;
                const newProgress = ((d.progress - step) + 1) % 1;

                // Detect start/finish crossing: progress jumped from near-0 back to near-1
                if (newProgress > d.progress + 0.5) {
                    d.lapsCompleted += 1;
                    d.cumulativeDistance += 1.0;
                }

                d.cumulativeDistance += step;
                d.progress = newProgress;
            }

            const ranked = [...engine].sort((a, b) => b.cumulativeDistance - a.cumulativeDistance);
            ranked.forEach((d, i) => { d.position = i + 1; });

            const leaderDist = ranked[0].cumulativeDistance;
            const currentLap = ranked[0].lapsCompleted;

            const overtakeEvents = [];
            for (const d of engine) {
                const prev = prevPositions.get(d.id)!;
                if (d.position < prev) {
                    const overtakee = engine.find(
                        o => o.id !== d.id && prevPositions.get(o.id) === d.position
                    );
                    overtakeEvents.push({
                        lap: currentLap,
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
                    gap: (leaderDist - d.cumulativeDistance) * GAP_SCALE,
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
                    x: pt.x,
                    y: pt.y,
                };
            });

            onPositionsUpdate(screenPositions);
        }, 16);

        return () => clearInterval(intervalId);
    // onPositionsUpdate is a stable callback — intentionally excluded from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathReady, dispatch]);
}

