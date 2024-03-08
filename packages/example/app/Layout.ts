import styles from './Layout.scss';
import Footer from './components/Footer';
import {MicroNode} from "@micro-frame/utils/types";

const Root: MicroNode[] = [
  {
    type: "chunk",
    chunk: () => import(/* webpackChunkName: "Navi" */ './components/Navi'),
    chunkName: 'Navi',
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
            chunk: () => import(/* webpackChunkName: "Home" */ './components/Home'),
          },
          {
            path: /^\/imprint$/,
            chunkName: 'Imprint',
            chunk: () => import(/* webpackChunkName: "Imprint" */ './components/Imprint'),
          },
          {
            path: /^\/faq/,
            chunkName: 'FAQ',
            chunk: () => import(/* webpackChunkName: "FAQ" */ './components/FAQ'),
          },
          {
            chunkName: 'Error404',
            chunk: () => import(/* webpackChunkName: "Error404" */ './components/Error404'),
          }
        ],
      },
    ]
  },
  {
    type: 'react',
    wrapper: { tagName: 'footer', props: { className: styles.footer }},
    component: Footer,
  }
];

export default Root;
