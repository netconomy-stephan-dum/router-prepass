import { Readable } from 'stream';
import { RenderContext, TemplateNode } from '@micro-frame/utils/types';

export type QueueResponseTypes = string | Readable;
export type QueueResponse = (promise: Promise<QueueResponseTypes> | QueueResponseTypes) => void;
export type SetAssets = (assets: string[], levelId: string, aboveFold?: boolean) => void;

export interface RenderContextSSR extends RenderContext {
  isSent: () => boolean;
  requestedLevelId: string;
  payload: Record<string, string>;
  setHead: (node: TemplateNode[], statusCode?: number | false) => void;
  queueResponse: QueueResponse;
  setAssets: SetAssets;
  url: string;
}

export interface NodeTypes<Node = any> {
  (node: Node, context: RenderContextSSR, isHydrate?: boolean): Promise<void> | void;
  key: string;
}
