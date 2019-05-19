import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as Boom from '@hapi/boom';
import {
  loginController,
  registerController,
  authorize,
  refreshAccessToken,
  revokeRefreshToken
} from './auth';
import { IUserDocument } from '../api/users/user.model';

/**
 *  A function that handles logging a user in
 *
 * @returns A signed JWT.
 */
export const login: Koa.Middleware = async (ctx, next) => {
  const username: string | undefined = ctx.request.body.username;
  const password: string | undefined = ctx.request.body.password;
  if (!username || !password)
    throw Boom.unauthorized('A username and password must be provided');
  ctx.body = await loginController(username, password);
};

export const register: Koa.Middleware = async (ctx, next) => {
  const user: IUserDocument = ctx.request.body;
  ctx.body = await registerController(user);
};

export function applyAuthorizationRoutes(app: Koa) {
  const router = new Router();

  router.post('/api/users/login', login);
  router.post('/api/users/register', register);
  router.post('/authorize', authorize);
  router.post('/token', refreshAccessToken);
  router.post('/token/revoke', revokeRefreshToken);

  app.use(router.routes());
}
