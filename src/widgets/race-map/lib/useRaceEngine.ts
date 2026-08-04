import { useEffect, useRef, type RefObject } from 'react';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { selectMapDrivers } from '@app/store/selectors/raceMapSelectors';
import { batchUpdateDrivers, updateDriver, recordPitStop } from '@app/store/slices/raceDriversSlice';
import { addEvents } from '@app/store/slices/raceEventsSlice';
import { advanceLap, setStatus } from '@app/store/slices/raceSessionSlice';
import { CIRCUITS, DriverStatus, RaceEventType, RaceStatus, type TyreCompound } from '@entities';
import { SPEED_SAMPLES } from './buildSpeedMap';
import { calcEffectiveDegradationRate, calcTyreSpeedDelta } from './calcDriverSpeed';
import { planPitStrategy, shouldPitNow, type DriverStrategyPlan } from './pitStrategy';

const BASE_STEP = 0.0005;
const GAP_SCALE = 80; // one lap ≈ 80 simulated seconds at Barcelona
const DRS_SPEED_BOOST = 0.035; // ~3.5% speed gain in the DRS zone
const DRS_WINDOW = 1.0;        // max interval (sim-seconds) to be DRS eligible
const DRS_MIN_LAP = 0;         // DRS disabled for the first 2 laps

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
    tyreManagement: number;
    tyreUsage: number;
    position: number;
    lapStartTick: number;
    lastLapTime: number;
    bestLapTime: number;
    // pit stop state
    pitStopTicksRemaining: number;
    pendingCompound: TyreCompound | null;
    pitStopsDone: number;
    pitCrewSpeed: number;
    pitLaneTimeSecs: number;
    pitLaneX: number;
    pitLaneY: number;
    strategyPlan: DriverStrategyPlan;
    pitEntryLap: number;
    pitEntryTyreAge: number;
    pitDurationSecs: number;
    isFinished: boolean;
    drsActive: boolean;
    prevProgress: number;
    drsEligibleZones: boolean[];
}

export interface ScreenPosition {
    id: string;
    code: string;
    color: string;
    teamLogo: string;
    position: number;
    x: number;
    y: number;
    isPitting: boolean;
    isFinished: boolean;
    drsActive: boolean;
}

