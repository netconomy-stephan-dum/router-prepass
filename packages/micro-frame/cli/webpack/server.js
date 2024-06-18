import { join } from 'node:path';
import { createRequire } from 'node:module';
// import { fileURLToPath } from 'node:url';
import webpack from 'webpack';
// import nodeExternals from 'webpack-node-externals';
import createCommonConfig from './common.js';

const { DefinePlugin, IgnorePlugin } = webpack;
const require = createRequire(import.meta.url);
// const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default (env, options) => {
  const config = Object.assign(createCommonConfig(env, options, 'node'), {
    devtool: 'source-map',
    entry: {
      server: require.resolve('@micro-frame/server/index.ts'),
    },
    // externals: [
    // nodeExternals({
    //   additionalModuleDirs: [join(__dirname, '../../../../node_modules')],
    //   allowlist: [/@micro-frame/],
    // }),
    // ],
    externalsPresets: { node: true },
    externalsType: 'node-commonjs',
    output: {
      filename: './[name].js',
      path: join(process.cwd(), 'dist/private'),
      publicPath: '/',
    },
    plugins: [
      // new IgnorePlugin({
      //   resourceRegExp: /\.client/,
      // }),
      new DefinePlugin({
        MIDDLEWARE: JSON.stringify(join(process.cwd(), 'middleware')),
        PROVIDES: JSON.stringify(join(process.cwd(), 'provides')),
        ROOT_NODE: JSON.stringify(join(process.cwd(), 'index')),
      }),
    ],
  });

  config.module.rules.push({
    loader: require.resolve('null-loader'),
    test: /\.client\.[ts]sx?$/,
  });
  config.resolve.extensions = [
    '.server.tsx',
    '.server.ts',
    '.server.jsx',
    '.server.js',
    ...config.resolve.extensions,
  ];

  return config;
};
