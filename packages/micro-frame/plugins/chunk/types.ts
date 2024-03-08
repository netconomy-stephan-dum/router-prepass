import {MicroNode} from "@example/server/types";

export interface ChunkNode {
  type: 'chunk';
  chunkName: string;
  chunk: () => Promise<MicroNode | { default: MicroNode; }>;
  aboveFold: boolean;
}