import { raceTimingMock } from "../models/raceTiming.mock";
import { TimingRow } from "./TimingRow";

import styles from "./RaceTiming.module.css";

export const RaceTiming = () => {
    return (
        <>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>POS</th>
                        <th>PILOTO</th>
                        <th>NEU</th>
                        <th>PARADAS</th>
                        <th>DIF</th>
                    </tr>
                </thead>
                <tbody>
                    {raceTimingMock.map(driver => (
                        <TimingRow driver={driver} />
                    ))}
                </tbody>
            </table>
        </>
    );
};