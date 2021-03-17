import { useState, useEffect, forwardRef, Ref, useImperativeHandle } from 'react'

import * as d3 from "d3";

import { colorFromHistogram, computeHistogram } from '@/lib/canvas-algorithms';


export const defaultDotSizes = [2, 4, 8, 16, 30];

function D3Container({ canvasId, dotSizes = defaultDotSizes }, ref: Ref<any>) {

    // function onInit() {
    //     const width = 1024;

    //     const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    //     const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    //     const data = ctx.getImageData(left, top, width, height).data;


    //     imageContext = FileAttachment("owl.jpg").image().then((image: any) => {
    //         const context = DOM.context2d(width, width, 1);
    //         context.drawImage(image, 0, 0, width, width);
    //         return context;
    //     });


    //     const graphic = () => {
    //         const quads = new TinyQueue([new Quad(0, 0, width, width)], (a, b) => b.score - a.score);
    //         const context = DOM.context2d(width, width);
    //         context.canvas.style.width = "100%";
    //         for (let i = 0; true; ++i) {
    //             const q = quads.pop();
    //             if (q === undefined || q.score < 50) break;
    //             const qs = q.split();
    //             const qsi = d3.interpolate([q, q, q, q], qs);
    //             qs.forEach(quads.push, quads);
    //             for (let j = 1, m = Math.max(1, Math.floor(q.w / 10)); j <= m; ++j) {
    //                 const t = d3.easeCubicInOut(j / m);
    //                 context.clearRect(q.x, q.y, q.w, q.h);
    //                 for (const s of qsi(t)) {
    //                     context.fillStyle = s.color;
    //                     context.beginPath()
    //                     context.moveTo(s.x + s.w, s.y + s.h / 2);
    //                     context.arc(s.x + s.w / 2, s.y + s.h / 2, s.w / 2, 0, 2 * Math.PI);
    //                     context.fill();
    //                 }
    //                 yield context.canvas;
    //             }
    //         }
    //     }
    // }

    return <div className="d3-container"></div>
}

export default forwardRef(D3Container);