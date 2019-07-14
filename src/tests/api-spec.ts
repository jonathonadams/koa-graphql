/* istanbul ignore file */

import 'jest-extended';
import mongoose from 'mongoose';
// @ts-ignore
import request from 'supertest';
import { setupTestDB, RESTTestResource } from './helpers';
import { signAccessToken } from '../server/auth/auth';
import { IUserDocument } from '../server/api/users/user.model';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { server } from '../index';

export default function createApiSpec<T>(resource: RESTTestResource<T>) {
  if (
    !resource.resourceToCreate ||
    Object.keys(resource.resourceToCreate).length === 0
  ) {
    throw new Error(
      'Must provide an object to create with properties of at least length 1'
    );
  }

  if (
    !resource.resourceToUpdate ||
    Object.keys(resource.resourceToUpdate).length === 0
  ) {
    throw new Error(
      'Must provide an object to updated with properties of at least length 1'
    );
  }

  // GraphQL schemas are designed written with UpperCase names
  const upperResourceName =
    resource.resourceName.charAt(0).toUpperCase() +
    resource.resourceName.slice(1);

  describe(`/api/${resource.urlString}`, () => {
    let mongoServer: MongoMemoryServer;
    let db: mongoose.Mongoose;
    let jwt: string;
    let tempResource: any;

    beforeAll(async () => {
      ({ db, mongoServer } = await setupTestDB());
      jwt = signAccessToken({ id: '1', role: 0 } as IUserDocument);
    });

    afterEach(async () => {});

    afterAll(async () => {
      await db.disconnect();
      await mongoServer.stop();
      await server.close();
    });

    describe(`POST /api/${resource.urlString}`, () => {
      it(`should create a new ${resource.resourceName}`, async () => {
        const result = await request(server)
          .post(`/api/${resource.urlString}`)
          .set('Authorization', `Bearer ${jwt}`)
          .send(resource.resourceToCreate);

        expect(result.status).toEqual(201);
        expect(result.body).toBeDefined();
        expect(result.body.id).toBeDefined();

        tempResource = result.body;
      });
    });

    describe(`GET /api/${resource.urlString}`, () => {
      it(`should get all ${resource.urlString}'s`, async () => {
        //semi-tests the creation of resourceToCreate

        const result = await request(server)
          .get(`/api/${resource.urlString}`)
          .set('Authorization', `Bearer ${jwt}`);

        expect(result.status).toEqual(200);
        expect(result.body).toBeArrayOfSize(1);
      });
    });

    describe(`GET /api/${resource.urlString}/:id`, () => {
      it(`should get one ${resource.urlString}'s by id`, async () => {
        const result = await request(server)
          .get(`/api/${resource.urlString}/${tempResource.id}`)
          .set('Authorization', `Bearer ${jwt}`);

        expect(result.status).toEqual(200);
        expect(result.body).toBeTruthy();
        expect(result.body.id).toEqual(tempResource.id);
      });
    });

    describe(`PUT /api/${resource.urlString}/:id`, () => {
      it(`should update the ${resource.resourceName}`, async () => {
        const result = await request(server)
          .put(`/api/${resource.urlString}/${tempResource.id}`)
          .set('Authorization', `Bearer ${jwt}`)
          .send(resource.resourceToUpdate);

        expect(result.body).toBeTruthy();
        expect(result.status).toEqual(201);
        expect(result.body).toBeTruthy();
        expect(tempResource).not.toEqual(result.body);
      });
    });

    describe(`DELETE /api/${resource.urlString}/:id`, () => {
      it(`should delete a ${resource.resourceName} by id`, async () => {
        const result = await request(server)
          .delete(`/api/${resource.urlString}/${tempResource.id}`)
          .set('Authorization', `Bearer ${jwt}`);

        const getOne = await request(server)
          .get(`/api/${resource.urlString}/${tempResource.id}`)
          .set('Authorization', `Bearer ${jwt}`);

        expect(result.status).toEqual(204);
        expect(result.body).toBeTruthy();
        expect(getOne.status).toEqual(404);
      });

      it(`should fail to delete a ${resource.resourceName} by id 1`, async () => {
        const result = await request(server)
          .delete(`/api/${resource.urlString}/${tempResource.id}`)
          .set('Authorization', `Bearer ${jwt}`);

        expect(result.status).toEqual(404);
        expect(result.body).toBeTruthy();
      });
    });
  });
}
