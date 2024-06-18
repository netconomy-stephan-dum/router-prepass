import styles from './Navi.scss';
import { MicroNode } from '@micro-frame/utils/types';
import { IPrepassComponent } from '@micro-frame/plugin-react/types';
import { useEffect } from 'react';
const Navi: IPrepassComponent = () => {
  useEffect(() => {
    console.log('hydrated');
  }, []);
  return (
    <nav>
      <ul>
        <li className={styles.logo}>
          <a href="/">logo</a>
        </li>
      </ul>
    </nav>
  );
};

const NaviMicroNode: MicroNode = {
  type: 'react',
  cacheKey: 'Navi',
  hydrate: true,
  wrapper: { tagName: 'header', props: { className: styles.header } },
  component: Navi,
};

export default NaviMicroNode;
