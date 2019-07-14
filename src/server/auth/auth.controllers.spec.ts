import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { setupTestDB } from '../../tests/helpers';
import { IUserDocument, User } from '../api/users/user.model';
import {
  registerController,
  loginController,
  authorizeController,
  refreshAccessTokenController,
  revokeRefreshTokenController
} from './auth.controllers';

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

  describe('register', () => {
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

  describe('login', () => {
    it('should return an access token if correct credentials are provided', async () => {
      await registerController(userToCreate);

      const token = await loginController(
        userToCreate.username,
        (userToCreate as any).password
      );

      expect(token.token).toBeDefined();
    });

    it('should throw unauthorized errors if the credentials are incorrect', async () => {
      await registerController(userToCreate);

      await expect(
        loginController(userToCreate.username, 'somePassword')
      ).rejects.toThrowError('Unauthorized');
      await expect(
        loginController('user', (userToCreate as any).password)
      ).rejects.toThrowError('Unauthorized');
    });

    it('should throw an unauthorized error if the user is not active', async () => {
      await registerController(userToCreate);
      const user = (await User.findByUsername(
        userToCreate.username
      )) as IUserDocument;

      await expect(
        loginController(userToCreate.username, (userToCreate as any).password)
      ).resolves.not.toThrowError();

      await user.update({ active: false }).exec();

      await expect(
        loginController(userToCreate.username, (userToCreate as any).password)
      ).rejects.toThrowError('Unauthorized');
    });
  });

  describe('authorize', () => {
    it('should return an accessToken and refreshToken if the credentials correct', async () => {
      await registerController(userToCreate);
      const token = await authorizeController(
        userToCreate.username,
        (userToCreate as any).password
      );
      expect(token.token).toBeDefined();
      expect(token.refreshToken).toBeDefined();
    });

    it('should throw unauthorized errors if the credentials are incorrect', async () => {
      await registerController(userToCreate);

      await expect(
        authorizeController(userToCreate.username, 'somePassword')
      ).rejects.toThrowError('Unauthorized');

      await expect(
        authorizeController('userafad', (userToCreate as any).password)
      ).rejects.toThrowError('Unauthorized');
    });

    it('should throw an unauthorized error if the user is not active', async () => {
      await registerController(userToCreate);
      const user = (await User.findByUsername(
        userToCreate.username
      )) as IUserDocument;

      await expect(
        authorizeController(
          userToCreate.username,
          (userToCreate as any).password
        )
      ).resolves.not.toThrowError();

      await user.update({ active: false }).exec();

      await expect(
        authorizeController(
          userToCreate.username,
          (userToCreate as any).password
        )
      ).rejects.toThrowError('Unauthorized');
    });
  });

  describe('refreshAccessToken', () => {
    it('should return a new access token when the a valid refresh token is provided', async () => {
      await registerController(userToCreate);
      const { refreshToken } = await authorizeController(
        userToCreate.username,
        (userToCreate as any).password
      );
      const accessToken = await refreshAccessTokenController(
        userToCreate.username,
        refreshToken
      );

      expect(accessToken.token).toBeDefined();
      expect(accessToken.token).toBeString();
    });

    it('should throw a unauthorized errors if invalid username or token provided', async () => {
      await registerController(userToCreate);

      const { refreshToken } = await authorizeController(
        userToCreate.username,
        (userToCreate as any).password
      );

      await expect(
        authorizeController(userToCreate.username, 'Incorrect Token')
      ).rejects.toThrowError('Unauthorized');

      await expect(
        authorizeController('userafad', refreshToken)
      ).rejects.toThrowError('Unauthorized');
    });
  });

  describe('revokeRefreshToken', () => {
    it('should revoke the refresh token provide', async () => {
      await registerController(userToCreate);

      const { refreshToken } = await authorizeController(
        userToCreate.username,
        (userToCreate as any).password
      );

      const result = await revokeRefreshTokenController(refreshToken);
      expect(result.success).toBe(true);
    });

    it('should remove the token from the db', async () => {
      await registerController(userToCreate);

      const { refreshToken } = await authorizeController(
        userToCreate.username,
        (userToCreate as any).password
      );

      // First call should remove it
      await revokeRefreshTokenController(refreshToken);

      // Confirm the token has been remove from the db.
      await expect(
        revokeRefreshTokenController(refreshToken)
      ).rejects.toThrowError('Bad Request');
    });
  });
});
