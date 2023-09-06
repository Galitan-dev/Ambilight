import express from 'express';
import { env } from 'process';
import { colorScheme } from './colorScheme';

const PORT = env.PORT ?? 3000;

const app = express();

app.use('/color-scheme', colorScheme());

app.listen(PORT, () => console.log(`Ambilight server listening on port ${PORT}`))