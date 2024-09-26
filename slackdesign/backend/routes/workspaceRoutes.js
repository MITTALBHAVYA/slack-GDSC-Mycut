import express from "express";
import {createWorkspace, getAllWorkspaces,updateWorkspace,deleteWorkspace} from "../controllers/workspaceController.js"
import { isAuthorized } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/",isAuthorized,createWorkspace);

router.get("/",isAuthorized,getAllWorkspaces);

router.put("/:id",isAuthorized,updateWorkspace);

router.delete("/:id",isAuthorized,deleteWorkspace);
export default router;