import * as Router from 'koa-router';
import * as controllers from './todo.controller';

export const router = new Router();

router.param('id', controllers.params);

router.get('/', controllers.getAll).post('/', controllers.post);

router
  .get('/:id', controllers.getOne)
  .put('/:id', controllers.updateOne)
  .delete('/:id', controllers.removeOne);
