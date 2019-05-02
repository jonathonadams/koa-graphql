import { User } from './user.model';
import { login, register } from '../../auth/graphqlAuth';
import { generateResolvers } from '../../util/create-resolvers';
import { verifyToken, authenticateRequest } from '../../auth/authGuardGraphQL';

const resolvers = generateResolvers<User>(User);

export const userResolvers = {
  Query: {
    User: authenticateRequest(verifyToken)(resolvers.getOne),
    allUsers: authenticateRequest(verifyToken)(resolvers.getAll)
  },
  Mutation: {
    login: login,
    register: authenticateRequest(verifyToken)(register),
    updateUser: authenticateRequest(verifyToken)(resolvers.updateOne),
    removeUser: authenticateRequest(verifyToken)(resolvers.removeOne)
  }
};
