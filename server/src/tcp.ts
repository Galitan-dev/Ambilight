import { env } from 'process';
import { generateColorScheme, stringifyColorScheme } from './colorScheme';
import { createServer } from 'http';

const TCP_PORT = env.TCP_PORT ?? 3000;

const server = createServer((req, res) => {
    const colorScheme = generateColorScheme();
    
    res
        .writeHead(200)
        .write(stringifyColorScheme(colorScheme) + '\n');

    res.end();
});

server.listen(TCP_PORT, () => {
    console.log(`(TCP) Server listening on port ${TCP_PORT}`);
});
