import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { getAllOrders, createOrder } from "../controllers/orderControllers";
import { rateLimitCreateOrderMw } from "../middleware/rateLimitMiddleware";

const router: Router = Router();

router
  .route("/")
  .get(asyncHandler(getAllOrders))
  .post(rateLimitCreateOrderMw, asyncHandler(createOrder));

export default router;
