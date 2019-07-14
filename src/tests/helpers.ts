import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { graphql } from 'graphql';
import { schema } from '../server/api/graphql';

export interface RESTTestResource<T> {
  model: any;
  resourceName: string;
  urlString: string;
  resourceToCreate: any;
  resourceToUpdate: any;
  testDependents?: TestDependents[];
}

export interface GraphQLTestResource<T> {
  model: any;
  resourceName: string;
  queryName: string;
  resourceToCreate: any;
  resourceToUpdate: any;
  testDependents?: TestDependents[];
}

export interface TestDependents {
  model: any;
  resource: any;
}

/**
 * Helper function to generate ObjectID, note it returns the hex string of the ObjectId
 */
export const newId = () => {
  return (mongoose.Types.ObjectId().toHexString() as unknown) as ObjectId;
};

export const runQuery = async (
  query: string,
  variables: { [prop: string]: any | undefined },
  token: string
) => {
  return graphql(
    schema,
    query,
    null,
    {
      state: {},
      token
    },
    variables
  );
};

/**
 * Helper function  if using SQL
 */
// export const syncDb = async () => {
//   try {
//     await db.authenticate();
//     await db.drop({ cascade: true });
//     await db.sync();
//     return db;
//   } catch (err) {
//     throw new Error('Unable to connect to the database:');
//   }
// };

/**
 * Helper function to setup Mongo Memory server
 */
export async function setupTestDB(): Promise<{
  db: mongoose.Mongoose;
  mongoServer: MongoMemoryServer;
}> {
  const mongoServer = new MongoMemoryServer();
  const mongoUri: string = await mongoServer.getConnectionString();
  const mongooseOpts: mongoose.ConnectionOptions = {
    promiseLibrary: Promise,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
    useNewUrlParser: true
  };

  const db: mongoose.Mongoose = await mongoose.connect(mongoUri, mongooseOpts);
  console.log(`MongoDB successfully connected to ${mongoUri}`);

  return {
    db: db,
    mongoServer: mongoServer
  };
}
