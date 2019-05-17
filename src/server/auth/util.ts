import * as omit from 'lodash.omit';
import { IUserDocument } from '../api/users/user.model';

export function userToJSON(user: IUserDocument) {
  return omit(user, ['hashedPassword', 'createdAt', 'updatedAt']);
}

export function isPasswordAllowed(password: string): boolean {
  return (
    !!password &&
    password.length > 6 &&
    /\d/.test(password) &&
    /\D/.test(password)
  );
}
