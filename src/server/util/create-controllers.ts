import * as Boom from 'boom';
import * as mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

export function createControllers(model: mongoose.Model<mongoose.Document>) {
  return {
    // Get All
    getAll: async () => {
      return await model
        .find({})
        .lean()
        .exec();
    },

    // Get an individual resource
    getOne: async (id: ObjectId) => {
      const resource = await model.findById(id);

      if (!resource) throw Boom.notFound('Cannot find a resource with the supplied parameters.');

      return resource;
    },

    // Create a Resource
    createOne: async (values: any) => {
      return await model.create(values);
    },

    // Update a resource
    updateOne: async (id: ObjectId, values: any) => {
      const resource = await model.findByIdAndUpdate(id, values, { new: true }).exec();
      if (!resource) throw Boom.notFound('Cannot find a resource with the supplied parameters.');
      return resource;
    },

    // Remove one
    removeOne: async (id: ObjectId) => {
      const resource = await model.findByIdAndRemove(id).exec();
      if (!resource) throw Boom.notFound('Cannot find a resource with the supplied parameters.');
      return resource;
    }
  };
}
