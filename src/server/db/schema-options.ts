/* istanbul ignore file */

import mongoose from 'mongoose';

export const defaultSchemaOptions: mongoose.SchemaOptions = {
  versionKey: false,
  timestamps: false,
  // __v: false
  toJSON: {
    transform: function(doc: any, ret: any, options: any) {
      [ret._id, ret.id] = [ret.id, ret._id];
      [doc._id, doc.id] = [doc.id, doc._id];
    }
  },
  toObject: {
    transform: function(doc: any, ret: any, options: any) {
      [doc._id, doc.id] = [doc.id, doc._id];
      [ret._id, ret.id] = [ret.id, ret._id];
    }
  }
};
