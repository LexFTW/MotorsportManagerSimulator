import { useEffect, useRef, useState } from "react";
import styles from "./RaceMap.module.css";
import TrackBackground from "@shared/assets/images/circuits/barcelona/track.png";
import TrackSvg from "@shared/assets/images/circuits/barcelona/track.svg?react";
import type { DriverMock } from "../models/raceMap.mock";
import { BARCELONA_TRACK } from "../models/trackPath";
import { DriverMarker } from "./DriverMarker";
import { useAppSelector } from "@app/store/hooks";
import { selectMapDrivers } from "@app/store/selectors/raceMapSelectors";
import { buildSpeedMap, SPEED_SAMPLES } from "../lib/buildSpeedMap";

const BASE_STEP = 0.0005;

type DriverState = DriverMock & { x: number; y: number };

export const RaceMap = () => {
    const pathRef = useRef<SVGPathElement>(null);
    const totalLengthRef = useRef(0);
    const speedMapRef = useRef<Float32Array | null>(null);
    const mapDrivers = useAppSelector(selectMapDrivers);
    // Ref captures store positions once at mount to seed the animation
    const initialDriversRef = useRef(mapDrivers);
    const [drivers, setDrivers] = useState<DriverState[]>([]);
    const [pathReady, setPathReady] = useState(false);

    useEffect(() => {
        if (!pathRef.current) return;
        const path = pathRef.current;
        totalLengthRef.current = path.getTotalLength();
        speedMapRef.current = buildSpeedMap(path);
        setDrivers(initialDriversRef.current.map(d => {
            const pt = path.getPointAtLength(d.progress * totalLengthRef.current);
            return { ...d, x: pt.x, y: pt.y };
        }));
        setPathReady(true);
    }, []);

    // Temporary animation loop — will be replaced by race engine dispatching tickDrivers
    useEffect(() => {
        if (!pathReady) return;
        const path = pathRef.current!;
        const total = totalLengthRef.current;
        const speedMap = speedMapRef.current!;
        const id = setInterval(() => {
            setDrivers(prev => prev.map(d => {
                const idx = Math.floor(d.progress * SPEED_SAMPLES) % SPEED_SAMPLES;
                const newProgress = ((d.progress - BASE_STEP * speedMap[idx] * d.speedMultiplier) + 1) % 1;
                const pt = path.getPointAtLength(newProgress * total);
                return { ...d, progress: newProgress, x: pt.x, y: pt.y };
            }));
        }, 16);
        return () => clearInterval(id);
    }, [pathReady]);

    return (
        <>
            <div style={{ backgroundImage: `url(${TrackBackground})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, filter: 'blur(4px)' }} />
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />

            <TrackSvg className={styles.track} />

            <svg className={styles.trackOverlay} viewBox={BARCELONA_TRACK.viewBox}>
                <path ref={pathRef} d={BARCELONA_TRACK.d} visibility="hidden" />
                {pathReady && drivers.map(d => (
                    <DriverMarker key={d.id} driver={d} x={d.x} y={d.y} />
                ))}
            </svg>
        </>
    );
} 