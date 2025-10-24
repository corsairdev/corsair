import "dotenv/config";
import { drizzle as db } from "drizzle-orm/node-postgres";
import * as drizzle from "drizzle-orm";
import * as drizzleZod from "drizzle-zod";
import {
  pgTable as pgTableDrizzle,
  text,
  uuid,
  integer,
  boolean,
  date,
  json,
  timestamp,
} from "drizzle-orm/pg-core";
import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

type AccessRule = string;

type AccessControl = {
  create?: AccessRule;
  update?: AccessRule;
  delete?: AccessRule;
};

type ConstraintRule = string;

type ConstraintControl = ConstraintRule[];

type Meta = { constraints?: ConstraintControl; access?: AccessControl };

// Wrapper that adds optional third argument for metadata
const table = <TTableName extends string, TColumns extends Record<string, any>>(
  name: TTableName,
  columns: TColumns,
  meta?: Meta
) => {
  return pgTableDrizzle(name, columns);
};

const CorsairDB = {
  table,
  text,
  uuid,
  integer,
  boolean,
  timestamp,
  date,
  json,
  db,
  drizzle,
  drizzleZod,
};

export {
  table,
  text,
  uuid,
  integer,
  boolean,
  timestamp,
  date,
  json,
  db,
  drizzle,
  drizzleZod,
};

export default CorsairDB;
