export const get = (context) => {
  context.setHead([{ tagName: 'title', children: ['error'] }], 404);
};
