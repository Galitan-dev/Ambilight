import net from 'net';
import { env } from 'process';
import { generateColorScheme, stringifyColorScheme } from './colorScheme';

const PORT = env.PORT ?? 3000;

const server = net.createServer((socket) => {
    console.log(`Client connected: ${socket.remoteAddress}:${socket.remotePort}`);
    
    const stream = setInterval(() => {
        const colorScheme = generateColorScheme();
        
        if (socket.writable) socket.write(stringifyColorScheme(colorScheme));
    })
    
    socket.on('end', () => {
        console.log(`Client disconnected: ${socket.remoteAddress}:${socket.remotePort}`);
        clearInterval(stream);
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
