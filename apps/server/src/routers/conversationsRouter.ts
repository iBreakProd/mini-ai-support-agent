import { Router } from "express";
import { asyncHandler } from "../handlers/asyncHandler";
import {
  listConversations,
  userQuery,
  getConversationMessages,
} from "../controllers/conversationsControllers";
import { rateLimitUserQueryMw } from "../middleware/rateLimitMiddleware";
import { optionalAuth } from "../middleware/authMiddleware";

const router: Router = Router();

router
  .route("/")
  .get(optionalAuth, asyncHandler(listConversations))
  .post(optionalAuth, rateLimitUserQueryMw, asyncHandler(userQuery));

router
  .route("/:conversationId/messages")
  .get(asyncHandler(getConversationMessages));

export default router;
