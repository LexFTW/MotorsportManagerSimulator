import { useState } from "react";
import { Card, CardBody, Tyres } from "@/shared/ui/components";
import { useAppSelector } from "@app/store/hooks";
import { selectTimingRows } from "@app/store/selectors/timingSelectors";

import styles from "./RaceTiming.module.css";

export const RaceTiming = () => {
    const rows = useAppSelector(selectTimingRows);
    const [showIntervalToAhead, setShowIntervalToAhead] = useState(false);

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
                                <th className="bg-transparent" style={{ color: 'var(--color-text)' }}>ÚLTIMA</th>
                                <th className="bg-transparent" style={{ color: 'var(--color-text)' }}>MEJOR</th>
                                <th
                                    className="bg-transparent"
                                    onClick={() => setShowIntervalToAhead(v => !v)}
                                    style={{ color: 'var(--color-text)', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                                    title={showIntervalToAhead ? 'Intervalo al coche de delante — pulsa para ver gap al líder' : 'Gap al líder — pulsa para ver intervalo al coche de delante'}
                                >
                                    {showIntervalToAhead ? 'INT' : 'DIF'}
                                </th>
                                <th className="bg-transparent text-center" style={{ color: '#00d4ff' }}>DRS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, index) => (
                                <tr key={row.code} className={styles.row}>
                                    <td className="bg-transparent" style={{ color: 'var(--color-text)' }}>{index + 1}</td>
                                    <td className="bg-transparent" style={{ color: 'var(--color-text)' }}>{row.code}</td>
                                    <td className="bg-transparent" style={{ color: 'var(--color-text)' }}>
                                        <Tyres tyreType={row.tyre} tyreWear={row.tyreWear} />
                                    </td>
                                    <td className="bg-transparent text-center" style={{ color: 'var(--color-text)' }}>{row.pitStops}</td>
                                    <td className="bg-transparent" style={{ color: 'var(--color-text)' }}>{row.lastLap}</td>
                                    <td className="bg-transparent" style={{ color: 'var(--color-text)' }}>{row.bestLap}</td>
                                    <td className="bg-transparent" style={{ color: 'var(--color-text)' }}>
                                        {showIntervalToAhead ? row.intervalToAhead : row.interval}
                                    </td>
                                    <td className="bg-transparent text-center">
                                        {row.drsActive && (
                                            <span style={{ color: '#00d4ff', fontWeight: 'bold', fontSize: '0.7rem', letterSpacing: '0.05em' }}>DRS</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardBody>
        </Card>
    );
}