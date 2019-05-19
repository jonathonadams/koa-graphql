import { GraphQLFieldResolver } from 'graphql';
import { IUserDocument } from '../api/users/user.model';
import { loginController, registerController } from './auth.controllers';

/**
 *  A function that handles logging a user in
 *
 * @returns { Object } A User and signed JWT.
 */
export const login: GraphQLFieldResolver<
  any,
  { username: string; password: string },
  any
> = async (root, args, context, info): Promise<{ token: string }> => {
  const username: string = args.username;
  const password: string = args.password;

  return await loginController(username, password);
};

export const register: GraphQLFieldResolver<
  any,
  { input: IUserDocument },
  any
> = async (root, args, context, info) => {
  const user: IUserDocument = args.input;
  return registerController(user);
};
