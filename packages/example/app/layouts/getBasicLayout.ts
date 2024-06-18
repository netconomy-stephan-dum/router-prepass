import styles from '../Layout.scss';
import { MicroNode } from '@micro-frame/utils/types';
import favicon from '../assets/favicon.ico';
import font from '../assets/Sans-Variable.woff2';

const getBasicLayout = (children: MicroNode[]): MicroNode => ({
  type: 'fragment',
  earlyHints: [
    {
      path: font,
      as: 'font',
    },
    {
      path: 'https://media.xxxlutz.com',
      rel: 'preconnect',
    },
  ],
  meta: [
    {
      tagName: 'meta',
      props: {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, minimum-scale=1, shrink-to-fit=no',
      },
    },
    { tagName: 'link', props: { rel: 'icon', type: 'image/x-icon', href: favicon } },
  ],
  children: [
    {
      type: 'chunk',
      chunk: () => import(/* webpackChunkName: "Navi" */ './components/Navi'),
      chunkName: 'Navi',
      hydrate: false,
      aboveFold: true,
    },
    {
      type: 'fragment',
      wrapper: { tagName: 'main', props: { className: styles.main } },
      children,
    },
    {
      type: 'chunk',
      chunk: () => import(/* webpackChunkName: "Footer" */ './components/Footer'),
      chunkName: 'Footer',
      aboveFold: true,
      hydrate: false,
    },
  ],
});

export default getBasicLayout;
