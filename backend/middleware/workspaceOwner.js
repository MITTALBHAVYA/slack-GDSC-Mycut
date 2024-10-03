//workspaceOwner.js
import Workspace from "../models/workspaceModel.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./errorHandler.js";

export const isWorkspaceOwner =  catchAsyncErrors(async(req,res,next)=>{
    const {workspaceId} = req.params;
    const userId = req.user.id;
    const workspace = await Workspace.findOne({
        where:{
            id:workspaceId,
            owner_id:userId
        }
    });

    if(!workspace){
        return next(new ErrorHandler("You are not owner of workspace",403));
    }
    req.workspace = workspace;
    next();
});