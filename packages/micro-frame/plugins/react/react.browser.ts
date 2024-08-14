import { PnPNodeConstructor, RenderContextBrowser } from '@micro-frame/browser/types';
import { ReactNode } from './types';
import createWrapperClient from '@micro-frame/utils/create-wrapper.client';
import createElementClient from '@micro-frame/utils/createElement.client';
import { type Root } from 'react-dom/client';
import microFetch from '@micro-frame/utils/microFetch.client';
import defineCustomElements from '@micro-frame/utils/defineCustomElements';

const DefaultWrapper = { tagName: 'div' };

const render = (
  { hydrate = true, component: Component, loading }: ReactNode,
  context: RenderContextBrowser,
  isHydrate: boolean,
  isLazy: boolean,
): Promise<Root> => {
  return new Promise((resolve) => {
    if (isHydrate && !hydrate) {
      return resolve({
        render: () => {},
        unmount: () => {},
      });
    }

    if (!isHydrate && loading) {
      context.node.appendChild(createElementClient(loading, context));
    }

    const loadPromise = Promise.all([
      import('react/jsx-runtime'),
      import('react-dom/client'),
      microFetch(Component, context, isHydrate),
    ]);

    const renderPromise = loadPromise.then(([{ jsx }, { createRoot, hydrateRoot }, props]) => {
      return async () => {
        if (isHydrate) {
          const reactElement = jsx(Component, props || context);
          resolve(hydrateRoot(context.node, reactElement));
        } else {
          await Promise.resolve(Component.meta?.(context, props || {})).then((meta) => {
            context.setHead(meta, isHydrate);
          });

          const reactElement = jsx(Component, props || context);
          const reactRoot = createRoot(context.node);
          reactRoot.render(reactElement);

          resolve(reactRoot);
        }
      };
    });

    if (isLazy) {
      renderPromise.then((handler) => handler());
    } else {
      context.queueResponse(renderPromise);
    }
  });
};

interface RenderResult {
  reactRoot?: Promise<Root>;
  unloadLazy?: null | (() => void);
}
const choseRenderMode = (context: RenderContextBrowser, options: ReactNode, isHydrate: boolean) => {
  const { aboveFold, wrapper = DefaultWrapper, loading, customElements = {}, outOfOrder } = options;
  const renderResult: RenderResult = {};
  if (aboveFold) {
    renderResult.reactRoot = render(options, context, isHydrate, false);
  } else {
    context.queueResponse(
      Promise.resolve(() => {
        renderResult.unloadLazy = context.registerLazy(context.node, async () => {
          renderResult.unloadLazy = null;

          renderResult.reactRoot = render(options, context, isHydrate, true);
        });
      }),
    );
  }

  return renderResult;
};
const PnPReactComponent: PnPNodeConstructor<ReactNode> = (options, parentContext, isHydrate) => {
  const {
    aboveFold,
    wrapper = DefaultWrapper,
    loading,
    customElements = {},
    outOfOrder,
    clientOnly,
  } = options;
  const { context, unload } = createWrapperClient(wrapper, parentContext, isHydrate);

  defineCustomElements(customElements);

  let renderResult: RenderResult = {};

  if (outOfOrder && isHydrate) {
    const template = document.querySelector(`#l_${context.levelId}`) as HTMLTemplateElement;

    Array.from(context.node.children).forEach((child) => {
      context.node.removeChild(child);
    });

    context.node.appendChild(template.content);
    template.parentNode.removeChild(template);
    renderResult = choseRenderMode(context, options, clientOnly ? false : isHydrate);
  } else {
    renderResult = choseRenderMode(context, options, clientOnly ? false : isHydrate);
  }

  return {
    async unload() {
      const { unloadLazy, reactRoot } = renderResult;
      unloadLazy?.();
      document.querySelectorAll(`[data-chunk="${context.levelId}"]`).forEach((element) => {
        element.parentNode.removeChild(element);
      });
      unload();
      await reactRoot?.then((root) => {
        root.unmount();
      });
    },
  };
};

PnPReactComponent.key = 'react';

export default PnPReactComponent;
