import { createControllers } from './create-controllers';
import { Middleware } from 'koa';
import * as Router from 'koa-router';

export function generateRestEndpoints(model): Middleware {
  const router = new Router();
  const controllers = generateRestControllers(model);

  router.param('id', controllers.params);

  router.get('/', controllers.getAll).post('/', controllers.createOne);

  router
    .get('/:id', controllers.getOne)
    .put('/:id', controllers.updateOne)
    .delete('/:id', controllers.removeOne);

  return router.routes();
}

export function generateRestControllers<T>(model) {
  const controllers = createControllers<T>(model);

  return {
    params: async (id, ctx, next) => {
      ctx.state.id = id;
      await next();
    },
    getAll: async ctx => {
      ctx.status = 200;
      ctx.body = await controllers.getAll();
    },
    getOne: async (ctx, next) => {
      try {
        ctx.status = 200;
        ctx.body = await controllers.getOne(ctx.state.id as string);
      } catch (err) {
        throw err;
      }
    },
    createOne: async (ctx, next) => {
      ctx.status = 201;
      ctx.body = await controllers.createOne(ctx.request.body);
    },
    updateOne: async (ctx, next) => {
      try {
        ctx.status = 201;
        ctx.body = await controllers.updateOne(ctx.state.id, ctx.request.body);
      } catch (err) {
        throw err;
      }
    },
    removeOne: async (ctx, next) => {
      try {
        ctx.status = 200;
        ctx.body = await controllers.removeOne(ctx.state.id);
      } catch (err) {
        throw err;
      }
    }
  };
}
