import styles from './Layout.scss';
import { MicroNode } from '@micro-frame/utils/types';
import favicon from './assets/favicon.ico';
import font from './assets/Sans-Variable.woff2';

const Root: MicroNode = {
  type: 'fragment',
  meta: [
    {
      tagName: 'meta',
      props: {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, minimum-scale=1, shrink-to-fit=no',
      },
    },
    { tagName: 'link', props: { rel: 'icon', type: 'image/x-icon', href: favicon } },
    {
      tagName: 'link',
      props: { rel: 'preload', as: 'font', href: font, crossorigin: 'anonymous' },
    },
  ],
  children: [
    {
      type: 'chunk',
      chunk: () => import(/* webpackChunkName: "Navi" */ './components/Navi'),
      chunkName: 'Navi',
      hydrate: true,
      aboveFold: true,
    },
    {
      type: 'fragment',
      wrapper: { tagName: 'main', props: { className: styles.main } },
      children: [
        {
          type: 'router',
          routes: [
            {
              path: /^\/(home)?$/,
              chunkName: 'Home',
              aboveFold: true,
              hydrate: false,
              chunk: () => import(/* webpackChunkName: "Home" */ './pages/Home'),
            },
            {
              path: /^\/category\/(?<categoryId>[^\/]+)$/,
              chunkName: 'Category',
              aboveFold: true,
              hydrate: false,
              chunk: () => import(/* webpackChunkName: "Category" */ './pages/Category'),
            },
            {
              path: /^\/product\/(?<productId>[^\/]+)$/,
              chunkName: 'Product',
              aboveFold: true,
              hydrate: false,
              chunk: () => import(/* webpackChunkName: "Product" */ './pages/Product'),
            },
            {
              path: /^\/imprint$/,
              chunkName: 'Imprint',
              chunk: () => import(/* webpackChunkName: "Imprint" */ './pages/Imprint'),
            },
            {
              chunkName: 'Error404',
              chunk: () => import(/* webpackChunkName: "Error404" */ './components/Error404'),
            },
          ],
        },
      ],
    },
    {
      type: 'chunk',
      chunk: () => import(/* webpackChunkName: "Footer" */ './components/Footer'),
      chunkName: 'Footer',
      aboveFold: true,
      hydrate: false,
    },
  ],
};

export default Root;
