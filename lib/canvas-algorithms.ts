import LoopingEngine from "./looping";
import { QuadAnimationEngine, QuadAnimationEngineV1 } from "./canvas-algos-animation";

export function computeHistogram(data: Uint8ClampedArray, x: any, y: any, w: any, h: any) {
    // const { data } = imageContext.getImageData(x, y, w, h);
    const histogram = new Uint32Array(1024);
    for (let i = 0, n = data.length; i < n; i += 4) {
        ++histogram[0 * 256 + data[i + 0]];
        ++histogram[1 * 256 + data[i + 1]];
        ++histogram[2 * 256 + data[i + 2]];
        ++histogram[3 * 256 + data[i + 3]];
    }
    return histogram;
}

export function weightedAverage(histogram: Uint32Array) {
    let total = 0;
    let value = 0;
    for (let i = 0; i < 256; ++i) total += histogram[i], value += histogram[i] * i;
    value /= total;
    let error = 0;
    for (let i = 0; i < 256; ++i) error += (value - i) ** 2 * histogram[i];
    return [value, Math.sqrt(error / total)];
}

export function colorFromHistogram(histogram: Uint32Array) {
    const [r, re] = weightedAverage(histogram.subarray(0, 256));
    const [g, ge] = weightedAverage(histogram.subarray(256, 512));
    const [b, be] = weightedAverage(histogram.subarray(512, 768));
    return [
        Math.round(r),
        Math.round(g),
        Math.round(b),
        re * 0.2989 + ge * 0.5870 + be * 0.1140
    ];
}

export class Quad {
    static area_power = 0.25;

    color: string;
    score: number;

    forceQuadSplit: boolean = false;

    constructor(private ctx: CanvasRenderingContext2D, public x: number, public y: number, public w: number, public h: number) {
        const [r, g, b, error] = colorFromHistogram(computeHistogram(ctx.getImageData(x, y, w, h).data, x, y, w, h));
        this.color = `#${(0x1000000 + (r << 16) + (g << 8) + b).toString(16).substring(1)}`;
        this.score = error * Math.pow(w * h, Quad.area_power);
    }

    getColor(): string {
        return this.color;
    }

    getScore(): number {
        return this.score;
    }

    split(): Quad[] {
        const splitTo2 = () => {
            const dx = this.w / 2, x1 = this.x, x2 = this.x + dx;
            const dy = this.h / 2, y1 = this.y, y2 = this.y + dy;

            if (dx < 1 || dy < 1) {
                return [];
            }

            return [
                new Quad(this.ctx, x1, y1, dx, dy),
                new Quad(this.ctx, x2, y1, dx, dy),
                new Quad(this.ctx, x1, y2, dx, dy),
                new Quad(this.ctx, x2, y2, dx, dy)
            ];
        }

        // x -- w -- numH
        // y -- h -- numV
        const splitToMulti = (numV: number, numH: number) => {
            const res = [];

            if (this.w / numH < 1 || this.h / numV < 1) {
                return res;
            }

            for (let i = 0; i < numH; i++) {
                for (let j = 0; j < numV; j++) {
                    const x = this.x + this.w / numH * i;
                    const y = this.y + this.h / numV * j;
                    res.push(new Quad(this.ctx, x, y, this.w / numH, this.h / numV));
                }
            }

            return res;
        }

        if (this.forceQuadSplit) {
            return splitTo2();
        } else {
            const ratio = this.w / this.h;
            let numV: number, numH: number;

            if (2/3 <= ratio && ratio <= 3/2) {
                return splitTo2();
            } else if (ratio < 2/3) {
                numH = 2;
                numV = Math.floor(numH / ratio);
            } else {
                numV = 2;
                numH = Math.floor(numV * ratio);
            }

            return splitToMulti(numV, numH);
        }
    }

    interpolate(b: Quad) {
        return (t: number) => {
            const u = 1 - t;
            return new Quad(this.ctx,
                u * this.x + t * b.x,
                u * this.y + t * b.y,
                u * this.w + t * b.w,
                u * this.h + t * b.h
            );
        };
    }

    isInside(x: number, y: number, expandMouse=15): boolean {
        return this.x - expandMouse <= x && x <= this.x + this.w + expandMouse && this.y - expandMouse <= y && y <= this.y + this.h + expandMouse;
    }
}

export enum AnimationStateEnum {
    BEFORE = 0,
    APPEARING = 1,
    STAYING = 2,
    DISAPPEARED = 3,
    SHOWINGIMAGE = 4,
    GONE = 5,
}

export class AnimationState<T> {
    public state: number = AnimationStateEnum.BEFORE;

    public startTimestamp: number;
    public endTimestamp: number;

    public parent: AnimationState<T>;

    constructor(public t: T) {
    }

    getProgress(timestamp?: number) {
        if (!timestamp) {
            timestamp = Date.now();
        }
        return (timestamp - this.startTimestamp) / (this.endTimestamp - this.startTimestamp);
    }
}

export class QuadLoopingEngine {

    loopingEngine: LoopingEngine;
    animationEngine: QuadAnimationEngine;

    quads: AnimationState<Quad>[];

    constructor(public canvas: HTMLCanvasElement, animationEngine: QuadAnimationEngine, quads?: AnimationState<Quad>[]) {
        this.quads = quads = quads ? quads : [];

        this.animationEngine = animationEngine; 
        this.loopingEngine = new LoopingEngine((_timestamp: number) => {
            this.animationEngine.draw(this.quads);
        });
    }

    setQuads(quads: AnimationState<Quad>[]) {
        this.quads = quads;
    }

    start() {
        this.loopingEngine.start();
    }

    terminate() {
        this.loopingEngine.terminate();
    }
}