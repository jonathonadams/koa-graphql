/* istanbul ignore file */

import { EnvironnementConfig } from './config';

/**
 * Development environment settings
 */
const devConfig: EnvironnementConfig = {
  logging: 'dev',
  docs: true,
  databaseOptions: {
    loggerLevel: 'warn'
  },
  expireTime: Number(process.env.JWT_EXPIRE_TIME) || 86400,
  secrets: {
    accessToken: process.env.ACCESS_TOKEN_SECRET || 'development-secret',
    refreshToken: process.env.REFRESH_TOKEN_SECRET || 'development-secret'
  },
  database: {
    host: process.env.MONGO_TCP_ADDR || 'localhost',
    port:
      process.env.MONGO_TCP_PORT &&
      !Number.isNaN(parseInt(process.env.MONGO_TCP_PORT, 10))
        ? parseInt(process.env.MONGO_TCP_PORT, 10)
        : 27017,
    dbName: process.env.MONGO_DEV_DB || 'development_database',
    user: process.env.MONGO_DEV_USER || 'mongo',
    pass: process.env.MONGO_DEV_PASSWORD || 'mongo'
  }
};

export default devConfig;
