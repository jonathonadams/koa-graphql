import * as omit from 'lodash.omit';
import { User } from '../api/users';

export function userToJSON(user: User) {
  return omit(user, ['hashedPassword', 'createdAt', 'updatedAt']);
}

export function isPasswordAllowed(password: string) {
  return password.length > 6 && /\d/.test(password) && /\D/.test(password);
}
