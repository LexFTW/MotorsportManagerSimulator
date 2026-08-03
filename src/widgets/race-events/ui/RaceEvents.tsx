import { useAppSelector } from '@app/store/hooks';
import { RaceEventType } from '@entities';

const EVENT_LABELS: Record<string, string> = {
    [RaceEventType.OVERTAKE]:            '⚔️ Adelantamiento',
    [RaceEventType.PIT_STOP]:            '🔧 Pit stop',
    [RaceEventType.PIT_EXIT]:            '🟢 Sale de boxes',
    [RaceEventType.CRASH]:               '💥 Accidente',
    [RaceEventType.MECHANICAL_FAILURE]:  '⚙️ Fallo mecánico',
    [RaceEventType.PENALTY]:             '🟥 Penalización',
};

const MAX_VISIBLE = 6;

export const RaceEvents = () => {
    const events = useAppSelector(state => state.events);
    const recent = [...events].reverse().slice(0, MAX_VISIBLE);

    return (
        <div className="card" style={{ marginTop: '1rem', background: 'var(--color-panel)' }}>
            <div className="card-header" style={{ background: 'var(--color-panel)', color: 'var(--color-text)', marginTop: '0.5rem' }}>
                <h5 className="card-title" style={{ color: 'var(--color-text)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                    Eventos
                </h5>
            </div>
            <div className="card-body" style={{ padding: '0.5rem 1rem' }}>
                {recent.length === 0 ? (
                    <span style={{ color: 'var(--color-text)', opacity: 0.5, fontSize: '0.85rem' }}>
                        Sin eventos todavía.
                    </span>
                ) : (
                    recent.map((evt, i) => (
                        <div key={i} style={{ display: 'flex', gap: '0.5rem', padding: '0.3rem 0', borderBottom: '1px solid rgba(255,255,255,0.08)', alignItems: 'center' }}>
                            <span style={{ color: 'var(--color-text)', opacity: 0.5, fontSize: '0.75rem', minWidth: '3rem' }}>
                                V{evt.lap}
                            </span>
                            <span style={{ color: 'var(--color-text)', fontSize: '0.85rem' }}>
                                {EVENT_LABELS[evt.type] ?? evt.type} — {evt.description}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};