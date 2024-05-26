import createMicroNode from '@micro-frame/utils/createMicroNode';
import createWrapperServer from '@micro-frame/utils/create-wrapper.server';
import { NodeTypes } from '@micro-frame/server/types';
import { FragmentNode } from './types';
import setupProvides from './setupProvides';

const fragment: NodeTypes<FragmentNode> = (
  { children, wrapper, meta, statusCode, provides = {} },
  context,
) => {
  const subContext = { ...context };

  const [head, tail] = createWrapperServer(wrapper, context);

  const { queueResponse } = context;

  queueResponse(head);
  setupProvides(subContext, provides);

  if (meta || statusCode) {
    context.setHead(meta || [], statusCode || false);
  }

  let levelId = 0;
  return children
    .reduce(
      (current, child) =>
        current.then(() =>
          createMicroNode(child, {
            ...subContext,
            levelId: subContext.levelId + '-' + levelId++,
          }),
        ),
      Promise.resolve(),
    )
    .then(() => {
      queueResponse(tail);
    });
};

fragment.key = 'fragment';

export default fragment;
