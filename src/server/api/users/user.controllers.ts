import * as merge from 'lodash.merge';
import { User } from './user.model';
import { escapeObjectProperties } from '../../util/helper-functions';

export async function params(id, ctx, next) {
  // In Sequelize v5, findById was changed to .findByPk
  // The Type Definitions do not reflec this as thet match v4
  const user = await (User as any).findByPk(id);
  if (!user) {
    ctx.status = 404;
  } else {
    ctx.state.user = user;
    await next();
  }
}

// Get All
export async function getAll(ctx) {
  ctx.status = 200;
  ctx.body = await User.findAll();
}

// Get an individual user
export async function getOne(ctx) {
  ctx.status = 200;
  ctx.body = ctx.state.user;
}

// Create a Resource
export async function createOne(ctx) {
  const user = ctx.request.body;
  // Escaoe the input values before create
  escapeObjectProperties(user);
  ctx.status = 201;
  ctx.body = await User.create(user);
}

// Update a user
export async function updateOne(ctx) {
  const userToUpdate = ctx.state.user;
  const user = ctx.request.body;

  // Escaoe the updated values before merge
  escapeObjectProperties(user);
  merge(userToUpdate, user);

  ctx.status = 201;
  ctx.body = await userToUpdate.save();
}

// Remove one
export async function removeOne(ctx) {
  const user = ctx.state.user;
  // Sequelize does not return an object from the destroy method.
  // Create a cloase of the object to send back with status 2000
  const userToReturn = { ...user.get() };
  await user.destroy();

  ctx.status = 200;
  ctx.body = userToReturn;
}
