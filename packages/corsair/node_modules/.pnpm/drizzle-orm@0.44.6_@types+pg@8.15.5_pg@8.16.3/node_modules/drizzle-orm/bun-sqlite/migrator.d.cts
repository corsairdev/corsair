import type { MigrationConfig } from "../migrator.cjs";
import type { BunSQLiteDatabase } from "./driver.cjs";
export declare function migrate<TSchema extends Record<string, unknown>>(db: BunSQLiteDatabase<TSchema>, config: MigrationConfig): void;
