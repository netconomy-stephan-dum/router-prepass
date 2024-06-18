import { EarlyHint, MicroNode, TemplateNode } from '@micro-frame/utils/types';

export interface FragmentNode {
  type: 'fragment';
  wrapper?: TemplateNode;
  children: MicroNode[];
  props?: unknown;
  meta?: TemplateNode[];
  statusCode?: number | false;
  earlyHints?: EarlyHint[];
}
