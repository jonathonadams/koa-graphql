import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User, IUserDocument } from './user.model';
import { runQuery, setupTestDB } from '../../../tests/helpers';
import { signAccessToken } from '../../auth/auth';
import { ExecutionResultDataDefault } from 'graphql/execution/execute';

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

// ----------------------------------
// GraphQL API tests
// ----------------------------------
describe(`GraphQL / User`, () => {
  // let connection: mongoose.Connection;
  let mongoServer: MongoMemoryServer;
  let db: mongoose.Mongoose;
  let createdUser: IUserDocument;
  let jwt: string;

  beforeAll(async () => {
    ({ db, mongoServer } = await setupTestDB());

    createdUser = await User.create(user);
    [createdUser.id, createdUser._id] = [createdUser._id, createdUser.id];
    jwt = signAccessToken(createdUser);
  });

  afterAll(async () => {
    await db.disconnect();
    await mongoServer.stop();
  });

  describe(`allUsers`, () => {
    it(`should return all Users`, async () => {
      const queryName = `allUsers`;
      //language=GraphQL
      const result = await runQuery(
        `
        {
          ${queryName} {
            id
            username
          }
        }`,
        {},
        jwt
      );

      expect(result.errors).not.toBeDefined();
      expect(
        (result.data as ExecutionResultDataDefault)[queryName]
      ).toBeArray();
    });
  });

  describe(`User(id: ID!)`, () => {
    it(`should return a User by id`, async () => {
      const queryName = `User`;

      const result = await runQuery(
        `
      {
        ${queryName}(id: "${createdUser.id}") {
          id
        }
      }`,
        {},
        jwt
      );

      expect(result.errors).not.toBeDefined();
      expect(
        (result.data as ExecutionResultDataDefault)[queryName]
      ).toBeObject();
      expect((result.data as ExecutionResultDataDefault)[queryName].id).toEqual(
        createdUser.id.toString()
      );
    });
  });

  describe(`register($input: NewUserInput!)`, () => {
    it(`should create a new User`, async () => {
      const differentUser = {
        ...user,
        username: 'A different user',
        emailAddress: 'someDifferent@email.com'
      };
      delete differentUser['role'];
      delete differentUser['hashedPassword'];

      const queryName = `register`;
      const result = await runQuery(
        `
      mutation Register($input: NewUserInput!) {
        ${queryName}(input: $input) {
          id
          username
        }
      }
    `,
        { input: differentUser },
        jwt
      );

      expect(result.errors).not.toBeDefined();
      expect(
        (result.data as ExecutionResultDataDefault)[queryName]
      ).toBeObject();
      expect(
        (result.data as ExecutionResultDataDefault)[queryName].id
      ).toBeString();
      expect(
        (result.data as ExecutionResultDataDefault)[queryName].username
      ).toEqual(differentUser.username);
    });
  });

  describe(`updateUser($input: UpdatedUserInput!)`, () => {
    it(`should update an User`, async () => {
      const queryName = `updateUser`;

      (updatedUser as any).id = createdUser.id;

      const result = await runQuery(
        `
          mutation UpdateUser($input: UpdatedUserInput!) {
            ${queryName}(input: $input) {
              id
            }
          }
        `,
        { input: updatedUser },
        jwt
      );

      expect(result.errors).not.toBeDefined();
      expect(
        (result.data as ExecutionResultDataDefault)[queryName]
      ).toBeObject();
      expect((result.data as ExecutionResultDataDefault)[queryName].id).toEqual(
        createdUser.id.toString()
      );
    });
  });

  describe(`removeUser($id: ID!)`, () => {
    it(`should delete a User by id`, async () => {
      const queryName = `removeUser`;
      const result = await runQuery(
        `
          mutation RemoveUser($id: ID!) {
            ${queryName}(id: $id) {
              id
            }
          }`,
        { id: createdUser.id },
        jwt
      );

      expect(result.errors).not.toBeDefined();
      expect(
        (result.data as ExecutionResultDataDefault)[queryName]
      ).toBeObject();
    });
  });
});
