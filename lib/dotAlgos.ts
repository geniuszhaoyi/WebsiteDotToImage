import { Number } from "aws-sdk/clients/iot";

export interface Dot {
    key: number | string;
    style: {
        top: number;
        left: number;
        width: number;
        height: number;
    }
    colorStyle: {
        top: number;
        left: number;
        width: number;
        height: number;
        borderRadius: number;
        background: string;
    }
}

type DomainSquare = { left: number, top: number, right?: number, bottom?: number, width?: number, height?: number } | [number, number, number, number];

const summary = (array: any[] | Uint8ClampedArray, callback: (item: any, index?: number) => number) => {
    let sum = 0, count = 0;
    array.forEach((item: any, i: number) => {
        const value = callback(item, i);
        if (value !== undefined) {
            sum += value;
            count += 1;
        }
    });
    return [sum, count];
}

export const getKeyColor = (ctx: CanvasRenderingContext2D, domainSquare: DomainSquare): string => {
    let left: number, top: number, width: number, height: number;
    if (Array.isArray(domainSquare)) {
        [left, top, width, height] = domainSquare;
    } else {
        let right: number, bottom: number;
        ({ left, top, right, bottom, width, height } = domainSquare);
        if (!width) {
            width = right - left;
        }
        if (!height) {
            height = bottom - top;
        }
    }

    const data = ctx.getImageData(left, top, width, height).data;

    const red = summary(data, (d, i) => i % 4 === 0 ? d : undefined);
    const green = summary(data, (d, i) => i % 4 === 1 ? d : undefined);
    const blue = summary(data, (d, i) => i % 4 === 2 ? d : undefined);

    return `rgba(${red[0] / red[1]}, ${green[0] / green[1]}, ${blue[0] / blue[1]}, 127)`;
}

export const generateDots = (ctx: CanvasRenderingContext2D, dotSizes: number[]): Dot[] => {
    const res: Dot[] = [];
    if (!ctx || !dotSizes) {
        return res;
    }

    const width = ctx.canvas.width, height = ctx.canvas.height;
    const minSize = width < height ? width : height;

    dotSizes.forEach((dotSize: number, index: number) => {
        const size = minSize / dotSize;
        const countHorizontal = Math.floor(width / size), countVertical = Math.floor(height / size);
        const marginHorizontal = (width - size * countHorizontal) / 2, marginVertical = (height - size * countVertical) / 2;

        for (let i = 0; i < countVertical; i++) {
            for (let j = 0; j < countHorizontal; j++) {
                const color = getKeyColor(ctx, {
                    top: marginVertical + i * size,
                    left: marginHorizontal + j * size,
                    width: size,
                    height: size,
                });
                res.push({
                    key: `${index}-${i}-${j}`,
                    style: {
                        top: i === 0 ? 0 : marginVertical + i * size,
                        left: j === 0 ? 0 : marginHorizontal + j * size,
                        height: i === 0 || i === countVertical - 1 ? marginVertical + size : size,
                        width: j === 0 || j === countHorizontal - 1 ? marginHorizontal + size : size,
                    },
                    colorStyle: {
                        top: i === 0 ? marginVertical : 0,
                        left: j === 0 ? marginHorizontal : 0,
                        height: size,
                        width: size,
                        borderRadius: size / 2,
                        background: color,
                    }
                })
            }
        }
    });

    return res.reverse();
}
