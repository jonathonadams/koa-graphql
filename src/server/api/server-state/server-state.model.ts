import sequelize from 'sequelize';
import { db } from '../../db/sequelize.js';

const { Model, DataTypes } = sequelize;

/**
 * This resource is an internal resource to manage the state that is required
 * to be stored in the db for the servers internal use. e.g. the issues refresh tokens.
 */
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
  { sequelize: db, tableName: 'server_state', timestamps: false }
);
