import { TemplateDescriptor } from './types';
import createElement from './createElement.client';
import { RenderContextBrowser } from '@micro-frame/browser/types';

const createWrapperClient = (
  Wrapper: TemplateDescriptor,
  parentContext: RenderContextBrowser,
  isHydrate: boolean,
) => {
  if (!Wrapper) {
    return {
      context: parentContext,
      unload: () => {},
    };
  }

  const wrapper = isHydrate
    ? document.querySelector(`[data-frame="${parentContext.levelId}"]`)
    : createElement(Wrapper, parentContext);

  if (wrapper instanceof Text) {
    throw new TypeError('TextNode cant be a Wrapper!');
  }

  const context = {
    ...parentContext,
    node: wrapper.querySelector(`[data-root="${parentContext.levelId}"]`) || wrapper,
  };

  parentContext.queueResponse(
    Promise.resolve(() => {
      if (!isHydrate) {
        parentContext.node.appendChild(wrapper);
      }
    }),
  );

  return {
    context,
    unload: () => {
      wrapper.parentNode?.removeChild(wrapper);
    },
  };
};

export default createWrapperClient;
