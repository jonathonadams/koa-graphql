import * as merge from 'lodash.merge';
import devConfig from './development';
import prodConfig from './production';
import testConfig from './test';
import { Options } from 'sequelize';

// ---------------------------------------------------------------
// Application configuration belongs in this file
// and associated environment files
// Configuration is dynamic based on what environment is running
// production, development or testing
// ---------------------------------------------------------------
const config: any = {};

// ---------------------------------------------------------------
// Config values common across all environments environments
// ---------------------------------------------------------------
// HTTP port for the server
config.port = process.env.PORT || 3000;

// Default timezone for date manipulation
config.timezone = process.env.TIMEZONE;

// Global database options for sequelize
const databaseOptions: Options = {
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  quoteIdentifiers: false,
  define: {
    // Default options for each model definition
    // converts cameCase js to snake_case db table and field names
    underscored: true
    // // don't add the timestamp attributes (updatedAt, createdAt)
    // timestamps: false,
    // // don't delete database entries but set the newly added attribute deletedAt
    // // to the current date (when deletion was done). paranoid will only work if
    // // timestamps are enabled
    // paranoid: true
  }
};
config.databaseOptions = databaseOptions;

// ----------------------------------------------------
// Assign values based on current execution environment
// ----------------------------------------------------
let environmentSettings;
switch (process.env.NODE_ENV) {
  case 'prod':
  case 'production':
    environmentSettings = prodConfig;
    break;
  case 'test':
  case 'testing':
    environmentSettings = testConfig;
    break;
  case 'development':
  case 'dev':
    environmentSettings = devConfig;
    break;
  default:
    environmentSettings = prodConfig;
    break;
}

// Merge overrides the global settings with the
// environment settings based on the NODE_ENV
merge(config, environmentSettings);

export default config;
