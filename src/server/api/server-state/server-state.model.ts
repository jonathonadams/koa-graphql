import { Model, DataTypes, Sequelize } from 'sequelize';
import { sequelize } from '../../db/sequelize';

const Op = (Sequelize as any).Op;
// This resource is an internal resource to manage and state that is required
// to be stored in the db for the servers internal use. e.g. the issues refresh tokens.

export class ServerState extends Model<ServerState> {
  id: number;
  refreshTokens: any;

  public static getServerState() {
    return this.findOne({
      where: {
        id: 1
      }
    });
  }
}

ServerState.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    refreshTokens: DataTypes.JSONB
  },
  { sequelize: sequelize, tableName: 'server_state', timestamps: false }
);
