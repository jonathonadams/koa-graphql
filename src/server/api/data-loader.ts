import * as DataLoader from 'dataloader';
import { Sequelize } from 'sequelize';
import * as keyBy from 'lodash.keyby';
import { User } from './users';
import { Todo } from './todos';

const Op = (Sequelize as any).Op;

const createUsersLoader = () => {
  return new DataLoader(async userIds => {
    const users = await User.findAll({
      where: {
        id: {
          [Op.in]: userIds
        }
      }
    });
    console.log('Users loader batch: ', userIds.length);
    const usersByIds = keyBy(users, 'id');
    return usersByIds.map((id: string) => usersByIds[id]);
  });
};

const createTodoLoader = () => {
  return new DataLoader(async todoIds => {
    const todos = await Todo.findAll({
      where: {
        id: {
          [Op.in]: todoIds
        }
      }
    });
    console.log('todo loader batch: ', todoIds.length);
    const todosById = keyBy(todos, 'id');
    return todoIds.map((id: string) => todosById[id]);
  });
};

export const loaders = () => {
  return {
    users: createUsersLoader(),
    todos: createTodoLoader()
  };
};
