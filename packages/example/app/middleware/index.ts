import getAppConfigService from './getAppConfigService';
import getTranslationService from './getTranslationService';
import { Http2ServerRequest } from 'node:http2';

// could be also defined by process.env
const tenants = ['nike', 'adidas'];
const setupMiddlewares = async () => {
  const { onRequest, appConfig } = await getAppConfigService(tenants);
  const createTranslate = await getTranslationService(appConfig);

  return (request: Http2ServerRequest) => {
    const appConfig = onRequest(request);

    request.middleware = {
      ...appConfig,
      ...createTranslate(appConfig),
    };
  };
};

export default setupMiddlewares;
