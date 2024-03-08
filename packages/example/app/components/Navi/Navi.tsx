import styles from "./Navi.scss";
import {FunctionComponent} from "react";
import {MicroNode} from "@micro-frame/utils/types";

const naviData = [
  {
    href: '/faq',
    text: 'faq',
  },
  {
    href: 'http://light.localhost:8100',
    text: 'light',
  },
  {
    href: 'http://dark.localhost:8100',
    text: 'dark',
  },
];

const Navi: FunctionComponent = () => (
  <nav>
    <ul>
      <li className={styles.logo}>
        <a href="/">
          logo
        </a>
      </li>
      {naviData.map(({ href, text }) => (
        <li key={href}>
          <a href={href}>{text}</a>
        </li>
      ))}
    </ul>
  </nav>
);

const NaviMicroNode: MicroNode = {
  type: 'react',
  wrapper: { tagName: 'header', props: { className: styles.header } },
  component: Navi,
};

export default NaviMicroNode;
