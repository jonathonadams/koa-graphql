import { ParameterizedContext } from 'koa';
import { Todo } from './todo.model';

export async function params(id: string, ctx: ParameterizedContext, next: () => Promise<any>) {
  ctx.state.id = id;
  await next();
}

export async function getAll(ctx: ParameterizedContext, next: () => Promise<any>) {
  try {
    const todos = await Todo.find({})
      .lean()
      .exec();
    ctx.body = todos;
  } catch (err) {
    console.log(err);
  }
}

export async function getOne(ctx: ParameterizedContext, next: () => Promise<any>) {
  try {
    const todo = await Todo.findById(ctx.state.id).exec();
    ctx.body = todo;
  } catch (err) {
    console.log(err);
  }
}

export async function post(ctx: ParameterizedContext) {
  try {
    const todo = await Todo.create(ctx.request.body);
    ctx.body = todo;
  } catch (err) {
    console.log(err);
  }
}

export async function updateOne(ctx: ParameterizedContext, next: () => Promise<any>) {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(ctx.state.id, ctx.request.body, {
      new: true
    }).exec();
    ctx.body = updatedTodo;
  } catch (err) {
    console.log(err);
  }
}

export async function removeOne(ctx: ParameterizedContext, next: () => Promise<any>) {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(ctx.state.id).exec();
    ctx.body = deletedTodo;
  } catch (err) {
    console.log(err);
  }
}
