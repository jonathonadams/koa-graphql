import { applyGraphQLEnpoint } from './graphql';
import { applyRestEndpoints } from './rest';

export function applyApiEndpoints(app) {
  // Setup the graphql endpoints
  applyGraphQLEnpoint(app);
  // Setup the REST endpoints
  applyRestEndpoints(app);
}
