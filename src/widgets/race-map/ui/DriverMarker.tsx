import styles from "./RaceMap.module.css";

interface Props {

    driver: {
        id: number;
        x: number;
        y: number;
        color: string;
        code: string;
        id: number;
    }

}

export const DriverMarker = ({ driver }: Props) => {

    return (
        <>
            <circle
                cx={driver.x}
                cy={driver.y}
                r={8}
                fill={driver.color}
                className={styles.marker}
            />

            
            <text
                x={driver.x}
                y={driver.y - 20}
                className={styles.label}
                style={{ background: driver.color }}
            >
                {driver.id} | {driver.code}
            </text>
        </>
    );

};