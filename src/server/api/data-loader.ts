import * as DataLoader from 'dataloader';
import { Sequelize } from 'sequelize';
import keyBy from 'lodash.keyby';
import { User } from './users';
import { Todo } from './todos';

const Op = (Sequelize as any).Op;

const createUsersLoader = () => {
  return new DataLoader(async usersIds => {
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
  return new DataLoader(async todosIds => {
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
