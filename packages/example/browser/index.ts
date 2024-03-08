import createMicroNode from "@micro-frame/utils/createMicroNode";
import { PnPNode, RenderContextBrowser } from '@micro-frame/browser/types';
import addFormListener from "./utils/addFormListener";
import addAnchorListener from "./utils/addAnchorListener";
import rootNode from '@example/app';
import createElement from '@micro-frame/utils/createElement.client';

type AssetHandler = (asset: string) => HTMLMetaElement | HTMLScriptElement | HTMLLinkElement;

const assetTypes: Record<string, AssetHandler> = {
  css: (href) => {
    return Object.assign(document.createElement('link'), {
      rel: 'stylesheet',
      href: '/' + href,
    });
  },
  mjs: (src) => {
    return Object.assign(document.createElement('script'), {
      type: 'module',
      src: '/' + src,
    });
  },
  js: (src) => {
    return Object.assign(document.createElement('script'), {
      async: true,
      src: '/' + src.replace(/\.mjs$/, '.js'),
    });
  },
  jsm: (src) => {
    return assetTypes.mjs(src.replace(/\.jsm$/, '.mjs'),)
  },
};
const createAsset = (asset: string) => {
  const lastIndex = asset.lastIndexOf('.');
  if (lastIndex >= 0) {
    const extension = asset.slice(lastIndex + 1);
    if (extension in assetTypes) {
      return assetTypes[extension](asset);
    }
  }

  throw new ReferenceError(`No file extension given for ${asset}`);
};

interface ActiveAsset {
  usage: number;
  node: HTMLElement;
  promise: Promise<void>;
}
const activeAssets: Record<string, ActiveAsset> = {};
const setAssets = (assets: string[]) => {
  return Promise.all(
    assets.map((rawAsset) => {
      if (!(rawAsset in activeAssets)) {
        const assetNode = createAsset(rawAsset);

        const promise = new Promise((resolve) => {
          assetNode.onload = resolve;
        }).then(() => {});

        document.head.appendChild(assetNode);
        activeAssets[rawAsset] = {
          usage: 0,
          node: assetNode,
          promise,
        }
      }

      const asset = activeAssets[rawAsset];
      asset.usage += 1;

      return asset.promise;
    })
  ).then(() => {});
};
const removeAssets = (assets: string[]) => {
  assets.forEach((rawAsset) => {
    const asset = activeAssets[rawAsset];
    asset.usage -= 1;

    if(asset.usage === 0) {
      delete activeAssets[rawAsset];
      document.head.removeChild(asset.node);
    }
  });
};


document.addEventListener('DOMContentLoaded', async() => {
  let levelId = 0;
  let isHydration = true;

  const context: RenderContextBrowser = {
    node: document.body,
    location: document.location,
    levelId,
    setHead: (meta = []) => {
      if (!isHydration) {
        meta.forEach((child) => {
          const element = createElement(child, context);

          if (typeof child !== 'string') {
            (element as HTMLElement).dataset.chunk = String(levelId);
          }
          document.head.appendChild(element);
        });
      }
    },
    setLevelId: () => levelId += 1,
    aboveFold: false,
    removeAssets,
    chunkName: 'root',
    setAssets,
    assetsByChunkName: window.assetsByChunkName,
  };

  const root = await createMicroNode<PnPNode>(rootNode, context, isHydration);
  isHydration = false;

  addAnchorListener(root);
  addFormListener(root);
});
