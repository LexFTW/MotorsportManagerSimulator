import barcelonaBackground from '@shared/assets/images/circuits/barcelona/track.png';
import barcelonaSvgRaw from '@shared/assets/images/circuits/barcelona/track.svg?raw';
import BarcelonaSvg from '@shared/assets/images/circuits/barcelona/track.svg?react';

import spaBackground from '@shared/assets/images/circuits/spa-francorchamps/track.jpg';
import spaSvgRaw from '@shared/assets/images/circuits/spa-francorchamps/track.svg?raw';
import SpaSvg from '@shared/assets/images/circuits/spa-francorchamps/track.svg?react';

import monzaBackground from '@shared/assets/images/circuits/monza/track.jpg';
import monzaSvgRaw from '@shared/assets/images/circuits/monza/track.svg?raw';
import MonzaSvg from '@shared/assets/images/circuits/monza/track.svg?react';

import bahrainBackground from '@shared/assets/images/circuits/bahrain/track.jpg';
import bahrainSvgRaw from '@shared/assets/images/circuits/bahrain/track.svg?raw';
import BahrainSvg from '@shared/assets/images/circuits/bahrain/track.svg?react';

import { parseTrackSvg } from '@shared/lib';
import { TrackType, TrackDownforceLevel, TrackOvertakingDifficulty, type Circuit } from './types.ts';

export const CIRCUITS: Record<string, Circuit> = {
    barcelona: {
        id: 'barcelona',
        name: 'Circuit de Barcelona-Catalunya',
        location: 'Montmeló',
        country: 'Spain',
        countryCode: 'ES',
        trackBackground: barcelonaBackground,
        trackSvg: BarcelonaSvg,
        trackPath: parseTrackSvg(barcelonaSvgRaw),
        totalLaps: 66,
        lapDistanceKm: 4.655,
        type: TrackType.Permanent,
        downforceLevel: TrackDownforceLevel.Medium,
        tyreDegradation: 0.72,
        pitLaneTimeSecs: 20,
        overtakingDifficulty: TrackOvertakingDifficulty.Hard,
        startFinishProgress: 1.7,
        sectors: [
            { id: 1, name: 'Sector 1', distanceKm: 1.48 },
            { id: 2, name: 'Sector 2', distanceKm: 1.78 },
            { id: 3, name: 'Sector 3', distanceKm: 1.36 },
        ],
        styles: {
            mobile: {
                top: 'calc(50vh - 28.13vw)',
                left: '0px',
                width: '100%',
                height: '56.27vw',
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
    'spa-francorchamps': {
        id: 'spa-francorchamps',
        name: 'Circuit de Spa-Francorchamps',
        location: 'Stavelot',
        country: 'Belgium',
        countryCode: 'BE',
        trackBackground: spaBackground,
        trackSvg: SpaSvg,
        trackPath: parseTrackSvg(spaSvgRaw),
        totalLaps: 44,
        lapDistanceKm: 7.004,
        type: TrackType.Permanent,
        downforceLevel: TrackDownforceLevel.High,
        tyreDegradation: 0.85,
        pitLaneTimeSecs: 21,
        overtakingDifficulty: TrackOvertakingDifficulty.Hard,
        startFinishProgress: 2.1,
        sectors: [
            { id: 1, name: 'Sector 1', distanceKm: 1.48 },
            { id: 2, name: 'Sector 2', distanceKm: 1.78 },
            { id: 3, name: 'Sector 3', distanceKm: 1.36 },
        ],
        styles: {
            mobile: {
                top: 'calc(50vh - 28.13vw)',
                left: '0px',
                width: '100%',
                height: '56.27vw',
            },
            tablet: {
                top: '-180px',
                left: '20px',
                width: '96%',
                height: '145%',
            },
            desktop: {
                top: '-354px',
                left: '126px',
                width: '88%',
                height: '165%',
                transform: 'rotate(3deg)',
            },
            landscape: {
                top: '-60px',
                left: '30px',
                width: '88%',
                height: '150%',
            },
        },
    },
    "monza": {
        id: 'monza',
        name: 'Autodromo Nazionale Monza',
        location: 'Monza',
        country: 'Italy',
        countryCode: 'IT',
        trackBackground: monzaBackground,
        trackSvg: MonzaSvg,
        trackPath: parseTrackSvg(monzaSvgRaw),
        totalLaps: 53,
        lapDistanceKm: 5.793,
        type: TrackType.Permanent,
        downforceLevel: TrackDownforceLevel.Low,
        tyreDegradation: 0.65,
        pitLaneTimeSecs: 19,
        overtakingDifficulty: TrackOvertakingDifficulty.Medium,
        startFinishProgress: 1.5,
        sectors: [
            { id: 1, name: 'Sector 1', distanceKm: 1.48 },
            { id: 2, name: 'Sector 2', distanceKm: 1.78 },
            { id: 3, name: 'Sector 3', distanceKm: 1.36 },
        ],
        styles: {
            mobile: {
                top: 'calc(50vh - 28.13vw)',
                left: '0px',
                width: '100%',
                height: '56.27vw',
            },
            tablet: {
                top: '-180px',
                left: '20px',
                width: '96%',
                height: '145%',
            },
            desktop: {
                top: '-325px',
                left: '60px',
                width: '87%',
                height: '164%',
            },
            landscape: {
                top: '-100px',
                left: '30px',
                width: '88%',
                height: '150%',
            }
        },
    },
    "bahrain": {
        id: 'bahrain',
        name: 'Bahrain International Circuit',
        location: 'Sakhir',
        country: 'Bahrain',
        countryCode: 'BH',
        trackBackground: bahrainBackground,
        trackPath: parseTrackSvg(bahrainSvgRaw),
        trackSvg: BahrainSvg,
        totalLaps: 57,
        lapDistanceKm: 5.412,
        type: TrackType.Permanent,
        downforceLevel: TrackDownforceLevel.Medium,
        tyreDegradation: 0.75,
        pitLaneTimeSecs: 22,
        overtakingDifficulty: TrackOvertakingDifficulty.Medium,
        startFinishProgress: 1.5,
        sectors: [
            { id: 1, name: 'Sector 1', distanceKm: 1.48 },
            { id: 2, name: 'Sector 2', distanceKm: 1.78 },
            { id: 3, name: 'Sector 3', distanceKm: 1.36 },
        ],
        styles: {
            mobile: {
                top: 'calc(50vh - 28.13vw)',
                left: '0px',
                width: '100%',
                height: '56.27vw',
            },
            tablet: {
                top: '-180px',
                left: '20px',
                width: '96%',
                height: '145%',
            },
            desktop: {
                top: '-299px',
                left: '148px',
                width: '83%',
                height: '156%',
            },
            landscape: {
                top: '-100px',
                left: '30px',
                width: '88%',
                height: '150%',
            }
        },
    },
};
