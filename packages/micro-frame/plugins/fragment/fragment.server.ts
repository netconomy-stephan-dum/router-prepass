import createMicroNode from "@micro-frame/utils/createMicroNode";
import createWrapperServer from "@micro-frame/utils/create-wrapper.server";
import {NodeTypes } from "@micro-frame/server/types";
import {FragmentNode} from "./types";
const fragment: NodeTypes<FragmentNode> = ({ children, wrapper, meta, statusCode }, context) => {
  const [head, tail] = createWrapperServer(wrapper, context);

  const { queueResponse } = context;

  queueResponse(head);

  return children
    .reduce((current, child) => current.then(() => createMicroNode(child, { ...context, levelId: context.setLevelId() })), Promise.resolve())
    .then(() => {
      if (meta || statusCode) {
        context.setHead(meta || [], statusCode);
      }

      queueResponse(tail);
    });
};

fragment.key = 'fragment';

export default fragment;
