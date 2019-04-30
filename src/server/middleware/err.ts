import * as Boom from 'boom';
import { Middleware, ParameterizedContext } from 'koa';

/**
 * Builds a custom error and logs it to the console.
 *
 * @param {Error} error
 */
export const errorHandler: Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.isBoom) {
      ctx.status = err.output.statusCode;
      ctx.body = err.output.payload;
    } else {
      const error = Boom.badImplementation(err.message);
      ctx.status = error.output.statusCode;
      ctx.body = error.output.payload;
    }
  }
};

export function errorLogger(err: any, ctx: ParameterizedContext) {
  const date = new Date();
  console.error('There was an error.', {
    timestamp: date.toISOString(),
    status: err.status,
    name: err.name,
    text: err.statusText,
    message: err.message,
    code: err.code,
    zone: err.zone,
    task: err.task,
    error: err
  });
}
