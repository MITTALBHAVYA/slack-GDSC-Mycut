import { DataTypes } from 'sequelize';
import postgresConnection from '../config/databases/postgreconn.js';
import Workspace from './workspaceModel.js';

const Channel = postgresConnection.define('Channel', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  workspace_id: {
    type: DataTypes.UUID,
    references: {
      model: Workspace,
      key: 'id',
    },
  },
  is_private: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
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

// Channel.sync().then(() => {
//     console.log('Channel Model synced');
// });

export default Channel;
