import Boom from '@hapi/boom';
import mongoose from 'mongoose';
import { Utils } from '../util/utils';
import { ObjectId } from 'mongodb';

/**
 * A helper function to create all CRUD related controllers.
 *
 * Because this function does not do any logic except to get or update
 * we use the lean() method to not create instances of mongoose documents
 * and returns the wrap document from mongoose.This means that the transform
 * functions for toObject() and toJSON() on the schemas will not get run.
 * This means we have to manually deal with the swapping of ._id and .id
 * This is manually done with a Utils helper method
 */
export function createControllers<T extends mongoose.Document>(
  model: mongoose.Model<T>
) {
  return {
    // Get All
    getAll: async () => {
      const resources: any[] = await model
        .find({})
        .lean()
        .exec();

      return resources.map(Utils.swapId);
    },

    // Get an individual resource
    getOne: async (id: ObjectId) => {
      const resource = await model
        .findById(id)
        .lean()
        .exec();

      if (!resource)
        throw Boom.notFound(
          'Cannot find a resource with the supplied parameters.'
        );

      return Utils.swapId(resource);
    },

    // Create a Resource
    createOne: async (values: any) => {
      return await model.create(values);
    },

    // Update a resource
    updateOne: async (id: ObjectId, values: any) => {
      const resource = await model
        .findByIdAndUpdate(id, values, { new: true })
        .lean()
        .exec();
      if (!resource)
        throw Boom.notFound(
          'Cannot find a resource with the supplied parameters.'
        );
      return Utils.swapId(resource);
    },

    // Remove one
    removeOne: async (id: ObjectId) => {
      const resource = await model
        .findByIdAndRemove(id)
        .lean()
        .exec();
      if (!resource)
        throw Boom.notFound(
          'Cannot find a resource with the supplied parameters.'
        );
      return Utils.swapId(resource);
    }
  };
}
