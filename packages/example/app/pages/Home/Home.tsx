import styles from './Home.scss';
import { IPrepassComponent } from '@micro-frame/plugin-react/types';
import { getProducts, getCategories, getHero } from './Home.api';
import { Product } from '../Product/Product.api';
import { Category } from '../Category/Category.api';
import Loading from '../../components/Loading';
import { DOMAttributes } from 'react';
import Slider from '../../components/Slider/Slider.client';

interface HeroProps {
  desktop: string;
  mobile: string;
}

type CustomElement<T = {}> = Partial<T & DOMAttributes<T> & { children: any }>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['micro-slider']: CustomElement;
    }
  }
}

const Hero: IPrepassComponent<HeroProps> = (hero) => (
  <>
    <source srcSet={hero.mobile + ' 100w'} sizes="100vw" media="(max-width: 599px)" />
    <source srcSet={hero.desktop + ' 100w'} sizes="100vw" media="(min-width: 600px)" />
    <img src={hero.desktop} sizes="100vw" alt="hero" />
  </>
);

Hero.meta = (context, { mobile, desktop }) => {
  return [
    { tagName: 'title', children: ['hello home'] },
    { tagName: 'meta', props: { name: 'description', content: 'the home page' } },
    {
      tagName: 'link',
      props: {
        rel: 'preload',
        type: 'image/webp',
        fetchpriority: 'high',
        as: 'image',
        href: mobile,
        media: '(max-width: 599px)',
      },
    },
    {
      tagName: 'link',
      props: {
        rel: 'preload',
        type: 'image/webp',
        fetchpriority: 'high',
        as: 'image',
        href: desktop,
        media: '(min-width: 600px)',
      },
    },
  ];
};

Hero.get = getHero;

interface CategoriesProps {
  categories: Category[];
}

interface ProductsProps {
  products: Product[];
}

const Categories: IPrepassComponent<CategoriesProps> = ({ categories }) => {
  return categories.map(({ name, categoryId, img }) => (
    <a key={categoryId} href={`/category/${categoryId}`}>
      <h2>{name}</h2>
      <img loading="lazy" {...img} />
    </a>
  ));
};

Categories.get = getCategories;
const Products: IPrepassComponent<ProductsProps> = ({ products }) => {
  return (
    <micro-slider>
      {products.map(({ name, productId, img }, index) => (
        <a key={productId} href={`/product/${productId}`}>
          <h2>{name}</h2>
          <img loading="lazy" {...img} />
        </a>
      ))}
    </micro-slider>
  );
};

Products.get = getProducts;

export default [
  {
    type: 'react',
    wrapper: { tagName: 'picture', props: { className: styles.hero } },
    component: Hero,
    aboveFold: true,
    hydrate: false,
  },
  {
    type: 'react',
    wrapper: { tagName: 'section', props: { className: styles.list } },
    component: Products,
    aboveFold: true,
    hydrate: false,
    customElements: {
      'micro-slider': Slider,
    },
  },
  {
    type: 'react',
    wrapper: { tagName: 'section', props: { className: styles.list } },
    component: Categories,
    aboveFold: false,
    hydrate: false,
    // outOfOrder: true,
    // clientOnly: true,
    loading: Loading,
  },
];
