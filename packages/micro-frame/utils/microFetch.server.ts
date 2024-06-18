import { IPrepassComponent } from '@micro-frame/plugin-react/types';
import { RenderContextSSR } from '@micro-frame/server/types';

const microFetchServer = (
  Component: IPrepassComponent,
  context: RenderContextSSR,
  isHydrate: boolean,
  options: Record<string, string> = {},
) => {
  return Promise.resolve(Component[context.method as 'get' | 'post']?.(context, options));
};

export default microFetchServer;
