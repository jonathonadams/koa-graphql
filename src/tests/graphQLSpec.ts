import 'jest-extended';
import { runQuery, TestDependents, syncDb } from './helpers';
import { User } from '../server/api/users';
import { signToken } from '../server/auth/auth';
import { Sequelize } from 'sequelize';

// -----------------------------------
// Object.keys(object) is used to return an array of the names of object properties.
// This can be used to create abstraced values to create the query strings
// Example of a query string
// `
// mutation NewAdviser($input: NewAdviser!) {
//   Adviser(input: $input) {
//     id
//     name
//   }
// }
// `
// ------------------------------------
export default function createGraphQLSpec<T>(
  model: any,
  resourceName: string,
  resourceToCreate: any,
  resourceToUpdate: any,
  testDependents: TestDependents<any>[] = []
) {
  if (!resourceToCreate || Object.keys(resourceToCreate).length === 0) {
    throw new Error('Must provide an obect to create with properties of at least length 1');
  }

  if (!resourceToUpdate || Object.keys(resourceToUpdate).length === 0) {
    throw new Error('Must provide an obect to updated with properties of at least length 1');
  }

  // GraphQL schemas are designed written with UpperCase names
  // const lowerResourceName = resourceName.toLocaleLowerCase();
  const upperResourceName = resourceName.charAt(0).toUpperCase() + resourceName.slice(1);

  describe(`GraphQL / ${upperResourceName}`, () => {
    let db: Sequelize;
    let user: User;
    let resource: T;
    let jwt: string;

    beforeEach(async () => {
      db = await syncDb();
      user = await User.create({ username: 'stu1', passwordHash: '123' });
      jwt = signToken(user);

      // If any depended models/resources are required,
      // Sync and create them in the database.
      if (testDependents.length !== 0) {
        for (const dependent of testDependents) {
          await dependent.model.drop({ cascade: true });
          await dependent.model.sync();
          await dependent.model.create(dependent.resource);
        }
      }
      resource = await model.create(resourceToCreate);
    });

    afterAll(async () => {
      await db.close();
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
          user,
          jwt
        );

        expect(result.errors).not.toBeDefined();
        expect(result.data[queryName]).toBeArray();

        // expect(result.errors).to.not.exist;
        // expect(result.data[queryName]).to.be.an('array');
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
          user,
          jwt
        );

        expect(result.errors).not.toBeDefined();
        expect(result.data[queryName]).toBeObject();
        expect(result.data[queryName].id).toEqual((resource as any).id.toString());

        // expect(result.errors).to.not.exist;
        // expect(result.data[queryName]).to.be.an('object');
        // expect(result.data[queryName].id).to.eql((resource as any).id);
      });
    });

    describe(`new${upperResourceName}($input: New${upperResourceName}Input!)`, () => {
      it(`should create a new ${upperResourceName}`, async () => {
        // Drop the table and sync again when creating a resource as the resource has already been created
        // This will cause an errors if there are meant to be unique fields
        await model.drop({ cascade: true });
        await model.sync();

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
          user,
          jwt
        );

        expect(result.errors).not.toBeDefined();
        expect(result.data[queryName]).toBeObject();
        expect(result.data[queryName].id).toBeString();

        // expect(result.errors).to.not.exist;
        // expect(result.data[queryName]).to.be.an('object');
        // expect(result.data[queryName].id).to.be.a('string');
      });
    });

    describe(`update${upperResourceName}($input: Updated${upperResourceName}Input!)`, () => {
      it(`should update an ${upperResourceName}`, async () => {
        const queryName = `update${upperResourceName}`;

        // const update = { id: (resource as any).id };
        // update[Object.keys(resourceToUpdate)[0]] =
        //   resourceToUpdate[Object.keys(resourceToUpdate)[0]];
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
          user,
          jwt
        );

        expect(result.errors).not.toBeDefined();
        expect(result.data[queryName]).toBeObject();
        expect(result.data[queryName].id).toEqual((resource as any).id.toString());

        // expect(result.errors).to.not.exist;
        // expect(result.data[queryName]).to.be.an('object');
        // expect(result.data[queryName].id).to.eql((resource as any).id);
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
          user,
          jwt
        );

        expect(result.errors).not.toBeDefined();
        expect(result.data[queryName]).toBeObject();

        // expect(result.errors).to.not.exist;
        // expect(result.data[queryName]).to.be.an('object');
      });
    });
  });
}
