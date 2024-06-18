type LazyHandler = () => Promise<void> | void;
const createIntersectionObserver = () => {
  const options = {
    rootMargin: '200px',
    threshold: 1,
  };

  const lazyHandlers: Map<Element, LazyHandler> = new Map();

  const observer = new IntersectionObserver(async (entries) => {
    await Promise.all(
      entries.map((entry) => {
        const { target, isIntersecting } = entry;

        if (isIntersecting) {
          const callback = lazyHandlers.get(target);
          lazyHandlers.delete(target);
          observer.unobserve(target);
          return callback();
        }
      }),
    );
  }, options);

  return (target: Element, callback: LazyHandler) => {
    lazyHandlers.set(target, callback);

    const handlerId = requestIdleCallback(() => {
      observer.observe(target);
    });

    return () => {
      cancelIdleCallback(handlerId);
      lazyHandlers.delete(target);
      observer.unobserve(target);
    };
  };
};

export default createIntersectionObserver;
