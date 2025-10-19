import type { MigrationConfig } from "../migrator.js";
import type { DrizzleD1Database } from "./driver.js";
export declare function migrate<TSchema extends Record<string, unknown>>(db: DrizzleD1Database<TSchema>, config: MigrationConfig): Promise<void>;
