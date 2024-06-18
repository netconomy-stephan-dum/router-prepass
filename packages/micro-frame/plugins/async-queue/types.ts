import { MicroNode } from '@micro-frame/utils/types';
import { RenderContextSSR } from '@micro-frame/server/types';

export interface AsyncQueueNode {
  type: 'async';
  handler: (context: RenderContextSSR) => Promise<MicroNode>;
}
