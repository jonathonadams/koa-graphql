// -----------------------------------
// Test environment settings
// -----------------------------------
const testConfig: any = {
  logging: 'dev',
  docs: true,
  databaseOptions: {
    logging: false
  },
  expireTime: 1200,
  secrets: {
    jwt: process.env.JWT
  }
};

testConfig.database = {
  host: process.env.POSTGRES_PORT_5432_TCP_ADDR,
  port: process.env.POSTGRES_PORT_5432_TCP_PORT,
  db: process.env.POSTGRES_ENV_POSTGRES_TEST_DB,
  user: process.env.POSTGRES_ENV_POSTGRES_USER,
  pass: process.env.POSTGRES_ENV_POSTGRES_PASSWORD
};

export default testConfig;
