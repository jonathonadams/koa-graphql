import createApiSpec from '../../../tests/api-spec';
import { IUserDocument, User } from './user.model';
const user = ({
  username: 'test user',
  firstName: 'test',
  lastName: 'user',
  emailAddress: 'test@domain.com',
  dateOfBirth: '2019-01-01',
  password: 'asF.s0f.s',
  hashedPassword: 'asF.s0f.s',
  role: 0,
  settings: {
    darkMode: false
  }
} as any) as IUserDocument;

const updatedUser = { username: 'updated user' };

createApiSpec({
  model: User,
  resourceName: 'user',
  resourceToCreate: user,
  resourceToUpdate: updatedUser,
  urlString: 'users'
});
