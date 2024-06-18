import { MicroNode } from '@micro-frame/utils/types';

export interface ChunkNode {
  type: 'chunk';
  chunkName: string;
  chunk: () => Promise<MicroNode | { default: MicroNode }>;
  aboveFold: boolean;
  hydrate?: boolean;
}
