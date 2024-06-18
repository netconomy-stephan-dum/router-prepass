import createMicroNode from '@micro-frame/utils/createMicroNode';
import { PnPNodeConstructor, PnPNode, RenderContextBrowser } from '@micro-frame/browser/types';
import createWrapper from '@micro-frame/utils/create-wrapper.client';
import { FragmentNode } from './types';

const PnPFragment: PnPNodeConstructor<FragmentNode> = async (
  { wrapper, meta, children },
  parentContext,
  isHydrate = false,
) => {
  const { context, unload } = createWrapper(wrapper, parentContext, isHydrate);

  if (meta && !isHydrate) {
    context.setHead(meta, isHydrate);
  }

  const instances: PnPNode[] = [];

  let levelId = 0;
  await children.reduce((currentPromise, child, index) => {
    return currentPromise
      .then(() =>
        createMicroNode(
          child,
          {
            ...context,
            levelId: context.levelId + '-' + levelId++,
          },
          isHydrate,
        ),
      )
      .then((instance) => {
        instances.push(instance as PnPNode);
      });
  }, Promise.resolve() as Promise<any>);

  return {
    navigate: async (location, state, isHydrate) => {
      await Promise.all(instances.map((child) => child?.navigate?.(location, state, isHydrate)));
    },
    unload: async () => {
      await Promise.all(instances.map((child) => child.unload()));

      document.querySelectorAll(`[data-chunk="${context.levelId}"]`).forEach((element) => {
        element.parentNode.removeChild(element);
      });
      unload();
    },
  };
};

PnPFragment.key = 'fragment';

export default PnPFragment;
