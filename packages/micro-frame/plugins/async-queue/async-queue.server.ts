import { NodeTypes, QueueResponse, QueueResponsePromise } from '@micro-frame/server/types';
import { AsyncQueueNode } from './types';
import createMicroNode from '@micro-frame/utils/createMicroNode';
import { EarlyHint } from '@micro-frame/utils/types';

const asyncQueue: NodeTypes<AsyncQueueNode> = ({ handler }, context) => {
  const queue: QueueResponsePromise[] = [];
  const queueResponse: QueueResponse = (...args) => {
    queue.push(...args);
  };
  const subContext = {
    queueResponse,
    earlyHints: {
      push: (earlyHints: EarlyHint[]) => {
        throw new Error('Cant use early hints inside async-queue!\n' + JSON.stringify(earlyHints));
      },
    },
    ...context,
  };

  context.queueResponse(
    new Promise(async (resolve) => {
      const node = await handler(subContext);
      await createMicroNode(node, subContext);
      const promiseQueue = await Promise.all(queue).then((queueResponse) => queueResponse.flat());
      resolve(promiseQueue);
    }),
  );
};

asyncQueue.key = 'async-queue';

export default asyncQueue;
