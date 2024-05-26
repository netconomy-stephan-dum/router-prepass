import path from 'path';
import { createReadStream } from 'fs';
import { Readable } from 'stream';

const assetFactories: Record<
  string,
  (
    asset: string,
    levelId: string,
    aboveFold?: boolean,
    base?: string,
  ) => string | Readable | Array<string | Readable>
> = {
  css: (href, levelId, aboveFold, base = '') => {
    if (aboveFold) {
      return [
        `<style data-chunk="${levelId}">`,
        createReadStream(path.join(base, href)),
        `</style>`,
      ];
    }
    return `<link data-chunk='${levelId}' rel="stylesheet" href="/${href}" />`;
  },
  js: (href, levelId, aboveFold, base = '') => {
    // if (aboveFold) {
    //   return [`<script data-chunk="${levelId}">`, createReadStream(path.join(base, href)), `</script>`];
    // }
    // return `<link data-chunk="${levelId}" rel="preload" as="script" href="/${href}" />`
    return `<script data-chunk="${levelId}" src="/${href}" type='text/javascript' defer></script>`;
  },
  mjs: (href, levelId) =>
    `<link data-chunk="${levelId}" rel="modulepreload " href="/${href.replace(
      /\.mjs$/,
      '.js',
    )}" />`,
  jsm: (href, levelId) => assetFactories.mjs(href.replace(/\.jsm$/, '.mjs'), levelId),
};

const createAsset = (asset: string, levelId: string, aboveFold = false, base = '') => {
  const ext = path.extname(asset).slice(1);
  const factory = assetFactories[ext];

  if (!factory) {
    throw new TypeError(`Unsupported file extension for "${asset}"!`);
  }

  return factory(asset, levelId, aboveFold, base);
};

export default createAsset;
