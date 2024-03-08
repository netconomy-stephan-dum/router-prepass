import { IPrepassComponent } from '@micro-frame/plugin-react/types';

const Error404: IPrepassComponent = () => (
  <h1>error 404</h1>
);

Error404.asyncData = (context) => {
  context.setHead([{ tagName: 'title', children: ['error'] }], 404)
}
const Error404MicroNode = [
  {
    type: 'react',
    wrapper: { tagName: 'section' },
    component: Error404,
  }
];
export default Error404MicroNode;
