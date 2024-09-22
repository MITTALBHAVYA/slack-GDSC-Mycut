// models/index.js
import postgresConnection from '../config/databases/postgreconn.js';
import User from './userModel.js';
import Workspace from './workspaceModel.js';
import Channel from './channelModel.js';
import UserChannelRelation from './userChannelRelationModel.js';

// Define relationships
User.hasMany(Workspace, { foreignKey: 'owner_id' });
Workspace.belongsTo(User, { foreignKey: 'owner_id' });

Workspace.hasMany(Channel, { foreignKey: 'workspace_id' });
Channel.belongsTo(Workspace, { foreignKey: 'workspace_id' });

User.belongsToMany(Channel, { through: UserChannelRelation, foreignKey: 'user_id' });
Channel.belongsToMany(User, { through: UserChannelRelation, foreignKey: 'channel_id' });

// Sync models in the correct order
const syncModels = async () => {
  try {
    await postgresConnection.sync({ alter: true }); // Sync all models
    console.log('Database & tables created!');
  } catch (error) {
    console.error('Error syncing models:', error);
  }
};

syncModels();

