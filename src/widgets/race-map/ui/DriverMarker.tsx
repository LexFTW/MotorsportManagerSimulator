import styles from "./RaceMap.module.css";

interface Props {
    driver: {
        id: string;
        code: string;
        color: string;
        teamLogo: string;
    };
    x: number;
    y: number;
}

export const DriverMarker = ({ driver, x, y }: Props) => {
    return (
        <g transform={`translate(${x}, ${y})`}>
            <circle r={3.2} fill={driver.color} className={styles.marker} />
            <image href={driver.teamLogo} x={-11} y={-20} width={8} height={8} />
            <text x={-1} y={-14} className={styles.label} textAnchor="start">
                {driver.code}
            </text>
        </g>
    );
};