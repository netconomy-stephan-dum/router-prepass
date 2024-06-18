import { createElement } from 'react';
import createMicroElement from '@micro-frame/utils/createElement.server';
import { renderToString } from 'react-dom/server';

import { NodeTypes, RenderContextSSR } from '@micro-frame/server/types';
import createWrapper from '@micro-frame/utils/create-wrapper.server';
import { ReactNode } from './types';
import { EarlyHint, TemplateNode } from '@micro-frame/utils/types';
import microFetch from '@micro-frame/utils/microFetch.server';
import microCache from '@micro-frame/server/utils/cache';
const DefaultWrapper = { tagName: 'div' };
interface CacheItem {
  meta: TemplateNode[];
  html: string;
  script: string;
}
const render = (options: ReactNode, context: RenderContextSSR) => {
  const { hydrate = true, wrapper = DefaultWrapper, component: Component } = options;

  return microFetch(Component, context, false).then(async (result) => {
    return {
      meta: Component.meta ? await Promise.resolve(Component.meta(context, result || {})) : null,
      script:
        (hydrate &&
          result &&
          `<script>window["hydrate-data-${context.levelId}"] = ${JSON.stringify(
            result,
          )};</script>`) ||
        '',
      html: renderToString(createElement(Component, result || context)),
    };
  });
};

const component: NodeTypes<ReactNode> = (options, context) => {
  const { error: Error, earlyHints = [], outOfOrder, wrapper, clientOnly, loading } = options;
  const { queueResponse, queueTail } = context;

  context.earlyHints.push(...earlyHints);

  const [head, tail] = createWrapper(wrapper, context);

  queueResponse(head);

  if (!clientOnly) {
    const cachedRender: Promise<{ html: string; script?: string }> = microCache<CacheItem>(
      options,
      context,
      render,
    ).then(
      ({ meta, html, script }) => {
        if (meta) {
          context.setHead(meta);
        }
        return { html, script };
      },
      async (error) => {
        if (Error) {
          return { html: renderToString(createElement(Error, error)) };
        }

        return { html: 'Error: ' + error.toString() };
      },
    );

    if (outOfOrder) {
      queueResponse(Promise.resolve(createMicroElement(loading, context)));
      queueTail(
        cachedRender.then(({ html, script }) => {
          return [`<template id="l_${context.levelId}">${html}</template>`, script].join('');
        }),
      );
    } else {
      queueResponse(cachedRender.then(({ html, script }) => html + script));
    }
  }

  queueResponse(tail);
};

component.key = 'react';

export default component;
