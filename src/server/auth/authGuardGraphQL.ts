import { verify } from 'jsonwebtoken';
import * as Boom from 'boom';
import { User } from '../api/users';
import config from '../config';

type AuthMiddlware = (root: any, args: any, ctx: any, info: any) => void | Promise<void>;

type ResolverFunction = (root: any, args: any, ctx: any, info: any) => any;

// The authenticate request function takes an array of
// Authentication middleware, and returns a function
// That takes a resolver function as an argument
// Each of the auth middlware functions are called with the
// Resolver arguments. An error is thrown if any authentication process fails.D
export const authenticateRequest = (authMiddlwares: AuthMiddlware[]) => {
  return (resolverFunction: ResolverFunction) => {
    return async (parent, args, ctx, info) => {
      for (const authMiddlware of authMiddlwares) {
        // loop over ther auth functinos
        // If any errors occurs they will bubble up
        await authMiddlware(parent, args, ctx, info);
      }
      //   // Return the resolver functino to be called
      return resolverFunction(parent, args, ctx, info);
    };
  };
};

// Verify the token signature
// Throws an error if the token is invalid
const checkToken: AuthMiddlware = (parent, args, context, info) => {
  try {
    context.state.token = verify(context.token, config.secrets.accessToken);
  } catch (err) {
    throw Boom.unauthorized('Unauthorised.');
  }
};

// Verify the user is a valid user in the database
// Throws an error if the user is invalid
const checkUser: AuthMiddlware = async (parent, args, context, info) => {
  const id = context.state.token.sub;
  const user = await User.findByPk(id);
  if (!user) throw Boom.unauthorized();
  context.state.user = user;
};

// Verify the user is an admin
// Throws an error if the user is not an admin invalid
const checkAdmin: AuthMiddlware = async (parent, args, context, info) => {
  if (!context.state.user.admin) throw Boom.unauthorized();
};

// export the below arragy to use in the authenticate request function.
export const verifyToken = [checkToken];
export const verifyUser = [checkToken, checkUser];
export const verifyAdmin = [checkToken, checkUser, checkAdmin];
