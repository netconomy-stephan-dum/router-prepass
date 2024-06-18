import path from 'node:path';
import createMicroNode from '@micro-frame/utils/createMicroNode';
import { NodeTypes } from '@micro-frame/server/types';
import { ChunkNode } from './types';

const chunk: NodeTypes<ChunkNode> = async (
  { hydrate = true, chunkName, chunk: chunkFactory, aboveFold },
  parentContext,
) => {
  const chunk = await chunkFactory().then((mod) => ('default' in mod ? mod.default : mod));
  const childContext = {
    ...parentContext,
    chunkName,
    aboveFold: aboveFold || parentContext.aboveFold,
  };

  const { assetsByChunkName, setAssets } = parentContext;
  const assets = [...(assetsByChunkName[chunkName] || [])];

  setAssets(
    hydrate ? assets : assets.filter((asset) => path.extname(asset) !== '.js'),
    parentContext.levelId,
    childContext.aboveFold,
  );

  return createMicroNode(chunk, childContext);
};

chunk.key = 'chunk';

export default chunk;
