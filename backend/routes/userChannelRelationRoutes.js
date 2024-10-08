//userChannelRelationRoutes.js

import express from "express";
import {
    addMembersToChannel,
    getAllMembersInChannel,
    removeMembersFromChannel,
    leaveChannel,
    updateMemberRoleInChannel
} from "../controllers/userChannelRelationController.js"
import { isAuthorized } from "../middleware/authMiddleware.js";
import { checkUserRole } from "../middleware/checkUserRole.js";

const router = express.Router({mergeParams: true});

router.post("/", isAuthorized,checkUserRole('owner','admin'), addMembersToChannel);
router.get("/", isAuthorized,checkUserRole('owner','admin','member','guest'), getAllMembersInChannel);
router.delete("/member", isAuthorized, checkUserRole('owner','admin'),removeMembersFromChannel);
router.delete("/leave",isAuthorized, checkUserRole('admin','member','guest'),leaveChannel);
router.put("/:memberId", isAuthorized, checkUserRole('owner','admin'),updateMemberRoleInChannel);

export default router;
