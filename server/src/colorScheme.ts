import type { RequestHandler } from 'express';
import { leds } from './config';

export function colorScheme(): RequestHandler {
    return function(_, res) {
        res.send({
            up: Array.from({ length: leds.horizontal }, () => [255, 0, 0]),
            left: Array.from({ length: leds.vertical }, () => [0, 255, 0]),
            bottom: Array.from({ length: leds.horizontal }, () => [0, 0, 255]),
            right: Array.from({ length: leds.vertical }, () => [255, 0, 255]),
        } satisfies ColorScheme);
    }
}