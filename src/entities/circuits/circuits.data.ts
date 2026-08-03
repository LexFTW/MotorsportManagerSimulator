import barcelonaSvgRaw from '@shared/assets/images/circuits/barcelona/track.svg?raw';
import { parseTrackSvg } from '@shared/lib';
import { TrackType, TrackDownforceLevel, TrackOvertakingDifficulty, type Circuit } from './types.ts';

export const CIRCUITS: Record<string, Circuit> = {
    barcelona: {
        id: 'barcelona',
        name: 'Circuit de Barcelona-Catalunya',
        location: 'Montmeló',
        country: 'Spain',
        trackPath: parseTrackSvg(barcelonaSvgRaw),
        totalLaps: 66,
        lapDistanceKm: 4.655,
        type: TrackType.Permanent,
        downforceLevel: TrackDownforceLevel.Medium,
        tyreDegradation: 0.72,
        overtakingDifficulty: TrackOvertakingDifficulty.Hard,
        startFinishProgress: 1.7,
        sectors: [
            { id: 1, name: 'Sector 1', distanceKm: 1.48 },
            { id: 2, name: 'Sector 2', distanceKm: 1.78 },
            { id: 3, name: 'Sector 3', distanceKm: 1.36 },
        ],
        styles: {
            mobile: {
                top: '-80px',
                left: '0px',
                width: '100%',
                height: '110%',
            },
            tablet: {
                top: '-180px',
                left: '20px',
                width: '96%',
                height: '145%',
            },
            desktop: {
                top: '-283px',
                left: '55px',
                width: '92%',
                height: '170%',
            },
            landscape: {
                top: '-60px',
                left: '30px',
                width: '88%',
                height: '150%',
            },
        },
    },
};
