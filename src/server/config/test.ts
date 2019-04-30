import { EnvironnementConfig } from './config';

/**
 * Test environment settings
 */
const testConfig: EnvironnementConfig = {
  logging: 'dev',
  docs: true,
  databaseOptions: {
    logging: false
  },
  expireTime: 1200,
  secrets: {
    accessToken: process.env.ACCESS_TOKEN_SECRET || 'test-secret',
    refreshToken: process.env.REFRESH_TOKEN_SECRET || 'test-secret'
  },
  database: {
    host: process.env.POSTGRES_TCP_ADDR || 'localhost',
    port:
      process.env.POSTGRES_TCP_PORT && !Number.isNaN(parseInt(process.env.POSTGRES_TCP_PORT, 10))
        ? parseInt(process.env.POSTGRES_TCP_PORT, 10)
        : 5432,
    db: process.env.POSTGRES_TEST_DB || 'test_database',
    user: process.env.POSTGRES_TEST_USER || 'postgres',
    pass: process.env.POSTGRES_TEST_PASSWORD || 'postgres'
  }
};

export default testConfig;
