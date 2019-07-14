/* istanbul ignore file */

import 'jest-extended';
import mongoose from 'mongoose';
import { runQuery, setupTestDB } from './helpers';
import { signAccessToken } from '../server/auth/auth';
import { ExecutionResultDataDefault } from 'graphql/execution/execute';
import { IUserDocument } from '../server/api/users/user.model';
import { MongoMemoryServer } from 'mongodb-memory-server';

/**
 * Object.keys(object) is used to return an array of the names of object properties.
 * This can be used to create abstracted values to create the query strings
 * Example of a query string
 *
 * @param model
 * @param resourceName
 * @param resourceToCreate
 * @param resourceToUpdate
 * @param testDependents
 */
export default function createGraphQLSpec<T>(
  model: any,
  resourceName: string,
  resourceToCreate: any,
  resourceToUpdate: any
) {
  if (!resourceToCreate || Object.keys(resourceToCreate).length === 0) {
    throw new Error(
      'Must provide an object to create with properties of at least length 1'
    );
  }

  if (!resourceToUpdate || Object.keys(resourceToUpdate).length === 0) {
    throw new Error(
      'Must provide an object to updated with properties of at least length 1'
    );
  }

  // GraphQL schemas are designed written with UpperCase names
  const upperResourceName =
    resourceName.charAt(0).toUpperCase() + resourceName.slice(1);

  describe(`GraphQL / ${upperResourceName}`, () => {
    let mongoServer: MongoMemoryServer;
    let db: mongoose.Mongoose;
    let resource: T;
    let jwt: string;

    beforeAll(async () => {
      ({ db, mongoServer } = await setupTestDB());
      jwt = signAccessToken({ id: '1', role: 0 } as IUserDocument);

      resource = await model.create(resourceToCreate);
    });

    afterAll(async () => {
      await db.disconnect();
      await mongoServer.stop();
    });

    describe(`new${upperResourceName}($input: New${upperResourceName}Input!)`, () => {
      it(`should create a new ${upperResourceName}`, async () => {
        const queryName = `new${upperResourceName}`;
        const result = await runQuery(
          `
        mutation New${upperResourceName}($input: New${upperResourceName}Input!) {
          ${queryName}(input: $input) {
            id
          }
        }
      `,
          { input: resourceToCreate },
          jwt
        );

        expect(result.errors).not.toBeDefined();
        expect(
          (result.data as ExecutionResultDataDefault)[queryName]
        ).toBeObject();
        expect(
          (result.data as ExecutionResultDataDefault)[queryName].id
        ).toBeString();
      });
    });

    describe(`all${upperResourceName}s`, () => {
      it(`should return all ${resourceName}s`, async () => {
        const queryName = `all${upperResourceName}s`;
        const result = await runQuery(
          `
          {
            ${queryName} {
              id
              ${Object.keys(resourceToCreate)[0]}
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

    describe(`${resourceName}(id: ID!)`, () => {
      it(`should return a ${resourceName} by id`, async () => {
        const queryName = `${resourceName}`;

        const result = await runQuery(
          `
        {
          ${queryName}(id: "${(resource as any).id}") {
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
        expect(
          (result.data as ExecutionResultDataDefault)[queryName].id
        ).toEqual((resource as any).id.toString());
      });
    });

    describe(`update${upperResourceName}($input: Updated${upperResourceName}Input!)`, () => {
      it(`should update an ${upperResourceName}`, async () => {
        const queryName = `update${upperResourceName}`;

        resourceToUpdate.id = (resource as any).id;

        const result = await runQuery(
          `
            mutation Update${upperResourceName}($input: Updated${upperResourceName}Input!) {
              ${queryName}(input: $input) {
                id
              }
            }
          `,
          { input: resourceToUpdate },
          jwt
        );

        expect(result.errors).not.toBeDefined();
        expect(
          (result.data as ExecutionResultDataDefault)[queryName]
        ).toBeObject();
        expect(
          (result.data as ExecutionResultDataDefault)[queryName].id
        ).toEqual((resource as any).id.toString());
      });
    });

    describe(`remove${upperResourceName}($id: ID!)`, () => {
      it(`should delete a ${upperResourceName} by id`, async () => {
        const queryName = `remove${upperResourceName}`;
        const result = await runQuery(
          `
            mutation Remove${upperResourceName}($id: ID!) {
              ${queryName}(id: $id) {
                id
              }
            }`,
          { id: (resource as any).id },
          jwt
        );

        expect(result.errors).not.toBeDefined();
        expect(
          (result.data as ExecutionResultDataDefault)[queryName]
        ).toBeObject();
      });
    });
  });
}
