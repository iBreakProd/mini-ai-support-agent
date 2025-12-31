import { Router } from "express";
import { getUserProfile, upsertUserProfile } from "../controllers/usersControllers";
import { asyncHandler } from "../handlers/asyncHandler";
import { requireAuth } from "../middleware/authMiddleware";
import { rateLimitProfileUpdateMw } from "../middleware/rateLimitMiddleware";

const usersRouter: Router = Router();

usersRouter.get("/profile", requireAuth, asyncHandler(getUserProfile));
usersRouter.put("/profile", requireAuth, rateLimitProfileUpdateMw, asyncHandler(upsertUserProfile));

export default usersRouter;