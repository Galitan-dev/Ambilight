
import { leds } from './config';

export function generateColorScheme(): ColorScheme {
    return {
        up: Array.from({ length: leds.horizontal }, (_, i) => 
            [Math.round((i + Date.now() % 2000 / 2000 * leds.horizontal) % leds.horizontal / leds.horizontal * 255), 0, 0]),
        left: Array.from({ length: leds.vertical }, () => [0, 255, 0]),
        bottom: Array.from({ length: leds.horizontal }, () => [0, 0, 255]),
        right: Array.from({ length: leds.vertical }, () => [255, 0, 255]),
    };
}

export function stringifyColorScheme(colorScheme: ColorScheme): string {
    return JSON.stringify(Object.values(colorScheme).flat(1));
}
