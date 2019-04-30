import * as Boom from 'boom';
import { escapeObjectProperties } from './helper-functions.js';

export function createControllers<T>(model: any) {
  return {
    // Get All
    getAll: async () => {
      return await (model.findAll() as T);
    },

    // Get an individual resource
    getOne: async (id: string) => {
      const resource = await (model.findByPk(id) as T);

      if (!resource) throw Boom.notFound('Cannot find a resource with the supplied parameters.');

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
      if (!resource) throw Boom.notFound('Cannot find a resource with the supplied parameters.');
      return (await resource.update(values)) as T;
    },

    // Remove one
    removeOne: async (id: any) => {
      const resource = await model.findByPk(id);
      if (!resource) throw Boom.notFound('Cannot find a resource with the supplied parameters.');

      // Sequelize does not return an object from the destroy method.
      // Create a clone of the object to send back with status 2000
      const resourceToReturn = { ...resource.get() };
      await resource.destroy();

      return resourceToReturn as T;
    }
  };
}
