import type { MigrationConfig } from "../migrator.js";
import type { SQLJsDatabase } from "./driver.js";
export declare function migrate<TSchema extends Record<string, unknown>>(db: SQLJsDatabase<TSchema>, config: MigrationConfig): void;
