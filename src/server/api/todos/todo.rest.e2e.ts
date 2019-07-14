import createApiSpec from '../../../tests/api-spec';
import { ITodoDocument, Todo } from './todo.model';
import { newId } from '../../../tests/helpers';

const todo = {
  title: 'Some Todo',
  description: 'A todo that needs to be done',
  completed: false,
  user: newId()
} as ITodoDocument;

const updatedTodo = {
  completed: true
};
createApiSpec({
  model: Todo,
  resourceName: 'todo',
  resourceToCreate: todo,
  resourceToUpdate: updatedTodo,
  urlString: 'todos'
});
