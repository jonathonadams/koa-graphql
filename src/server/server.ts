import * as Koa from 'koa';
import * as Router from 'koa-router';
import { setupMiddleware } from './middleware';
import { applyApiEndpoints } from './api';
import { applyAuthorizationRoutes } from './auth/auth-routes';

/**
 * Crates a new API Server
 */
export default class ApiServer {
  /**
   * Instantiate a new API Server
   * @constructor
   * @param {Koa} app an instance of a koa server
   * @param {Router} router an instance of a koa-router
   */
  constructor(private app: Koa, private router: Router) {
    this.setupServer(app, router);
  }

  /**
   * Sets up all the server configuration and applies the routes
   * @param {Koa} app an instance of a koa server
   * @param {Router} router an instance of a koa-router
   */
  private async setupServer(app: Koa, router: Router) {
    // Setup all the required middleware for the app
    setupMiddleware(app);

    // Apply the API endpoints
    await applyApiEndpoints(app);

    // apply all authorizatoin router
    await applyAuthorizationRoutes(app);

    // Health check for kubernetes on google cloud
    // Container must return status 200 on a designated healthz route
    // In k8's the default route is '/'
    // Must be configured on the deployment object to use this route for checking
    router.get('/healthz', ctx => {
      ctx.status = 200;
    });

    // Apply the routes
    app.use(router.routes());
    app.use(router.allowedMethods());
  }

  /**
   *
   * @returns a request handler callback for node's native http/http2 server.
   */
  public start() {
    return this.app.callback();
  }
}
