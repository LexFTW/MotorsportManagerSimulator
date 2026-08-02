import styles from "./RaceMap.module.css";
import TrackBackground from "@shared/assets/images/circuits/barcelona/track.png";
import TrackSvg from "@shared/assets/images/circuits/barcelona/track.svg?react";

import { raceMapMock } from "../models/raceMap.mock";
import { DriverMarker } from "./DriverMarker";
export const RaceMap = () => {

    return (
        <>
            <div style={{ backgroundImage: `url(${TrackBackground})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, filter: 'blur(4px)' }}></div>
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}></div>
        
            <TrackSvg style={{ filter: 'drop-shadow(10px 10px 6px #222)', position: 'fixed', top: '-294px', left: '-186px', width: '121%', height: '170%', zIndex: 2, pointerEvents: 'none', transform: 'rotate(50deg)' }} />
            <svg className={styles.overlay}>
                {raceMapMock.map(driver => (
                    <DriverMarker
                        key={driver.id}
                        driver={driver}
                    />
                ))}
            </svg>
        </>
    );
}