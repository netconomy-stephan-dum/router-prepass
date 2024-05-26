import { FunctionComponent } from 'react';
import styles from './footer.scss';

const Footer: FunctionComponent = () => (
  <ul className={styles.footer}>
    <li>
      <a href="/imprint">Imprint</a>
    </li>
  </ul>
);

export default {
  type: 'react',
  cacheKey: 'Footer',
  wrapper: { tagName: 'footer', props: { className: styles.footer } },
  component: Footer,
};
