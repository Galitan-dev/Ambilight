import { env } from 'process';
import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocket } from 'ws';
import { default as sharp } from 'sharp';

const HTTP_PORT = env.HTTP_PORT ?? 3001;

const app = express();
const server = http.createServer(app);

app.use(express.static(env.PUBLIC_PATH ?? path.join(__dirname, '../public')));

const wss = new WebSocket.Server({ server });
const sockets: WebSocket[] = [];

wss.on('connection', (socket) => {
  console.log('Camera connected');
  sockets.push(socket);

  socket.on('message', (message) => {
    sharp(Buffer.from(message as Uint8Array))
      .raw()
      .toBuffer({ resolveWithObject: true })
      .then(({ data, info }: any) => {
        (process as any).currentFrame = {
          width: info.width,
          height: info.height,
          data,
        };
      })

  });

  socket.on('close', () => {
    console.log('Camera disconnected');
  });
});

server.listen(HTTP_PORT, () => {
  console.log(`HTTP Server is listening on port ${HTTP_PORT}`);
});
