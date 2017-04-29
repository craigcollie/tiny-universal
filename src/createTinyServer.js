import url from 'url';
import propInjector from './utils/propInjector';
import matchRoute from './utils/matchRoute';
import resolveRoute from './utils/resolveRoute';

function createTinyServer(RootComponent, routes, template) {

  //  Express middleware
  return function (req, res, next) {
    const { pathname, search } = url.parse(req.url);

    const activeRoute = matchRoute(routes, pathname);
    if (activeRoute.length) {

      //  Perform any route resolves here first
      const currentRoute = activeRoute[0].props;
      const {
        resolve,
        routeParams,
        meta,
      } = currentRoute;

      //  Resolve data first, then render the route
      //  and pass props to the client app
      resolveRoute(resolve, routeParams).then(resolvedData => {
        const props = {
          location: {
            pathname,
            search,
          },
          resolvedData,
          meta
        };

        res.render(template, {
          appRoot: propInjector(props, RootComponent),
          title: meta.title,
          description: meta.description,
        });
      });

    } else {
      next();
    }
  }
}

export default createTinyServer;
