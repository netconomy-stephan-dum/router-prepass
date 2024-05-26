const path = require('node:path');
const { IgnorePlugin } = require('webpack');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const { StatsWriterPlugin } = require('webpack-stats-plugin');
// const WorkboxPlugin = require('workbox-webpack-plugin');

// const allowedExtensions = ['.js', '.mjs'];
module.exports = () => {
  return {
    mode: 'development',
    target: 'web',
    entry: {
      browser: require.resolve('./index.ts'),
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '...'],
      mainFields: ['browser', 'module', 'main'],
      alias: {},
    },
    module: {
      rules: [
        {
          type: 'asset',
          test: /\.(ico|png|jpe?g|gif|woff2?|ttf|otf)$/,
        },
        {
          test: /\.[jt]sx?$/,
          loader: require.resolve('ts-loader'),
          options: {
            transpileOnly: true,
            configFile: path.join(__dirname, './tsconfig.json'),
          },
        },
        {
          test: /\.(c|s[ca])ss$/,
          type: 'javascript/auto',
          use: [
            MiniCSSExtractPlugin.loader,
            {
              loader: require.resolve('css-loader'),
              options: {
                modules: true,
              },
            },
          ],
        },
      ],
    },
    output: {
      path: path.join(__dirname, '.dist/public'),
      filename: './[name].js',
      publicPath: '/',
    },
    optimization: {
      providedExports: true,
      sideEffects: true,
    },
    plugins: [
      new MiniCSSExtractPlugin({
        runtime: false,
      }),
      new IgnorePlugin({
        resourceRegExp: /\.api\.[jt]sx?$/,
      }),
      // new WorkboxPlugin.GenerateSW({
      //   clientsClaim: true,
      //   skipWaiting: true,
      // }),
      new StatsWriterPlugin({
        filename: './stats.json',
        fields: ['assetsByChunkName', 'entrypoints'],
        transform: (stats) => {
          const { assetsByChunkName, entrypoints, hash } = stats;
          const entry = Object.keys(entrypoints)[0];
          return JSON.stringify({
            hash,
            assetsByChunkName,
            entry,
          });
        },
      }),
    ],
  };
};
