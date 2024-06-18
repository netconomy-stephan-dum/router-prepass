import ReactJson from '@micro-frame/plugin-react/react.json';
import RouterServer from '@micro-frame/plugin-router';
import FragmentJson from '@micro-frame/plugin-fragment/fragment.json';
import ChunkJson from '@micro-frame/plugin-chunk/chunk.json';
import createMicroNode from '@micro-frame/utils/createMicroNode';
// import rootNode from '@example/app';

import { MicroNode } from '@micro-frame/utils/types';
import { RequestHandler, SetupProvides } from '../types';
import getPostData from '../utils/getPostData';

const plugins = {
  react: ReactJson,
  router: RouterServer,
  fragment: FragmentJson,
  chunk: ChunkJson,
};

const jsonProxy =
  (rootNode: MicroNode, setupProvides: SetupProvides): RequestHandler =>
  async (request, response) => {
    const [, , rawLevelId, pathname] = request.url.split('/');
    const levelIds = rawLevelId.split('-');
    levelIds.shift();

    const context = {
      levelId: '0',
      plugins,
      method: request.method.toLowerCase(),
      middleware: request.middleware,
      requestedLevelId: levelIds,
      payload: await getPostData(request),
      url: decodeURIComponent(pathname),
    };

    context.provides = await setupProvides(context);

    await createMicroNode(rootNode, context).then(
      (result) => {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(result));
      },
      (error) => {
        console.log(error);
        response.statusCode = 500;
        response.setHeader('Content-Type', 'application/json');
        response.end(error.toString() + '\n' + error.stack);
      },
    );
  };

export default jsonProxy;
