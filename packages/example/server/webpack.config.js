const path = require('node:path');
const nodeExternals = require('webpack-node-externals');

module.exports = () => {
  return {
    devServer: {
      host: 'localhost',
      port: 8111,
      hot: true,
      allowedHosts: 'all',
      historyApiFallback: true,
      devMiddleware: {
        writeToDisk: true,
      },
    },
    mode: 'development',
    target: 'node',
    entry: {
      server: require.resolve('./index.ts'),
    },
    externals: [nodeExternals({
      modulesDir: path.resolve(__dirname, '../../../node_modules'),
      allowlist: [/@example/, /@micro-frame/],
    })],
    externalsType: 'node-commonjs',
    externalsPresets: { node: true },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '...'],
    },
    module: {
      rules: [
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
            {
              loader: require.resolve('css-loader'),
              options: {
                modules: {
                  exportOnlyLocals: true
                },
              }
            },
          ],
        }
      ]
    },
    output: {
      path: path.join(__dirname, '.dist/private'),
      filename: './[name].js',
    },
    plugins: [
    ]
  }
};