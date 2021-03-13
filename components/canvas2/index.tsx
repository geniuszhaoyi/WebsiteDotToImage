import React, { useEffect, useState, useRef } from "react";
import _uniqueId from 'lodash/uniqueId';

import classes from './style.module.scss';
import { Dot, generateDots } from "@/lib/dotAlgos";
import Dots from "../dots/div-based-animation";

interface Size {
    width: number;
    height: number;
}

export default function Canvas({ file }) {
    const dotsRef = useRef();

    const [canvasId] = useState('canvasId');        /// TODO change to unique ID
    const [showcaseId] = useState('showcaseId');    /// TODO change to unique ID

    const [size, setSize] = useState<Size>({ width: 800, height: 600 });
    const getSize = () => {
        return {
            width: size.width + 42,
            height: size.height + 42,
        }
    }

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
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

        const reader = new FileReader();
        reader.onload = function (event) {
            const img = new Image();
            img.onload = function () {
                const { width, height } = getSizeFitHeight({ width: img.width, height: img.height });
                setSize({ width, height });
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);
                dotsRef.current.updateDots();
            }
            img.src = event.target.result as string;
        }
        reader.readAsDataURL(file);
    }

    useEffect(() => {
        if (file) {
            const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
            loadFileIntoCanvas(file, canvas);
        }
    }, [file]);

    return <div id={showcaseId} className={classes.showcase} style={getSize()}>
        <Dots ref={dotsRef} canvasId={canvasId}></Dots>
        <canvas id={canvasId}></canvas>
    </div>
}
