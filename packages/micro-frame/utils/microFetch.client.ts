import { RenderContextBrowser } from 'types.js';
import { IPrepassComponent } from '@micro-frame/plugin-react/types.js';

const microFetchBrowser = (
  Component: IPrepassComponent,
  context: RenderContextBrowser,
  isHydrate: boolean,
) => {
  if (isHydrate) {
    return Promise.resolve(window[`hydrate-data-${context.levelId}`] || {});
  } else {
    return context.method in Component
      ? fetch(`/api/${context.levelId}/${encodeURIComponent(context.location.fullPathname)}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((response) => response.json())
      : Promise.resolve({});
  }
};

export default microFetchBrowser;
