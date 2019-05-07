import DataLoader from 'dataloader';
import sequelize from 'sequelize';
import * as keyBy from 'lodash.keyby';
import { User } from './users';
import { Todo } from './todos';
import { IUserDocument } from './users/user.model';
import { ITodoDocument } from './todos/todo.model';

const { Sequelize } = sequelize;

const Op = (Sequelize as any).Op;

const createUsersLoader = () => {
  return new DataLoader<string, IUserDocument>(async usersIds => {
    const users = await User.find({
      id: { $in: usersIds }
      // where: {
      //   id: {
      //     [Op.in]: usersIds
      //   }
      // }
    });
    const usersByIds = keyBy(users, 'id');
    return usersIds.map((id: string) => usersByIds[id]);
  });
};

const createTodoLoader = () => {
  return new DataLoader<string, ITodoDocument>(async todosIds => {
    const todos = await Todo.find({
      id: { $in: todosIds }
      // where: {
      //   id: {
      //     [Op.in]: todosIds
      //   }
      // }
    });
    const todosById = keyBy(todos, 'id');
    return todosIds.map((id: string) => todosById[id]);
  });
};

export const loaders = () => {
  return {
    users: createUsersLoader(),
    todos: createTodoLoader()
  };
};
