import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import { createLayout, editLayout, getFilterOptions, getLayoutByType } from "../controllers/layout.controller";
const layoutRouter = express.Router();

layoutRouter.post("/create-layout", isAutheticated,authorizeRoles("admin"), createLayout);

layoutRouter.put("/edit-layout", isAutheticated,authorizeRoles("admin"), editLayout);

layoutRouter.get("/get-layout/:type",getLayoutByType);

layoutRouter.get("/get-filter-options", getFilterOptions);
export default layoutRouter;