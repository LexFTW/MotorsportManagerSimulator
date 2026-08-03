import { useEffect, useRef, useState, useCallback } from 'react';
import { useAppDispatch } from '@app/store/hooks';
import { batchUpdateDrivers } from '@app/store/slices/raceDriversSlice';
import { addEvents } from '@app/store/slices/raceEventsSlice';
import { setStatus } from '@app/store/slices/raceSessionSlice';
import { RaceStatus as AppRaceStatus } from '@entities';
import type {
    S2CMessage,
    C2SMessage,
    TeamStrategyProfile,
    FullRaceState,
    PlayerSlot,
} from './index';
import { TyreCompound } from './index';

export type MultiplayerStatus =
    | 'IDLE'
    | 'CONNECTING'
    | 'LOBBY'
    | 'RACING'
    | 'DISCONNECTED'
    | 'FINISHED';

interface UseMultiplayerSessionOptions {
    partyKitHost: string;
    sessionId:    string;
    teamId:       string;
    strategy:     TeamStrategyProfile;
}

interface UseMultiplayerSessionReturn {
    status:         MultiplayerStatus;
    yourTeam:       string | null;
    players:        PlayerSlot[];
    connected:      boolean;
    sendPitStop:    (driverId: string, compound: TyreCompound) => void;
    updateStrategy: (strategy: TeamStrategyProfile) => void;
    startRace:      () => void;
    disconnect:     () => void;
}

const RECONNECT_DELAY_MS  = 3000;

export function useMultiplayerSession({
    partyKitHost,
    sessionId,
    teamId,
    strategy,
}: UseMultiplayerSessionOptions): UseMultiplayerSessionReturn {
    const dispatch   = useAppDispatch();
    const wsRef      = useRef<WebSocket | null>(null);
    const stratRef   = useRef(strategy);
    const mountedRef = useRef(true);

    const [mpStatus, setMpStatus] = useState<MultiplayerStatus>('IDLE');
    const [yourTeam, setYourTeam] = useState<string | null>(null);
    const [players,  setPlayers]  = useState<PlayerSlot[]>([]);

    // Keep strategy ref in sync for reconnect
    useEffect(() => { stratRef.current = strategy; });

    const send = useCallback((msg: C2SMessage) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(msg));
        }
    }, []);

    const applyFullState = useCallback((state: FullRaceState) => {
        // Sync driver state into Redux
        dispatch(batchUpdateDrivers(
            state.drivers.map(d => ({
                driverId:      d.driverId,
                position:      d.position,
                progress:      d.progress,
                lapsCompleted: d.lapsCompleted,
                sector:        d.sector,
                gap:           d.gap,
                tyreWear:      d.tyreWear,
                tyreAge:       d.tyreAge,
            }))
        ));
        if (state.events.length > 0) dispatch(addEvents(state.events));
        setPlayers(state.players);
    }, [dispatch]);

    const handleMessage = useCallback((msg: S2CMessage) => {
        switch (msg.type) {
            case 'SESSION_JOINED':
                setYourTeam(msg.yourTeam);
                setMpStatus('LOBBY');
                applyFullState(msg.state);
                break;

            case 'FULL_STATE':
                applyFullState(msg.state);
                break;

            case 'DELTA':
                dispatch(batchUpdateDrivers(
                    msg.drivers.map(d => ({
                        driverId:      d.driverId,
                        position:      d.position,
                        progress:      d.progress,
                        lapsCompleted: d.lapsCompleted,
                        sector:        d.sector,
                        gap:           d.gap,
                        tyreWear:      d.tyreWear,
                        tyreAge:       d.tyreAge,
                    }))
                ));
                if (msg.events?.length) dispatch(addEvents(msg.events));
                break;

            case 'PLAYER_CONNECTED':
            case 'PLAYER_DISCONNECTED':
            case 'PLAYER_RECONNECTED':
                // Trigger a full state refresh to get updated player list
                send({ type: 'PING' });
                break;

            case 'PIT_EXECUTED':
                dispatch(addEvents([{
                    lap:         0,
                    type:        'PIT_STOP' as const,
                    driverId:    msg.driverId,
                    description: `${msg.driverId} entró a boxes — ${msg.compound}`,
                }]));
                break;

            case 'RACE_FINISHED':
                dispatch(setStatus(AppRaceStatus.FINISHED));
                setMpStatus('FINISHED');
                break;

            case 'ERROR':
                console.error('[Multiplayer]', msg.message);
                break;

            case 'PONG':
                // latency check, no-op
                break;
        }
    }, [dispatch, applyFullState, send]);

    const connect = useCallback(() => {
        if (!mountedRef.current) return;
        setMpStatus('CONNECTING');

        const url = `wss://${partyKitHost}/parties/main/${sessionId}`;
        const ws  = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
            if (!mountedRef.current) { ws.close(); return; }
            send({ type: 'JOIN', sessionId, teamId, strategy: stratRef.current });
        };

        ws.onmessage = (e: MessageEvent<string>) => {
            try {
                handleMessage(JSON.parse(e.data) as S2CMessage);
            } catch {
                console.warn('[Multiplayer] Unparseable message', e.data);
            }
        };

        ws.onclose = () => {
            if (!mountedRef.current) return;
            setMpStatus('DISCONNECTED');
            // Auto-reconnect after delay
            setTimeout(connect, RECONNECT_DELAY_MS);
        };

        ws.onerror = () => {
            ws.close();
        };
    }, [partyKitHost, sessionId, teamId, send, handleMessage]);

    useEffect(() => {
        mountedRef.current = true;
        connect();
        return () => {
            mountedRef.current = false;
            wsRef.current?.close();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const sendPitStop = useCallback((driverId: string, compound: TyreCompound) => {
        send({ type: 'PIT_STOP', driverId, compound });
    }, [send]);

    const updateStrategy = useCallback((newStrategy: TeamStrategyProfile) => {
        stratRef.current = newStrategy;
        send({ type: 'SET_STRATEGY', strategy: newStrategy });
    }, [send]);

    const startRace = useCallback(() => {
        send({ type: 'START_RACE' });
        setMpStatus('RACING');
    }, [send]);

    const disconnect = useCallback(() => {
        mountedRef.current = false;
        wsRef.current?.close();
        setMpStatus('DISCONNECTED');
    }, []);

    return {
        status:    mpStatus,
        yourTeam,
        players,
        connected: mpStatus !== 'IDLE' && mpStatus !== 'DISCONNECTED' && mpStatus !== 'CONNECTING',
        sendPitStop,
        updateStrategy,
        startRace,
        disconnect,
    };
}
