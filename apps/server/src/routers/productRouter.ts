import { Router } from "express";
import {
  getAllProducts,
  createProduct,
  generateDescription,
  getProductById,
} from "../controllers/productControllers";
import { asyncHandler } from "../handlers/asyncHandler";
import { requireAuth } from "../middleware/authMiddleware";
import {
  rateLimitCreateProductMw,
  rateLimitGenerateDescMw,
} from "../middleware/rateLimitMiddleware";

const router: Router = Router();

router
  .route("/")
  .get(asyncHandler(getAllProducts))
  .post(rateLimitCreateProductMw, asyncHandler(createProduct));

router.post(
  "/generate-description",
  requireAuth,
  rateLimitGenerateDescMw,
  asyncHandler(generateDescription)
);

router.get("/:id", asyncHandler(getProductById));

export default router;
