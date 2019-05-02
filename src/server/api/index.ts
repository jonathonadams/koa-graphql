import { applyGraphQLEndpoints } from './graphql';
import { applyRestEndpoints } from './rest';
import Koa from 'koa';

export async function applyApiEndpoints(app: Koa) {
  // Setup the graphql endpoints
  await applyGraphQLEndpoints(app);
  // Setup the REST endpoints
  await applyRestEndpoints(app);
}
