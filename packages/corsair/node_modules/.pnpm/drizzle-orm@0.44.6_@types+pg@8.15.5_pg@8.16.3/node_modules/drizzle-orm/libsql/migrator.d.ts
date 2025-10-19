import type { MigrationConfig } from "../migrator.js";
import type { LibSQLDatabase } from "./driver.js";
export declare function migrate<TSchema extends Record<string, unknown>>(db: LibSQLDatabase<TSchema>, config: MigrationConfig): Promise<void>;
