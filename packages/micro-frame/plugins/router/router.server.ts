import createMicroNode from '@micro-frame/utils/createMicroNode';
import getRouteMatch from './getRouteMatch';
import { RouterNode } from './types';
import { NodeTypes } from '@micro-frame/server/types';

const router: NodeTypes<RouterNode> = async ({ routes }, context) => {
  const routerMatch = getRouteMatch(routes, context.url);

  if (!routerMatch) {
    throw new Error(`No route matched ${context.url}!`);
  }

  const { route, remaining, params, groups } = routerMatch;
  const { chunk, chunkName, node, aboveFold, hydrate } = route;

  const subContext = {
    ...context,
    groups,
    params,
    aboveFold: aboveFold || context.aboveFold,
    url: remaining,
  };

  if (node) {
    return createMicroNode(node, subContext);
  }

  if (chunk) {
    return createMicroNode(
      {
        type: 'chunk',
        chunk,
        chunkName,
        hydrate,
        aboveFold: subContext.aboveFold,
      },
      subContext,
    );
  }

  throw new TypeError('Unknown route type, node or chunk must be set!');
};

router.key = 'router';

export default router;
