import { sign, verify } from 'jsonwebtoken';
import * as Boom from 'boom';
import { compare, hash } from 'bcryptjs';
import config from '../config';
import { User } from '../api/users';
import { ServerState } from '../api/server-state/server-state.model';
import { isPasswordAllowed } from './util';

// A function that returns a singed JWT
export const signToken = (user: User): string => {
  return sign(
    {
      // Enter addtional paylod info here
      scope: user.scope
    },
    config.secrets.accessToken,
    {
      subject: user.id,
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

export const registerController = async (user: User) => {
  const username: string = user.username;
  const password: string = (user as any).password;
  if (isPasswordAllowed(password)) {
    user.hashedPassword = await hash(password, 10);
    return await User.create(user);
  } else {
    throw Boom.unauthorized('Password does not match requirements');
  }
};

export const authorize = async (ctx, next) => {
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

  const serverState: ServerState = await ServerState.getServerState();

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
export async function refreshAccessToken(ctx, nex) {
  const refreshToken = ctx.request.body.refreshToken;
  const username = ctx.request.body.username;

  // find the token
  const state: ServerState = await ServerState.findOne({ where: { id: 1 } });
  const refreshTokens = { ...state.refreshTokens };
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
export async function revokeRefreshToken(ctx, next) {
  const refreshToken = ctx.request.body.refreshToken;

  const serverState: ServerState = await ServerState.getServerState();

  const refreshTokens = { ...serverState.refreshTokens };
  delete refreshTokens[refreshToken];

  serverState.set('refreshTokens', refreshTokens);
  await serverState.save();

  ctx.body = { token: refreshToken };
}
