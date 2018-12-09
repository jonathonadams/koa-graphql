import { readFileSync } from 'fs';

// ALl types and resolvers
import { todoType } from './todos';
import { userType } from './users';

// Base scheme that defindes
// the Query and Mutation operations
// And any custom scalars
const baseSchema = readFileSync(__dirname + '/base.graphql', 'utf8');

// An array of type definitions
const typeDefs = [baseSchema, userType, todoType];

export default typeDefs;
