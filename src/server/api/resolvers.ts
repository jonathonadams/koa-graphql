import merge from 'lodash.merge';
import { createTypeResolver } from '../util/create-resolvers.js';
import { userResolvers } from './users/index.js';
import { Todo } from './todos/index.js';

// All the resolvers as an object.
const resolvers = merge({}, userResolvers, createTypeResolver<Todo>(Todo, 'Todo'));

export default resolvers;
