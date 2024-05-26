import { StreamNode } from '@micro-frame/utils/types';

export type ILoadable<T = unknown> = () => Promise<{ default: T }>;

export interface IRouteProps {
  aboveFold?: boolean;
  chunk?: ILoadable<StreamNode>;
  chunkName: string;
  node?: StreamNode;
  path?: string | RegExp;
  hydrate?: boolean;
}

export interface RouterNode {
  type: 'router';
  routes: IRouteProps[];
}
