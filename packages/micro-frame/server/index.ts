import createServer from './utils/createServer';
// import { createServer } from 'node:http';
declare global {
  const ROOT_NODE: string;
  const PROVIDES: string;
  const MIDDLEWARE: string;
}

(async () => {
  console.log(ROOT_NODE, PROVIDES, MIDDLEWARE);
  const rootNode = (await import(ROOT_NODE)).default;
  const setupProvides = PROVIDES && (await import(PROVIDES)).default;
  const setupMiddleware = MIDDLEWARE && (await import(MIDDLEWARE)).default;
  await createServer({ setupMiddleware, rootNode, setupProvides });
})();
