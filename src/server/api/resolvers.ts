import * as merge from 'lodash.merge';
import { createTypeResolver } from '../util/create-resolvers';
import { userResolvers } from './users';
import { Todo } from './todos';

// All the resolvers as an object.
const resolvers = merge({}, userResolvers, createTypeResolver<Todo>(Todo, 'Todo'));

export default resolvers;
