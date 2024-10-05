//messageRoutes.js
import express from 'express';
import {isAuthorized} from "../middleware/authMiddleware.js";
import { checkUserRole } from '../middleware/checkUserRole.js';
import {
    sendMessage,
    getChannelMessages,
    editMessage,
    deleteMessage,
} from "../controllers/messageController.js";

const router = express.Router({mergeParams:true});

router.post("/",isAuthorized,checkUserRole('owner','admin','member','guest'),sendMessage);
router.get("/",isAuthorized,checkUserRole('owner','admin','member','guest'),getChannelMessages);
router.put("/:messageId",isAuthorized,checkUserRole('owner','admin','member','guest'),editMessage);
router.delete("/:messageId",isAuthorized,checkUserRole('owner','admin','member','guest'),deleteMessage);

export default router;