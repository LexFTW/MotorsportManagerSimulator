import { useEffect, type RefObject } from 'react';
import { useAppSelector } from '@app/store/hooks';
import { selectMapDrivers } from '@app/store/selectors/raceMapSelectors';
import type { ScreenPosition } from './useRaceEngine';

/**
 * Multiplayer counterpart of useRaceEngine's position computation.
 * Reads progress from Redux (fed by the server) and converts to SVG screen coordinates.
 * Only active when pathReady is true.
 */
export function useScreenPositions(
    pathRef:          RefObject<SVGPathElement | null>,
    totalLengthRef:   RefObject<number>,
    pathReady:        boolean,
    onPositionsUpdate: (positions: ScreenPosition[]) => void,
): void {
    const mapDrivers = useAppSelector(selectMapDrivers);
    const driverStates = useAppSelector(state => state.drivers);

    // Runs after every render triggered by Redux updates — intentional
    useEffect(() => {
        if (!pathReady) return;
        const path  = pathRef.current!;
        const total = totalLengthRef.current!;

        const positionMap = new Map(driverStates.map(d => [d.driverId, d.position]));

        const positions: ScreenPosition[] = mapDrivers.map(d => {
            const pt = path.getPointAtLength(d.progress * total);
            return {
                id:       d.id,
                code:     d.code,
                color:    d.color,
                teamLogo: d.teamLogo,
                position: positionMap.get(d.id) ?? 0,
                x:        pt.x,
                y:        pt.y,
            };
        });

        onPositionsUpdate(positions);
    });
}
