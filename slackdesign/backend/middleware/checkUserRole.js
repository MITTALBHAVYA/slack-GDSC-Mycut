import UserChannelRelation from "../models/userChannelRelationModel.js";
import ErrorHandler from "./errorHandler.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";

export const checkUserRole = (...acceptedRoles)=>{
    return catchAsyncErrors(async(req,res,next)=>{
        const userId = req.user.id;
        const {channelId} = req.params;

        const userChannelRelation = await UserChannelRelation.findOne({
            where : {
                user_id : userId,
                channel_id : channelId,
            },
        });

        if(!userChannelRelation){
            return next(new ErrorHandler("USer is not associated with this channel",403));
        }

        const userRole = userChannelRelation.role;
        if(!acceptedRoles.includes(userRole)){
            return next(new ErrorHandler("Access denied. Insufficient role permission.",403));
        }

        req.userchannelrel = userChannelRelation;

        next();
    });
};