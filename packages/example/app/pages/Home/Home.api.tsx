import categories from '../../data/categories.json';
import products from '../../data/products.json';

export const get = () => {
  return {
    products,
    categories,
  };
};
