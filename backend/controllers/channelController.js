//channelController.js
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
