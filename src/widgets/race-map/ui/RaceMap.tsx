import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./RaceMap.module.css";
import { DriverMarker } from "./DriverMarker";
import { buildSpeedMap } from "../lib/buildSpeedMap";
import { useRaceEngine, type ScreenPosition } from "../lib/useRaceEngine";
import { useAppSelector } from "@app/store/hooks";
import { CIRCUITS } from "@entities";

type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'landscape';

function useBreakpoint(): Breakpoint {
    const get = (): Breakpoint => {
        const { innerWidth: w, innerHeight: h } = window;
        if (w > h && h <= 450) return 'landscape';
        if (w < 768) return 'mobile';
        if (w < 1280) return 'tablet';
        return 'desktop';
    };
    const [bp, setBp] = useState<Breakpoint>(get);
    useEffect(() => {
        const handler = () => setBp(get());
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);
    return bp;
}

export const RaceMap = () => {
    const pathRef = useRef<SVGPathElement>(null);
    const totalLengthRef = useRef(0);
    const speedMapRef = useRef<Float32Array | null>(null);
    const [screenPositions, setScreenPositions] = useState<ScreenPosition[]>([]);
    const [pathReady, setPathReady] = useState(false);

    const circuitId = useAppSelector(state => state.session.circuitId);
    const circuit = CIRCUITS[circuitId];
    const TrackSvg = circuit.trackSvg;
    const bp = useBreakpoint();
    const circuitStyle = circuit.styles[bp];

    // Sector boundaries as progress thresholds (progress decreases as driver advances)
    // sector 1: progress > thresholds[0], sector 2: thresholds[1]..thresholds[0], sector 3: ≤ thresholds[1]
    const sectorThresholds = useMemo((): [number, number] => {
        const total = circuit.lapDistanceKm;
        const s1 = circuit.sectors[0].distanceKm / total;
        const s2 = (circuit.sectors[0].distanceKm + circuit.sectors[1].distanceKm) / total;
        return [1 - s1, 1 - s2];
    }, [circuit]);

    useEffect(() => {
        if (!pathRef.current) return;
        const path = pathRef.current;
        totalLengthRef.current = path.getTotalLength();
        speedMapRef.current = buildSpeedMap(path);
        setPathReady(true);
    }, []);

    const handlePositionsUpdate = useCallback((positions: ScreenPosition[]) => {
        setScreenPositions(positions);
    }, []);

    useRaceEngine(pathRef, totalLengthRef, speedMapRef, pathReady, sectorThresholds, handlePositionsUpdate);

    const positionStyle = {
        top: circuitStyle.top,
        left: circuitStyle.left,
        width: circuitStyle.width,
        height: circuitStyle.height,
        transform: circuitStyle.transform,
    };

    return (
        <>
            <div style={{ backgroundImage: `url(${circuit.trackBackground})`,
            backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: bp === 'mobile' ? 'contain' : 'cover', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, filter: 'blur(4px)' }} />
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />

            {circuit.trackPath && (
                <TrackSvg 
                    className={styles.track} 
                    style={positionStyle} />
            )}

            <svg className={styles.trackOverlay} style={positionStyle} viewBox={circuit.trackPath.viewBox}>
                <path ref={pathRef} d={circuit.trackPath.d} visibility="hidden" />
                {pathReady && screenPositions.map(d => (
                    <DriverMarker key={d.id} driver={d} x={d.x} y={d.y} isPitting={d.isPitting} isFinished={d.isFinished} />
                ))}
            </svg>
        </>
    );
}
