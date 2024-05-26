import { IPrepassComponent } from '@micro-frame/plugin-react/types';
import { get } from './Errror404.api';

const Error404: IPrepassComponent = () => <h1>error 404</h1>;

Error404.get = get;

const Error404MicroNode = [
  {
    type: 'react',
    wrapper: { tagName: 'section' },
    component: Error404,
  },
];
export default Error404MicroNode;
