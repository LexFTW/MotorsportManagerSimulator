import { useState } from 'react';
import { useAppDispatch } from '@app/store/hooks';
import { setSession } from '@app/store/slices/multiplayerSlice';
import { TEAMS } from '@entities';

function randomId(): string {
    return Math.random().toString(36).slice(2, 8);
}

export function JoinMultiplayerForm() {
    const dispatch = useAppDispatch();
    const [sessionId, setSessionId] = useState('session-1');
    const [userId,    setUserId]    = useState(() => randomId());
    const [teamId,    setTeamId]    = useState(TEAMS[0].id);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!sessionId.trim() || !userId.trim()) return;
        dispatch(setSession({ sessionId: sessionId.trim(), userId: userId.trim(), teamId }));
    }

    return (
        <div style={{
            position: 'fixed', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.85)', zIndex: 9999,
        }}>
            <form
                onSubmit={handleSubmit}
                style={{
                    background: '#1a1a1a', border: '1px solid #333', borderRadius: 8,
                    padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem',
                    minWidth: 320, color: '#fff',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Unirse a sesión multijugador</h2>

                <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontSize: '0.8rem', color: '#aaa' }}>ID de sesión</span>
                    <input
                        value={sessionId}
                        onChange={e => setSessionId(e.target.value)}
                        placeholder="session-1"
                        required
                        style={{ padding: '0.4rem 0.6rem', borderRadius: 4, border: '1px solid #444', background: '#111', color: '#fff' }}
                    />
                </label>

                <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontSize: '0.8rem', color: '#aaa' }}>Tu nombre / ID de usuario</span>
                    <input
                        value={userId}
                        onChange={e => setUserId(e.target.value)}
                        required
                        style={{ padding: '0.4rem 0.6rem', borderRadius: 4, border: '1px solid #444', background: '#111', color: '#fff' }}
                    />
                </label>

                <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontSize: '0.8rem', color: '#aaa' }}>Tu escudería</span>
                    <select
                        value={teamId}
                        onChange={e => setTeamId(e.target.value)}
                        style={{ padding: '0.4rem 0.6rem', borderRadius: 4, border: '1px solid #444', background: '#111', color: '#fff' }}
                    >
                        {TEAMS.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                </label>

                <button
                    type="submit"
                    style={{
                        padding: '0.5rem 1rem', borderRadius: 4, border: 'none',
                        background: '#e10600', color: '#fff', fontWeight: 700, cursor: 'pointer',
                    }}
                >
                    Entrar
                </button>

                <p style={{ margin: 0, fontSize: '0.75rem', color: '#666' }}>
                    Todos los jugadores que usen el mismo ID de sesión entran a la misma carrera.
                </p>
            </form>
        </div>
    );
}
