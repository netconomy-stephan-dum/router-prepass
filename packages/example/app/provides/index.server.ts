import { RenderContextSSR } from '@micro-frame/server/types';
import { Provides } from './types';

const providesServer = (context: RenderContextSSR): Provides => {
  const { tenantName, TLD, language, routes } = context.middleware;

  const provide = {
    tenantName,
    TLD,
    language,
    routes,
  } as Provides;

  // TODO: find better solution for json api
  context.queueResponse?.(`<script>window['provides'] = ${JSON.stringify(provide)}</script>`);

  return provide;
};

export default providesServer;
