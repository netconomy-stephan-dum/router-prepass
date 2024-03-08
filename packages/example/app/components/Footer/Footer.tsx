import { FunctionComponent } from 'react';
import styles from './footer.scss';

const Footer: FunctionComponent = () => (
  <ul className={styles.footer}>
     <li>
       <a target="_blank" href="https://icons8.com">All icons from Icons8.com</a>
     </li>
     <li>
       <a href="/imprint">Imprint</a>
     </li>
   </ul>
)

export default Footer;
