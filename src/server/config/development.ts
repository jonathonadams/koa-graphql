// -----------------------------------
// Development environment settings
// -----------------------------------
const devConfig: any = {
  logging: 'dev',
  docs: true,
  databaseOptions: {
    logging: console.log
  },
  expireTime: Number(process.env.JWT_EXPIRE_TIME) || 86400,
  secrets: {
    accessToken: process.env.ACCESS_TOKEN_SECRET,
    refreshToken: process.env.REFRESH_TOKEN_SECRET
  }
};

devConfig.database = {
  host: process.env.POSTGRES_PORT_5432_TCP_ADDR,
  port: process.env.POSTGRES_PORT_5432_TCP_PORT,
  db: process.env.POSTGRES_ENV_POSTGRES_DEV_DB,
  user: process.env.POSTGRES_ENV_POSTGRES_USER,
  pass: process.env.POSTGRES_ENV_POSTGRES_PASSWORD
};

export default devConfig;
