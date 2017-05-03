import url from 'url';
import set from 'lodash/set';
import forEach from 'lodash/forEach';
import isEqual from 'lodash/isEqual';
import { renderToString } from 'react-dom/server';

import { resolveRoute } from './plugins/resolveRoutePlugin';
import matchRoute from './utils/matchRoute';
import getTemplateTokens from './utils/getTemplateTokens';
import getParamsFromUrl from './utils/getParamsFromUrl';
import getRouteMap from './utils/getRouteMap';

function generateServerProps(props, htmlComponent) {
  const RootComponent = htmlComponent;
  const dataProps = JSON.stringify(props);
  return `
      <script id='app-props' type='application/json'>
        <![CDATA[${dataProps}]]>
      </script>
      <div>${renderToString(RootComponent(props))}</div>
    `;
};

function createTinyServer({ clientApp, routes, template }) {
  return function (req, res, next) {
    const { pathname, search } = url.parse(req.url);

    const currentRoute = matchRoute(routes, pathname);

    //  If no routes match, handoff to next middleware
    if (isEqual(currentRoute, {})) {
      return next();
    };

    const { path, resolve } = currentRoute;

    //  Convert URL to params
    const routeParams = getParamsFromUrl(path, pathname);
    const routeMap = getRouteMap(routes, path, routeParams);

    resolveRoute(resolve, routeParams)
      .then(resolvedData => {

        let templateString = template.toString();
        const templateTokens = getTemplateTokens(templateString, currentRoute);

        //  Populate the token and apply any
        let tokenProps = {};

        forEach(templateTokens, (val, key) => {
          set(tokenProps, key, val);
          templateString = templateString.replace(`<% ${key} %>`, val);
        });

        const props = {
          location: { pathname, search },
          resolvedData,
          routeMap,
          ...tokenProps,
        };

        //  Populate the appRoot with the
        //  injected server-side props
        templateString = templateString.replace(
          '<% appRoot %>', generateServerProps(props, clientApp)
        );

        res.send(templateString);
      });
  }
}

export default createTinyServer;
