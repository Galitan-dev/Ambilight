import type { RequestHandler } from 'express';
import { leds } from './config';

export function colorScheme(): RequestHandler {
    return function(_, res) {
        const scheme: ColorScheme = {
            up: Array.from({ length: leds.horizontal }, () => [100, 0, 0]),
            left: Array.from({ length: leds.vertical }, () => [0, 100, 0]),
            bottom: Array.from({ length: leds.horizontal }, () => [0, 0, 100]),
            right: Array.from({ length: leds.vertical }, () => [100, 0, 100]),
        };

        res.send('[' + Object.values(scheme).flat(2).join(',') + ']')
    }
}
