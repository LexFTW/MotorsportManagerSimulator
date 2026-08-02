import barcelonaSvgRaw from '@shared/assets/images/circuits/barcelona/track.svg?raw';
import spaFrancorchampsSvgRaw from '@shared/assets/images/circuits/spa-francorchamps/track.svg?raw';
import { parseTrackSvg } from '@shared/lib';

export const BARCELONA_TRACK = parseTrackSvg(barcelonaSvgRaw);
export const SPA_FRANCORCHAMPS_TRACK = parseTrackSvg(spaFrancorchampsSvgRaw);