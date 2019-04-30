import { Options } from 'sequelize';

export interface GlobalConfig {
  port: number;
  databaseOptions: Options;
}

export interface EnvironnementConfig {
  logging: false | 'dev';
  docs: boolean;
  databaseOptions: Options;
  expireTime: number;
  secrets: {
    accessToken: string;
    refreshToken: string;
  };
  database: {
    host: string;
    port: number;
    db: string;
    user: string;
    pass: string;
  };
}

export interface ServerConfig extends GlobalConfig, EnvironnementConfig {}
