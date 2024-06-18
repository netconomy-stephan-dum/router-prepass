import { NodeTypes } from '@micro-frame/server/types';
import { ReactNode } from './types';
const component: NodeTypes<ReactNode> = (options, context) => {
  return options.component[context.method]?.(context);
};

component.key = 'react';

export default component;
