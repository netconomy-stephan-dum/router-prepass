import { join } from 'node:path';
import webpack from 'webpack';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import { StatsWriterPlugin } from 'webpack-stats-plugin';
import createCommonConfig from './common.js';
import { createRequire } from 'node:module';

const { IgnorePlugin, DefinePlugin, SourceMapDevToolPlugin } = webpack;
const require = createRequire(import.meta.url);

export default (env, options) => {
  const config = Object.assign(createCommonConfig(env, options, 'web'), {
    devtool: false,
    entry: {
      browser: require.resolve('@micro-frame/browser/index.ts'),
    },
    output: {
      filename: './[name].js',
      path: join(process.cwd(), 'dist/public'),
      publicPath: '/',
    },
    plugins: [
      new SourceMapDevToolPlugin({
        filename: 'sourcemaps/[file].map[query]',
        publicPath: '/',
      }),
      new DefinePlugin({
        PROVIDES: JSON.stringify(join(process.cwd(), 'provides')),
        ROOT_NODE: JSON.stringify(join(process.cwd(), 'index')),
      }),
      new MiniCSSExtractPlugin({
        runtime: false,
      }),
      new IgnorePlugin({
        resourceRegExp: /\.api\.[jt]sx?$/,
      }),
      new StatsWriterPlugin({
        fields: ['assetsByChunkName', 'entrypoints'],
        filename: './stats.json',
        transform: (stats) => {
          const { assetsByChunkName, entrypoints, hash } = stats;
          const [entry] = Object.keys(entrypoints);

          Object.entries(assetsByChunkName).forEach(([key, value]) => {
            assetsByChunkName[key] = value.filter(
              (pathName) => !pathName.endsWith('hot-update.js'),
            );
          });

          return JSON.stringify({
            assetsByChunkName,
            entry,
            hash,
          });
        },
      }),
    ],
  });

  config.resolve.extensions = [
    '.client.tsx',
    '.client.ts',
    '.client.jsx',
    '.client.js',
    ...config.resolve.extensions,
  ];

  return config;
};
