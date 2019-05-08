import * as mongoose from 'mongoose';

// TODO pull in environnement variables
const uri = 'mongodb://localhost/todo_db';

export const dbConnection = async (url = uri, opts = {}) => {
  const connectionOptions: mongoose.ConnectionOptions = {
    ...opts,
    useNewUrlParser: true
  };
  return await mongoose.connect(url, connectionOptions);
};
