
import { leds } from './config';

export function generateColorScheme(): ColorScheme {
    if (!(process as any).currentFrame) {
        return {
            up: Array.from({ length: leds.horizontal }, (_) => [255, 255, 0]),
            left: Array.from({ length: leds.vertical }, (_) => [255, 0, 0]),
            bottom: Array.from({ length: leds.horizontal }, (_) => [255, 0, 0]),
            right: Array.from({ length: leds.vertical }, (_) => [255, 0, 0]),
        }
    }

    const currentFrame = (process as any).currentFrame;

    const horizontalS = Math.floor(currentFrame.width / leds.horizontal);
    const verticalS = Math.floor(currentFrame.height / leds.vertical);

    return {
        left: Array.from({ length: leds.vertical }, (_, i) => generateLed(currentFrame, verticalS, 0, i * verticalS)),
        up: Array.from({ length: leds.horizontal }, (_, i) => generateLed(currentFrame, horizontalS, i * horizontalS, 0)),
        right: Array.from({ length: leds.vertical }, (_, i) => generateLed(currentFrame, verticalS, currentFrame.width - verticalS, i * verticalS)).reverse(),
        bottom: Array.from({ length: leds.horizontal }, (_, i) => generateLed(currentFrame, horizontalS, i * horizontalS, currentFrame.height - horizontalS)).reverse(),
    };
}

export function stringifyColorScheme(colorScheme: ColorScheme): string {
    return JSON.stringify(Object.values(colorScheme).flat(1));
}

function generateLed(currentFrame: { data: number[], width: number, height: number }, s: number, bx: number, by: number): Color {
    let r = 0, g = 0, b = 0, count = 0;

    for (let x = 0; x < s; x++) {
        for (let y = 0; y < s; y++) {
            const i = ((by + y) * currentFrame.width + x + bx) * 4;
            r += currentFrame.data[i];
            g += currentFrame.data[i + 1];
            b += currentFrame.data[i + 2];
            count += 1;
        }
    }

    r /= count;
    g /= count;
    b /= count;

    return [Math.floor(r), Math.floor(g), Math.floor(b)];
}
