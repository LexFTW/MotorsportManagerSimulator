import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./RaceMap.module.css";
import TrackBackground from "@shared/assets/images/circuits/barcelona/track.png";
import TrackSvg from "@shared/assets/images/circuits/barcelona/track.svg?react";
import { BARCELONA_TRACK } from "../models/trackPath";
import { DriverMarker } from "./DriverMarker";
import { buildSpeedMap } from "../lib/buildSpeedMap";
import { useRaceEngine, type ScreenPosition } from "../lib/useRaceEngine";

export const RaceMap = () => {
    const pathRef = useRef<SVGPathElement>(null);
    const totalLengthRef = useRef(0);
    const speedMapRef = useRef<Float32Array | null>(null);
    const [screenPositions, setScreenPositions] = useState<ScreenPosition[]>([]);
    const [pathReady, setPathReady] = useState(false);

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

    return (
        <>
            <div style={{ backgroundImage: `url(${TrackBackground})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, filter: 'blur(4px)' }} />
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />

            <TrackSvg className={styles.track} />

            <svg className={styles.trackOverlay} viewBox={BARCELONA_TRACK.viewBox}>
                <path ref={pathRef} d={BARCELONA_TRACK.d} visibility="hidden" />
                {pathReady && screenPositions.map(d => (
                    <DriverMarker key={d.id} driver={d} x={d.x} y={d.y} />
                ))}
            </svg>
        </>
    );
}
