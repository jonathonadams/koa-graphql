# A starter API build with TypeScript, Koa, GraphQL and MongoDB

## Build the Server

To download and build the server, run the following commands.

1. `git clone https://github.com/jadams88/koa-graphql-rest-api.git api`
2. `cd api`
3. `npm install`
4. `npm run build`

### Build Notes:

The `src/` directory contains all TypeScript & GraphQL source files (`.ts` & `.graphql` respectively). The build script will compile the TS into JS and copy the `.graphql` files and output them into the `dist/` directory. The `dist/` directory contains the files to run.

Although you may run TS compilation directly (e.g. using your IDE), this will likely throw errors when you try to run the application as the `.graphql` files will not be copied over unless you run the build script.

The build script will continue to watch files as they change and recompile the source files.

There are two build scripts, one for development and one for production.

- Development: `npm run build` - Continues to watch for files changing
- Production: `npm run build` - Removed source maps and test files

## Run the API

There are two scripts to run the server.

1. `npm run dev` : Runs the server using [nodemon](https://www.npmjs.com/package/nodemon), it will restart each time it detects a file has changed. It will also run in development mode.
2. `npm start`: It will run in production mode.

Notes:
The API will try to connect to a mongodb instance when it runs, please see below on setting up a database.

### Server Config / Environment Variables

When the server starts, it will use environment variables to configure configure the server at run time (e.g. different databases for `development` and `production`). Environment based configuration can be found in the config files, [global](./src/server/config/index.ts), [development](./src/server/config/development.ts), [production](./src/server/config/production.ts) & [test](./src/server/config/test.ts).

During development it can be convenient to store environment variables in a `.env` file at the root directory. To create your own, copy and paste the [sample .env](./.sample.env) and rename it to `.env`.

## Database Setup

There are a number of ways to set up a database for development and production.
Some basic instruction for setting up a local database for development using `Docker` can be found [here](./docs/DOCKER_BASICS.md).

## Testing

Testing in run using the [Jest](https://www.npmjs.com/package/jest) testing framework and [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server) to create ephemeral in memory mongodb databases for testing.

There are two types of tests, `unit` and `end-to-end` tests. They are located in `*.spec.ts` and `*.e2e.ts` files respectively.

To run individual test types, run `npm run test:unit` for unit tests and `npm run test:e2e` for end-to-end tests.

`npm test` will run the entire test suite.

## Redis

If you would like to set up Redis for caching (or any other reason), there is an example redis client using [ioredis](https://github.com/luin/ioredis) in the [redis directory](./src/server/redis/redis.ts) and controller in the [users director](./src/server/api/users/user.controller.redis.ts).

To use io redis, run `npm install --save ioredis`. It is also recommended to install the TypeScript definitions `npm install --save-dev @types/ioredis`

### Node 12 & ES6 Module Imports

While typescript can work fine using ES6 Imports (adding fully resolved imports and `"type": "module"` to the package.json), currently Jest does not work with native ES6 Modules yet.

The Github issue can be found [here](https://github.com/facebook/jest/issues/4842)

### Archived Postgres & Sequelize setup

This API Server was initially setup with Postgres & Sequelize. The final version of the API using Postgres & Sequelize has been tagged `Final-Postgres/Sequelize`. You can check that out to view the API before switching to MongoDB & Mongoose
