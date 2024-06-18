import { IPrepassComponent } from '@micro-frame/plugin-react/types';
import { get, Product } from './Product.api';

const ProductDetail: IPrepassComponent<Product> = ({ name, img }) => {
  return (
    <>
      <h1>{name}</h1>
      <img {...img} />
    </>
  );
};

ProductDetail.meta = (context, { name, img }) => {
  return [
    { tagName: 'title', children: [name] },
    { tagName: 'meta', props: { name: 'description', content: `Welcome to product ${name}!` } },
  ];
};

ProductDetail.get = get;

export default {
  type: 'react',
  wrapper: { tagName: 'article' },
  component: ProductDetail,
  aboveFold: true,
  hydrate: false,
};
