import { createElement } from 'react';
import { createRoot, hydrateRoot, Root } from 'react-dom/client';
import { PnPNodeConstructor } from "@micro-frame/browser/types";
import { ReactNode } from "./types";
import createWrapperClient from "@micro-frame/utils/create-wrapper.client";

const DefaultWrapper = { tagName: 'div' };

const PnPReactComponent: PnPNodeConstructor<ReactNode> = async ({ wrapper = DefaultWrapper, component: Component }, parentContext, isHydrate) => {
  const { context, unload } = createWrapperClient(wrapper, parentContext, isHydrate)
  const props = await Promise.resolve(Component.asyncData?.(context));
  const reactElement = createElement(Component, props || context);

  let reactRoot: Root;
  if (isHydrate) {
    reactRoot = hydrateRoot(context.node, reactElement);
  } else {
    reactRoot = createRoot(context.node);
    reactRoot.render(reactElement);
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
}

PnPReactComponent.key = 'react';

export default PnPReactComponent;
