import * as jsonwebtoken from 'jsonwebtoken';
import * as Boom from 'boom';
import * as bcryptjs from 'bcryptjs';
import config from '../config';
import {
  ServerState,
  IServerStateDocument
} from '../api/server-state/server-state.model';
import { isPasswordAllowed } from './util';
import { Middleware, ParameterizedContext } from 'koa';
import { IUserDocument, User } from '../api/users/user.model';

const { sign, verify } = jsonwebtoken;
const { compare, hash } = bcryptjs;

// A function that returns a singed JWT
export const signToken = (user: IUserDocument): string => {
  return sign(
    {
      // Enter additional payload info here
      role: user.role
    },
    config.secrets.accessToken,
    {
      subject: user.id.toString(),
      expiresIn: config.expireTime,
      issuer: 'your-company-here'
    }
  );
};

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

  if (!user) throw Boom.unauthorized('Unauthorized');

  const valid = await compare(password, user.hashedPassword);

  if (!valid) throw Boom.unauthorized('Unauthorized');

  const token = signToken(user);

  return {
    token
  };
};

export const registerController = async (user: IUserDocument) => {
  const password: string = (user as any).password;
  if (!password) Boom.badRequest('No password provided');

  if (!isPasswordAllowed(password))
    throw Boom.unauthorized('Password does not match requirements');

  user.hashedPassword = await hash(password, 10);

  const currentUser = await User.findByUsername(user.username);
  if (currentUser !== null) throw Boom.badRequest('Username is not available');

  return await User.create(user);
};

export const authorize: Middleware = async (ctx, next) => {
  const username = ctx.request.body.username;
  const password = ctx.request.body.password;

  const user = await User.findByUsername(username);

  if (!user) throw Boom.unauthorized('Unauthorized.');

  const valid = compare(password, user.hashedPassword);

  if (!valid) throw Boom.unauthorized('Unauthorized.');

  const accessToken = signToken(user);

  const refreshToken = sign(
    {
      prop: 'some property'
    },
    config.secrets.refreshToken,
    {
      issuer: 'your-company-here'
    }
  );

  const serverState: IServerStateDocument | null = await ServerState.getServerState();
  if (serverState === null) throw Boom.badRequest();

  const refreshTokens = { ...serverState.refreshTokens };

  refreshTokens[refreshToken] = username;
  serverState.set('refreshTokens', refreshTokens);
  await serverState.save();

  ctx.body = {
    token: accessToken,
    refreshToken: refreshToken
  };
};

// a controller that receives a refresh token and returns an access token.
export async function refreshAccessToken(
  ctx: ParameterizedContext,
  next: () => Promise<any>
) {
  const refreshToken = ctx.request.body.refreshToken;
  const username = ctx.request.body.username;

  // find the token
  const serverState: IServerStateDocument | null = await ServerState.getServerState();
  if (serverState === null) throw Boom.badRequest();

  const refreshTokens = { ...serverState.refreshTokens };
  const token = refreshTokens[refreshToken];

  if (!token || token !== username) {
    throw Boom.unauthorized('Invalid refresh token.');
  }

  const valid = verify(token, config.secrets.refreshToken);
  if (valid) throw Boom.unauthorized('Invalid refresh token.');

  const user = await User.findByUsername(username);

  if (!user) throw Boom.unauthorized('Invalid username provided');

  ctx.body = {
    token: signToken(user)
  };
}

// a controller to revoke a refresh token
export async function revokeRefreshToken(
  ctx: ParameterizedContext,
  next: () => Promise<any>
) {
  const refreshToken = ctx.request.body.refreshToken;

  const serverState: IServerStateDocument | null = await ServerState.getServerState();
  if (serverState === null) throw Boom.badRequest();

  const refreshTokens = { ...serverState.refreshTokens };
  delete refreshTokens[refreshToken];

  serverState.set('refreshTokens', refreshTokens);
  await serverState.save();

  ctx.body = { token: refreshToken };
}
