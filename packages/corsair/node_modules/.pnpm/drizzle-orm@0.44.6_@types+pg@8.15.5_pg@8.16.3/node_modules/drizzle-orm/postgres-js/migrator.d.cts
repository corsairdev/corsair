import type { MigrationConfig } from "../migrator.cjs";
import type { PostgresJsDatabase } from "./driver.cjs";
export declare function migrate<TSchema extends Record<string, unknown>>(db: PostgresJsDatabase<TSchema>, config: MigrationConfig): Promise<void>;
