import * as http from 'http';
import config from './server/config';
import ApiServer from './server/server';
import * as Koa from 'koa';
import * as Router from 'koa-router';
import { apolloServer } from './server/api/graphql';

/**
 * A instance of the API Aplication
 * @param {Koa} app an instance of a koa server
 * @param {Router} router an instance of a koa-router
 */
const app = new ApiServer(new Koa(), new Router());

/**
 * An instance of a http server
 */
export const server = http.createServer(app.start()).listen(config.port, () => {
  console.log(`Server listening on port ${config.port}.`);
});

// Add the subscription options, this is a websocket connection
apolloServer.installSubscriptionHandlers(server);
