import * as helmet from 'koa-helmet';
import * as morgan from 'koa-morgan';
import * as bearerToken from 'koa-bearer-token';
import * as compress from 'koa-compress';
import * as bodyParser from 'koa-bodyparser';
import * as cors from 'kcors';
import config from '../config';
import { errorHandler, errorLogger } from './err';

// Configure middleware to parse income requests
export const setupMiddleware = app => {
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
