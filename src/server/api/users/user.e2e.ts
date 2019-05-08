import { User, IUserDocument } from './user.model';
import * as mongoose from 'mongoose';
import { runQuery } from '../../../tests/helpers';
import { signToken } from '../../auth/auth';
import { ExecutionResultDataDefault } from 'graphql/execution/execute';
import { dbConnection } from '../../db/mongo';

const user = ({
  username: 'test user',
  firstName: 'test',
  lastName: 'user',
  emailAddress: 'test@domain.com',
  dateOfBirth: '2019-01-01',
  password: 'asF.s0f.s'
} as any) as IUserDocument;

const updatedUser = { username: 'updated user' };

// ----------------------------------
// GraphQL API tests
// ----------------------------------
describe(`GraphQL / User`, () => {
  // let connection: mongoose.Connection;
  let db: any;
  let createdUser: IUserDocument;
  let jwt: string;

  beforeEach(async () => {
    db = await dbConnection();
    // connection = ;
    // db = connection.db

    console.log(db);

    createdUser = await User.create(user);
    jwt = signToken(createdUser);
  });

  afterAll(async () => {
    await db.close();
  });

  describe(`allUsers`, () => {
    it(`should return all Users`, async () => {
      const queryName = `allUsers`;
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
      expect((result.data as ExecutionResultDataDefault)[queryName]).toBeArray();
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
      expect((result.data as ExecutionResultDataDefault)[queryName]).toBeObject();
      expect((result.data as ExecutionResultDataDefault)[queryName].id).toEqual(
        createdUser.id.toString()
      );
    });
  });

  describe(`register($input: NewUserInput!)`, () => {
    it(`should create a new User`, async () => {
      // Drop the table and sync again when creating a resource as the resource has already been created
      // This will cause an errors if there are meant to be unique fields
      await db.collections['user'].remove(function() {});

      const queryName = `register`;
      const result = await runQuery(
        `
      mutation Register($input: NewUserInput!) {
        ${queryName}(input: $input) {
          id
        }
      }
    `,
        { input: user },
        jwt
      );

      expect(result.errors).not.toBeDefined();
      expect((result.data as ExecutionResultDataDefault)[queryName]).toBeObject();
      expect((result.data as ExecutionResultDataDefault)[queryName].id).toBeString();
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
      expect((result.data as ExecutionResultDataDefault)[queryName]).toBeObject();
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
      expect((result.data as ExecutionResultDataDefault)[queryName]).toBeObject();
    });
  });
});
