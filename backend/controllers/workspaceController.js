import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/errorHandler.js";
import Workspace from "../models/workspaceModel.js";
import Channel from "../models/channelModel.js";
import UserChannelRelation from "../models/userChannelRelationModel.js";
import { Op, Sequelize } from "sequelize";

export const createWorkspace = catchAsyncErrors(async (req, res, next) => {
    const owner_id = req.user.id;
    const { name } = req.body;

    if (!name || name.length < 3 || name.length > 50) {
        return next(new ErrorHandler("Workspace name must be between 3 and 50 characters", 400));
    }

    const existingWorkspace = await Workspace.findOne({
        where: { owner_id, name },
    });

    if (existingWorkspace) {
        return next(new ErrorHandler("Workspace with the same name already exists", 400));
    }
    const workspace = await Workspace.create({ owner_id, name });
    res.status(201).json({
        success: true,
        message: "Workspace created successfully",
        workspace,
    });
});

export const getAllWorkspaces2 = catchAsyncErrors(async (req, res, next) => {
    const owner_id = req.user.id;
    
    const workspaces = await Workspace.findAll({ where: { owner_id } });

    if (!workspaces || workspaces.length === 0) {
        return res.status(200).json({
            success: true,
            message: "No workspaces found for this user",
            workspaces: []
        });
    }

    res.status(200).json({
        success: true,
        message: "All workspaces gathered successfully",
        workspaces : workspaces
    });
});

export const getAllWorkspaces = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user.id;

    const workspaces = await Workspace.findAll({
        where: {
            [Op.or]: [
                { owner_id: userId }, 
                {
                    id: {
                        [Op.in]: Sequelize.literal(`(
                             SELECT w.id FROM public."Workspaces" w 
                             INNER JOIN public."Channels" c ON w.id = c.workspace_id
                             INNER JOIN public."UserChannelRelations" ucr ON ucr.channel_id = c.id
                             WHERE ucr.user_id = '${userId}'
                        )`) 
                    }
                }
            ]
        },
        group:['Workspace.id'],
    });

    if (!workspaces || workspaces.length === 0) {
        return res.status(200).json({
            success: true,
            message: "No workspaces found for this user",
            workspaces: []
        });
    }

    res.status(200).json({
        success: true,
        message: "All workspaces gathered successfully",
        workspaces: workspaces
    });
});

export const updateWorkspace = catchAsyncErrors(async (req, res, next) => {
    const { name } = req.body;
    const workspaceId = req.workspace.id;
    const owner_id = req.workspace.owner_id;
    
    const workspace = await Workspace.findOne({ where: { id:workspaceId, owner_id } });

    if (!name || name.length < 3 || name.length > 50) {
        return next(new ErrorHandler("Workspace name must be between 3 and 50 characters", 400));
    }

    const existingWorkspace = await Workspace.findOne({
        where: {
            owner_id,
            name,
            id: { [Op.ne]: workspaceId }, 
        },
    });

    if (existingWorkspace) {
        return next(new ErrorHandler("Workspace with this name already exists", 400));
    }

    workspace.name = name;
    await workspace.save();

    res.status(200).json({
        success: true,
        message: "Workspace updated successfully",
        data: workspace
    });
});

export const deleteWorkspace = catchAsyncErrors(async (req, res, next) => {
    const workspaceId = req.workspace.id;
    const owner_id = req.workspace.owner_id;

    const channels = await Channel.findAll({ where: { workspace_id: workspaceId } });

    await UserChannelRelation.destroy({ where: { channel_id: channels.map(channel => channel.id) } });

    await Channel.destroy({ where: { workspace_id: workspaceId} });
    await req.workspace.destroy();

    res.status(200).json({
        success: true,
        message: "Workspace and all associated channels deleted successfully",
    });
});