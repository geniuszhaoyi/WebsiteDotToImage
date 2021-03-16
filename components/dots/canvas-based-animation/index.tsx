import { useState, useEffect, forwardRef, Ref, useImperativeHandle } from 'react'

import Animation from '@/lib/dotAnimation';

interface Frame {
    data?: Uint8ClampedArray;
    delta?: [number, number, number, number, number][];
}

export const defaultDotSizes = [2, 4, 8, 16, 30];

function AnimationCanvas({ canvasId, dotSizes = defaultDotSizes }, ref: Ref<any>) {

    const [animation, setAnimation] = useState<Animation<Frame>>(undefined);

    useEffect(() => {
        // const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        // const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

        setAnimation(new Animation(() => { }));

        return () => {
            if (animation !== undefined) {
                animation.stop();
            }
        }
    }, []);

    useImperativeHandle(ref, () => ({
        updateDots() {
            const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
            const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
            const width = ctx.canvas.width, height = ctx.canvas.height;

            animation.setCallback((frame) => {
                if (frame.delta) {
                    const imageData: ImageData = ctx.getImageData(0, 0, width, height);
                    frame.delta.forEach((d) => {
                        imageData.data[d[0] * width * 4 + d[1] * 4 + 0] = d[2];
                        imageData.data[d[0] * width * 4 + d[1] * 4 + 1] = d[3];
                        imageData.data[d[0] * width * 4 + d[1] * 4 + 2] = d[4];
                    });
                    ctx.putImageData(imageData, 0, 0);
                } else if (frame.data) {
                    const imageData: ImageData = new ImageData(frame.data, width, height);
                    ctx.putImageData(imageData, 0, 0);
                }
            });

            animation.start();

            const delta = [];
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    delta.push([i, j, 255, 0, 0]);
                }
            }
            const data = [];
            for (let i = 0; i < 880; i++) {
                for (let j = 0; j < 416; j++) {
                    data.push(255);
                    data.push(255);
                    data.push(255);
                    data.push(255);
                }
            }
            animation.pushFrame({ data: new Uint8ClampedArray(data) });
            animation.pushFrame({ delta });
        }
    }));

    return <div></div>
}

export default forwardRef(AnimationCanvas);