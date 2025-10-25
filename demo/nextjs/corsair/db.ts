import "server-only";
import CorsairDB from "corsair/db";
import { schema } from "./types";
import { pool } from "corsair/db";

export const db = CorsairDB.db(pool, { schema });

// Export the db type for use in types.ts
export type DB = typeof db;
