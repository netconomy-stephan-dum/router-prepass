import { NodeTypes} from "@micro-frame/server/types";
import FragmentServer from "@micro-frame/plugin-fragment";
import ReactServer from "@micro-frame/plugin-react";
import ChunkServer from "@micro-frame/plugin-chunk";
import RouterServer from '@micro-frame/plugin-router';

const plugins: Record<string, NodeTypes> = {
  fragment: FragmentServer,
  react: ReactServer,
  chunk: ChunkServer,
  router: RouterServer,
};

export default plugins;
