import ReactJson from '@micro-frame/plugin-react/react.json';
import RouterServer from '@micro-frame/plugin-router';
import FragmentJson from '@micro-frame/plugin-fragment/fragment.json';
import ChunkJson from '@micro-frame/plugin-chunk/chunk.json';
import createMicroNode from '@micro-frame/utils/createMicroNode';
import rootNode from '@example/app';
import { RequestHandler } from 'express';

const plugins = {
  react: ReactJson,
  router: RouterServer,
  fragment: FragmentJson,
  chunk: ChunkJson,
};

const jsonProxy: RequestHandler = async (request, response, next) => {
  const context = {
    levelId: '0',
    plugins,
    method: request.method.toLowerCase(),
    requestedLevelId: request.params.requestedLevelId,
    payload: request.body,
    url: decodeURIComponent(request.params.pathname),
  };

  await createMicroNode(rootNode, context).then(
    (result) => {
      response.json(result);
    },
    (error) => {
      console.log(error);
      response.status(500);
      response.json(error);
    },
  );
};

export default jsonProxy;
