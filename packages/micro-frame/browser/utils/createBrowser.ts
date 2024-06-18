import createMicroNode from '@micro-frame/utils/createMicroNode';
import { PnPNode, RenderContextBrowser, SetupProvides } from '../types';
import addFormListener from './addFormListener';
import addAnchorListener from './addAnchorListener';
import createElement from '@micro-frame/utils/createElement.client';
import { MicroNode, TemplateNode } from '@micro-frame/utils/types';
import plugins from '@micro-frame/utils/plugins';
import createIntersectionObserver from './createIntersectionObserver';

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
    return assetTypes.mjs(src.replace(/\.jsm$/, '.mjs'));
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
// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};
const activeAssets: Record<string, ActiveAsset> = {};
const setAssets = (assets: string[]) => {
  return Promise.all(
    assets.map((rawAsset) => {
      if (!(rawAsset in activeAssets)) {
        const assetNode = createAsset(rawAsset);

        const promise = new Promise((resolve) => {
          assetNode.onload = resolve;
        }).then(noop);

        document.head.appendChild(assetNode);
        activeAssets[rawAsset] = {
          usage: 0,
          node: assetNode,
          promise,
        };
      }

      const asset = activeAssets[rawAsset];
      asset.usage += 1;

      return asset.promise;
    }),
  ).then(noop);
};
const removeAssets = (assets: string[]) => {
  assets.forEach((rawAsset) => {
    const asset = activeAssets[rawAsset];
    asset.usage -= 1;

    if (asset.usage === 0) {
      delete activeAssets[rawAsset];
      document.head.removeChild(asset.node);
    }
  });
};

const createBrowser = async (rootNode: MicroNode, setupProvides: SetupProvides) => {
  // const isHydration = true;
  const setHead = (meta: TemplateNode[] = [], levelId: string, isHydration: boolean) => {
    if (!isHydration) {
      meta.forEach((child) => {
        const element = createElement(child, context);

        if (typeof child !== 'string') {
          (element as HTMLElement).dataset.chunk = String(levelId);
        }
        document.head.appendChild(element);
      });
    }
  };

  const renderQueue: Promise<() => Promise<void> | void>[] = [];
  const context: RenderContextBrowser = {
    groups: {},
    registerLazy: createIntersectionObserver(),
    method: 'get',
    node: document.body,
    location: {
      fullPathname: document.location.pathname,
      ...document.location,
    },
    state: {
      // TODO: this depends on server response
      method: 'get',
      data: {},
    },
    levelId: '0',
    queueResponse: (...args) => {
      renderQueue.push(...args);
    },
    setHead(meta, isHydration) {
      return setHead(meta, this.levelId, isHydration);
    },
    aboveFold: false,
    removeAssets,
    chunkName: 'root',
    setAssets,
    plugins,
    provides: {},
    assetsByChunkName: window.assetsByChunkName,
  };

  context.provides = (await setupProvides(context)) || {};
  const root = await createMicroNode<PnPNode>(rootNode, context, true);

  const flushQueue = async () => {
    const queue = renderQueue.slice();
    renderQueue.length = 0;

    await queue.reduce((currentPromise, node) => {
      return currentPromise.then(() => node).then((handler) => handler());
    }, Promise.resolve());
  };

  const navigate = root.navigate;
  root.navigate = async (...args) => {
    await navigate(...args);
    await flushQueue();
  };

  await flushQueue();

  addAnchorListener(root);
  addFormListener(root);
};

export default createBrowser;
