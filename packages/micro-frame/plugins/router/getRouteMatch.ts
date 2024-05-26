import { IRouteProps } from './types';

const getRouteMatch = (routes: IRouteProps[], pathname: string) => {
  for (let index = 0; index < routes.length; index++) {
    const route = routes[index];

    if (!route.path) {
      return {
        route,
        remaining: pathname,
        params: [],
        groups: {},
      };
    }
    switch (Object.prototype.toString.call(route.path)) {
      case '[object RegExp]':
        const match = pathname.match(route.path);
        if (match && match.index === 0) {
          return {
            route,
            remaining: pathname.replace(match[0], ''),
            params: match.slice(1),
            groups: match.groups,
          };
        }
        break;
      case '[object String]':
        if (pathname.startsWith(route.path as string)) {
          return {
            route,
            remaining: pathname.replace(route.path, ''),
            params: [],
            groups: {},
          };
        }
        break;
    }
  }

  return null;
};

export default getRouteMatch;
