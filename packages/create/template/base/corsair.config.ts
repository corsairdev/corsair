import type { CorsairConfig } from "@corsair-ai/core";
import { config as dotenvConfig } from "dotenv";
import { db } from "./src/db/index.js";

dotenvConfig({ path: ".env.local" });

export const config = {
  dbType: "postgres",
  orm: "drizzle",
  framework: "nextjs",
  pathToCorsairFolder: "./src/corsair",
  apiEndpoint: process.env.NEXT_PUBLIC_CORSAIR_API_ROUTE!,
  db: db,
  connection: process.env.DATABASE_URL!,
} satisfies CorsairConfig<typeof db>;

export type Config = typeof config;
