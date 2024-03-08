export interface RenderContext {
  chunkName: string;
  aboveFold: boolean;
  assetsByChunkName: Record<string, string[]>;
  levelId: number;
  setLevelId: () => number;
  setHead: (node?: TemplateNode[], statusCode?: number | false) => void;
}

export interface TemplateProps {
  [key: string]: unknown;
  root?: string;
}

export type TemplateTagName = string;
export interface TemplateNodeObject {
  tagName: TemplateTagName;
  data?: Record<string, string>;
  props?: TemplateProps;
  children?: TemplateNode[];
}

export type TemplateNode = TemplateNodeObject | string;

export type TemplateNodeFactory = (context: RenderContext) => TemplateNode;
export type TemplateDescriptor = TemplateNodeFactory | TemplateNode;

export interface PnPLocation {
  pathname: string;
  hash: string;
  search: string;
}
export interface MicroNode {
  type: string;
  [index: string]: any;
}

export type NodeResult = MicroNode | MicroNode[];
type NodeFactory = (context: RenderContext, isHydrate?: boolean) => NodeResult;


export type StreamNode = NodeResult | NodeFactory;