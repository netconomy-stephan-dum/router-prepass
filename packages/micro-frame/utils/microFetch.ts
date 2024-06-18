import { IPrepassComponent } from '@micro-frame/plugin-react/types';
import { RenderContext } from './types';

export type MicroFetch = <Return = object, Variables = object>(
  Component: IPrepassComponent<Return, Variables>,
  context: RenderContext,
  isHydrate: boolean,
  props?: Record<string, unknown>,
) => Promise<Return>;

const microFetch: MicroFetch = () => Promise.resolve(null);

export default microFetch;
