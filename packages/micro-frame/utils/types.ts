import { Derefer } from './createDerefer';
import plugins from './plugins';

export interface RenderContext<Provides = Record<string, unknown>> {
  method: 'get' | 'post';
  chunkName: string;
  groups: Record<string, string>;
  aboveFold: boolean;
  assetsByChunkName: Record<string, string[]>;
  levelId: string;
  provides: Provides;
  plugins: typeof plugins;
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

export interface NodeTypes<Node = any, Context extends RenderContext = RenderContext> {
  (node: Node, context: Context, isHydrate?: boolean): Promise<any> | any;
  key: string;
}

export type EarlyHint = string | { path: string; rel?: 'preload' | 'preconnect'; as?: string };
