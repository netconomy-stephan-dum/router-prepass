import { FunctionComponent } from 'react';
import { MicroNode, RenderContext, TemplateNode } from '@micro-frame/utils/types';
import { RenderContextSSR } from '@micro-frame/server/types';

export interface IPrepassComponent<Props = {}> extends FunctionComponent<Props> {
  get?: (context: RenderContext) => Promise<Props | void> | Props | void;
  post?: (context: RenderContext) => Promise<Props | void> | Props | void;
  meta?: (context: RenderContext, props: Props) => Promise<TemplateNode[]> | TemplateNode[];
}
export interface ReactNode {
  type: 'react';
  component: IPrepassComponent;
  aboveFold?: boolean;
  hydrate?: boolean | 'in-view';
  props?: unknown;
  wrapper?: TemplateNode;
  error?: FunctionComponent<Error>;
  cacheKey?: string | ((context: RenderContextSSR) => string);
}
