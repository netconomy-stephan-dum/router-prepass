import { Derefer } from './createDerefer';

export interface RenderContext {
  method: 'get' | 'post';
  chunkName: string;
  groups: Record<string, string>;
  aboveFold: boolean;
  assetsByChunkName: Record<string, string[]>;
  levelId: string;
  provides: Record<string, Derefer>;
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
  fullPathname: string;
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
