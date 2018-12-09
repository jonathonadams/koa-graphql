// import { Todo } from './todo.model';
// import createResolvers from '../../util/resolver-generator';
// import { authenticateRequest, verifyToken } from 'src/server/auth/authGuard';

// const resolvers = createResolvers<Todo>(Todo);

// export const todosResolvers = {
//   Query: {
//     Todo: authenticateRequest(verifyToken)(resolvers.getOne),
//     allTodos: authenticateRequest(verifyToken)(resolvers.getAll)
//   },
//   Mutation: {
//     newTodo: authenticateRequest(verifyToken)(resolvers.createOne),
//     updateTodo: authenticateRequest(verifyToken)(resolvers.updateOne),
//     removeTodo: authenticateRequest(verifyToken)(resolvers.removeOne)
//   }
// };
