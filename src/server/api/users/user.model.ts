import sequelize from 'sequelize';
import { db } from '../../db/sequelize';
import { AuthenticationScopes } from 'src/server/auth/scopes';

const { Model, DataTypes, Sequelize } = sequelize;

// Sequelize Operation symbols
const Op = (Sequelize as any).Op;

export class User extends Model<User> {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  dateOfBirth: Date | string;
  settings: {
    darkMode: boolean;
    colors: {
      lightPrimary: string;
      lightAccent: string;
      darkPrimary: string;
      darkAccent: string;
    };
  };
  hashedPassword: string;
  scope: AuthenticationScopes;
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

// Initialize the sequelize map.
User.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV1, primaryKey: true },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    username: DataTypes.STRING,
    emailAddress: DataTypes.STRING,
    dateOfBirth: DataTypes.DATE,
    settings: DataTypes.JSONB,
    hashedPassword: DataTypes.STRING,
    scope: DataTypes.INTEGER
  },
  {
    sequelize: db,
    defaultScope: {
      attributes: { exclude: ['hashedPassword', 'createdAt', 'updatedAt'] }
    },
    scopes: {
      withPassword: {
        attributes: { include: ['hashedPassword'] }
      }
    }
  }
);
