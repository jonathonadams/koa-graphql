import { User } from './users/index.js';
import { Todo } from './todos/index.js';

// It will default to the primary key of the source
// { foreignKey: 'userId', sourceKey: 'id' }
User.hasMany(Todo, { foreignKey: 'userId' });
