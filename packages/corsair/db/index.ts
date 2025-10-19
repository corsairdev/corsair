import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
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

export const db = drizzle(process.env.DATABASE_URL!);

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
export const table = <
  TTableName extends string,
  TColumns extends Record<string, any>
>(
  name: TTableName,
  columns: TColumns,
  meta?: Meta
) => {
  return pgTableDrizzle(name, columns);
};

export const t = {
  text,
  uuid,
  integer,
  boolean,
  timestamp,
  date,
  json,
};
