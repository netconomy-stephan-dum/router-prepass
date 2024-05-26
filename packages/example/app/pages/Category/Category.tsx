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
      <img src={img} alt="" width="200" height="136" />
      <section className={styles.list}>
        {products.map(({ name, img, productId }) => (
          <a key={productId} href={`/product/${productId}`}>
            <h2>{name}</h2>
            <img width="200" height="135" src={img} alt="" />
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

export default [
  {
    type: 'react',
    wrapper: { tagName: 'article' },
    component: Category,
  },
];
