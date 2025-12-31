import { Router } from "express";
import { asyncHandler } from "../handlers/asyncHandler";
import { getAllOrders, createOrder } from "../controllers/orderControllers";
import { rateLimitCreateOrderMw } from "../middleware/rateLimitMiddleware";
import { optionalAuth } from "../middleware/authMiddleware";

const router: Router = Router();

router
  .route("/")
  .get(asyncHandler(getAllOrders))
  .post(rateLimitCreateOrderMw, asyncHandler(createOrder));

export default router;
