import {useEffect} from 'react';
import styles from './Home.scss';
import { MicroNode } from '@micro-frame/utils/types';
import { IPrepassComponent } from '@micro-frame/plugin-react/types';

const Slider: IPrepassComponent = () => {
  useEffect(() => {
    console.log('hello hydration');
  }, []);

  return <h1 className={styles.home}>home</h1>;
}
Slider.asyncData = (context) => {
  context.setHead([{ tagName: 'title', children: ['hello home'] }])
};

const Home: MicroNode[] = [
  {
    type: 'react',
    wrapper: { tagName: 'section' },
    component: Slider,
  }
];

export default Home;
