import { Router } from "express";
import { signup, login, logout, googleAuthCallback, googleAuth, getMe } from "../controllers/authControllers";
import { asyncHandler } from "../handlers/asyncHandler";
import { requireAuth } from "../middleware/authMiddleware";
import { rateLimitSignInMw } from "../middleware/rateLimitMiddleware";

const router: Router = Router();

router.get("/me", requireAuth, asyncHandler(getMe));
router.post("/signup", rateLimitSignInMw, asyncHandler(signup));
router.post("/login", rateLimitSignInMw, asyncHandler(login));
router.post("/logout", asyncHandler(logout));
router.get("/google/callback", asyncHandler(googleAuthCallback));
router.get("/google", asyncHandler(googleAuth));

export default router;