import { ConnectionOptions } from 'mongoose';

/*
 * https://mongoosejs.com/docs/api.html#mongoose_Mongoose-connect
 * http://mongodb.github.io/node-mongodb-native/3.0/api/MongoClient.html
 */

export interface GlobalConfig {
  port: number;
  databaseOptions: ConnectionOptions;
}

export interface EnvironnementConfig {
  logging: false | 'dev';
  docs: boolean;
  databaseOptions: ConnectionOptions;
  expireTime: number;
  secrets: {
    accessToken: string;
    refreshToken: string;
  };
  database: {
    host: string;
    port: number;
    dbName: string;
    user: string;
    pass: string;
  };
}

export interface ServerConfig extends GlobalConfig, EnvironnementConfig {}
