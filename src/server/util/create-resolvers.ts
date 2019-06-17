import { createControllers } from './create-controllers';
import { authenticateRequest, verifyToken } from '../auth/authGuardGraphQL';
import { GraphQLFieldResolver } from 'graphql';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

// const resolver = async (rootValue, args, context, info) => {
//   -> place logic here
// }

// const exampleResolver = async (_, { destructuredProperty }, { req, user } , __ ) => {
//   -> place logic here
// }

type Resolver<T> = GraphQLFieldResolver<any, any, T>;

export function generateResolvers<T extends mongoose.Document>(
  model: mongoose.Model<T>
) {
  const controllers = createControllers(model);

  const getAll: Resolver<any> = async (root, args, ctx, info) => {
    return await controllers.getAll();
  };
  const getOne: Resolver<{ id: ObjectId }> = async (
    root,
    { id },
    ctx,
    info
  ) => {
    return await controllers.getOne(id);
  };
  const createOne: Resolver<{ input: T }> = async (
    root,
    { input },
    ctx,
    info
  ) => {
    return await controllers.createOne(input);
  };

  const updateOne: Resolver<{
    input: { id: ObjectId; [property: string]: any };
  }> = async (root, { input }, ctx, info) => {
    const { id, ...values } = input;
    return await controllers.updateOne(id, values);
  };

  const removeOne: Resolver<{ id: ObjectId }> = async (
    root,
    { id },
    ctx,
    info
  ) => {
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

export function createTypeResolver<T extends mongoose.Document>(
  model: mongoose.Model<T>,
  name: string
): {
  Query: {
    [queryName: string]: GraphQLFieldResolver<any, any, any> | undefined;
  };
  Mutation: {
    [mutationName: string]: GraphQLFieldResolver<any, any, any> | undefined;
  };
} {
  const resolvers = generateResolvers<T>(model);

  const typeResolver = {
    Query: {} as any,
    Mutation: {} as any
  };

  typeResolver.Query[`${name}`] = authenticateRequest(verifyToken)(
    resolvers.getOne
  );
  typeResolver.Query[`all${name}s`] = authenticateRequest(verifyToken)(
    resolvers.getAll
  );
  typeResolver.Mutation[`new${name}`] = authenticateRequest(verifyToken)(
    resolvers.createOne
  );
  typeResolver.Mutation[`update${name}`] = authenticateRequest(verifyToken)(
    resolvers.updateOne
  );
  typeResolver.Mutation[`remove${name}`] = authenticateRequest(verifyToken)(
    resolvers.removeOne
  );

  return typeResolver;
}
