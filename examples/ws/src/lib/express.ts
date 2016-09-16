import { info } from 'loglevel';
import { cyan } from 'chalk';
import express from 'express';
import { project } from '../project';
import { findAsync } from './openport';

export async function listenAsync(middlewares = [], root = project.ws.distDir) {
  const app = express();

  middlewares.push(express.static(root));

  for (const middleware of middlewares) {
    app.use(middleware);
  }

  const port = await findAsync();
  return new Promise((resolve, reject) => {
    const server = app.listen(port);
    server.on('listening', () => info(`Serving from ${cyan(`http://localhost:${port}`)}.`));
    server.on('error', reject);
    server.on('close', resolve);
  });
}
