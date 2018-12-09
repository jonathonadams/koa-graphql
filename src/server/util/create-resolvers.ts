import { createControllers } from './create-controllers';
import { authenticateRequest, verifyToken } from '../auth/authGuardGraphQL';

// const resolver = async (rootValue, args, context, info) => {
//   -> place logic here
// }

// const exampleResolver = async (_, { spreaOperator }, { req, user } , __ ) => {
//   -> place logic here
// }

export function generateResolvers<T>(model) {
  const controllers = createControllers<T>(model);

  return {
    getAll: async <T>(root, args, ctx, info) => {
      return await controllers.getAll();
    },
    getOne: async <T>(root, { id }, ctx, info) => {
      return await controllers.getOne(id as string);
    },
    createOne: async <T>(root, { input }, ctx, info) => {
      return await controllers.createOne(input);
    },
    updateOne: async <T>(root, { input }, ctx, info) => {
      const { id, ...values } = input;
      return await controllers.updateOne(id, values);
    },
    removeOne: async <T>(root, { id }, ctx, info) => {
      return await controllers.removeOne(id);
    }
  };
}

export function createTypeResolver<T>(model: T, name: string) {
  const resolvers = generateResolvers<T>(model);

  const typeResolver = {
    Query: {} as any,
    Mutation: {} as any
  };

  typeResolver.Query[`${name}`] = authenticateRequest(verifyToken)(resolvers.getOne);
  typeResolver.Query[`all${name}s`] = authenticateRequest(verifyToken)(resolvers.getAll);
  typeResolver.Mutation[`new${name}`] = authenticateRequest(verifyToken)(resolvers.createOne);
  typeResolver.Mutation[`update${name}`] = authenticateRequest(verifyToken)(resolvers.updateOne);
  typeResolver.Mutation[`remove${name}`] = authenticateRequest(verifyToken)(resolvers.removeOne);

  return typeResolver;
}
