import "server-only";
import CorsairDB from "corsair/db";
import * as schema from "./schema";
import { pool } from "corsair/db";

export const db = CorsairDB.db(pool, { schema });

// Export the DB type for use in mutations
export type DatabaseContext = {
  db: typeof db;
  schema: typeof schema;
  userId?: string; // Optional user context from auth
};

export { schema };
