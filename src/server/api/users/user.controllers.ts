import { User } from './user.model.js';
import { escapeObjectProperties } from '../../util/helper-functions.js';
import { ParameterizedContext } from 'koa';

export async function params(id: string, ctx: ParameterizedContext, next: () => Promise<any>) {
  const user = await (User as any).findByPk(id);
  if (!user) {
    ctx.status = 404;
  } else {
    ctx.state.user = user;
    await next();
  }
}

// Get All
export async function getAll(ctx: ParameterizedContext) {
  ctx.status = 200;
  ctx.body = await User.findAll();
}

// Get an individual user
export async function getOne(ctx: ParameterizedContext) {
  ctx.status = 200;
  ctx.body = ctx.state.user;
}

// Create a Resource
export async function createOne(ctx: ParameterizedContext) {
  const user = ctx.request.body;
  // Escape the input values before create
  escapeObjectProperties(user);
  ctx.status = 201;
  ctx.body = await User.create(user);
}

// Update a user
export async function updateOne(ctx: ParameterizedContext) {
  const userToUpdate: User = ctx.state.user;
  const user = ctx.request.body;

  ctx.status = 201;
  ctx.body = await userToUpdate.update(user);
}

// Remove one
export async function removeOne(ctx: ParameterizedContext) {
  const user = ctx.state.user;
  // Sequelize does not return an object from the destroy method.
  // Create a close of the object to send back with status 2000
  const userToReturn = { ...user.get() };
  await user.destroy();

  ctx.status = 200;
  ctx.body = userToReturn;
}
