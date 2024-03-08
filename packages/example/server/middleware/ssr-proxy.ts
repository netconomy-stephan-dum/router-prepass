import {RequestHandler } from "express";
import createDerefer from "../utils/createDerefer";
import Stream from "stream";
import rootNode from '@example/app';
import { QueueResponse, QueueResponseTypes, RenderContextSSR, SetAssets } from '@micro-frame/server/types';
import createMicroNode from "@micro-frame/utils/createMicroNode";
import createElement from '@micro-frame/utils/createElement.server';
import createAsset from '../utils/createAsset';
import path from 'path';
import { readFile } from 'node:fs/promises';
import { createReadStream } from 'fs';

const logger = console;
const HEAD_TIMEOUT = 30 * 1000;

interface SSRConfig {
  publicDir: string;
}

const ssrProxy = async ({ publicDir }: SSRConfig): Promise<RequestHandler> => {
  const { assetsByChunkName, entry } = JSON.parse(await readFile(path.relative(path.join(__dirname, '../..'), publicDir)+'/stats.json', 'utf-8'));
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

    let currentPromise: Promise<any>;
    const promises: (Promise<QueueResponseTypes> | QueueResponseTypes)[] = [];
    const headSent = createDerefer(HEAD_TIMEOUT);
    const headQueue: QueueResponseTypes[] = [
      `<!DOCTYPE html>`,
      `<html lang="${lang}"><head>`,
      `<script>window.assetsByChunkName = ${JSON.stringify(assetsByChunkName)};</script>`,
      createReadStream(fragmentHeadStart)
    ];

    const queueResponse: QueueResponse = (promise) => {
        if (currentPromise) {
        currentPromise = currentPromise.then(() => promise).then(send);
      } else {
        promises.push(promise);
      }
    };
    let levelId = 0;
    const setAssets: SetAssets = (assets = [], aboveFold = false) => {
      assets.map(
        (asset) => createAsset(asset, levelId, aboveFold, publicDir)
      ).flat().forEach((part) => {
        queueResponse(part)
      })
    };
    const context: RenderContextSSR = {
      chunkName: 'root',
      aboveFold: false,
      queueResponse,
      setAssets,
      setHead: async (meta = [], statusCode = 200) => {
        headQueue.push(meta.map((child) => {
          if (typeof child !== 'string') {
            child.props = child.props || {};
            child.props['data-chunk'] = levelId;
          }
          return createElement(child, context);
        }).join(''));

        if (statusCode !== false) {
          response.setHeader('Content-Type', 'text/html; charset=UTF-8');
          response.setHeader('Transfer-Encoding', 'chunked');
          response.status(statusCode);

          headQueue.push(`</head><body>`);
          headSent.resolve();
        }
      },
      url: request.url,
      levelId: 0,
      getLevelId: () => {
        return levelId
      },
      setLevelId: () => {
        return levelId += 1;
      },
      assetsByChunkName,
    };

    const renderPromise = headSent.then(
      () => {
        promises.unshift(...headQueue);
        currentPromise = promises
          .reduce((currentPromise, promise) =>
            currentPromise.then(() => promise).then(send),
            Promise.resolve() as Promise<any>
          )
      },
      (error) => {
        logger.log(request.url);
        logger.error('Abort connection, head was not sent within 30 seconds!');
        globalErrorHandler(error);
      }
    );

    context.setAssets(assetsByChunkName[entry], true);

    try {
      await Promise.resolve(createMicroNode(
        rootNode,
        context
      ));

      queueResponse(await renderPromise.then(() => currentPromise).then(() => '</body></html>'));
      response.end();
    } catch (error) {
      globalErrorHandler(error as Error);
    }
  };
}

export default ssrProxy;
