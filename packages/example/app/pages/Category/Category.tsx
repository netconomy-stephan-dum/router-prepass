import styles from './Category.scss';
import { get, Category } from './Category.api';
import { Product } from '../Product/Product.api';
import { IPrepassComponent } from '@micro-frame/plugin-react/types';
interface CategoryProps extends Category {
  products: Product[];
}

const Category: IPrepassComponent<CategoryProps> = ({ name, img, products }) => {
  return (
    <>
      <h1>{name}</h1>
      <img {...img} />
      <section className={styles.list}>
        {products.map(({ name, img, productId }) => (
          <a key={productId} href={`/product/${productId}`}>
            <h2>{name}</h2>
            <img {...img} />
          </a>
        ))}
      </section>
    </>
  );
};

Category.meta = (context, { name }) => {
  return [
    { tagName: 'title', children: [name] },
    { tagName: 'meta', props: { name: 'description', content: `Welcome to Category ${name}!` } },
  ];
};

Category.get = get;

export default {
  type: 'react',
  wrapper: { tagName: 'article' },
  component: Category,
  aboveFold: true,
  hydrate: false,
};
