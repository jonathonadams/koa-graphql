import Koa from 'koa';
import Router from 'koa-router';
import Boom from '@hapi/boom';
import {
  loginController,
  registerController,
  authorizeController,
  refreshAccessTokenController,
  revokeRefreshTokenController
} from './auth.controllers';
import { IUserDocument } from '../api/users/user.model';

export function applyAuthorizationRoutes(app: Koa) {
  const router = new Router();

  router.post('/api/users/login', login);
  router.post('/api/users/register', register);
  router.post('/authorize', authorize);
  router.post('/token', refreshAccessToken);
  router.post('/token/revoke', revokeRefreshToken);

  app.use(router.routes());
}

/**
 *  A function that handles logging a user in
 *
 * @returns A signed JWT.
 */
export async function login(ctx: Koa.ParameterizedContext) {
  const username: string = ctx.request.body.username;
  const password: string = ctx.request.body.password;

  if (!username || !password)
    throw Boom.unauthorized('A username and password must be provided');

  ctx.body = await loginController(username, password);
}

export async function register(ctx: Koa.ParameterizedContext) {
  const user: IUserDocument = ctx.request.body;
  ctx.body = await registerController(user);
}

export async function authorize(ctx: Koa.ParameterizedContext) {
  const username = ctx.request.body.username;
  const password = ctx.request.body.password;

  if (!username || !password)
    throw Boom.unauthorized('Not all parameters provided.');

  ctx.body = await authorizeController(username, password);
}

export async function refreshAccessToken(ctx: Koa.ParameterizedContext) {
  const username = ctx.request.body.username;
  const refreshToken = ctx.request.body.refreshToken;

  if (!username || !refreshToken)
    throw Boom.unauthorized('Not all parameters provided.');

  ctx.body = await refreshAccessTokenController(username, refreshToken);
}

export async function revokeRefreshToken(ctx: Koa.ParameterizedContext) {
  const token = ctx.request.body.refreshToken;
  ctx.body = await revokeRefreshTokenController(token);
}
