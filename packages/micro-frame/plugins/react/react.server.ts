import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

import { NodeTypes } from "@micro-frame/server/types";
import createWrapper from "@micro-frame/utils/create-wrapper.server";
import {ReactNode} from "./types";
const DefaultWrapper = { tagName: 'div' };
const component: NodeTypes<ReactNode> = (options, context) => {
  const { wrapper = DefaultWrapper, component: Component } = options;
  const [head, tail] = createWrapper(wrapper, context);
  const { queueResponse } = context;
  queueResponse(head);
  queueResponse(
    Promise.resolve(Component.asyncData?.(context)).then((result) => {
      return renderToString(
        createElement(Component, result || context)
      );
    }),
  );
  queueResponse(tail);
};

component.key = 'react';

export default component;
