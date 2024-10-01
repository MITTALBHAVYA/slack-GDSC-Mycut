import { DataTypes } from 'sequelize';
import postgresConnection from '../config/databases/postgreconn.js';
import User from './userModel.js';
import Channel from './channelModel.js';

const UserChannelRelation = postgresConnection.define('UserChannelRelation', {
  user_id: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id',
    },
    primaryKey: true,
  },
  channel_id: {
    type: DataTypes.UUID,
    references: {
      model: Channel,
      key: 'id',
    },
    primaryKey: true,
  },
  role: {
    type: DataTypes.ENUM('owner', 'admin', 'member', 'guest'),
    allowNull: false,
  },
  joined_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
},{
  timestamps:false,
});

export default UserChannelRelation;
