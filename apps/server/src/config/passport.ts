import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { db } from "@repo/db";
import { usersTable } from "@repo/db/schema";
import { eq } from "drizzle-orm";
import { AppError } from "../utils/errorClasses";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new AppError("No email from Google", 400), undefined);
        }

        const [existing] = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, email))
          .limit(1);

        if (existing) {
          return done(null, existing);
        }

        const [user] = await db
          .insert(usersTable)
          .values({
            name: profile.displayName ?? "User",
            email,
            password: null,
            imageUrl: profile.photos?.[0]?.value ?? "https://example.com/avatar.png",
          })
          .returning();

        if (!user) {
          return done(new AppError("Failed to create user", 500), undefined);
        }

        return done(null, user);
      } catch (err) {
        return done(new AppError("Failed to authenticate with Google", 500), undefined);
      }
    }
  )
);

export default passport;