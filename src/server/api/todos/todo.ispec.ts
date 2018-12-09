import { Todo } from './todo.model';
import createGraphQLSpec from '../../../tests/graphQLSpec';
import { TestDependents } from '../../../tests/helpers';
import { User } from '../users';

const user: TestDependents<User> = {
  model: User,
  resource: {
    id: '00d8bd28-3480-11e8-b43d-0242ac110002',
    firstName: 'Some',
    lastName: 'User',
    username: 'someuser',
    emailAddress: 'email@domain.com',
    hashedPassword: '$2a$10$yTVUkddFs4sT2CBAiWkbGOp3Y5R4MMUrQ/IQo0nSbDHQfJuYNwMJu'
  } as User
};

const dependents = [user];

const todo = {
  userId: '00d8bd28-3480-11e8-b43d-0242ac110002',
  title: 'Some Todo',
  description: 'A todo that needs to be done',
  completed: false,
} as Todo;

const updatedTodo = {
  completed: true
};

createGraphQLSpec(Todo, 'todo', todo, updatedTodo, dependents);
