export interface TrackSvgData {
    d: string;
    viewBox: string;
}

// Picks the path with the longest `d` — most likely the track outline
export function parseTrackSvg(svgRaw: string): TrackSvgData {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgRaw, 'image/svg+xml');

    const viewBox = doc.querySelector('svg')?.getAttribute('viewBox') ?? '0 0 800 600';

    const paths = Array.from(doc.querySelectorAll('path'));
    const d = paths.reduce((longest, p) => {
        const attr = p.getAttribute('d') ?? '';
        return attr.length > longest.length ? attr : longest;
    }, '');

    return { d, viewBox };
}
