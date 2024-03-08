import { PnPNodeConstructor, PnPNode } from "@micro-frame/browser/types";
import { ChunkNode } from "./types";
import createMicroNode from '@micro-frame/utils/createMicroNode';

const chunk: PnPNodeConstructor<ChunkNode> = async ({ chunkName, chunk: chunkFactory }, parentContext, isHyrate) => {
  const { assetsByChunkName } = parentContext;

  const assets = !isHyrate ? assetsByChunkName[chunkName] || [] : [];

  await parentContext.setAssets(assets);

  const chunk = await chunkFactory().then((mod) => 'default' in mod ? mod.default : mod);

  const node = await createMicroNode<PnPNode>(chunk, parentContext, isHyrate);

  return {
    navigate: (...args) => {
      return node.navigate?.(...args);
    },
    unload: () => {
      parentContext.removeAssets(assets);
      node.unload();
    }
  }
}

chunk.key = 'chunk';

export default chunk;
