import { DataTypes } from 'sequelize';
import postgresConnection from '../config/databases/postgreconn.js';
import User from './userModel.js';

const Workspace = postgresConnection.define('Workspace', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 50], 
    },
  },
  owner_id: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id',
    },
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
},{
  timestamps:true,
  createdAt:'created_at',
  updatedAt:false,
});

export default Workspace;
