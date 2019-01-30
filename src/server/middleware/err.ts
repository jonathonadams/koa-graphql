import { badImplementation } from 'boom';

/**
 * Buiilds a custom eror and logs it to the console.
 *
 * @param {Error} error
 */
export const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.isBoom) {
      ctx.status = err.output.statusCode;
      ctx.body = err.output.payload;
    } else {
      const error = badImplementation(err.message);
      ctx.status = error.output.statusCode;
      ctx.body = error.output.payload;
    }
  }
};

export function errorLogger(err, ctx) {
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
