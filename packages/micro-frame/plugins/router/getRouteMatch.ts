import { IRouteProps } from './types';
import pathStringToRegEx from './pathStringToRegEx';

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

    const match = pathname.match(pathStringToRegEx(route.path));

    if (match && match.index === 0) {
      return {
        route,
        remaining: pathname.replace(match[0], ''),
        params: match.slice(1),
        groups: match.groups,
      };
    }
  }

  return null;
};

export default getRouteMatch;
