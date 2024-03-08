import {FunctionComponent} from "react";
import {RenderContext, TemplateNode} from "@micro-frame/utils/types";

export interface IPrepassComponent<Props = {}> extends FunctionComponent <Props> {
  asyncData?: (context: RenderContext) => Promise<Props | void> | Props | void;
}
export interface ReactNode {
  type: 'react';
  component: IPrepassComponent;
  aboveFold?: boolean;
  props?: unknown;
  wrapper?: TemplateNode;
}