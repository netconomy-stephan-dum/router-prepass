const pathStringToRegEx = (pathString: string): RegExp => {
  return new RegExp(
    '^' +
      pathString
        .split('/')
        .map((segment) => {
          if (segment.startsWith(':')) {
            return `(?<${segment.slice(1)}>[^/]+)`;
          }

          return segment || '';
        })
        .join('/') +
      '$',
  );
};

export default pathStringToRegEx;
