declare module 'svg-path-properties' {
    interface Point {
        x: number;
        y: number;
    }

    class svgPathProperties {
        constructor(svgPath: string);
        getTotalLength(): number;
        getPointAtLength(length: number): Point;
        getTangentAtLength(length: number): Point;
    }

    export { svgPathProperties };
}
