import { RenderContext } from '@micro-frame/utils/types';

interface MicroConfig {
  language: string | ((context: RenderContext) => string);
  provides: string; // path to root provides
  server: {
    timeout?: number; // timeout in milliseconds default to 5000
    compress?: boolean; // default false
    port?: number; // default 3001 or fallback with npm package to search for open port?
    // if this is not set then its http1
    https?: {
      cert: string;
      key: string;
    };
    middleware: string; // path to middleware, default require.resolve('middleware')
  };
}
