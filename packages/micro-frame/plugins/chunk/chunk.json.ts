import createMicroNode from "@micro-frame/utils/createMicroNode";
import { NodeTypes } from "@micro-frame/server/types";
import {ChunkNode} from "./types";

const chunk: NodeTypes<ChunkNode> = async ({ chunkName, chunk: chunkFactory, aboveFold }, parentContext) => {
  const chunk = await chunkFactory().then((mod) => 'default' in mod ? mod.default : mod);

  return createMicroNode(chunk, parentContext);
};

chunk.key = 'chunk';

export default chunk;
