import type { MigrationConfig } from "../migrator.js";
import type { BunSQLDatabase } from "./driver.js";
export declare function migrate<TSchema extends Record<string, unknown>>(db: BunSQLDatabase<TSchema>, config: MigrationConfig): Promise<void>;
