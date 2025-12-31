import { Router } from "express";
import {
  getAllProducts,
  createProduct,
} from "../controllers/productControllers";
import { asyncHandler } from "../utils/asyncHandler";
import { rateLimitCreateProductMw } from "../middleware/rateLimitMiddleware";

const router: Router = Router();

router
  .route("/")
  .get(asyncHandler(getAllProducts))
  .post(rateLimitCreateProductMw, asyncHandler(createProduct));

export default router;
