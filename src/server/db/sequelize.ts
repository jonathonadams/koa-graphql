import { Sequelize } from 'sequelize';
import config from '../config';

// Create shared instance to be used across models
export const sequelize = new Sequelize(
  config.database.db,
  config.database.user,
  config.database.pass,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: config.databaseOptions.dialect,
    logging: config.databaseOptions.logging,
    pool: config.databaseOptions.pool,
    define: config.databaseOptions.define,
    quoteIdentifiers: config.databaseOptions.quoteIdentifiers,
    operatorsAliases: config.databaseOptions.operatorsAliases,
    dialectOptions: config.databaseOptions.dialectOptions
  }
);
