import Router from 'koa-router';
import * as controllers from './user.controllers';

export const router = new Router();

router.param('id', controllers.params);

router.get('/', controllers.getAll).post('/', controllers.createOne);

router
  .get('/:id', controllers.getOne)
  .put('/:id', controllers.updateOne)
  .delete('/:id', controllers.removeOne);
