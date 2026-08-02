import { useEffect, useRef, useState } from "react";
import styles from "./RaceMap.module.css";
import TrackBackground from "@shared/assets/images/circuits/barcelona/track.png";
import TrackSvg2 from "@shared/assets/images/circuits/barcelona/track2.svg?react";
import { raceMapMock, type DriverMock } from "../models/raceMap.mock";
import { BARCELONA_TRACK } from "../models/trackPath";
import { DriverMarker } from "./DriverMarker";

type DriverState = DriverMock & { x: number; y: number };

export const RaceMap = () => {
    const pathRef = useRef<SVGPathElement>(null);
    const totalLengthRef = useRef(0);
    const [drivers, setDrivers] = useState<DriverState[]>(
        raceMapMock.map(d => ({ ...d, x: 0, y: 0 }))
    );
    const [pathReady, setPathReady] = useState(false);

    useEffect(() => {
        if (!pathRef.current) return;
        const path = pathRef.current;
        totalLengthRef.current = path.getTotalLength();
        setDrivers(prev => prev.map(d => {
            const pt = path.getPointAtLength(d.progress * totalLengthRef.current);
            return { ...d, x: pt.x, y: pt.y };
        }));
        setPathReady(true);
    }, []);

    useEffect(() => {
        if (!pathReady) return;
        const path = pathRef.current!;
        const total = totalLengthRef.current;
        const id = setInterval(() => {
            setDrivers(prev => prev.map(d => {
                const newProgress = ((d.progress - 0.0005) + 1) % 1;
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

            <TrackSvg2 className={styles.track} />

            <svg className={styles.trackOverlay} viewBox={BARCELONA_TRACK.viewBox}>
                <path ref={pathRef} d={BARCELONA_TRACK.d} visibility="hidden" />
                {pathReady && drivers.map(d => (
                    <DriverMarker key={d.id} driver={d} x={d.x} y={d.y} />
                ))}
            </svg>
        </>
    );
}