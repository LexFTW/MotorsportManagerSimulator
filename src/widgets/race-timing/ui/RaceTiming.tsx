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
                <div className="table-responsive" style={{ maxHeight: 'calc(100vh - 385px)', overflowY: 'auto' }}>
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
                            {rows.map((row, index) => (
                                <tr key={row.code} className={styles.row}>
                                    <td className="bg-transparent" style={{ color: 'var(--color-text)' }}>{index + 1}</td>
                                    <td className="bg-transparent" style={{ color: 'var(--color-text)' }}>{row.code}</td>
                                    <td className="bg-transparent" style={{ color: 'var(--color-text)' }}>
                                        <Tyres type={row.tyre} size="small" />
                                    </td>
                                    <td className="bg-transparent text-center" style={{ color: 'var(--color-text)' }}>{row.pitStops}</td>
                                    <td className="bg-transparent" style={{ color: 'var(--color-text)' }}>{row.interval}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardBody>
        </Card>
    );
}