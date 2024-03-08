import { Readable } from 'stream';
import { RenderContext } from '@micro-frame/utils/types';

export type QueueResponseTypes = string | Readable;
export type QueueResponse = (promise: Promise<QueueResponseTypes> | QueueResponseTypes) => void;
export type SetAssets = (assets: string[], aboveFold?: boolean) => void;


export interface RenderContextSSR extends RenderContext {
  queueResponse: QueueResponse;
  setAssets: SetAssets;
  url: string;
}

export interface NodeTypes<Node = any> {
  (node: Node, context: RenderContextSSR, isHydrate?: boolean): Promise<void> | void;
  key: string;
}
