import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

import { NodeTypes, RenderContextSSR } from '@micro-frame/server/types';
import createWrapper from '@micro-frame/utils/create-wrapper.server';
import { ReactNode } from './types';
import { TemplateNode } from '@micro-frame/utils/types';
const DefaultWrapper = { tagName: 'div' };
interface CacheEntry {
  node: Promise<{
    head: string;
    tail: string;
    meta: TemplateNode[];
    html: string;
  }>;
  isStale: boolean;
  ttl: number;
}
const cache: Record<string, CacheEntry> = {};
const TTL = 1000 * 60 * 5; // 5 minutes
const render = (options: ReactNode, context: RenderContextSSR) => {
  const { hydrate, wrapper = DefaultWrapper, component: Component } = options;

  const [head, tail] = createWrapper(wrapper, context);

  return Promise.resolve(Component[context.method]?.(context)).then(async (result) => {
    return {
      head,
      tail,
      meta: Component.meta ? await Promise.resolve(Component.meta(context, result || {})) : null,
      html: [
        renderToString(createElement(Component, result || context)),
        (hydrate &&
          result &&
          `<script>window["hydrate-data-${context.levelId}"] = ${JSON.stringify(
            result,
          )};</script>`) ||
          '',
      ].join(''),
    };
  });
};
const cachedRender = (options: ReactNode, context: RenderContextSSR) => {
  const { cacheKey } = options;

  if (cacheKey) {
    const key = typeof cacheKey === 'function' ? cacheKey(context) : cacheKey;
    const cacheEntry = cache[key];
    const timestamp = new Date().getTime();

    if (cacheEntry) {
      const { isStale, ttl, node } = cacheEntry;
      if (!isStale && ttl < timestamp) {
        // renew cache
        cacheEntry.isStale = true;
        const newNode = render(options, context);

        newNode
          .then(
            () => {
              cacheEntry.node = newNode;
              cacheEntry.ttl = timestamp + TTL;
            },
            (error) => {
              console.log('Revalidating cache', cacheKey, 'errored', error);
            },
          )
          .finally(() => {
            cacheEntry.isStale = false;
          });
      }

      return node;
    }

    const node = render(options, context);

    node.then(() => {
      cache[key] = {
        node,
        isStale: false,
        ttl: timestamp + TTL,
      };
    });

    return node;
  }

  return render(options, context);
};
const component: NodeTypes<ReactNode> = (options, context) => {
  const { error: Error } = options;
  const { queueResponse } = context;

  queueResponse(
    cachedRender(options, context).then(
      ({ head, tail, meta, html }) => {
        if (meta) {
          context.setHead(meta);
        }
        return [head, html, tail].join('');
      },
      async (error) => {
        if (Error) {
          return renderToString(createElement(Error, error));
        }

        return 'Error: ' + error.toString();
      },
    ),
  );
};

component.key = 'react';

export default component;
