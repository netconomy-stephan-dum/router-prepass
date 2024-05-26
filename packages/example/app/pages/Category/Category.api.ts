import categories from '../../data/categories.json';
import products from '../../data/products.json';
import { RenderContext } from '@micro-frame/utils/types';

export interface Category {
  name: string;
  categoryId: number;
  img: string;
}
export const get = ({ groups }: RenderContext) => {
  const category = categories.find(({ categoryId }) => groups.categoryId === categoryId.toString());
  if (!category) {
    throw new Response('', { status: 404 });
  }
  return {
    ...category,
    products: products.filter(({ categoryId }) => groups.categoryId === categoryId.toString()),
  };
};
