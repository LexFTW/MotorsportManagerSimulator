import styles from "./RaceMap.module.css";

interface Props {
    driver: {
        id: string;
        code: string;
        color: string;
        teamLogo: string;
        position: number;
    };
    x: number;
    y: number;
    isPitting: boolean;
    isFinished: boolean;
}

export const DriverMarker = ({ driver, x, y, isPitting, isFinished }: Props) => {
    const isOffTrack = isPitting || isFinished;
    const label = isFinished ? 'F' : isPitting ? 'P' : String(driver.position);
    const fill  = isOffTrack ? (isFinished ? '#444' : '#888') : driver.color;
    return (
        <g transform={`translate(${x}, ${y})`} className={isPitting && !isFinished ? styles.pitting : undefined}>
            <circle r={3.2} fill={fill} className={styles.marker} />
            <text x={0} y={0} className={styles.markerPosition} textAnchor="middle" dominantBaseline="central">
                {label}
            </text>
            <image href={driver.teamLogo} x={-11} y={-20} width={8} height={8} />
            <text x={-1} y={-14} className={styles.label} textAnchor="start">
                {driver.code}
            </text>
        </g>
    );
};