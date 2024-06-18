import { RenderContext, TemplateNode } from './types';

type CreateWrapper = (
  Component: TemplateNode | undefined,
  context: RenderContext,
) => [string, string];

const createWrapper: CreateWrapper = () => ['', ''];

export default createWrapper;
