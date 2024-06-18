import { NodeTypes } from '@micro-frame/server/types';
import { FragmentNode } from './types';
import setupProvides from './setupProvides';
import createMicroNode from '@micro-frame/utils/createMicroNode';

const fragment: NodeTypes<FragmentNode> = ({ children, provides = {} }, context) => {
  const subContext = { ...context };

  setupProvides(subContext, provides);

  const levelId = Number.parseInt(context.requestedLevelId.shift(), 10);

  return createMicroNode(children[levelId], {
    ...subContext,
    levelId: subContext.levelId + '-' + levelId,
  });
};

fragment.key = 'fragment';

export default fragment;
