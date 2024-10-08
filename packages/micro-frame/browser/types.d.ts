import { PnPLocation, StreamNode, RenderContext, TemplateNode } from '@micro-frame/utils/types';

declare global {
  interface Window {
    assetsByChunkName: RenderContext['assetsByChunkName'];
  }
}

export interface VirtualNode {
  node: Element;
  split: () => VirtualNode;
  fork: (newChild: Element, isHydrate: boolean) => VirtualNode;
}
export interface RenderContextBrowser extends RenderContext {
  state?: FormState;
  queueResponse: (...promise: Promise<() => Promise<void> | void>[]) => void;
  registerLazy: (target: Element, lazyHandler: () => Promise<void> | void) => () => void;
  node: Element;
  location: PnPLocation;
  setHead: (meta: TemplateNode[], isHydration: boolean) => void;
  setAssets: (asset: string[]) => Promise<void>;
  removeAssets: (assets: string[]) => void;
}

export interface FormState {
  method: string;
  data: Record<string, unknown>;
}

export interface PnPNode {
  navigate?: (location: PnPLocation, state: FormState, isHydrate: boolean) => Promise<void>;
  unload: () => void | Promise<void>;
}

export interface PnPNodeConstructor<Node = StreamNode> {
  (node: Node, context: RenderContextBrowser, isHydrate: boolean): PnPNode | Promise<PnPNode>;
  key: string;
}

export type Init = (
  rootLibraryName: string,
  rootContainer: string,
  htmlElement: HTMLElement,
) => Promise<void>;

export type SetupProvides = (
  context: RenderContextBrowser,
) => Promise<Record<string, unknown>> | Record<string, unknown>;
