import products from '../../data/products.json';
import { RenderContext } from '@micro-frame/utils/types';

export interface Product {
  name: string;
  productId: number;
  categoryId: number;
  img: string;
}
const simulateHTTP = (min = 100, max = 200) => {
  return new Promise((resolve) => {
    const delay = Math.floor(Math.random() * min) + max - min;
    setTimeout(resolve, delay);
  });
};
export const get = async ({ groups }: RenderContext) => {
  await simulateHTTP();
  const product = (products as Product[]).find(
    ({ productId }) => groups.productId === productId.toString(),
  );
  if (!product) {
    throw new Response('', { status: 404 });
  }
  // product.img = await fetch(product.img)
  //   .then((response) => response.arrayBuffer())
  //   .then((buffer) => {
  //     return `data:image/png;base64, ${Buffer.from(buffer).toString('base64')}`;
  //   });

  return product;
};
