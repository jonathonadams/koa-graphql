import jsonwebtoken from 'jsonwebtoken';
import Boom from '@hapi/boom';
import { User } from '../api/users/user.model';
import config from '../config';
import { GraphQLResolveInfo, GraphQLFieldResolver } from 'graphql';

const { verify } = jsonwebtoken;

type AuthMiddleware = GraphQLFieldResolver<any, any, any>;
/**
 * @param authMiddlewares
 *
 * The authenticate request function takes an array of authentication middleware, and returns a function
 * that takes a resolver function as an argument each of the auth middleware functions are called with the
 * resolver arguments. An error is thrown if any authentication process fails.D
 */
export const authenticateRequest = (authMiddlewares: AuthMiddleware[]) => {
  return (resolverFunction: GraphQLFieldResolver<any, any, any>) => {
    return async (
      parent: any,
      args: any,
      ctx: any,
      info: GraphQLResolveInfo
    ) => {
      for (const middleware of authMiddlewares) {
        /**
         * loop over there auth functions
         * If any errors occurs they will bubble up
         */
        await middleware(parent, args, ctx, info);
      }
      // Return the resolver function to be called
      return resolverFunction(parent, args, ctx, info);
    };
  };
};

// Verify the token signature
// Throws an error if the token is invalid
const checkToken: AuthMiddleware = (parent, args, context, info) => {
  try {
    context.state.token = verify(context.token, config.secrets.accessToken);
  } catch (err) {
    throw Boom.unauthorized('Unauthorized.');
  }
};

// Verify the user is a valid user in the database
// Throws an error if the user is invalid
const checkUser: AuthMiddleware = async (parent, args, context, info) => {
  const id = context.state.token.sub;
  const user = await User.findById(id);
  if (!user) throw Boom.unauthorized();
  context.state.user = user;
};

// Verify the user is an admin
// Throws an error if the user is not an admin invalid
const checkAdmin: AuthMiddleware = async (parent, args, context, info) => {
  if (!context.state.user.admin) throw Boom.unauthorized();
};

// export the below array to use in the authenticate request function.
export const verifyToken = [checkToken];
export const verifyUser = [checkToken, checkUser];
export const verifyAdmin = [checkToken, checkUser, checkAdmin];
