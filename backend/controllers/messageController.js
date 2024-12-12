//messageController.js
import { Message } from "../models/messageModel.js";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/errorHandler.js";

export const sendMessage = catchAsyncErrors(async(req,res,next)=>{
   const {content} = req.body;
   const {channelId} = req.params;
   
   const message = await Message.create({
    message : content,
    channel_id : channelId,
    user_id : req.user.id,
    username: req.user.username,
   });

   if(!message){
      return next(new ErrorHandler("Failed to send the message",500));
   }

   res.status(201).json({
    success:true,
    message
   });
});

export const getChannelMessages = catchAsyncErrors(async(req,res,next)=>{
   const {channelId} = req.params;

   const messages = await Message.find({channel_id:channelId})
   .sort({timestamp:1})

   res.status(200).json({
      success: true,
      messages: messages || []
   });
});

export const editMessage = catchAsyncErrors(async(req,res,next)=>{
   const {messageId} = req.params;
   const {content} = req.body;
   
   if(!content || content.trim()===""){
      return next(new ErrorHandler("Message content cannot be empty",400));
   }

   const message = await Message.findById(messageId);

   if(!message){
      return next(new ErrorHandler("Message not found",404));
   }

   if(message.user_id !== req.user.id){
      return next(new ErrorHandler("Not authorized to edit this message",403));
   }

   message.message = content;
   message.edited = true;
   await message.save();

   res.status(200).json({
      success:true,
      message
   });
});

export const deleteMessage = catchAsyncErrors(async(req,res,next)=>{
   const {messageId} = req.params;
   const message = await Message.findById(messageId);

   if(!message){
      return next(new ErrorHandler("Message not found",404));
   }

   const userRole = req.userchannelrel.role;

   if((userRole==='member' || userRole==='guest') && message.user_id !==req.user.id){
      return next(new ErrorHandler("Not authorized to delete this message",403));
   }

   if(userRole==='owner' || userRole==='admin' || message.user_id === req.user.id){
      await message.deleteOne();
      return res.status(200).json({
         success : true,
         message:"Message deleted successfully"
      });
   }else{
      return next(new ErrorHandler("Not authorized to delete this message",403));
   }
})