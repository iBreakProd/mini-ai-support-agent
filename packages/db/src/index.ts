import "dotenv/config";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
import { Pool as PoolPg } from "pg";
import { Pool as PoolNeon } from "@neondatabase/serverless";

let db;

const env = process.env.NODE_ENV;

if (env && env === "production") {
  const sql = new PoolNeon({ connectionString: process.env.DATABASE_URL! });
  db = drizzleNeon(sql);
} else {
  const pool = new PoolPg({ connectionString: process.env.DATABASE_URL! });
  db = drizzlePg(pool);
}

export { db };
