import mongoose from 'mongoose';
import { defaultSchemaOptions } from '../../db/schema-options';

export class TodoClass extends mongoose.Model {
  user: mongoose.Types.ObjectId;
  title: string;
  description: string;
  completed: boolean;
}

export const todoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user'
    },
    title: String,
    description: String,
    completed: {
      type: Boolean,
      required: true
    }
  },
  {
    ...defaultSchemaOptions
  }
);

export interface ITodoDocument extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description: string;
  completed: boolean;
}
export interface ITodoModel extends mongoose.Model<ITodoDocument> {}

todoSchema.loadClass(TodoClass);
export const Todo = mongoose.model<ITodoDocument, ITodoModel>(
  'todo',
  todoSchema
);
