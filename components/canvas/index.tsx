import React, { useEffect, useState } from "react";
import _uniqueId from 'lodash/uniqueId';

import classes from './style.module.scss';
import { Dot, generateDots } from "@/lib/dotAlgos";
import DotComponent from "./dot";

interface Size {
    width: number;
    height: number;
}

export const defaultDotSizes = [2, 4, 8, 16, 30];

export default function Canvas({ file, dotSizes = defaultDotSizes }) {
    const [canvasId] = useState('canvasId');        /// TODO change to unique ID
    const [showcaseId] = useState('showcaseId');    /// TODO change to unique ID

    const [size, setSize] = useState<Size>({ width: 800, height: 600 });
    const getSize = () => {
        return {
            width: size.width + 42,
            height: size.height + 42,
        }
    }

    const [dots, setDots] = useState<Dot[]>([]);

    const getSizeFitHeight = ({ width, height }) => {
        const availableHeight = window.screen.height - 200;

        if (availableHeight >= height) {
            return { width, height };
        } else {
            const radio = availableHeight / height;

            return {
                width: width * radio,
                height: height * radio
            };
        }
    }

    const loadFileIntoCanvas = (file: Blob, canvas: HTMLCanvasElement) => {
        var ctx: CanvasRenderingContext2D = canvas.getContext('2d');

        var reader = new FileReader();
        reader.onload = function (event) {
            var img = new Image();
            img.onload = function () {
                const { width, height } = getSizeFitHeight({ width: img.width, height: img.height });
                setSize({ width, height });
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);
                setDots(generateDots(ctx, dotSizes));
            }
            img.src = event.target.result as string;
        }
        reader.readAsDataURL(file);
    }

    useEffect(() => {
        if (file) {
            var canvas = document.getElementById(canvasId) as HTMLCanvasElement;
            loadFileIntoCanvas(file, canvas);
        }
    }, [file]);

    return <div id={showcaseId} className={classes.showcase} style={getSize()}>
        <div className={classes.dotContainer}>
            {dots.map((dot: Dot) => <DotComponent dot={dot} key={dot.key} />)}
        </div>
        <canvas id={canvasId}></canvas>
    </div>
}
