import { RenderContextSSR } from '../types';

interface CacheEntry<Node = any> {
  node: Promise<Node>;
  isStale: boolean;
  ttl: number;
}
interface CacheOptions {
  cacheKey?: string | ((context: RenderContextSSR) => string);
}

type Sync<CacheItem = unknown> = (
  options: CacheOptions,
  context: RenderContextSSR,
) => Promise<CacheItem>;

const cacheStorage: Record<string, CacheEntry> = {};
const TTL = 1000 * 60 * 5; // 5 minutes

const cache = <CacheItem = unknown>(
  options: CacheOptions,
  context: RenderContextSSR,
  sync: Sync<CacheItem>,
): Promise<CacheItem> => {
  const { cacheKey } = options;

  if (cacheKey) {
    const key = typeof cacheKey === 'function' ? cacheKey(context) : cacheKey;
    const cacheEntry: CacheEntry<CacheItem> = cacheStorage[key];
    const timestamp = new Date().getTime();

    if (cacheEntry) {
      const { isStale, ttl, node } = cacheEntry;
      if (!isStale && ttl < timestamp) {
        // renew cache
        cacheEntry.isStale = true;
        const newNode = sync(options, context);

        newNode
          .then(
            () => {
              cacheEntry.node = newNode;
              cacheEntry.ttl = timestamp + TTL;
            },
            (error) => {
              console.log('Revalidating cache', cacheKey, 'errored', error);
            },
          )
          .finally(() => {
            cacheEntry.isStale = false;
          });
      }

      return node;
    }

    const node = sync(options, context);

    node.then(() => {
      cacheStorage[key] = {
        node,
        isStale: false,
        ttl: timestamp + TTL,
      };
    });

    return node;
  }

  return sync(options, context);
};

export default cache;
