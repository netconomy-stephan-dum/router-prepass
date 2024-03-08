import express from 'express';
import ssrProxy from "./middleware/ssr-proxy";
import path from 'node:path';
import compression from 'compression';

const logger = console;
const PORT = "8100";
const publicDir = path.resolve('../browser/.dist/public');
const staticDir = path.resolve('./.static');
(async () => {
  const srrMiddleware = await ssrProxy({ publicDir });
  const app = express()
    .use(compression())
    .use(express.static(publicDir))
    .use(express.static(staticDir))
    .use(srrMiddleware);

  const server = app.listen(PORT, () => {
    logger.info(`The server is running at http://localhost:${PORT}`);
    logger.info('publicDir:', publicDir);
    logger.info('staticDir path:', staticDir);
  });

  if (module.hot) {
    module.hot.accept(logger.error);
    module.hot.dispose(() => {
      logger.log('Restarting server...');
      server.close();
    });
  }
})();
