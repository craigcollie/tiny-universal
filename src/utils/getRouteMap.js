function getPathMap(path) {
  const map = {
    '/': 'root',
  };
  return (map[path] || path);
}

function getRouteMap(routes, path, routeParams) {
  const routeNodes = routes().props.children;

  if (Array.isArray(routeNodes)) {
    return routeNodes
      .reduce((acc, route) => {
        const { path, component, resolve, meta } = route.props;
        acc[getPathMap(path)] = { path, component, resolve, meta };
        return acc;
      }, {});

  } else {
    return routes().props;
  }
}

export default getRouteMap;
