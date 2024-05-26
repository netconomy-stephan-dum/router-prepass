import { PnPNodeConstructor } from '@micro-frame/browser/types';
import { ReactNode } from './types';
import createWrapperClient from '@micro-frame/utils/create-wrapper.client';
import { type Root } from 'react-dom/client';

const DefaultWrapper = { tagName: 'div' };

const PnPReactComponent: PnPNodeConstructor<ReactNode> = async (
  { hydrate, wrapper = DefaultWrapper, component: Component },
  parentContext,
  isHydrate,
) => {
  const { jsx } = await import('react/jsx-runtime');
  // const { createElement } = await import('react');
  const { createRoot, hydrateRoot } = await import('react-dom/client');

  const { context, unload } = createWrapperClient(wrapper, parentContext, isHydrate);

  let reactRoot: Root;
  if (isHydrate) {
    if (hydrate) {
      const props = window[`hydrate-data-${context.levelId}`] || {};
      const reactElement = jsx(Component, props || context);
      reactRoot = hydrateRoot(context.node, reactElement);
    } else {
      reactRoot = {
        render: () => {},
        unmount: () => {},
      };
    }
  } else {
    const props =
      context.method in Component
        ? await fetch(
            `/api/${context.levelId}/${encodeURIComponent(context.location.fullPathname)}`,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          ).then((response) => response.json())
        : {};
    const reactElement = jsx(Component, props || context);
    reactRoot = createRoot(context.node);
    reactRoot.render(reactElement);
    await Promise.resolve(Component.meta?.(context, props || {})).then((meta) => {
      context.setHead(meta);
    });
  }

  return {
    unload() {
      reactRoot.unmount();
      document.querySelectorAll(`[data-chunk="${context.levelId}"]`).forEach((element) => {
        element.parentNode.removeChild(element);
      });
      unload();
    },
  };
};

PnPReactComponent.key = 'react';

export default PnPReactComponent;
