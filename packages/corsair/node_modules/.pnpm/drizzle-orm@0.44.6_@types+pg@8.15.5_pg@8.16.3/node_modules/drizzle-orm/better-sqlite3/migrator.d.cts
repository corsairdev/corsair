import type { MigrationConfig } from "../migrator.cjs";
import type { BetterSQLite3Database } from "./driver.cjs";
export declare function migrate<TSchema extends Record<string, unknown>>(db: BetterSQLite3Database<TSchema>, config: MigrationConfig): void;
