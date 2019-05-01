import DataLoader from 'dataloader';
import sequelize from 'sequelize';
import keyBy from 'lodash.keyby';
import { User } from './users/index.js';
import { Todo } from './todos/index.js';

const { Sequelize } = sequelize;

const Op = (Sequelize as any).Op;

const createUsersLoader = () => {
  return new DataLoader<string, User>(async usersIds => {
    const users = await User.findAll({
      where: {
        id: {
          [Op.in]: usersIds
        }
      }
    });
    const usersByIds = keyBy(users, 'id');
    return usersIds.map((id: string) => usersByIds[id]);
  });
};

const createTodoLoader = () => {
  return new DataLoader<string, Todo>(async todosIds => {
    const todos = await Todo.findAll({
      where: {
        id: {
          [Op.in]: todosIds
        }
      }
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
