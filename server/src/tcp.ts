import net from 'net';
import { env } from 'process';
import { generateColorScheme, stringifyColorScheme } from './colorScheme';

const TCP_PORT = env.TCP_PORT ?? 3000;

const tcpServer = net.createServer((socket) => {
    console.log(`TCP Client connected: ${socket.remoteAddress}:${socket.remotePort}`);
    
    const stream = setInterval(() => {
        const colorScheme = generateColorScheme();
        
        if (socket.writable) socket.write(stringifyColorScheme(colorScheme) + '\n');
    })
    
    socket.on('end', () => {
        console.log(`TCP Client disconnected: ${socket.remoteAddress}:${socket.remotePort}`);
        clearInterval(stream);
    });
});

tcpServer.listen(TCP_PORT, () => {
    console.log(`TCP Server listening on port ${TCP_PORT}`);
});
