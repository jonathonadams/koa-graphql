/* istanbul ignore file */

import { EnvironnementConfig } from './config';

/**
 * Test environment settings
 */
const testConfig: EnvironnementConfig = {
  logging: 'dev',
  docs: true,
  databaseOptions: {
    loggerLevel: 'warn'
  },
  expireTime: 1200,
  secrets: {
    accessToken: process.env.ACCESS_TOKEN_SECRET || 'test-secret',
    refreshToken: process.env.REFRESH_TOKEN_SECRET || 'test-secret'
  },
  database: {
    host: process.env.MONGO_TCP_ADDR || 'localhost',
    port:
      process.env.MONGO_TCP_PORT &&
      !Number.isNaN(parseInt(process.env.MONGO_TCP_PORT, 10))
        ? parseInt(process.env.MONGO_TCP_PORT, 10)
        : 27017,
    dbName: process.env.MONGO_TEST_DB || 'test_database',
    user: process.env.MONGO_TEST_USER || 'mongo',
    pass: process.env.MONGO_TEST_PASSWORD || 'mongo'
  }
};

export default testConfig;
