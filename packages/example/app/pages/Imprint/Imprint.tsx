import { IPrepassComponent } from '@micro-frame/plugin-react/types';
const Imprint: IPrepassComponent = () => <h1>Imprint</h1>;

Imprint.meta = (context) => {
  return [{ tagName: 'title', children: ['hello imprint'] }];
};
const ImprintMicroNode = [
  {
    type: 'react',
    wrapper: { tagName: 'section' },
    component: Imprint,
  },
];
export default ImprintMicroNode;
