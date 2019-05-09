import { applyGraphQLEndpoints } from './graphql';
import { applyRestEndpoints } from './rest';
import Koa from 'koa';

export function applyApiEndpoints(app: Koa) {
  // Setup the graphql endpoints
  applyGraphQLEndpoints(app);
  // Setup the REST endpoints
  applyRestEndpoints(app);
}
