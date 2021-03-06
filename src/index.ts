import http from 'http';
import config from './server/config';
import ApiServer from './server/server';
import Koa from 'koa';
import Router from 'koa-router';
import { apolloServer } from './server/api/graphql';

/**
 * A instance of the API ApplicationA
 *
 * @param {Koa} app an instance of a koa server
 * @param {Router} router an instance of a koa-router
 */
const app = new ApiServer(new Koa(), new Router());

/**
 * Create and export a http server
 */
export const server = http.createServer(app.start());

/**
 * Listen on the desired port
 */
server.listen({ port: config.port }, () => {
  console.log(`Server listening on port ${config.port}.`);
});

/**
 * Add the subscription options, this is a websocket connection
 */
apolloServer.installSubscriptionHandlers(server);
