import { Router } from "express";
import { asyncHandler } from "../handlers/asyncHandler";
import {
  listConversations,
  userQuery,
  getConversationMessages,
} from "../controllers/conversationsControllers";
import { rateLimitUserQueryMw } from "../middleware/rateLimitMiddleware";

const router: Router = Router();

router
  .route("/")
  .get(asyncHandler(listConversations))
  .post(rateLimitUserQueryMw, asyncHandler(userQuery));

router
  .route("/:conversationId/messages")
  .get(asyncHandler(getConversationMessages));

export default router;
