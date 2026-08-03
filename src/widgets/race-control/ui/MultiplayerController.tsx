import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { setConnectionStatus, setPlayers, setMyStrategy } from '@app/store/slices/multiplayerSlice';
import { useMultiplayerSession } from '@features/multiplayer/useMultiplayerSession';
import { StrategyConfigPanel } from '@features/multiplayer/StrategyConfigPanel';
import { DRIVERS, TyreCompound } from '@entities';
import type { TeamStrategyProfile } from '@features/multiplayer';

// Set VITE_PARTYKIT_HOST in .env.local, e.g. "my-app.username.partykit.dev"
const PARTYKIT_HOST = (import.meta.env.VITE_PARTYKIT_HOST as string | undefined) ?? 'localhost:1999';

export function MultiplayerController() {
    const dispatch   = useAppDispatch();
    const mp         = useAppSelector(state => state.multiplayer);
    const driverStates = useAppSelector(state => state.drivers);

    const { status, players, sendPitStop, updateStrategy, startRace } =
        useMultiplayerSession({
            partyKitHost: PARTYKIT_HOST,
            sessionId:    mp.sessionId!,
            teamId:       mp.myTeamId!,
            strategy:     mp.myStrategy,
        });

    useEffect(() => { dispatch(setConnectionStatus(status)); }, [dispatch, status]);
    useEffect(() => { dispatch(setPlayers(players)); },         [dispatch, players]);

    const handleSaveStrategy = (strategy: TeamStrategyProfile) => {
        dispatch(setMyStrategy(strategy));
        updateStrategy(strategy);
    };

    // Drivers that belong to my team
    const myDrivers = driverStates.filter(d => {
        const entity = DRIVERS.find(dr => dr.id === d.driverId);
        return entity?.team === mp.myTeamId;
    });

    if (status === 'LOBBY' || status === 'DISCONNECTED') {
        return (
            <div className="multiplayer-overlay">
                {status === 'DISCONNECTED' && (
                    <p className="multiplayer-overlay__reconnecting">Reconectando…</p>
                )}

                {/* Other players in the session */}
                {players.length > 0 && (
                    <ul className="multiplayer-overlay__players">
                        {players.map(p => (
                            <li key={p.teamId} className={`mp-player mp-player--${p.status.toLowerCase()}`}>
                                <span className="mp-player__team">{p.teamId}</span>
                                <span className="mp-player__status">{p.status === 'CONNECTED' ? '●' : '○'}</span>
                            </li>
                        ))}
                    </ul>
                )}

                <StrategyConfigPanel
                    initialStrategy={mp.myStrategy}
                    onSave={handleSaveStrategy}
                    isFallback={status === 'DISCONNECTED'}
                />

                {status === 'LOBBY' && (
                    <button className="btn btn-success mt-2 w-100" onClick={startRace}>
                        Iniciar carrera
                    </button>
                )}
            </div>
        );
    }

    if (status === 'RACING') {
        return (
            <div className="pit-controls">
                {myDrivers.map(d => (
                    <div key={d.driverId} className="pit-controls__driver">
                        <span className="pit-controls__id">{d.driverId}</span>
                        <span className="pit-controls__wear">{Math.round(d.tyreWear)}% {d.tyre}</span>
                        <div className="pit-controls__compounds">
                            {Object.values(TyreCompound).map(c => (
                                <button
                                    key={c}
                                    className={`btn btn-sm pit-compound pit-compound--${c.toLowerCase()}`}
                                    onClick={() => sendPitStop(d.driverId, c)}
                                    title={`Box: montar ${c}`}
                                >
                                    {c[0]}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return null;
}
