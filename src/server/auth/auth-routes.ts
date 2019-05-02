import * as Koa from 'koa';
import * as Router from 'koa-router';
import {
  loginController,
  registerController,
  authorize,
  refreshAccessToken,
  revokeRefreshToken
} from './auth.js';
import { User } from '../api/users';

/**
 *  A function that handles logging a user in
 *
 * @returns { Object } A User and signed JWT.
 */
export const login: Koa.Middleware = async (ctx, next) => {
  const username: string = ctx.request.body.username;
  const password: string = ctx.request.body.password;

  return await loginController(username, password);
};

export const register: Koa.Middleware = async (ctx, next) => {
  const user: User = ctx.request.body;
  return registerController(user);
};

export async function applyAuthorizationRoutes(app: Koa) {
  const router = new Router();

  router.post('/api/users/login', login);
  router.post('/api/users/register', register);
  router.post('/authorize', authorize);
  router.post('/token', refreshAccessToken);
  router.post('/token/revoke', revokeRefreshToken);

  app.use(router.routes());
}
