import { loginController, registerController } from './auth';
import { User } from '../api/users';

/**
 *  A function that handles logging a user in
 *
 * @returns { Object } A User and signed JWT.
 */
export const login = async (root, args, context, info): Promise<{ token: string }> => {
  const username: string = args.username;
  const password: string = args.password;

  return await loginController(username, password);
};

export const register = async (root, args, context, info) => {
  const user: User = args.input;
  return registerController(user);
};