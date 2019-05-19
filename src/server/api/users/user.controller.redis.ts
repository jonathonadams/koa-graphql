/* 
import { ParameterizedContext } from 'koa';
import { User } from './user.model';
import redis from '../../redis/redis';
*/

/**
 *
 * Below was a redis client example
 * 1. Check redis
 * 2. If data, send data
 * 3. If not data, get from db, save in redis, send data
 */
/*
 export async function getAll(ctx: ParameterizedContext): Promise<void> {
  const redisCache: null | string = await redis.get(ctx.url);
  if (redisCache === null) {
    const resources = await User.find({})
      .lean()
      .exec();
    const transformedResources = resources.map(Utils.swapId);
    await redis.set(ctx.url, JSON.stringify(transformedResources));
    ctx.status = 200;
    ctx.body = transformedResources;
  } else {
    ctx.status = 200;
    ctx.body = redisCache;
  }
}
*/
