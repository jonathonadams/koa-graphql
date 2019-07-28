/* istanbul ignore file */

import { ApolloServer } from 'apollo-server-koa';
import { makeExecutableSchema } from 'graphql-tools';
// @ts-ignore
import { GraphQLDate, GraphQLTime, GraphQLDateTime } from 'graphql-iso-date';
import config from '../config';
import typeDefs from './typeDefs';
import resolvers from './resolvers';
import { loaders } from './data-loader';
import { User } from './users';

// A function to add additional Scalar types.
const resolveFunctions = {
  Date: GraphQLDate,
  Time: GraphQLTime,
  DateTime: GraphQLDateTime
};

// Make the schema model
export const schema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: [resolveFunctions, resolvers],
  allowUndefinedInResolve: false
});

export const apolloServer = new ApolloServer({
  schema: schema,
  context: async ({ ctx, connection }) => {
    // if the connection exists, it is a subscription
    if (connection) {
      return {
        state: {},
        model: {},
        loaders: {}
      };
    }
    // if the ctx exists, it is a req/res
    if (ctx) {
      return {
        // create an empty state object to store temporary data in the resolvers
        state: {},
        // put the desired models on the context for quick access if needed
        // Such as the user
        model: { user: User },
        // Add any necessary data loaders here if wanted
        loaders: loaders(),
        // Add the JWT as the token property
        token: (<any>ctx).request.token
      };
    }
  },
  playground: config.docs,
  tracing: config.docs,
  debug: config.docs,
  uploads: false
});

// A function that applies the middleware to the app.
export function applyGraphQLEndpoints(app: any) {
  apolloServer.applyMiddleware({ app });
}
