import createMicroNode from "@micro-frame/utils/createMicroNode";
import { NodeTypes } from "@micro-frame/server/types";
import {ChunkNode} from "./types";

const chunk: NodeTypes<ChunkNode> = async ({ chunkName, chunk: chunkFactory, aboveFold }, parentContext) => {
  const { assetsByChunkName, setAssets } = parentContext;

  const chunk = await chunkFactory().then((mod) => 'default' in mod ? mod.default : mod);

  const childContext = {
    ...parentContext,
    chunkName,
    aboveFold: aboveFold || parentContext.aboveFold
  };

  setAssets(
    [...(assetsByChunkName[chunkName] || [])],
    childContext.aboveFold
  );

  return createMicroNode(chunk, childContext);
};

chunk.key = 'chunk';

export default chunk;
