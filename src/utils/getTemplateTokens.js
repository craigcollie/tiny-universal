// @flow
import get from 'lodash/get';
import type { Route } from './../types/Route';

function getTemplateTokens(
  templateString: string,
  route: Route,
): { [key: string]: string } {
  const tokensInTemplate = templateString.match(/\{(.*?)\}/g);

  if (!tokensInTemplate) return {};

  return tokensInTemplate
    .map(token => (token.replace('{', '').replace('}', '')))
    .filter(token => (token !== 'appRoot'))
    .reduce((acc, token) => {
      acc[token] = get(route, token);
      return acc;
    }, {});
}

export default getTemplateTokens;
