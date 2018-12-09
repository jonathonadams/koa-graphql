import * as merge from 'lodash.merge';
import { escapeObjectProperties } from './helper-functions';

export function createControllers<T>(model) {
  return {
    // Get All
    getAll: async <T>() => {
      return await (model.findAll() as T);
    },

    // Get an individual resource
    getOne: async <T>(id: string) => {
      const resource = await (model.findByPk(id) as T);

      if (!resource) {
        let error = new Error(`Cannot find a resource with that id.`);
        error.name = '404';
        throw error;
      }

      return resource;
    },

    // Create a Resource
    createOne: async <T>(values: any) => {
      // Escaoe the input values before create
      escapeObjectProperties(values);
      return await (model.create(values) as T);
    },

    // Update a resource
    updateOne: async <T>(id: string, values: any) => {
      const resource = await model.findByPk(id);
      if (!resource) {
        let error = new Error(`Cannot find a resource with that id.`);
        error.name = '404';
        throw error;
      }
      // Escaoe the updated values before merge
      escapeObjectProperties(values);
      merge(resource, values);

      return await (resource.save() as T);
    },

    // Remove one
    removeOne: async <T>(id) => {
      const resource = await model.findByPk(id);

      if (!resource) {
        let error = new Error(`Cannot find a resource with that id.`);
        error.name = '404';
        throw error;
      }
      // Sequelize does not return an object from the destroy method.
      // Create a cloase of the object to send back with status 2000
      const resourceToReturn = { ...resource.get() };
      await resource.destroy();

      return resourceToReturn as T;
    }
  };
}
