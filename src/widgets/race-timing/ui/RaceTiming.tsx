import { Card, CardBody, Tyres } from "@/shared/ui/components";
import { raceTimingMock } from "../models/raceTiming.mock";
// import { TimingRow } from "./TimingRow";

import styles from "./RaceTiming.module.css";
import { hexToRgba } from "@/shared/lib";

export const RaceTiming = () => {
    return (
        <Card>
            <CardBody>
                <table className="table bg-transparent">
                    <thead>
                        <tr>
                            <th className="bg-transparent" style={{ color: 'var(--color-text)'}}>POS</th>
                            <th className="bg-transparent" style={{ color: 'var(--color-text)' }}>PILOTO</th>
                            <th className="bg-transparent" style={{ color: 'var(--color-text)' }}>NEU</th>
                            <th className="bg-transparent text-center" style={{ color: 'var(--color-text)' }}>PARADAS</th>
                            <th className="bg-transparent" style={{ color: 'var(--color-text)' }}>DIF</th>
                        </tr>
                    </thead>
                    <tbody>
                        {raceTimingMock.map(driver => (
                            <tr>
                                <td className="border-0 bg-transparent" style={{ color: 'var(--color-text)'}}>{driver.position}</td>
                                <td className="border-0 bg-transparent" style={{ color: 'var(--color-text)'}}>
                                    <img className={styles.imgLogo} style={{ background: hexToRgba(driver.team.color, 0.2), padding: '5px', marginRight: '5px' }} src={driver.team.logo} alt={driver.team.name} />
                                    {driver.code}
                                </td>
                                <td className="border-0 bg-transparent" style={{ color: 'var(--color-text)'}}>
                                    <Tyres tyreType={driver.tyre} />
                                </td>
                                <td className="text-center border-0 bg-transparent" style={{ color: 'var(--color-text)'}}>{driver.pitStops}</td>
                                <td className="border-0 bg-transparent" style={{ color: 'var(--color-text)'}}>{driver.interval}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardBody>
        </Card>
    );
}