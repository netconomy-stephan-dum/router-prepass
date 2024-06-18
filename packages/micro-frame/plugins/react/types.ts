import { FunctionComponent } from 'react';
import { EarlyHint, MicroNode, RenderContext, TemplateNode } from '@micro-frame/utils/types';
import { RenderContextSSR } from '@micro-frame/server/types';

export interface IPrepassComponent<Props = {}, Options = {}> extends FunctionComponent<Props> {
  get?: (context: RenderContextSSR, options: Options) => Promise<Props | void> | Props | void;
  post?: (context: RenderContextSSR, options: Options) => Promise<Props | void> | Props | void;
  meta?: (context: RenderContext, props: Props) => Promise<TemplateNode[]> | TemplateNode[];
}
export interface ReactNode {
  type: 'react';
  component: IPrepassComponent;
  aboveFold?: boolean;
  statusCode?: number | false;
  hydrate?: boolean | 'in-view';
  props?: unknown;
  wrapper?: TemplateNode;
  error?: FunctionComponent<Error>;
  cacheKey?: string | ((context: RenderContextSSR) => string);
  earlyHints?: EarlyHint[];
  loading?: TemplateNode;
  customElements?: Record<string, CustomElementConstructor>;
  outOfOrder?: boolean;
  clientOnly?: boolean;
}
