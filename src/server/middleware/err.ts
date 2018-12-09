// Configure error handling error handling must go after routes
/**
 * Buiilds a custom eror and logs it to the console.
 *
 * @param {Error} error
 */
export const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    switch (err.name) {
      case 'JsonWebTokenError':
      case 'TokenExpiredError':
        ctx.status = 401;
        ctx.body = 'Unauthorized';
        break;
      default:
        // if the error in not handdled here, it will
        // bubble up to the default Koa error handler
        throw err;
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
