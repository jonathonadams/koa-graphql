import { Model, DataTypes, Sequelize } from 'sequelize';
import { sequelize } from '../../db/sequelize';

// Sequelize Operation symbols
const Op = (Sequelize as any).Op;

export class Todo extends Model<Todo> {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Initialize the sequlize map.
Todo.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID
    },
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    completed: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  { sequelize }
);
