import type { CorsairConfig } from "@corsair-ai/core";
import { env } from "./src/env.js";
import { db } from "./src/db";

export const config = {
  dbType: "postgres",
  orm: "drizzle",
  framework: "nextjs",
  pathToCorsairFolder: "./src/corsair",
  apiEndpoint: env.NEXT_PUBLIC_CORSAIR_API_ROUTE,
  db: db,
  connection: env.DATABASE_URL,
} satisfies CorsairConfig<typeof db>;

export type Config = typeof config;
