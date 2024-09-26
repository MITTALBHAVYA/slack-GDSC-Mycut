import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/errorHandler.js";
// import User from "../models/userModel.js";
import Workspace from "../models/workspaceModel.js";
import { Op } from "sequelize";

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


export const getAllWorkspaces = catchAsyncErrors(async (req, res, next) => {
    const owner_id = req.user.id;
    
    const workspaces = await Workspace.findAll({ where: { owner_id } });

    if (!workspaces || workspaces.length === 0) {
        return next(new ErrorHandler("No workspaces found for this user", 404));
    }

    // console.log(workspaces);
    res.status(200).json({
        success: true,
        message: "All workspaces gathered successfully",
        workspaces : workspaces
    });
});

export const updateWorkspace = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    const owner_id = req.user.id;

    // Check if workspace with the provided id exists and belongs to the user
    const workspace = await Workspace.findOne({ where: { id, owner_id } });

    if (!workspace) {
        return next(new ErrorHandler("Workspace not found or you're not authorized to update it", 404));
    }

    // Validate the new workspace name
    if (!name || name.length < 3 || name.length > 50) {
        return next(new ErrorHandler("Workspace name must be between 3 and 50 characters", 400));
    }

    // Check if the new name already exists for this user
    const existingWorkspace = await Workspace.findOne({
        where: {
            owner_id,
            name,
            id: { [Op.ne]: id }, 
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
    const { id } = req.params;
    const owner_id = req.user.id;

    // Check if the workspace exists and belongs to the user
    const workspace = await Workspace.findOne({ where: { id, owner_id } });

    if (!workspace) {
        return next(new ErrorHandler("Workspace not found or you're not authorized to delete it", 404));
    }

    // Delete the workspace
    await workspace.destroy();

    res.status(200).json({
        success: true,
        message: "Workspace deleted successfully"
    });
});
