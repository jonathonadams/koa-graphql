import { randomBytes } from 'crypto';
import { EnvironnementConfig } from './config';

/**
 * Production environment settings
 */
const prodConfig: EnvironnementConfig = {
  logging: false,
  docs: false,
  databaseOptions: {
    logging: false
  },
  expireTime: Number(process.env.JWT_EXPIRE_TIME) || 86400,
  secrets: {
    accessToken: process.env.ACCESS_TOKEN_SECRET || randomBytes(16).toString('hex'),
    refreshToken: process.env.REFRESH_TOKEN_SECRET || 'some-super-secret-password'
  },
  database: {
    host: process.env.POSTGRES_TCP_ADDR || 'localhost',
    port:
      process.env.POSTGRES_TCP_PORT && !Number.isNaN(parseInt(process.env.POSTGRES_TCP_PORT, 10))
        ? parseInt(process.env.POSTGRES_TCP_PORT, 10)
        : 5432,
    db: process.env.POSTGRES_DB || 'production_database',
    user: process.env.POSTGRES_USER || 'postgres',
    pass: process.env.POSTGRES_PASSWORD || 'postgres'
  }
};

export default prodConfig;
