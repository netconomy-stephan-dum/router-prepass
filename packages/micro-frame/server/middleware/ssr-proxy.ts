import createDerefer from '../utils/createDerefer';
import Stream, { PassThrough } from 'stream';
import {
  QueueResponse,
  QueueResponsePromise,
  QueueResponseTypes,
  RenderContextSSR,
  RequestHandler,
  SetAssets,
} from '../types';
import createMicroNode from '@micro-frame/utils/createMicroNode';
import createElement from '@micro-frame/utils/createElement.server';
import createAsset from '../utils/createAsset';
import { readFile } from 'node:fs/promises';
import { EarlyHint, MicroNode, TemplateNode } from '@micro-frame/utils/types';
import plugins from '@micro-frame/utils/plugins';
import compress from '../utils/compress';

const logger = console;
const HEAD_TIMEOUT = 30 * 1000;

interface SSRConfig {
  publicDir: string;
  rootNode: MicroNode;
}

const PRELOAD = 'preload';
const formatEarlyLink = (resource: EarlyHint) => {
  if (typeof resource === 'string') {
    return `<${resource}>; rel=${PRELOAD}`;
  }
  return [
    `<${resource.path}>`,
    `rel=${resource.rel || PRELOAD}`,
    resource.as && `as=${resource.as}`,
  ]
    .filter(Boolean)
    .join(';');
};

const ssrProxy = async ({ publicDir, rootNode }: SSRConfig): Promise<RequestHandler> => {
  const { assetsByChunkName, entry } = JSON.parse(
    await readFile(publicDir + '/stats.json', 'utf-8'),
  );
  const setupProvides = PROVIDES && (await import(PROVIDES)).default;
  // const fragmentHeadStart = path.join(__dirname, '../../html-fragments/service-worker.html');

  return async (request, response) => {
    const lang = 'de';

    const globalErrorHandler = (error: Error) => {
      console.error(error.stack);
      response.write(JSON.stringify(error.stack));
      response.end();
    };

    const endStream = new PassThrough();
    compress(request.headers['accept-encoding'] || '', endStream, response);
    // const endStream = response;

    const send = (data: QueueResponseTypes): Promise<void> => {
      if (typeof data === 'string') {
        endStream.write(data);
        return Promise.resolve();
      }

      if (data instanceof Stream) {
        const stream = data.pipe(endStream, { end: false });
        return new Promise((resolve, reject) => {
          data.on('end', resolve);
          stream.on('error', reject);
        });
      }
      if (Array.isArray(data)) {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        return Promise.all(data.map(send)).then(() => {});
      }

      throw new TypeError('Only strings and streams are allowed: ' + typeof data);
    };

    const tail: QueueResponsePromise[] = [
      `<script>window.assetsByChunkName = ${JSON.stringify(assetsByChunkName)};</script>`,
      // createReadStream(fragmentHeadStart),
    ];
    const promises: QueueResponsePromise[] = [];
    const headSent = createDerefer(HEAD_TIMEOUT);
    const headQueue: QueueResponseTypes[] = [`<!DOCTYPE html>`, `<html lang="${lang}"><head>`];

    const queueResponse: QueueResponse = (...promise) => {
      promises.push(...promise);
    };

    let isSent = false;
    const setAssets: SetAssets = (assets = [], levelId, aboveFold = false) => {
      const js: string[] = [];
      const rest: string[] = [];

      assets.forEach((asset) => {
        if (/\.m?js$/.test(asset)) {
          js.push(asset);
        } else {
          rest.push(asset);
        }
      });
      js.map((asset) => createAsset(asset, levelId, aboveFold, publicDir))
        .flat()
        .forEach((part) => {
          tail.push(part);
        });
      rest
        .map((asset) => createAsset(asset, levelId, aboveFold, publicDir))
        .flat()
        .forEach((part) => {
          if (isSent) {
            queueResponse(part);
          } else {
            headQueue.push(part);
          }
        });
    };

    const setHead = (
      meta: TemplateNode[] = [],
      levelId: string,
      statusCode: number | false = 200,
    ) => {
      headQueue.push(
        meta
          .map((child) => {
            if (typeof child !== 'string') {
              child.props = child.props || {};
              child.props['data-chunk'] = levelId;
            }
            return createElement(child, context);
          })
          .join(''),
      );

      if (isSent) {
        throw new Error('StatusCode already sent!');
      }
      if (statusCode !== false) {
        isSent = true;
        response.setHeader('Content-Type', 'text/html; charset=UTF-8');
        // response.setHeader('Transfer-Encoding', 'chunked');

        response.statusCode = statusCode;

        headQueue.push(`</head><body>`);
        headSent.resolve();
      }
    };

    const context: RenderContextSSR = {
      chunkName: 'root',
      services: {},
      middleware: request.middleware,
      earlyHints: [],
      aboveFold: false,
      method: request.method.toLowerCase() as RenderContextSSR['method'],
      plugins,
      isSent: () => isSent,
      queueTail: (...args) => {
        tail.push(...args);
      },
      queueResponse,
      setAssets,
      setHead(meta, statusCode) {
        return setHead(meta, this.levelId, statusCode);
      },
      url: request.url,
      levelId: '0',
      assetsByChunkName,
    };

    context.provides = (await setupProvides?.(context)) || {};

    context.setAssets(assetsByChunkName[entry], '0', true);

    try {
      await createMicroNode(rootNode, context);

      response.writeEarlyHints({
        link: context.earlyHints.map(formatEarlyLink),
      });

      await headSent;

      await [...headQueue, ...promises, ...tail, '</body></html>']
        .reduce(
          (currentPromise, promise) => currentPromise.then(() => promise).then(send),
          Promise.resolve(null) as Promise<unknown>,
        )
        .catch((error) => {
          logger.log(request.url);
          logger.error('Abort connection, head was not sent within 30 seconds!');
          globalErrorHandler(error);
        });

      endStream.end();
      // response.end();
    } catch (error) {
      globalErrorHandler(error as Error);
    }
  };
};

export default ssrProxy;
