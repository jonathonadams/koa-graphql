import mongoose from 'mongoose';
import { defaultSchemaOptions } from '../db/schema-options';
import { IUserDocument } from '../api/users/user.model';

/**
 * This resource is not publicly available but used to store all refresh tokens
 */
export class RefreshTokenClass extends mongoose.Model {
  user: IUserDocument;
  token: string;

  static findByTokenWithUser(
    token: string
  ): Promise<IRefreshTokenDocument | null> {
    return this.findOne({ token })
      .populate('user')
      .exec();
  }
}

export const refreshTokenSchema = new mongoose.Schema(
  {
    user: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    token: {
      required: true,
      type: String
    }
  },
  {
    ...defaultSchemaOptions
  }
);

export interface IRefreshTokenDocument extends mongoose.Document {
  user: IUserDocument;
  token: string;
}

export interface IRefreshTokenModel
  extends mongoose.Model<IRefreshTokenDocument> {
  findByTokenWithUser: (token: string) => Promise<IRefreshTokenDocument | null>;
}

refreshTokenSchema.loadClass(RefreshTokenClass);
export const RefreshToken = mongoose.model<
  IRefreshTokenDocument,
  IRefreshTokenModel
>('refresh-token', refreshTokenSchema);
