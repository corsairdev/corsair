import CorsairDB from "../../../../packages/corsair/db";
import * as schema from "./schema";

export const db = CorsairDB.db(schema);

// Export the DB type for use in mutations
export type DatabaseContext = {
  db: typeof db;
  schema: typeof schema;
  userId?: string; // Optional user context from auth
};

export { schema };
