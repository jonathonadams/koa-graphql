import { GraphQLFieldResolver } from 'graphql';
import { loginController, registerController } from './auth.js';
import { User } from '../api/users/index.js';

/**
 *  A function that handles logging a user in
 *
 * @returns { Object } A User and signed JWT.
 */
export const login: GraphQLFieldResolver<any, { username: string; password: string }, any> = async (
  root,
  args,
  context,
  info
): Promise<{ token: string }> => {
  const username: string = args.username;
  const password: string = args.password;

  return await loginController(username, password);
};

export const register: GraphQLFieldResolver<any, { input: User }, any> = async (
  root,
  args,
  context,
  info
) => {
  const user: User = args.input;
  return registerController(user);
};
