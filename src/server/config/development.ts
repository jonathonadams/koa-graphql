import { EnvironnementConfig } from './config';

/**
 * Development environment settings
 */
const devConfig: EnvironnementConfig = {
  logging: 'dev',
  docs: true,
  databaseOptions: {
    logging: console.log
  },
  expireTime: Number(process.env.JWT_EXPIRE_TIME) || 86400,
  secrets: {
    accessToken: process.env.ACCESS_TOKEN_SECRET || 'development-secret',
    refreshToken: process.env.REFRESH_TOKEN_SECRET || 'development-secret'
  },
  database: {
    host: process.env.POSTGRES_TCP_ADDR || 'localhost',
    port:
      process.env.POSTGRES_TCP_PORT && !Number.isNaN(parseInt(process.env.POSTGRES_TCP_PORT, 10))
        ? parseInt(process.env.POSTGRES_TCP_PORT, 10)
        : 5432,
    db: process.env.POSTGRES_DEV_DB || 'development_database',
    user: process.env.POSTGRES_DEV_USER || 'postgres',
    pass: process.env.POSTGRES_DEV_PASSWORD || 'postgres'
  }
};

export default devConfig;
