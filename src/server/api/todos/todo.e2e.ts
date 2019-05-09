import { Todo, ITodoDocument } from './todo.model';
import { newId } from '../../../tests/helpers';
import createGraphQLSpec from '../../../tests/graphQLSpec';

const todo = {
  title: 'Some Todo',
  description: 'A todo that needs to be done',
  completed: false,
  user: newId()
} as ITodoDocument;

const updatedTodo = {
  completed: true
};

createGraphQLSpec(Todo, 'Todo', todo, updatedTodo);
