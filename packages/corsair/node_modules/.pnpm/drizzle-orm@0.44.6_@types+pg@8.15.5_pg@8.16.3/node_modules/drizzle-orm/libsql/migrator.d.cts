import type { MigrationConfig } from "../migrator.cjs";
import type { LibSQLDatabase } from "./driver.cjs";
export declare function migrate<TSchema extends Record<string, unknown>>(db: LibSQLDatabase<TSchema>, config: MigrationConfig): Promise<void>;
