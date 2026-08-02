const SPEED_SAMPLES = 1200;
const MIN_SPEED = 0.30; // fraction of base step used at the sharpest corner

/** Precomputes a speed multiplier (0–1) for each sampled position along the path.
 *  High curvature → low multiplier; includes a look-ahead so braking starts before the apex. */
export function buildSpeedMap(path: SVGPathElement): Float32Array {
    const total = path.getTotalLength();
    const delta = total * 0.02; // tangent sampling distance (~2 % of lap)
    const rawCurvature = new Float32Array(SPEED_SAMPLES);

    for (let i = 0; i < SPEED_SAMPLES; i++) {
        const t = (i / SPEED_SAMPLES) * total;
        const A = path.getPointAtLength(((t - delta) + total) % total);
        const B = path.getPointAtLength((t + delta) % total);
        const C = path.getPointAtLength((t + delta * 2) % total);
        const D = path.getPointAtLength((t + delta * 3) % total);

        const dx1 = B.x - A.x, dy1 = B.y - A.y;
        const dx2 = D.x - C.x, dy2 = D.y - C.y;
        const len1 = Math.hypot(dx1, dy1);
        const len2 = Math.hypot(dx2, dy2);

        if (len1 < 1e-4 || len2 < 1e-4) continue;

        const cos = Math.max(-1, Math.min(1, (dx1 * dx2 + dy1 * dy2) / (len1 * len2)));
        rawCurvature[i] = Math.acos(cos);
    }

    // Smooth with a running average (~4 % window) to avoid abrupt speed jumps
    const smoothed = new Float32Array(SPEED_SAMPLES);
    const half = Math.floor(SPEED_SAMPLES * 0.04);
    for (let i = 0; i < SPEED_SAMPLES; i++) {
        let sum = 0;
        for (let j = -half; j <= half; j++) sum += rawCurvature[(i + j + SPEED_SAMPLES) % SPEED_SAMPLES];
        smoothed[i] = sum / (2 * half + 1);
    }

    let maxCurv = 0;
    for (let i = 0; i < SPEED_SAMPLES; i++) maxCurv = Math.max(maxCurv, smoothed[i]);

    // Look-ahead in direction of travel (decreasing progress) so braking starts before the apex
    const lookahead = Math.floor(SPEED_SAMPLES * 0.03);
    const speeds = new Float32Array(SPEED_SAMPLES);

    for (let i = 0; i < SPEED_SAMPLES; i++) {
        let maxAhead = 0;
        for (let j = 0; j <= lookahead; j++) {
            maxAhead = Math.max(maxAhead, smoothed[(i - j + SPEED_SAMPLES) % SPEED_SAMPLES]);
        }
        const norm = maxCurv > 0 ? maxAhead / maxCurv : 0;
        speeds[i] = MIN_SPEED + (1 - MIN_SPEED) * (1 - norm);
    }

    return speeds;
}

export { SPEED_SAMPLES };
