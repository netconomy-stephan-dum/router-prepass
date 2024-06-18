import { PnPNodeConstructor, PnPNode } from '@micro-frame/browser/types';
import { ChunkNode } from './types';
import createMicroNode from '@micro-frame/utils/createMicroNode';

const chunk: PnPNodeConstructor<ChunkNode> = async (
  { hydrate = true, chunkName, chunk: chunkFactory },
  parentContext,
  isHydrate,
) => {
  if (!hydrate && isHydrate) {
    const elements = [
      ...Array.from(document.querySelectorAll(`[data-chunk^="${parentContext.levelId}"]`)),
      ...Array.from(document.querySelectorAll(`[data-frame^="${parentContext.levelId}"]`)),
    ];
    return {
      unload: () => {
        console.log('unload');
        elements.forEach((element) => {
          element.parentNode.removeChild(element);
        });
      },
    };
  }
  const { assetsByChunkName } = parentContext;

  const assets = !isHydrate ? assetsByChunkName[chunkName] || [] : [];

  await parentContext.setAssets(assets);

  const chunk = await chunkFactory().then((mod) => ('default' in mod ? mod.default : mod));

  const node = await createMicroNode<PnPNode>(chunk, parentContext, isHydrate);

  return {
    navigate: (...args) => {
      return node.navigate?.(...args);
    },
    unload: () => {
      console.log('unload');
      parentContext.removeAssets(assets);
      return node.unload();
    },
  };
};

chunk.key = 'chunk';

export default chunk;
