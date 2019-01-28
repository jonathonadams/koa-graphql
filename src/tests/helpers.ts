import { sequelize } from '../server/db/sequelize';
import { graphql } from 'graphql';
import { schema } from '../server/api/graphql';

export interface TestDependents<T> {
  model: any;
  resource: T;
}

export const syncDb = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.drop({ cascade: true });
    return await sequelize.sync();
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
};

export const runQuery = async (query, variables, token) => {
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
