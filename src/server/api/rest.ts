import Koa from 'koa';
import Router from 'koa-router';
import { generateRestEndpoints } from '../util/create-rest-controllers';
import { router as userRouter } from './users';
import { Todo } from './todos';
import { verifyToken } from '../auth/authGuardRest';

export function applyRestEndpoints(app: Koa) {
  const router = new Router({
    prefix: '/api'
  });

  // Global check to ensure token is valid
  router.use(verifyToken);

  // Apply all your routes here
  router.use('/users', userRouter.routes());
  router.use('/todos', generateRestEndpoints(Todo));

  app.use(router.routes());
}
