import './associations'; // Import all associations
import { ApolloServer } from 'apollo-server-koa';
import { makeExecutableSchema } from 'graphql-tools';
import { GraphQLDate, GraphQLTime, GraphQLDateTime } from 'graphql-iso-date';
import config from '../config';
import typeDefs from './typeDefs';
import resolvers from './resolvers';
import { loaders } from './data-loader';
import { User } from './users';

// A function to add addtional Scalar types.
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
        model: {},
        loaders: {}
      };
    }
    // if the ctx exists, it is a req/res
    if (ctx) {
      return {
        // put the desired models on the context for quick access if needed
        // Such as the user
        model: { user: User },
        // Add any necessary data loaders here if awanted
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

// A function that applies the middlware to the app.
export function applyGraphQLEnpoint(app) {
  apolloServer.applyMiddleware({ app });
}
