const devServer = {
  devServer: {
    allowedHosts: 'all',
    client: {
      logging: 'none',
      overlay: false,
      progress: false,
    },
    devMiddleware: {
      writeToDisk: true,
    },
    historyApiFallback: true,
    host: 'localhost',
    hot: true,
    port: 8111,
  },
  entry: {},
  infrastructureLogging: { level: 'error' },
  stats: false,
};

export default devServer;
