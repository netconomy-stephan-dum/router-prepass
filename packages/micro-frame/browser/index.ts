import createBrowser from './utils/createBrowser';

declare global {
  const ROOT_NODE: string;
  const PROVIDES: string;
}

(async () => {
  const setupProvides =
    PROVIDES &&
    (
      await import(
        /* webpackMode: "eager" */
        PROVIDES
      )
    ).default;

  const rootNode = (
    await import(
      /* webpackMode: "eager" */
      ROOT_NODE
    )
  ).default;

  await createBrowser(rootNode, setupProvides);
})();
