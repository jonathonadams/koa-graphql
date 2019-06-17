import jsonwebtoken from 'jsonwebtoken';
import Boom from '@hapi/boom';
import bcryptjs from 'bcryptjs';
import config from '../config';
import { RefreshToken } from './tokens.model';
import { IUserDocument, User } from '../api/users/user.model';
import {
  signAccessToken,
  signRefreshToken,
  isPasswordAllowed,
  userToJSON
} from './auth';

const { verify } = jsonwebtoken;
const { compare, hash } = bcryptjs;

export async function registerController(
  user: IUserDocument
): Promise<IUserDocument> {
  const password: string = (user as any).password;
  if (!password) Boom.badRequest('No password provided');

  if (!isPasswordAllowed(password))
    throw Boom.badRequest('Password does not match requirements');

  const currentUser = await User.findByUsername(user.username);
  if (currentUser !== null) throw Boom.badRequest('Username is not available');

  user.hashedPassword = await hash(password, 10);

  const newUser = new User({ ...user });
  await newUser.save();

  return userToJSON<IUserDocument>(newUser.toJSON());
}

/**
 *  A function that handles logging a user in
 *
 * @returns { Object } A User and signed JWT.
 */
export const loginController = async (
  username: string,
  password: string
): Promise<{ token: string }> => {
  const user = await User.findByUsername(username);

  if (!user || user.active === false) throw Boom.unauthorized('Unauthorized');

  const valid = await compare(password, user.hashedPassword);

  if (!valid) throw Boom.unauthorized('Unauthorized');

  const token = signAccessToken(user);

  return {
    token
  };
};

export async function authorizeController(
  username: string,
  password: string
): Promise<{ token: string; refreshToken: string }> {
  const user = await User.findByUsername(username);

  if (!user || user.active === false) throw Boom.unauthorized('Unauthorized');

  const valid = await compare(password, user.hashedPassword);

  if (!valid) throw Boom.unauthorized('Unauthorized');

  const accessToken = signAccessToken(user);

  const refreshToken = signRefreshToken(user);

  await RefreshToken.create({
    user: user.id,
    token: refreshToken
  });

  return {
    token: accessToken,
    refreshToken: refreshToken
  };
}

// a controller that receives a refresh token and returns an access token.
export async function refreshAccessTokenController(
  username: string,
  refreshToken: string
): Promise<{ token: string }> {
  const token = await RefreshToken.findByTokenWithUser(refreshToken);
  // No token found
  if (token === null) throw Boom.unauthorized();

  // No user found or matched with given parameters
  if (token.user === null || token.user.username !== username)
    throw Boom.unauthorized();

  // revoke refreshToken if user is inactive
  if (token.user.active === false) {
    await token.remove();
    throw Boom.unauthorized();
  }

  // The provided token is valid
  const valid = await verify(refreshToken, config.secrets.refreshToken);
  if (!valid) throw Boom.unauthorized();

  return {
    token: signAccessToken(token.user)
  };
}

// a controller to revoke a refresh token
export async function revokeRefreshTokenController(
  token: string
): Promise<{ success: true }> {
  const refreshToken = await RefreshToken.findOne({ token }).exec();

  if (refreshToken === null) throw Boom.badRequest();

  await refreshToken.remove();

  return { success: true };
}
