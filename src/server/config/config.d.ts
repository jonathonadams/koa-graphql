export interface GlobalConfig {
  port: number;
  databaseOptions: any;
}

export interface EnvironnementConfig {
  logging: false | 'dev';
  docs: boolean;
  databaseOptions: any;
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
