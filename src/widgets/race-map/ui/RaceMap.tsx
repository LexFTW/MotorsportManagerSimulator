import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./RaceMap.module.css";
import TrackBackground from "@shared/assets/images/circuits/barcelona/track.png";
import TrackSvg from "@shared/assets/images/circuits/barcelona/track.svg?react";
import { DriverMarker } from "./DriverMarker";
import { buildSpeedMap } from "../lib/buildSpeedMap";
import { useRaceEngine, type ScreenPosition } from "../lib/useRaceEngine";
import { useAppSelector } from "@app/store/hooks";
import { CIRCUITS } from "@entities";

type Breakpoint = 'mobile' | 'tablet' | 'desktop';

function useBreakpoint(): Breakpoint {
    const get = (): Breakpoint => {
        if (window.innerWidth < 768) return 'mobile';
        if (window.innerWidth < 1280) return 'tablet';
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
    const bp = useBreakpoint();
    const circuitStyle = circuit.styles[bp];

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

    useRaceEngine(pathRef, totalLengthRef, speedMapRef, pathReady, handlePositionsUpdate);

    const positionStyle = {
        top: circuitStyle.top,
        left: circuitStyle.left,
        width: circuitStyle.width,
        height: circuitStyle.height,
    };

    return (
        <>
            <div style={{ backgroundImage: `url(${TrackBackground})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, filter: 'blur(4px)' }} />
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />

            <TrackSvg className={styles.track} style={positionStyle} />

            <svg className={styles.trackOverlay} style={positionStyle} viewBox={circuit.trackPath.viewBox}>
                <path ref={pathRef} d={circuit.trackPath.d} visibility="hidden" />
                {pathReady && screenPositions.map(d => (
                    <DriverMarker key={d.id} driver={d} x={d.x} y={d.y} />
                ))}
            </svg>
        </>
    );
}
