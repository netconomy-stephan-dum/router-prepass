import { IPrepassComponent } from '@micro-frame/plugin-react/types';

const Imprint: IPrepassComponent = () => (
  <h1>Imprint</h1>
);

Imprint.asyncData = (context) => {
  context.setHead([{ tagName: 'title', children: ['hello imprint'] }])
}
const ImprintMicroNode = [
  {
    type: 'react',
    wrapper: { tagName: 'section' },
    component: Imprint,
  }
];
export default ImprintMicroNode;
