import * as jsonwebtoken from 'jsonwebtoken';
import * as Boom from '@hapi/boom';
import * as bcryptjs from 'bcryptjs';
import config from '../config';
import { RefreshToken, IRefreshTokenDocument } from './tokens.model';
import { isPasswordAllowed, userToJSON } from './util';
import { Middleware, ParameterizedContext } from 'koa';
import { IUserDocument, User } from '../api/users/user.model';

const { sign, verify } = jsonwebtoken;
const { compare, hash } = bcryptjs;

// A function that returns a singed JWT
export function signAccessToken(user: IUserDocument): string {
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
}

export function signRefreshToken(user: IUserDocument) {
  return sign(
    {
      prop: 'some property'
    },
    config.secrets.refreshToken,
    {
      subject: user.id.toString(),
      issuer: 'your-company-here'
    }
  );
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
  const user = await User.findByUsername(username).exec();

  if (!user) throw Boom.unauthorized('Unauthorized');

  const valid = await compare(password, user.hashedPassword);

  if (!valid) throw Boom.unauthorized('Unauthorized');

  const token = signAccessToken(user);

  return {
    token
  };
};

export const registerController = async (user: IUserDocument) => {
  const password: string = (user as any).password;
  if (!password) Boom.badRequest('No password provided');

  if (!isPasswordAllowed(password))
    throw Boom.badRequest('Password does not match requirements');

  const currentUser = await User.findByUsername(user.username).exec();
  if (currentUser !== null) throw Boom.badRequest('Username is not available');

  user.hashedPassword = await hash(password, 10);

  const newUser = new User({ ...user });
  await newUser.save();

  return userToJSON(newUser.toJSON());
};

export const authorize: Middleware = async (ctx, next) => {
  const username = ctx.request.body.username;
  const password = ctx.request.body.password;

  const user = await User.findByUsername(username).exec();

  if (!user) throw Boom.unauthorized('Unauthorized.');

  const valid = compare(password, user.hashedPassword);

  if (!valid) throw Boom.unauthorized('Unauthorized.');

  const accessToken = signAccessToken(user);

  const refreshToken = signRefreshToken(user);

  await RefreshToken.create({
    user: user.id,
    username: user.username,
    token: refreshToken
  });

  ctx.body = {
    token: accessToken,
    refreshToken: refreshToken
  };
};

// a controller that receives a refresh token and returns an access token.
export async function refreshAccessToken(ctx: ParameterizedContext) {
  const refreshToken = ctx.request.body.refreshToken as string;
  const username = ctx.request.body.username as string;

  const token = await RefreshToken.findByTokenWithUser(refreshToken);
  // No token found
  if (token === null) throw Boom.unauthorized();

  // No user found or matched with given parameters
  if (token.user === null || token.user.username !== username)
    throw Boom.unauthorized();

  const valid = await verify(refreshToken, config.secrets.refreshToken);
  if (!valid) throw Boom.unauthorized();

  ctx.body = {
    token: signAccessToken(token.user)
  };
}

// // a controller to revoke a refresh token
// export async function revokeRefreshToken(
//   ctx: ParameterizedContext,
//   next: () => Promise<any>
// ) {
//   const refreshToken = ctx.request.body.refreshToken;

//   const serverState: IServerStateDocument | null = await ServerState.getServerState();
//   if (serverState === null) throw Boom.badRequest();

//   const refreshTokens = { ...serverState.refreshTokens };
//   delete refreshTokens[refreshToken];

//   serverState.set('refreshTokens', refreshTokens);
//   await serverState.save();

//   ctx.body = { token: refreshToken };
// }
