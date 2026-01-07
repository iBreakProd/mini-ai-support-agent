import { Request, Response, NextFunction } from "express";
import { db } from "@repo/db";
import { usersTable } from "@repo/db/schema";
import { signupSchema, loginSchema } from "@repo/zod";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { AppError } from "../utils/errorClasses";
import { signToken } from "../utils/jwt";
import passport from "../config/passport";

const COOKIE_NAME = process.env.COOKIE_NAME ?? "session_token";
const COOKIE_MAX_AGE_DAYS = 7;
const SALT_ROUNDS = 10;

export const signup = async (req: Request, res: Response) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) throw new AppError(parsed.error.message, 400);

  const { name, email, password, imageUrl } = parsed.data;

  const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (existing) throw new AppError("Email already registered", 409);

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const [user] = await db.insert(usersTable).values({
    name,
    email,
    password: hashedPassword,
    imageUrl: imageUrl ?? "",
  }).returning();

  if (!user) throw new AppError("Failed to create user", 500);

  const token = signToken({ userId: user.id, email: user.email });

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000,
    path: "/",
  });

  res.status(201).json({ success: true, data: { id: user.id, name: user.name, email: user.email, imageUrl: user.imageUrl } });
};

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  
  if (!parsed.success) throw new AppError("Invalid inputs", 400);

  const { email, password } = parsed.data;

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (!user) throw new AppError("Email not found", 401);
  if (!user.password) {
    throw new AppError("Please sign in with Google", 401);
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new AppError("Password is incorrect", 401);

  const token = signToken({ userId: user.id, email: user.email });

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000,
    path: "/",
  });

  res.status(200).json({ success: true, data: { id: user.id, name: user.name, email: user.email, imageUrl: user.imageUrl } });
};

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME, { path: "/" });
  res.status(200).json({ success: true });
};

export const getMe = async (req: Request, res: Response) => {
  const userId = (req as Request & { user: { id: string } }).user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);

  const [user] = await db
    .select({ id: usersTable.id, name: usersTable.name, email: usersTable.email, imageUrl: usersTable.imageUrl })
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);

  if (!user) throw new AppError("User not found", 404);
  res.status(200).json({ success: true, data: user });
};

export const googleAuth = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next);
};

export const googleAuthCallback = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("google", { session: false }, (err: Error | null, user: any) => {
    if (err) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_user`);
    }

    const token = signToken({ userId: user.id, email: user.email });

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.redirect(`${process.env.FRONTEND_URL}`);
  })(req, res, next);
};