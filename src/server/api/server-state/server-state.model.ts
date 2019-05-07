import * as mongoose from 'mongoose';

/**
 * This resource is an internal resource to manage the state that is required
 * to be stored in the db for the servers internal use. e.g. the issues refresh tokens.
 */
export class ServerStateClass extends mongoose.Model {
  refreshTokens: any;

  public static getServerState() {
    return this.findOne({
      id: 1
    });
  }
}

export interface IServerStateDocument extends mongoose.Document {
  refreshTokens: any;
}

export interface IServerStateModel extends mongoose.Model<IServerStateDocument> {
  getServerState: () => mongoose.DocumentQuery<
    IServerStateDocument | null,
    IServerStateDocument,
    {}
  >;
}

export const serverStateSchema = new mongoose.Schema({
  refreshTokens: String
});

serverStateSchema.loadClass(ServerStateClass);
export const ServerState = mongoose.model<IServerStateDocument, IServerStateModel>(
  'server-state',
  serverStateSchema
);
