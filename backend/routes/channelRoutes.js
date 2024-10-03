//channelRoutes.js

import express from "express";
import {
    createChannel,
    getAllChannels,
    updateChannel,
    deleteChannel
} from "../controllers/channelController.js";
import { isAuthorized } from "../middleware/authMiddleware.js";
import { isWorkspaceOwner } from "../middleware/workspaceOwner.js";
import { checkUserRole } from "../middleware/checkUserRole.js";

const router = express.Router({mergeParams: true});

router.post('/', isAuthorized, isWorkspaceOwner, createChannel);
router.get('/', isAuthorized, getAllChannels);
router.put('/:channelId',isAuthorized,checkUserRole('owner','admin'),updateChannel);
router.delete('/:channelId',isAuthorized,isWorkspaceOwner,deleteChannel);

export default router;
