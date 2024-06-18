import ssrProxy from '../middleware/ssr-proxy';
import path from 'node:path';
import createJSONProxy from '../middleware/json-proxy';
import { MicroNode } from '@micro-frame/utils/types';
import { readFileSync, createReadStream } from 'node:fs';
import { createSecureServer } from 'node:http2';
import { lstat } from 'fs/promises';
import compress from './compress';
import { SetupProvides, SetupMiddleware } from '../types';

const logger = console;
const PORT = '8100';
const publicDir = path.join(process.cwd(), '/dist/public');

interface CreateServerOptions {
  setupMiddleware?: SetupMiddleware;
  rootNode: MicroNode;
  setupProvides: SetupProvides;
}

const options = {
  key: readFileSync(path.join(process.cwd(), 'cert/tls.key')),
  cert: readFileSync(path.join(process.cwd(), 'cert/tls.crt')),
};

const fileExists = (filePath: string) =>
  lstat(filePath).then(
    (stats) => stats.isFile(),
    () => false,
  );

const TTL = 60 * 60 * 24 * 365; // one year

const createServer = async ({ setupMiddleware, rootNode, setupProvides }: CreateServerOptions) => {
  const srrMiddleware = await ssrProxy({ rootNode, publicDir, setupProvides });
  const customMiddleware = setupMiddleware && (await setupMiddleware());
  const jsonProxy = createJSONProxy(rootNode, setupProvides);

  const server = createSecureServer(options, async (request, response) => {
    const { headers, url } = request;
    console.log(url);

    const filePath = path.join(publicDir, request.url.slice(1));
    if (await fileExists(filePath)) {
      response.setHeader('Cache-Control', `max-age=${TTL}`);
      return compress(headers['accept-encoding'] || '', createReadStream(filePath), response);
    }

    if (customMiddleware) {
      await customMiddleware(request, response);
    }

    if (url.startsWith('/api')) {
      return jsonProxy(request, response);
    }

    return srrMiddleware(request, response);
  });

  server.listen(PORT, () => {
    logger.info(`The server is running at http://localhost:${PORT}`);
    logger.info('publicDir:', publicDir);
  });
};

export default createServer;
