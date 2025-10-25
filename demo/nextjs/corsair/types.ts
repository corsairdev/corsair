// Shared types that can be imported in both client and server code
// This file uses "import type" to only import types, not runtime values
// This avoids pulling in "server-only" dependencies

import * as schema from "./schema";
import type { DB } from "./db";

// Export the schema for use in mutations and queries
export { schema };

// Export the database context type with proper typing
export type DatabaseContext = {
  db: DB;
  schema: typeof schema;
  userId?: string; // Optional user context from auth
};
