import type { MigrationConfig } from "../migrator.cjs";
import type { SQLJsDatabase } from "./driver.cjs";
export declare function migrate<TSchema extends Record<string, unknown>>(db: SQLJsDatabase<TSchema>, config: MigrationConfig): void;
