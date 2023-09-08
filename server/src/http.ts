import { env } from 'process';
import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocket } from 'ws';

const HTTP_PORT = env.HTTP_PORT ?? 3001;

const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, '../public')));

const wss = new WebSocket.Server({ server });
const sockets: WebSocket[] = [];

wss.on('connection', (socket) => {
  console.log('Camera connected');
  sockets.push(socket);

  socket.on('message', (message) => {
    for (const socket of sockets) {
      socket.send(message);
    }
  });

  socket.on('close', () => {
    console.log('Camera disconnected');
  });
});

server.listen(HTTP_PORT, () => {
  console.log(`HTTP Server is listening on port ${HTTP_PORT}`);
});
