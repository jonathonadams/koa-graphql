import { User } from './user.model';
import { ParameterizedContext } from 'koa';

export async function params(
  id: string,
  ctx: ParameterizedContext,
  next: () => Promise<any>
): Promise<void> {
  ctx.state.id = id;
  await next();
}

// Get All
export async function getAll(ctx: ParameterizedContext): Promise<void> {
  ctx.status = 200;
  ctx.body = await User.find({})
    .lean()
    .exec();
}

// Get an individual user
export async function getOne(ctx: ParameterizedContext): Promise<void> {
  ctx.status = 200;
  ctx.body = await User.findById(ctx.state.id).exec();
}

// Create a Resource
export async function createOne(ctx: ParameterizedContext): Promise<void> {
  ctx.status = 201;
  ctx.body = await User.create(ctx.request.body);
}

// Update a user
export async function updateOne(ctx: ParameterizedContext): Promise<void> {
  ctx.status = 201;
  ctx.body = await User.findByIdAndUpdate(ctx.state.id, ctx.request.body, { new: true });
}

// Remove one
export async function removeOne(ctx: ParameterizedContext): Promise<void> {
  ctx.status = 200;
  ctx.body = User.findByIdAndDelete(ctx.state.id).exec();
}
