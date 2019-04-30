import { createControllers } from './create-controllers.js';
import { authenticateRequest, verifyToken } from '../auth/authGuardGraphQL.js';
import { GraphQLFieldResolver } from 'graphql';

// const resolver = async (rootValue, args, context, info) => {
//   -> place logic here
// }

// const exampleResolver = async (_, { destructedProperty }, { req, user } , __ ) => {
//   -> place logic here
// }

type Resolver<T> = GraphQLFieldResolver<any, any, T>;

export function generateResolvers<T>(model: any) {
  const controllers = createControllers<T>(model);

  const getAll: Resolver<any> = async (root, args, ctx, info) => {
    return await controllers.getAll();
  };
  const getOne: Resolver<{ id: string }> = async (root, { id }, ctx, info) => {
    return await controllers.getOne(id);
  };
  const createOne: Resolver<{ input: T }> = async (root, { input }, ctx, info) => {
    return await controllers.createOne(input);
  };

  const updateOne: Resolver<{ input: { id: string; [property: string]: any } }> = async (
    root,
    { input },
    ctx,
    info
  ) => {
    const { id, ...values } = input;
    return await controllers.updateOne(id, values);
  };

  const removeOne: Resolver<{ id: string }> = async (root, { id }, ctx, info) => {
    return await controllers.removeOne(id);
  };

  return {
    getAll,
    getOne,
    createOne,
    updateOne,
    removeOne
  };
}

export function createTypeResolver<T>(model: any, name: string) {
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
