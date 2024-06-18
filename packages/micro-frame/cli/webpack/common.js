import { join } from 'node:path';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const createCommonWebpackConfig = (env, options, target) => {
  const { mode } = options;
  return {
    mode,
    module: {
      rules: [
        {
          generator: {
            emit: target === 'web',
          },
          test: /\.(ico|png|jpe?g|gif|woff2?|ttf|otf)$/,
          type: 'asset',
        },
        {
          loader: require.resolve('ts-loader'),
          options: {
            configFile: join(process.cwd(), './tsconfig.json'),
            transpileOnly: true,
          },
          test: /\.[jt]sx?$/,
        },
        {
          test: /\.(c|s[ca])ss$/,
          type: 'javascript/auto',
          use: [
            target === 'web' && MiniCSSExtractPlugin.loader,
            {
              loader: require.resolve('css-loader'),
              options: {
                modules: {
                  exportOnlyLocals: target === 'node',
                },
              },
            },
          ].filter(Boolean),
        },
      ],
    },
    name: `${target}-${mode}`,
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '...'],
    },
    stats: 'minimal',
    target,
  };
};

export default createCommonWebpackConfig;
