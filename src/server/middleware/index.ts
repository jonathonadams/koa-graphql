import Koa from 'koa';
import helmet from 'koa-helmet';
import morgan from 'koa-morgan';
import bearerToken from 'koa-bearer-token';
import compress from 'koa-compress';
import bodyParser from 'koa-bodyparser';
import cors from 'kcors';
import config from '../config';
import { errorHandler, errorLogger } from './err';

// Configure middleware to parse income requests
export const setupMiddleware = (app: Koa) => {
  app.use(helmet());
  app.use(compress());
  app.use(bodyParser());
  app.use(cors());
  app.use(bearerToken());

  if (config.logging) {
    app.use(morgan(config.logging)); // configure the logging based on node environment
  }

  // Custom error handling
  app.use(errorHandler);

  app.on('error', errorLogger);
};
