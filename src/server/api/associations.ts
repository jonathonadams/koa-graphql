import { User } from './users';
import { Todo } from './todos';

// It will default to the primary key of the source
// { foreignKey: 'userId', sourceKey: 'id' }
User.hasMany(Todo, { foreignKey: 'userId' });
