import type { MigrationConfig } from "../migrator.js";
import type { BetterSQLite3Database } from "./driver.js";
export declare function migrate<TSchema extends Record<string, unknown>>(db: BetterSQLite3Database<TSchema>, config: MigrationConfig): void;
