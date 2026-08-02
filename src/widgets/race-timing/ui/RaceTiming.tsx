import { Card, CardBody, Tyres } from "@/shared/ui/components";
import { useAppSelector } from "@app/store/hooks";
import { selectTimingRows } from "@app/store/selectors/timingSelectors";

import styles from "./RaceTiming.module.css";
import { hexToRgba } from "@/shared/lib";

export const RaceTiming = () => {
    const rows = useAppSelector(selectTimingRows);

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
                        {rows.map(row => (
                            <tr key={row.code}>
                                <td className="border-0 bg-transparent" style={{ color: 'var(--color-text)'}}>{row.position}</td>
                                <td className="border-0 bg-transparent" style={{ color: 'var(--color-text)'}}>
                                    <img className={styles.imgLogo} style={{ background: hexToRgba(row.team.color, 0.2), padding: '5px', marginRight: '5px' }} src={row.team.logo} alt={row.team.name} />
                                    {row.code}
                                </td>
                                <td className="border-0 bg-transparent" style={{ color: 'var(--color-text)'}}>
                                    <Tyres tyreType={row.tyre} />
                                </td>
                                <td className="text-center border-0 bg-transparent" style={{ color: 'var(--color-text)'}}>{row.pitStops}</td>
                                <td className="border-0 bg-transparent" style={{ color: 'var(--color-text)'}}>{row.interval}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardBody>
        </Card>
    );
}