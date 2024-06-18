import categories from '../../mocks/categories.json';
import products from '../../mocks/products.json';
import { RenderContext } from '@micro-frame/utils/types';
import randomTimeout from '../../utils/randomTimeout';
import inlineRemoteImage from '../../utils/inlineRemoteImage';

export interface Category {
  name: string;
  categoryId: number;
  img: {
    src: string;
    width: string;
    height: string;
    alt: string;
  };
}
export const get = async ({ groups }: RenderContext) => {
  await randomTimeout();

  const category = categories.find(({ categoryId }) => groups.categoryId === categoryId.toString());
  if (!category) {
    throw new Response('', { status: 404 });
  }
  return {
    ...category,
    img: {
      ...category.img,
      src: await inlineRemoteImage(category.img.src),
    },
    products: products.filter(({ categoryId }) => groups.categoryId === categoryId.toString()),
  };
};
