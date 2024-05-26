import { RenderContextSSR } from '@micro-frame/server/types';
import createDerefer from '@micro-frame/utils/createDerefer';
import { FragmentNode } from './types';

const setupProvides = (subContext: RenderContextSSR, provides: FragmentNode['provides']) => {
  Object.keys(provides).forEach((key) => {
    subContext.provides[key] = createDerefer();
  });
  Object.entries(provides).forEach(([key, value]) => {
    const { resolve, reject } = subContext.provides[key];
    Promise.resolve(value(subContext)).then(resolve, reject);
  });
}

export default setupProvides;
