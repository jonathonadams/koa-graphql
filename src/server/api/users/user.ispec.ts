import { User } from './user.model';

import createGraphQLSpec from '../../../tests/graphQLSpec';

const user = {
  username: 'test user',
  emailAddress: 'test@domsin.com',
  password: '123',
  corporateRepId: '1',
  admin: true
};

const updatedUser = { username: 'updated user' };

// ----------------------------------
// GraphQL API tests
// ----------------------------------
createGraphQLSpec(User, 'user', user, updatedUser);
