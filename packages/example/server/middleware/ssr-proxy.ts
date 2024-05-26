import { RequestHandler } from 'express';
import createDerefer from '../utils/createDerefer';
import Stream from 'stream';
import rootNode from '@example/app';
import {
  QueueResponse,
  QueueResponseTypes,
  RenderContextSSR,
  SetAssets,
} from '@micro-frame/server/types';
import createMicroNode from '@micro-frame/utils/createMicroNode';
import createElement from '@micro-frame/utils/createElement.server';
import createAsset from '../utils/createAsset';
import path from 'path';
import { readFile } from 'node:fs/promises';
import { createReadStream } from 'fs';
import { TemplateNode } from '@micro-frame/utils/types';
import plugins from '@micro-frame/utils/plugins';

const logger = console;
const HEAD_TIMEOUT = 30 * 1000;

interface SSRConfig {
  publicDir: string;
}

const ssrProxy = async ({ publicDir }: SSRConfig): Promise<RequestHandler> => {
  const { assetsByChunkName, entry } = JSON.parse(
    await readFile(
      path.relative(path.join(__dirname, '../..'), publicDir) + '/stats.json',
      'utf-8',
    ),
  );
  const fragmentHeadStart = path.join(__dirname, '../../html-fragments/service-worker.html');

  return async (request, response) => {
    const lang = 'de';
    const globalErrorHandler = (error: Error) => {
      console.error(error.stack);
      response.write(error.stack);
      response.end();
    };

    const send = (data: QueueResponseTypes) => {
      if (typeof data === 'string') {
        response.write(data);
        return Promise.resolve();
      } else if (data instanceof Stream) {
        const stream = data.pipe(response, { end: false });
        return new Promise((resolve, reject) => {
          data.on('end', resolve);
          stream.on('error', reject);
        });
      } else {
        throw new TypeError('Only strings and streams are allowed: ' + typeof data);
      }
    };

    const tail: (Promise<QueueResponseTypes> | QueueResponseTypes)[] = [
      `<script>window.assetsByChunkName = ${JSON.stringify(assetsByChunkName)};</script>`,
      createReadStream(fragmentHeadStart),
    ];
    const promises: (Promise<QueueResponseTypes> | QueueResponseTypes)[] = [];
    const headSent = createDerefer(HEAD_TIMEOUT);
    const headQueue: QueueResponseTypes[] = [`<!DOCTYPE html>`, `<html lang="${lang}"><head>`];

    const queueResponse: QueueResponse = (...promise) => {
      promises.push(...promise);
    };

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
          queueResponse(part);
        });
    };
    let isSent = false;

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
        response.setHeader('Transfer-Encoding', 'chunked');
        response.status(statusCode);

        headQueue.push(`</head><body>`);
        headSent.resolve();
      }
    };
    const context: RenderContextSSR = {
      chunkName: 'root',
      aboveFold: false,
      method: request.method.toLowerCase() as RenderContextSSR['method'],
      plugins,
      isSent: () => isSent,
      queueResponse,
      setAssets,
      setHead(meta, statusCode) {
        return setHead(meta, this.levelId, statusCode);
      },
      url: request.url,
      levelId: '0',
      assetsByChunkName,
    };

    context.setAssets(assetsByChunkName[entry], '0', true);

    try {
      await Promise.resolve(createMicroNode(rootNode, context));

      await headSent.then(
        () => {
          return [...headQueue, ...promises, ...tail, '</body></html>'].reduce(
            (currentPromise, promise) => currentPromise.then(() => promise).then(send),
            Promise.resolve() as Promise<any>,
          );
        },
        (error) => {
          logger.log(request.url);
          logger.error('Abort connection, head was not sent within 30 seconds!');
          globalErrorHandler(error);
        },
      );

      response.end();
    } catch (error) {
      globalErrorHandler(error as Error);
    }
  };
};

export default ssrProxy;
