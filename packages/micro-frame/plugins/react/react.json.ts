import { NodeTypes } from "@micro-frame/server/types";
import {ReactNode} from "./types";
const component: NodeTypes<ReactNode> = (options, context) => {
  if (context.requestedLevelId === context.levelId) {
    return options.component[context.method]?.(context);
  }
  return null;
};

component.key = 'react';

export default component;
