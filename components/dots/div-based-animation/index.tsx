import { Ref, useState, forwardRef, useImperativeHandle, useEffect } from 'react'

import classes from './style.module.scss';
import { Dot, generateDots } from '@/lib/dotAlgos';
import DotComponent from './dot';

export const defaultDotSizes = [2, 4, 8, 16, 30];

function Dots({ canvasId, dotSizes=defaultDotSizes }, ref: Ref<unknown>) {
    const [dots, setDots] = useState<Dot[]>([]);

    useImperativeHandle(ref, () => ({

        updateDots() {
            const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
            const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
            setDots(generateDots(ctx, dotSizes));
        }

    }));

    return <div className={classes.dotContainer}>
        {dots.map((dot: Dot) => <DotComponent dot={dot} key={dot.key} />)}
    </div>

}

export default forwardRef(Dots);