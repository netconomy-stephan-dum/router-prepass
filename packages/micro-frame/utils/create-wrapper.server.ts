import { RenderContextSSR } from "@micro-frame/server/types";
import { TemplateNode } from "@micro-frame/utils/types";
import createElement from "./createElement.server";

const rootReg = /data-root(?:="[^"]+")?/;
const createWrapper = (Component: TemplateNode | undefined, context: RenderContextSSR) => {
  if (!Component) {
    return ['', ''];
  }

  if (typeof Component === 'string') {
    throw new TypeError('TextNode cant be a Wrapper!');
  }

  Component.data ||= {};
  Component.data.frame = `${context.levelId}`;

  const rawHTML = createElement(Component, context)
    .replace(rootReg, `data-root="${context.levelId}"`);
  const match = rawHTML.match(rootReg);
  const startIndex = match?.index || 0;
  const middle = rawHTML.indexOf('>', startIndex) + 1;

  return [
    rawHTML.slice(0, middle),
    rawHTML.slice(middle)
  ];
};

export default createWrapper;
