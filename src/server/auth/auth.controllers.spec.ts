import * as mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { setupTestDB } from '../../tests/helpers';
import { IUserDocument, User, UserClass } from '../api/users/user.model';
import { registerController, loginController } from './auth.controllers';

const userToCreate = ({
  username: 'uniqueUsername',
  firstName: 'test',
  lastName: 'user',
  emailAddress: 'unique@email.com',
  dateOfBirth: '2019-01-01',
  password: 'asF.s0f.s123123',
  hashedPassword: 'asF.s0f.s',
  settings: {
    darkMode: false
  }
} as any) as IUserDocument;

// ----------------------------------
// Auth Controller Specs
// ----------------------------------
describe(`Authentication Controllers`, () => {
  let mongoServer: MongoMemoryServer;
  let db: mongoose.Mongoose;

  beforeAll(async () => {
    ({ db, mongoServer } = await setupTestDB());
  });

  afterEach(async () => {
    // Clear all user after each test
    await User.deleteMany({}).exec();
  });

  afterAll(async () => {
    await db.disconnect();
    await mongoServer.stop();
  });

  describe('registerController', () => {
    it('should register a new user', async () => {
      const anotherUserToCreate = ({
        username: 'anotherUniqueUsername',
        firstName: 'test',
        lastName: 'user',
        emailAddress: 'anotherUnique@email.com',
        dateOfBirth: '2019-01-01',
        password: 'asF.s0f.s123123',
        hashedPassword: 'asF.s0f.s',
        settings: {
          darkMode: false
        }
      } as any) as IUserDocument;

      const anotherCreatedUser = await registerController(anotherUserToCreate);

      expect(anotherCreatedUser).toBeTruthy();
      expect(anotherCreatedUser.id).toBeTruthy();
    });

    it('should not return the password or hashed password if successful', async () => {
      const anotherUserToCreate = ({
        username: 'anotherUniqueUsername',
        firstName: 'test',
        lastName: 'user',
        emailAddress: 'anotherUnique@email.com',
        dateOfBirth: '2019-01-01',
        password: 'asF.s0f.s123123',
        hashedPassword: 'asF.s0f.s',
        settings: {
          darkMode: false
        }
      } as any) as IUserDocument;

      const anotherCreatedUser = await registerController(anotherUserToCreate);

      expect((anotherCreatedUser as any).password).not.toBe(null);
      expect((anotherCreatedUser as any).hashedPassword).not.toBe(null);
    });

    it('should not not allow a user to register if the username or password is created', async () => {
      const userWithUniqueDetails = ({
        ...userToCreate,
        username: 'anotherUsername',
        emailAddress: 'anotherUnique@email.com'
      } as any) as IUserDocument;

      const userWithDifferentUsername = ({
        ...userWithUniqueDetails,
        username: 'anotherUniqueUsername'
      } as any) as IUserDocument;

      const userWithDifferentUsernameAndEmail = ({
        ...userWithDifferentUsername,
        emailAddress: 'secondUnique@email.com'
      } as any) as IUserDocument;

      await expect(
        registerController(userWithUniqueDetails)
      ).resolves.not.toThrowError();

      await expect(
        registerController(userWithUniqueDetails)
      ).rejects.toThrowError('Username is not available');

      await expect(
        registerController(userWithDifferentUsername)
      ).rejects.toThrowError();

      await expect(
        registerController(userWithDifferentUsernameAndEmail)
      ).resolves.not.toThrowError();
    });
  });

  describe('loginController', () => {
    it('should return an access token if correct credentials are provided', async () => {
      await registerController(userToCreate);

      const token = await loginController(
        userToCreate.username,
        (userToCreate as any).password
      );

      expect(token.token).toBeDefined();
    });

    it('should throw unauthorized error if the credentials are incorrect', async () => {
      await registerController(userToCreate);

      await expect(
        loginController(userToCreate.username, 'somePassword')
      ).rejects.toThrowError('Unauthorized');
      await expect(
        loginController('user', (userToCreate as any).password)
      ).rejects.toThrowError('Unauthorized');
    });
  });

  //   describe(`loginController`, () => {
  //     it(`should return a authorization token if the credentials match`, async () => {});
  //   });
});
