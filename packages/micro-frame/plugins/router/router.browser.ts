import { PnPLocation } from '@micro-frame/utils/types';
import createMicroNode from '@micro-frame/utils/createMicroNode';
import getRouteMatch from './getRouteMatch';
import { FormState, PnPNode, PnPNodeConstructor } from '@micro-frame/browser/types';
import { IRouteProps, RouterNode } from './types';

const PnPRouter: PnPNodeConstructor<RouterNode> = async ({ routes }, parentContext, isHydrate) => {
  let activeRoute: IRouteProps = null;
  let activeChunk: PnPNode = null;
  const navigate = async (location: PnPLocation, state: FormState, shouldHydrate = false) => {
    const routeMatch = getRouteMatch(routes, location.pathname);

    if (!routeMatch) {
      await activeChunk?.unload();
      activeRoute = null;
      return Promise.resolve();
    }

    const { route, remaining, params, groups } = routeMatch;

    if (activeRoute !== route) {
      await activeChunk?.unload();
      activeRoute = route;

      const context = {
        ...parentContext,
        method: state.method,
        groups,
        params,
        location: {
          ...location,
          pathname: remaining,
        },
      };

      const node = route.node || (route.chunk && { ...route, type: 'chunk' });

      activeChunk = await createMicroNode(node, context, shouldHydrate);
    } else if (activeChunk) {
      return activeChunk.navigate?.(
        {
          ...location,
          pathname: remaining,
        },
        state,
        shouldHydrate,
      );
    }
  };

  await navigate(parentContext.location, parentContext.state, isHydrate);

  return {
    navigate,
    unload: () => {
      return activeChunk?.unload();
    },
  };
};

PnPRouter.key = 'router';

export default PnPRouter;
