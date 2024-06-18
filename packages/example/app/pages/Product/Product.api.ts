import products from '../../mocks/products.json';
import { RenderContext } from '@micro-frame/utils/types';
import randomTimeout from '../../utils/randomTimeout';
import inlineRemoteImage from '../../utils/inlineRemoteImage';

export interface Product {
  name: string;
  productId: number;
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

  const product = (products as Product[]).find(
    ({ productId }) => groups.productId === productId.toString(),
  );
  if (!product) {
    throw new Response('', { status: 404 });
  }

  return {
    ...product,
    img: {
      ...product.img,
      src: await inlineRemoteImage(product.img.src),
    },
  };
};
