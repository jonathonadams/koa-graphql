import { Middleware } from 'koa';
import { Utils } from '../util/utils';

export const postRoutesMiddleware: Middleware = async (ctx, next) => {
  await next();
  ctx.body = Utils.swapId(ctx.body);
};
