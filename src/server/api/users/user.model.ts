import { Model, DataTypes, Sequelize } from 'sequelize';
import { sequelize } from '../../db/sequelize';

// Sequelize Operation symbols
const Op = (Sequelize as any).Op;

export class User extends Model {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  emailAddress: string;
  hashedPassword: string;
  createdAt: Date;
  updatedAt: Date;

  // This function is only used for the auth function
  // And hence, must return the hashed password
  public static findByUsername(username: string) {
    return this.scope('withPassword').findOne({
      where: {
        username: {
          [Op.eq]: username
        }
      }
    });
  }
}

// Initialize the sequlize map.
User.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV1, primaryKey: true },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    username: DataTypes.STRING,
    emailAddress: DataTypes.STRING,
    hashedPassword: DataTypes.STRING
  },
  {
    sequelize: sequelize,
    defaultScope: {
      attributes: { exclude: ['hashedPassword'] }
    },
    scopes: {
      withPassword: {
        attributes: { include: ['hashedPassword'] }
      }
    }
  }
);
