import * as mongoose from 'mongoose';

const uri = 'mongodb://localhost/todo-db';
const db = mongoose.connect(uri, {});

export const dbConnection = (url = uri, opts = {}) => {
  return mongoose.connect(url, { ...opts, useNewUrlParser: true });
};
