import { applyGraphQLEnpoint } from './graphql';
import { applyRestEndpoints } from './rest';

export async function applyApiEndpoints(app) {
  // Setup the graphql endpoints
  await applyGraphQLEnpoint(app);
  // Setup the REST endpoints
  await applyRestEndpoints(app);
}
