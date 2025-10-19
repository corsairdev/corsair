import type { MigrationConfig } from "../migrator.cjs";
import type { BunSQLDatabase } from "./driver.cjs";
export declare function migrate<TSchema extends Record<string, unknown>>(db: BunSQLDatabase<TSchema>, config: MigrationConfig): Promise<void>;
