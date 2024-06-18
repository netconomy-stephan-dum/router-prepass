import { MicroNode, RenderContext, TemplateNode } from '@micro-frame/utils/types';
import microFetch from '@micro-frame/utils/microFetch';
import { CMSComponent, get } from './CMS.api';
import { IPrepassComponent } from '@micro-frame/plugin-react/types';

const getChildren = (components: CMSComponent[], context: RenderContext) =>
  components.map((component) => {
    return possibleNodes[component.type](component.props || {}, component.children || [], context);
  });
interface CMSProps {
  components: CMSComponent[];
  meta: unknown[];
}
interface CMSVariables {
  position: string;
}
const CMS: IPrepassComponent<CMSProps, CMSVariables> = () => {
  return null;
};

CMS.get = get;

// interface ProductTileProps {
//   props: {
//     name: string;
//   };
// }

// const ProductTile = ({ props: { name } }: ProductTileProps) => {
//   return <div>{name}</div>;
// };

// const possibleTags: Record<string, FunctionComponent<{ props: any; children?: CMSComponent[] }>> = {
//   ProductTile,
// };

// interface HTMLProps {
//   props: TemplateNode;
//   children: CMSComponent[];
// }

// const HTML = ({ props, children }: HTMLProps) => {
//   children.map(({ type, props, children }) => {
//     const Component = possibleTags[type] || type;
//     return <Component props={props} children={children} />;
//   });
//   return null;
// };

const HTMLNode = (props: TemplateNode, children: CMSComponent[], context: RenderContext) => {
  return {
    type: 'fragment',
    wrapper: props,
    children: getChildren(children, context),
  };
};

type PossibleNode = (props: any, children: CMSComponent[], context: RenderContext) => MicroNode;

const Hero = () => {
  return <div>hero</div>;
};

const HeroNode = () => {
  return {
    type: 'react',
    component: Hero,
  };
};

const ProductSlider = () => {
  return <div>Product Slider</div>;
};
const ProductSliderNode = () => {
  return {
    type: 'react',
    component: ProductSlider,
  };
};

const possibleNodes: Record<string, PossibleNode> = {
  html: HTMLNode,
  hero: HeroNode,
  ProductSlider: ProductSliderNode,
};
export const getCMSConfig = (props: Record<string, unknown> = {}) => ({
  type: 'async-queue',
  handler: async (context: RenderContext, isHydrate: boolean): Promise<MicroNode> => {
    const data = await microFetch(CMS, context, isHydrate);
    const children = getChildren(data.components, context);

    return {
      type: 'fragment',
      children,
    };
  },
});

const CMSConfig = getCMSConfig();

export default CMSConfig;
