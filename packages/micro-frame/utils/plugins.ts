import { NodeTypes } from './types';
import fragment from '@micro-frame/plugin-fragment';
import react from '@micro-frame/plugin-react';
import chunk from '@micro-frame/plugin-chunk';
import router from '@micro-frame/plugin-router';

const plugins: Record<string, NodeTypes> = {
  fragment,
  react,
  chunk,
  router,
};

export default plugins;
