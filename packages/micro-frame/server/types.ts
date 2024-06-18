import { Readable } from 'stream';
import { EarlyHint, RenderContext, TemplateNode } from '@micro-frame/utils/types';
import { Http2ServerRequest, Http2ServerResponse } from 'node:http2';

export type QueueResponseTypesPrimitives = string | Readable;
export type QueueResponseTypes = QueueResponseTypesPrimitives | QueueResponseTypesPrimitives[];
export type QueueResponsePromise = Promise<QueueResponseTypes> | QueueResponseTypes;
export type QueueResponse = (...promises: QueueResponsePromise[]) => void;

export type SetAssets = (assets: string[], levelId: string, aboveFold?: boolean) => void;

export interface RenderContextSSR extends RenderContext {
  isSent: () => boolean;
  earlyHints: EarlyHint[];
  middleware: Record<string, unknown>;
  requestedLevelId: string[];
  payload: Record<string, string>;
  setHead: (node: TemplateNode[], statusCode?: number | false) => void;
  queueResponse: QueueResponse;
  queueTail: QueueResponse;
  setAssets: SetAssets;
  url: string;
}

export interface NodeTypes<Node = any> {
  (node: Node, context: RenderContextSSR, isHydrate?: boolean): Promise<any> | any;
  key: string;
}

export type RequestHandler = (
  request: Http2ServerRequest,
  response: Http2ServerResponse,
) => Promise<void> | void;
export type SetupMiddleware = () => Promise<RequestHandler> | RequestHandler;
export type SetupProvides = (
  context: RenderContextSSR,
) => Promise<Record<string, unknown>> | Record<string, unknown>;
