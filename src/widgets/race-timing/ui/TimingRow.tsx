// import ReactCountryFlag from "react-country-flag";

import type { RaceTimingRow } from "../types/RaceTimingRow";

// import styles from "./RaceTiming.module.css";

import softTyreIcon from "@shared/assets/images/tyres/soft.svg";
import mediumTyreIcon from "@shared/assets/images/tyres/medium.svg";
import hardTyreIcon from "@shared/assets/images/tyres/hard.svg";

interface Props {
    driver: RaceTimingRow;
}

export const TimingRow = ({ driver }: Props) => {
    return (
        <tr key={driver.number}>
            <td>{driver.position}</td>
            <td>{driver.code}</td>
            <td>
                {driver.tyre === "Soft" ? (
                    <img src={softTyreIcon} alt="Soft Tyre" width="20" />
                ) : driver.tyre === "Medium" ? (
                    <img src={mediumTyreIcon} alt="Medium Tyre" width="20" />
                ) : (
                    <img src={hardTyreIcon} alt="Hard Tyre" width="20" />
                )}
            </td>
            <td>{driver.pitStops}</td>
            <td>{driver.interval}</td>
        </tr>
    );
};