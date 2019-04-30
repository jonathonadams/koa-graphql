import { db } from '../server/db/sequelize.js';
import { graphql } from 'graphql';
import { schema } from '../server/api/graphql.js';

export interface TestDependents<T> {
  model: any;
  resource: T;
}

export const syncDb = async () => {
  try {
    await db.authenticate();
    await db.drop({ cascade: true });
    return await db.sync();
  } catch (err) {
    throw new Error('Unable to connect to the database:');
  }
};

export const runQuery = async (
  query: string,
  variables: { [prop: string]: any },
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
