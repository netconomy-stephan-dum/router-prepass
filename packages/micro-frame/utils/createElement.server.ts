import { TemplateDescriptor } from "@micro-frame/utils/types";

const createElement = (descriptor: TemplateDescriptor, context: any): string => {
  switch (typeof descriptor) {
    case 'function':
      return createElement(descriptor(context), context);
    case 'string':
      return descriptor;
  }


  const { tagName, props = {}, children = [], data } = descriptor;
  Object.entries(data || {}).forEach(([key, value]) => {
    props[`data-${key}`] = value;
  })
  const { className, ...normalProps } = props;
  const properties = Object.entries(normalProps).map(([key, value]) => `${key}="${value}"`).join(' ');
  const elementBody = (className ? ` class="${className}"` : '') + (properties ? ' ' + properties : '');

  if(children.length) {
    return `<${tagName}${elementBody}>${children.map((child) => createElement(child, context)).join('')}</${tagName}>`
  }

  return `<${tagName}${elementBody}></${tagName}>`;
};

export default createElement;
