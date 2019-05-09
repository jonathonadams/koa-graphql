# About This Project

TODO -> Document

## How to Install & Build

TODO -> Document

## Database Setup

TODO -> Document
Follow the instructions [here](./docs/DOCKER_BASICS.md) to setup a Database with Docker

### Node 12 & ES6 Module Imports

While typescript can work fine using ES6 Imports (adding fully resolved imports and `"type": "module"` to the package.json), currently Jest does not work with native ES6 Modules yet.

The Github issue can be found [here](https://github.com/facebook/jest/issues/4842)

### Archived Postgres & Sequelize setup

This API Server was initially setup with Postgres & Sequelize. The final version of the API using Postgres & Sequelize has been tagged `Final-Postgres/Sequelize`. You can check that out to view the API before switching to MongoDB & Mongoose
