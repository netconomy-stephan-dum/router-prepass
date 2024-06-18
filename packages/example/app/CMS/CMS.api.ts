import { RenderContextSSR } from '@micro-frame/server/types';

export interface CMSComponent {
  type: string;
  props?: Record<string, string>;
  children?: [CMSComponent];
}

const components: Record<string, CMSComponent[]> = {};
export const get = (context: RenderContextSSR, options: { position: string }) => {
  const { position = '' } = options;
  const id = context.url + position;

  return {
    components: components[id],
    meta: [],
  };
};
