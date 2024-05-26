import { StreamNode } from '@micro-frame/utils/types';
import { RenderContextSSR } from '@micro-frame/server/types';
import { RenderContextBrowser } from '@micro-frame/browser/types';

const createMicroNode = <Return>(node: StreamNode, context: RenderContextSSR | RenderContextBrowser, isHydrate = false): Promise<Return> => {
  if (Array.isArray(node)) {
    return context.plugins.fragment(
      {
        type: 'fragment',
        children: node,
      },
      context,
      isHydrate,
    );
  }

  if (typeof node === 'function') {
    const childContext = { ...context };
    return Promise.resolve(node(childContext)).then((realNode) => {
      return createMicroNode(realNode, childContext, isHydrate) as Return;
    });
  }

  if (node.type in context.plugins) {
    return context.plugins[node.type](node, context, isHydrate);
  }

  throw new ReferenceError(`Unregistered node type '${node.type}'!\n${JSON.stringify(node)}`);
}

export default createMicroNode;