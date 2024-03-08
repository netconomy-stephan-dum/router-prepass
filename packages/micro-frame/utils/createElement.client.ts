import { RenderContextBrowser } from "@micro-frame/browser/types";
import { TemplateDescriptor } from "./types";

const createElement = (descriptor: TemplateDescriptor, context: RenderContextBrowser): Text | HTMLElement => {
  switch (typeof descriptor) {
    case 'function':
      return createElement(descriptor(context), context);
    case 'string':
      return document.createTextNode(descriptor);
  }

  const { tagName, props, children, data } = descriptor;
  const element = Object.assign(document.createElement(tagName), props);
  Object.assign(element.dataset, data);
  (children || []).forEach((child) => {
    element.appendChild(createElement(child, context));
  });

  return element;
};

export default createElement;
