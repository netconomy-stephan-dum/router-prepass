import { PnPNodeConstructor, PnPNode } from '@micro-frame/browser/types';
import { ChunkNode } from './types';
import createMicroNode from '@micro-frame/utils/createMicroNode';

const chunk: PnPNodeConstructor<ChunkNode> = async (
  { hydrate, chunkName, chunk: chunkFactory },
  parentContext,
  isHyrate,
) => {
  if (!hydrate && isHyrate) {
    const elements = [
      ...Array.from(document.querySelectorAll(`[data-chunk^="${parentContext.levelId}"]`)),
      ...Array.from(document.querySelectorAll(`[data-frame^="${parentContext.levelId}"]`)),
    ];
    return {
      unload: () => {
        elements.forEach((element) => {
          element.parentNode.removeChild(element);
        });
      },
    };
  }
  const { assetsByChunkName } = parentContext;

  const assets = !isHyrate ? assetsByChunkName[chunkName] || [] : [];

  await parentContext.setAssets(assets);

  const chunk = await chunkFactory().then((mod) => ('default' in mod ? mod.default : mod));

  const node = await createMicroNode<PnPNode>(chunk, parentContext, isHyrate);

  return {
    navigate: (...args) => {
      return node.navigate?.(...args);
    },
    unload: () => {
      parentContext.removeAssets(assets);
      node.unload();
    },
  };
};

chunk.key = 'chunk';

export default chunk;
