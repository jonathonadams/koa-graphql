import * as Boom from 'boom';
import * as merge from 'lodash.merge';
import { escapeObjectProperties } from './helper-functions';

export function createControllers<T>(model: any) {
  return {
    // Get All
    getAll: async () => {
      return await (model.findAll() as T);
    },

    // Get an individual resource
    getOne: async (id: string) => {
      const resource = await (model.findByPk(id) as T);

      if (!resource) throw Boom.notFound('Cannot find a resource with the supplied paramaters.');

      return resource;
    },

    // Create a Resource
    createOne: async (values: any) => {
      // Escape the input values before create
      escapeObjectProperties(values);
      return await (model.create(values) as T);
    },

    // Update a resource
    updateOne: async (id: string, values: any) => {
      const resource = await model.findByPk(id);
      if (!resource) throw Boom.notFound('Cannot find a resource with the supplied paramaters.');
      merge(resource, values);
      return await (resource.save() as T);
    },

    // Remove one
    removeOne: async (id: any) => {
      const resource = await model.findByPk(id);
      if (!resource) throw Boom.notFound('Cannot find a resource with the supplied paramaters.');

      // Sequelize does not return an object from the destroy method.
      // Create a clone of the object to send back with status 2000
      const resourceToReturn = { ...resource.get() };
      await resource.destroy();

      return resourceToReturn as T;
    }
  };
}
