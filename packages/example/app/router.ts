import { RenderContext } from '@micro-frame/utils/types';
import { Provides } from './provides/types';

const router = (context: RenderContext<Provides>) => {
  const { routes } = context.provides;
  return {
    type: 'router',
    routes: [
      {
        path: '/',
        chunkName: 'Home',
        aboveFold: true,
        hydrate: true,
        chunk: () => import(/* webpackChunkName: "Home" */ './pages/Home'),
      },
      {
        path: routes.category,
        chunkName: 'Category',
        aboveFold: true,
        hydrate: false,
        chunk: () => import(/* webpackChunkName: "Category" */ './pages/Category'),
      },
      {
        path: routes.product,
        chunkName: 'Product',
        aboveFold: true,
        hydrate: false,
        chunk: () => import(/* webpackChunkName: "Product" */ './pages/Product'),
      },
      {
        path: routes.imprint,
        chunkName: 'Imprint',
        chunk: () => import(/* webpackChunkName: "Imprint" */ './pages/Imprint'),
      },
      {
        chunkName: 'Error404',
        chunk: () => import(/* webpackChunkName: "Error404" */ './components/Error404'),
      },
    ],
  };
};

export default router;