function calcPitDurationSecs(pitLaneTimeSecs: number, pitCrewSpeed: number): number {
    // crewSecs: pitCrewSpeed 100 → 2.0s, 70 → 4.0s
    const crewSecs = 2.0 + (100 - pitCrewSpeed) * 0.067;
    return pitLaneTimeSecs + crewSecs;
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

    const circuitId = useAppSelector(state => state.session.circuitId);
    const circuitIdRef = useRef(circuitId);

    const thresholdsRef = useRef(sectorThresholds);

    const engineRef = useRef<EngineDriver[] | null>(null);
    const prevLeaderLapsRef = useRef(0);
    const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Sync all "latest value" refs after every render so interval callbacks read current values
    useEffect(() => {
        mapDriversRef.current = mapDrivers;
        totalLapsRef.current = totalLaps;
        thresholdsRef.current = sectorThresholds;
        circuitIdRef.current = circuitId;
    });

    useEffect(() => {
        if (!pathReady) return;

        const initial     = mapDriversRef.current;
        const thresholds  = thresholdsRef.current;
        const circuit     = CIRCUITS[circuitIdRef.current];
        const path        = pathRef.current!;
        const total       = totalLengthRef.current!;
        const totalLapsVal = totalLapsRef.current;

        // Derive pit lane position: perpendicular offset from the S/F point (progress=0)
        const ptA     = path.getPointAtLength(0);
        const ptB     = path.getPointAtLength(total * 0.01);
        const dx      = ptB.x - ptA.x;
        const dy      = ptB.y - ptA.y;
        const len     = Math.hypot(dx, dy) || 1;
        const perpX   = -dy / len;
        const perpY   =  dx / len;
        const pitBaseX = ptA.x + perpX * 14;
        const pitBaseY = ptA.y + perpY * 14;

        engineRef.current = initial
            .map(d => {
                const sector      = getSector(d.progress, thresholds);
                const strategyPlan = planPitStrategy({
                    totalLaps: totalLapsVal,
                    circuitDegradation: circuit.tyreDegradation,
                    effectiveDegRate: d.tyreDegradationRate,
                    startCompound: d.tyre as TyreCompound,
                    jitterSeed: Math.random(),
                });
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
                    tyreManagement: d.tyreManagement,
                    tyreUsage: d.tyreUsage,
                    position: 0,
                    lapStartTick: 0,
                    lastLapTime: 0,
                    bestLapTime: Infinity,
                    pitStopTicksRemaining: 0,
                    pendingCompound: null,
                    pitStopsDone: 0,
                    pitCrewSpeed: d.pitCrewSpeed,
                    pitLaneTimeSecs: circuit.pitLaneTimeSecs,
                    pitLaneX: pitBaseX,
                    pitLaneY: pitBaseY,
                    strategyPlan,
                    pitEntryLap: 0,
                    pitEntryTyreAge: 0,
                    pitDurationSecs: 0,
                    isFinished: false,
                    drsActive: false,
                    prevProgress: d.progress,
                    drsEligibleZones: new Array(circuit.drsZones.length).fill(false),
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

        // Harmonic mean ensures lapTime = GAP_SCALE/multiplier, matching the gap formula units
        let sumInverse = 0;
        for (let i = 0; i < speedMap.length; i++) sumInverse += 1 / speedMap[i];
        const tickToGameSecs = GAP_SCALE * BASE_STEP * (speedMap.length / sumInverse);

        let tick = 0;
        intervalIdRef.current = setInterval(() => {
            tick++;
            const engine = engineRef.current;
            if (!engine) return;

            const thresholds   = thresholdsRef.current;
            const totalLapsVal = totalLapsRef.current;
            const prevPositions = new Map(engine.map(d => [d.id, d.position]));

            // Snapshot progress before movement so detection crossings can be detected after ranking
            for (const d of engine) d.prevProgress = d.progress;

            const pitEntryEvents: Array<{ driverId: string; lap: number; compound: TyreCompound }> = [];
            const pitExitEvents:  Array<{ driverId: string; lap: number; tyre: TyreCompound; tyreLapsIn: number; durationSecs: number }> = [];

            for (const d of engine) {
                // Driver is in the pit box: count down ticks
                if (d.pitStopTicksRemaining > 0) {
                    d.pitStopTicksRemaining--;
                    if (d.pitStopTicksRemaining === 0 && d.pendingCompound) {
                        const newCompound = d.pendingCompound;
                        d.tyre       = newCompound;
                        d.tyreWear   = 0;
                        d.tyreAge    = 0;
                        d.tyreDegradationRate = calcEffectiveDegradationRate(
                            newCompound, d.tyreManagement, d.tyreUsage
                        );
                        pitExitEvents.push({
                            driverId:    d.id,
                            lap:         d.lapsCompleted,
                            tyre:        newCompound,
                            tyreLapsIn:  d.pitEntryTyreAge,
                            durationSecs: d.pitDurationSecs,
                        });
                        d.pendingCompound = null;
                    }
                    continue; // marker stays at pit lane position
                }

                const idx = Math.floor(d.progress * SPEED_SAMPLES) % SPEED_SAMPLES;
                const drsBoost = d.drsActive ? DRS_SPEED_BOOST : 0;
                const effectiveMultiplier = d.speedMultiplier + calcTyreSpeedDelta(d.tyre, d.tyreWear) + drsBoost;
                const step = BASE_STEP * speedMap[idx] * Math.max(0.5, effectiveMultiplier);
                const newProgress = ((d.progress - step) + 1) % 1;

                // S/F crossing: progress wraps from near-0 back to near-1
                if (newProgress > d.progress + 0.5) {
                    d.lapsCompleted += 1;
                    d.tyreAge       += 1;
                    d.tyreWear = Math.min(100, d.tyreWear + d.tyreDegradationRate);
                    // lapStartTick=0 means first partial lap — skip to avoid incorrect bestLapTime
                    if (d.lapStartTick > 0) {
                        const lapTime = (tick - d.lapStartTick) * tickToGameSecs;
                        d.lastLapTime = lapTime;
                        if (lapTime < d.bestLapTime) d.bestLapTime = lapTime;
                    }
                    d.lapStartTick = tick;

                    // Evaluate pit strategy on every lap completion
                    const decision = shouldPitNow(
                        { lapsCompleted: d.lapsCompleted, tyreWear: d.tyreWear, pitStopsDone: d.pitStopsDone },
                        d.strategyPlan,
                        totalLapsVal,
                    );
                    if (decision.pit) {
                        const durSecs  = calcPitDurationSecs(d.pitLaneTimeSecs, d.pitCrewSpeed);
                        d.pitStopTicksRemaining = Math.ceil(durSecs / tickToGameSecs);
                        d.pendingCompound  = decision.compound;
                        d.pitEntryLap      = d.lapsCompleted;
                        d.pitEntryTyreAge  = d.tyreAge;
                        d.pitDurationSecs  = durSecs;
                        d.pitStopsDone++;
                        pitEntryEvents.push({ driverId: d.id, lap: d.lapsCompleted, compound: decision.compound });
                    }
                }

                d.progress = newProgress;
                d.sector   = getSector(newProgress, thresholds);
            }

            const ranked = [...engine].sort((a, b) =>
                driverRank(b.lapsCompleted, b.sector, b.progress) -
                driverRank(a.lapsCompleted, a.sector, a.progress)
            );
            ranked.forEach((d, i) => { d.position = i + 1; });

            const leader = ranked[0];

            // DRS: sticky eligibility set at detection point, cleared on zone exit
            const drsZones = CIRCUITS[circuitIdRef.current].drsZones ?? [];
            if (drsZones.length > 0 && leader.lapsCompleted >= DRS_MIN_LAP) {
                for (let i = 0; i < ranked.length; i++) {
                    const d = ranked[i];
                    if (d.pitStopTicksRemaining > 0 || d.isFinished) { d.drsActive = false; continue; }

                    for (let zi = 0; zi < drsZones.length; zi++) {
                        const z = drsZones[zi];

                        // One-shot eligibility check: driver crosses detection point downward
                        if (d.prevProgress > z.detection && d.progress <= z.detection) {
                            if (i === 0) {
                                d.drsEligibleZones[zi] = false;
                            } else {
                                const ahead = ranked[i - 1];
                                const interval = (ahead.lapsCompleted - d.lapsCompleted) * GAP_SCALE
                                    + (d.progress - ahead.progress) * GAP_SCALE;
                                d.drsEligibleZones[zi] = interval >= 0 && interval <= DRS_WINDOW;
                            }
                        }

                        // Reset eligibility when the driver exits the zone
                        const wasInZone = d.prevProgress <= z.entry && d.prevProgress >= z.exit;
                        const nowInZone = d.progress   <= z.entry && d.progress   >= z.exit;
                        if (wasInZone && !nowInZone) d.drsEligibleZones[zi] = false;
                    }

                    // DRS active only when inside a zone for which eligibility was granted
                    d.drsActive = drsZones.some((z, zi) =>
                        d.progress <= z.entry && d.progress >= z.exit && d.drsEligibleZones[zi]
                    );
                }
            } else {
                for (const d of engine) d.drsActive = false;
            }

            // Mark drivers as finished when they cross the line for their last lap
            const justFinished: string[] = [];
            for (const d of engine) {
                if (!d.isFinished && d.lapsCompleted >= totalLapsVal) {
                    d.isFinished = true;
                    justFinished.push(d.id);
                }
            }
            // When the leader finishes, classify all remaining drivers immediately
            const raceOver = leader.lapsCompleted >= totalLapsVal;
            if (raceOver) {
                for (const d of engine) {
                    if (!d.isFinished) {
                        d.isFinished = true;
                        justFinished.push(d.id);
                    }
                }
            }

            const allEvents = [];

            for (const d of engine) {
                const prev = prevPositions.get(d.id)!;
                if (d.position < prev && d.pitStopTicksRemaining === 0) {
                    const overtakee = engine.find(
                        o => o.id !== d.id && prevPositions.get(o.id) === d.position
                    );
                    allEvents.push({
                        lap:         leader.lapsCompleted,
                        type:        RaceEventType.OVERTAKE,
                        driverId:    d.id,
                        description: `${d.id} adelantó a ${overtakee?.id ?? '?'}`,
                    });
                }
            }

            for (const pe of pitEntryEvents) {
                allEvents.push({
                    lap:         pe.lap,
                    type:        RaceEventType.PIT_STOP,
                    driverId:    pe.driverId,
                    description: `${pe.driverId} entra a boxes → ${pe.compound}`,
                });
                dispatch(updateDriver({ driverId: pe.driverId, status: DriverStatus.PIT }));
            }

            for (const px of pitExitEvents) {
                allEvents.push({
                    lap:         px.lap,
                    type:        RaceEventType.PIT_EXIT,
                    driverId:    px.driverId,
                    description: `${px.driverId} sale de boxes con ${px.tyre}`,
                });
                dispatch(updateDriver({ driverId: px.driverId, status: DriverStatus.RACING, tyre: px.tyre, tyreWear: 0, tyreAge: 0 }));
                dispatch(recordPitStop({
                    driverId: px.driverId,
                    stop: { lap: px.lap, duration: px.durationSecs, newTyre: px.tyre, tyreLapsIn: px.tyreLapsIn },
                }));
            }

            if (allEvents.length > 0) dispatch(addEvents(allEvents));

            for (const driverId of justFinished) {
                dispatch(updateDriver({ driverId, status: DriverStatus.FINISHED }));
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
                    drsActive: d.drsActive,
                    ...(d.bestLapTime < Infinity && {
                        lastLapTime: d.lastLapTime,
                        bestLapTime: d.bestLapTime,
                    }),
                }))
            ));

            // Pitting and finished drivers are shown off-track with index-based spacing
            let pitIndex = 0;
            let finishedIndex = 0;
            const screenPositions: ScreenPosition[] = engine.map(d => {
                const isFinished = d.isFinished;
                const isPitting  = d.pitStopTicksRemaining > 0 && !isFinished;
                let x: number, y: number;
                if (isFinished) {
                    x = d.pitLaneX + finishedIndex * 5;
                    y = d.pitLaneY + 12;
                    finishedIndex++;
                } else if (isPitting) {
                    x = d.pitLaneX + pitIndex * 5;
                    y = d.pitLaneY;
                    pitIndex++;
                } else {
                    const pt = path.getPointAtLength(d.progress * total);
                    x = pt.x;
                    y = pt.y;
                }
                const driver = mapDriversRef.current.find(md => md.id === d.id);
                return {
                    id: d.id,
                    code: driver?.code ?? d.id,
                    color: driver?.color ?? '#FFFFFF',
                    teamLogo: driver?.teamLogo ?? '',
                    position: d.position,
                    x,
                    y,
                    isPitting,
                    isFinished,
                    drsActive: d.drsActive,
                };
            });

            onPositionsUpdate(screenPositions);

            // Advance session lap counter each time the leader crosses S/F
            if (leader.lapsCompleted > prevLeaderLapsRef.current) {
                prevLeaderLapsRef.current = leader.lapsCompleted;
                dispatch(advanceLap());
            }

            // Race ends when the leader completes all laps
            if (raceOver) {
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

