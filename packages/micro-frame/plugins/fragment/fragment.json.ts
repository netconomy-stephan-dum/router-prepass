import {NodeTypes } from "@micro-frame/server/types";
import {FragmentNode} from "./types";
import setupProvides from './setupProvides';
import createMicroNode from '@micro-frame/utils/createMicroNode';

const fragment: NodeTypes<FragmentNode> = ({ children, provides = {} }, context) => {
  const subContext = { ...context };

  setupProvides(subContext, provides);

  let levelId = 0;
  return children
    .reduce((current, child) => current.then((result) => result || createMicroNode(child, {
      ...subContext,
      levelId: subContext.levelId + '-'+ levelId++,
    })), Promise.resolve(null))
};

fragment.key = 'fragment';

export default fragment;
