// Schema builder utilities (safe for client-side imports)
// No Node.js runtime dependencies

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

import { sql } from "drizzle-orm";

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

const CorsairSchema = {
  table,
  sql,
  text,
  uuid,
  integer,
  boolean,
  timestamp,
  date,
  json,
  drizzle,
  drizzleZod,
};

export {
  table,
  sql,
  text,
  uuid,
  integer,
  boolean,
  timestamp,
  date,
  json,
  drizzle,
  drizzleZod,
};

export default CorsairSchema;
