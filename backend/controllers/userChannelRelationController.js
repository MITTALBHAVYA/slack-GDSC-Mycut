import Channel from "../models/channelModel.js";
import Workspace from "../models/workspaceModel.js";
import UserChannelRelation from "../models/userChannelRelationModel.js";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/errorHandler.js";
import User from "../models/userModel.js";


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

export const leaveChannel = catchAsyncErrors(async(req,res,next)=>{

    const {channelId,workspaceId} = req.params;
    const userId = req.user.id;

    const userChannelRelation = await UserChannelRelation.findOne({
        where:{
            user_id:userId,
            channel_id:channelId
        },
    });

    if(!userChannelRelation){
        return next(new ErrorHandler("User is not a member of this channel.",404));
    }

    await UserChannelRelation.destroy({
        where:{
            user_id:userId,
            channel_id:channelId
        }
    })

    res.status(200).json({
        success: true,
        message: `User ${userId} leave the channel successfully.`
    });
});

export const updateMemberRoleInChannel = catchAsyncErrors(async(req,res,next)=>{
    const {memberId} = req.params;
    const {newRole} = req.body;
    const channelId = req.userchannelrel.channel_id;

    const roleTransition = {
        guest : ['member','admin'],
        member:['guest','admin'],
        admin:['member','guest'],
    };

    const userChannelRelation = await UserChannelRelation.findOne({
        where:{
            user_id:memberId,
            channel_id:channelId
        },
    });


    if(!userChannelRelation){
        return res.status(404).json({
            success:false,
            message:"Member not found in the specified channel",
        });
    }

    const currentRole = userChannelRelation.role;

    if(!roleTransition[currentRole]?.includes(newRole)){
        return res.status(404).json({
            success:false,
            message:`Role transition from ${currentRole} to ${newRole} is not allowed`,
        });
    }

    userChannelRelation.role = newRole;

    await userChannelRelation.save();

    res.status(200).json({
        success: true,
        message: `Role updated successfully from ${currentRole} to ${newRole}`,
        updatedRole: userChannelRelation,
    });
});