import categories from '../../mocks/categories.json';
import products from '../../mocks/products.json';
import hero from '../../mocks/hero.json';
import randomTimeout from '../../utils/randomTimeout';

export const getHero = async () => {
  await randomTimeout();

  return hero;
};
export const getProducts = async () => {
  await randomTimeout();

  return {
    products,
  };
};
export const getCategories = async () => {
  await randomTimeout(5000, 6000);
  // await randomTimeout();

  return {
    categories,
  };
};
