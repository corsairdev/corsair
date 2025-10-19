import type { MigrationConfig } from "../migrator.js";
import type { BunSQLiteDatabase } from "./driver.js";
export declare function migrate<TSchema extends Record<string, unknown>>(db: BunSQLiteDatabase<TSchema>, config: MigrationConfig): void;
