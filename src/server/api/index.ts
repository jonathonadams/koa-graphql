import { applyGraphQLEndpoints } from './graphql.js';
import { applyRestEndpoints } from './rest.js';
import Koa from 'koa';

export async function applyApiEndpoints(app: Koa) {
  // Setup the graphql endpoints
  await applyGraphQLEndpoints(app);
  // Setup the REST endpoints
  await applyRestEndpoints(app);
}
