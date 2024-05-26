import styles from './Home.scss';
import { IPrepassComponent } from '@micro-frame/plugin-react/types';
import { get } from './Home.api';
import { Product } from '../Product/Product.api';
import { Category } from '../Category/Category.api';
interface HomeProps {
  categories: Category[];
  products: Product[];
}
const Home: IPrepassComponent<HomeProps> = ({ categories, products }) => {
  return (
    <>
      <h1>Home</h1>
      <section className={styles.list}>
        {categories.map(({ name, categoryId, img }) => (
          <a key={categoryId} href={`/category/${categoryId}`}>
            <h2>{name}</h2>
            <img src={img} width="200" height="136" alt="" />
          </a>
        ))}
      </section>
      <section className={styles.list}>
        {products.map(({ name, productId, img }) => (
          <a key={productId} href={`/product/${productId}`}>
            <h2>{name}</h2>
            <img src={img} width="200" height="136" alt="" />
          </a>
        ))}
      </section>
    </>
  );
};

Home.meta = () => {
  return [{ tagName: 'title', children: ['hello home'] }];
};

Home.get = get;

export default [
  {
    type: 'react',
    wrapper: { tagName: 'article' },
    component: Home,
  },
];
