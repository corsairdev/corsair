import type { MigrationConfig } from "../migrator.js";
import type { PostgresJsDatabase } from "./driver.js";
export declare function migrate<TSchema extends Record<string, unknown>>(db: PostgresJsDatabase<TSchema>, config: MigrationConfig): Promise<void>;
