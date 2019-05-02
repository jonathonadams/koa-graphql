import * as merge from 'lodash.merge';
import { createTypeResolver } from '../util/create-resolvers';
import { userResolvers } from './users/index';
import { Todo } from './todos/index';

// All the resolvers as an object.
const resolvers = merge({}, userResolvers, createTypeResolver<Todo>(Todo, 'Todo'));

export default resolvers;
