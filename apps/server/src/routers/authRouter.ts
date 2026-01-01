import { Router } from "express";
import { signup, login, logout, googleAuthCallback, googleAuth } from "../controllers/authControllers";
import { asyncHandler } from "../handlers/asyncHandler";
import { rateLimitSignInMw } from "../middleware/rateLimitMiddleware";

const router: Router = Router();

router.post("/signup", rateLimitSignInMw, asyncHandler(signup));
router.post("/login", rateLimitSignInMw, asyncHandler(login));
router.post("/logout", asyncHandler(logout));
router.get("/google", asyncHandler(googleAuth));
router.get("/google/callback", asyncHandler(googleAuthCallback));

export default router;