import * as d3 from "d3";

import { AnimationState, Quad, AnimationStateEnum } from "./canvas-algorithms";

export abstract class QuadAnimationEngine {
    context: CanvasRenderingContext2D;

    constructor(public canvas: HTMLCanvasElement, private imageCanvas: HTMLCanvasElement, private minDotSize=10) {
        this.context = this.canvas.getContext('2d');
    }

    drawQuad = (s: Quad) => {
        let r = Math.min(s.w / 2, s.h / 2);

        this.context.fillStyle = s.color;
        this.context.beginPath()
        this.context.moveTo(s.x + s.w, s.y + s.h / 2);
        this.context.arc(s.x + s.w / 2, s.y + s.h / 2, r, 0, 2 * Math.PI);
        this.context.fill();
    }

    drawBackground = (s: Quad, color = 'white') => {
        this.context.fillStyle = color;
        this.context.beginPath();
        if (s.w < this.minDotSize || s.h < this.minDotSize) {
            this.context.rect(s.x, s.y, s.w, s.h);
        } else {
            this.context.rect(s.x - 1, s.y - 1, s.w + 2, s.h + 2);
        }
        this.context.fill();
    }

    abstract draw(quads: AnimationState<Quad>[]): void;
}

export class QuadAnimationEngineV1 extends QuadAnimationEngine {

    draw(quads: AnimationState<Quad>[]) {

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        quads.forEach((quad: AnimationState<Quad>) => {
            if (quad.state === AnimationStateEnum.APPEARING || quad.state === AnimationStateEnum.STAYING) {
                if (quad.getProgress() >= 1) {
                    quad.state = AnimationStateEnum.STAYING;
                }
                this.drawBackground(quad.t);
            }
        });

        quads.forEach((quad: AnimationState<Quad>) => {
            if (quad.state === AnimationStateEnum.APPEARING) {
                const t = d3.easeCubicInOut(quad.getProgress());

                const p = quad.parent.t;
                const c = quad.t;

                const ci = p.interpolate(c);
                this.drawQuad(ci(t));
            }

            if (quad.state === AnimationStateEnum.STAYING) {
                this.drawQuad(quad.t);
            }
        });

    }
}