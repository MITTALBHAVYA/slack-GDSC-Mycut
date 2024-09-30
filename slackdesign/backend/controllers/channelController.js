import Channel from "../models/channelModel.js";
import Workspace from "../models/workspaceModel.js";
import UserChannelRelation from "../models/userChannelRelationModel.js";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/errorHandler.js";
import User from "../models/userModel.js";
import {Op} from 'sequelize';

export const createChannel = catchAsyncErrors(async(req,res,next)=>{
    const {id,owner_id} = req.workspace;
    const workspaceId=id;
    const {name,is_private} = req.body;
    if(!name || name.length<3 || name.length>50){
        return next(new ErrorHandler("Channel name must be between 3 and 50 characters",400));
    }

    const existingChannel = await Channel.findOne({
        where:{
            name,
            workspace_id:workspaceId
        }
    });

    if(existingChannel){
        return next(new ErrorHandler("A channel with this name already exists in the workspace",400));
    }
    const channel = await Channel.create({name,workspace_id:workspaceId,is_private})
    .catch(error => {
        console.log("Error while creating channel:", error); // Debug the Sequelize error
        return next(new ErrorHandler(error.message, 400)); // Return the actual Sequelize validation message
    });
    const userChannelRel = await UserChannelRelation.create({user_id:owner_id,channel_id:channel.id,role:"owner"})
    res.status(201).json({
        success:true,
        message:"Channel created successfully",
        channel,
        userChannelRel
    });
});

export const getAllChannels = catchAsyncErrors(async(req,res,next)=>{
    const {workspaceId} = req.params;
    const workspace_id=workspaceId;
    const user_id = req.user.id;

    const userChannels = await User.findAll({
        where: {
            id: user_id
        },
        include: [{
            model: Channel,
            as: 'UserChannels',
            where: {
                workspace_id
            },
            attributes: ['id', 'name', 'is_private', 'created_at'],
        }],
    });
    
    if(!userChannels || userChannels.length === 0){
        return next(new ErrorHandler("No channels found for the user in this workspace",404));
    }

    const channels = userChannels.map(relation=>relation.UserChannels);
    
    res.status(200).json({
        success:true,
        message:"All channels gathered successfully",
        channels
    });
});

export const updateChannel = catchAsyncErrors(async(req,res,next)=>{
    const {workspaceId,channelId} = req.params;
    const {name,is_private} = req.body;

    const channel = await Channel.findOne({
        where:{id:channelId,workspace_id:workspaceId}
    });
    if(!channel){
        return next(new ErrorHandler("Channel not found",404));
    }

    if (name && name !== channel.name) {
        const existingChannel = await Channel.findOne({
          where: { name, workspace_id: workspaceId },
        });
        if (existingChannel) {
          return next(new ErrorHandler("Channel name already exists in this workspace", 400));
        }
        channel.name = name;
      }
      if (is_private !== undefined) {
        channel.is_private = is_private;
      }
    await channel.save();

    res.status(200).json({
        success:true,
        message:"Channel updated successfully",
        channel,
    });
});

export const deleteChannel = catchAsyncErrors(async (req, res, next) => {
    const { id, owner_id } = req.workspace;
    const workspaceId = id;

    const {channelId} = req.params;
    const channel = await Channel.findOne({ where: { id: channelId, workspace_id: workspaceId } });
    if (!channel) {
        return next(new ErrorHandler("Channel not found in this workspace", 404));
    }
    await UserChannelRelation.destroy({ where: { channel_id: channelId } });

    await channel.destroy();

    res.status(200).json({
        success: true,
        message: "Channel deleted successfully",
    });
});

export const addMembersToChannel = catchAsyncErrors(async(req,res,next)=>{
    const {workspaceId,channelId} = req.params;
    const {userIds} = req.body;

    const channel = await Channel.findOne({
        where : {
            id:channelId,
            workspace_id:workspaceId
        }
    })

    if(!channel){
        return next(new ErrorHandler("Channel not found",404));
    }

    for(const userId of userIds){
        await UserChannelRelation.create({
            user_id:userId,
            channel_id:channelId,
            role:'member'
        });
    }

    res.status(200).json({
        success:true,
        message:"Members added to the channel successfully",
    });
});

export const getAllMembersInChannel = catchAsyncErrors(async (req, res, next) => {
    const { workspaceId, channelId } = req.params;
    const userChannelRelations = await UserChannelRelation.findAll({
        where: {
            channel_id: channelId
        },
        include: [{
            model: User,
            attributes: ['id', 'username', 'email'] 
        }, {
            model: Channel,
            attributes: [],
            where: {
                workspace_id: workspaceId
            }
        }]
    });

    if (!userChannelRelations || userChannelRelations.length === 0) {
        return res.status(200).json({
            success: true,
            message: "No members found in this channel",
            data: []
        });
    }

    // Extract user details and role from the relations
    const memberData = userChannelRelations.map(relation => ({
        userId: relation.User.id,
        username: relation.User.username,
        email: relation.User.email,
        role: relation.role // Access the role directly from UserChannelRelation
    }));

    res.status(200).json({
        success: true,
        message: `Found ${memberData.length} members in the channel`,
        data: memberData
    });
});

export const removeMembersFromChannel = catchAsyncErrors(async (req, res, next) => {
    const { channelId } = req.params;
    const { userIds } = req.body;

    if (!userIds || userIds.length === 0) {
        return res.status(400).json({
            success: false,
            message: "No user IDs provided."
        });
    }

    const channel = await Channel.findOne({
        where: { id: channelId },
        include: [{
            model: Workspace,
            attributes: ['owner_id']
        }]
    });

    if (!channel) {
        return res.status(404).json({
            success: false,
            message: "Channel not found."
        });
    }

    console.log(channel);

    const ownerId = channel.Workspace.owner_id;

    if (userIds.includes(ownerId)) {
        return res.status(400).json({
            success: false,
            message: "Owner cannot be removed from the channel."
        });
    }

    const userChannelRelations = await UserChannelRelation.findAll({
        where: {
            user_id: userIds,
            channel_id: channelId
        }
    });

    if (userChannelRelations.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No members found in the specified channel for the given user IDs."
        });
    }
    
    await UserChannelRelation.destroy({
        where: {
            user_id: userIds,
            channel_id: channelId
        }
    });

    res.status(200).json({
        success: true,
        message: `Users with IDs ${userIds.join(', ')} removed from channel with ID ${channelId}.`
    });
});
