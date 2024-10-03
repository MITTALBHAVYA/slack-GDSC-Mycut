//workspaceRoutes.js
import express from "express";
import {createWorkspace, getAllWorkspaces,updateWorkspace,deleteWorkspace, getAllWorkspaces2} from "../controllers/workspaceController.js"
import { isAuthorized } from "../middleware/authMiddleware.js";
import { isWorkspaceOwner } from "../middleware/workspaceOwner.js";

const router = express.Router({mergeParams: true});

router.post("/",isAuthorized,createWorkspace);
router.get("/",isAuthorized,getAllWorkspaces);
router.put("/:workspaceId",isAuthorized,isWorkspaceOwner,updateWorkspace);
router.delete("/:workspaceId",isAuthorized,isWorkspaceOwner,deleteWorkspace);
router.get("/exper",isAuthorized,getAllWorkspaces2);
export default router;