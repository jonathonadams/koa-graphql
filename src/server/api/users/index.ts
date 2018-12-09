import { readFileSync } from 'fs';
export const userType = readFileSync(__dirname + `/user.graphql`, 'utf8');
export { User } from './user.model';
export { userResolvers } from './user.resolvers';
export { router } from './user.router';
