import mongoose from 'mongoose';
import { AuthenticationRoles } from '../../auth/roles';
import { defaultSchemaOptions } from '../../db/schema-options';

export class UserClass extends mongoose.Model {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  dateOfBirth: Date | string;
  active: boolean;
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
  role: AuthenticationRoles;

  /**
   * This function is only used for the auth function and hence, must return the hashed password
   *
   * @param username The username to search by.
   */
  public static findByUsername(
    username: string
  ): Promise<IUserDocument | null> {
    return this.findOne({
      username: username
    })
      .select('+hashedPassword +role')
      .exec();
  }
}

export const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    emailAddress: {
      type: String,
      required: true,
      unique: true
    },
    dateOfBirth: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      required: true,
      default: true
    },
    settings: {
      darkMode: {
        type: Boolean,
        required: true
      },
      colors: {
        lightPrimary: String,
        lightAccent: String,
        darkPrimary: String,
        darkAccent: String
      }
    },
    role: {
      type: Number,
      required: true,
      select: false,
      default: AuthenticationRoles.User
    },
    hashedPassword: {
      type: String,
      required: true,
      select: false
    }
  },
  {
    ...defaultSchemaOptions
  }
);

export interface IUserDocument extends mongoose.Document {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  dateOfBirth: Date | string;
  active: boolean;
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
  role: AuthenticationRoles;
}

export interface IUserModel extends mongoose.Model<IUserDocument> {
  findByUsername: (userName: string) => Promise<IUserDocument | null>;
}

userSchema.loadClass(UserClass);
export const User = mongoose.model<IUserDocument, IUserModel>(
  'user',
  userSchema
);
