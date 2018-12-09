import { readFileSync } from 'fs';
export { Todo } from './todo.model';
export const todoType = readFileSync(__dirname + `/todo.graphql`, 'utf8');
// export { todosResolvers } from './todo.resolvers';
