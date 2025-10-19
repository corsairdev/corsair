import type { MigrationConfig } from "../migrator.cjs";
import type { DrizzleD1Database } from "./driver.cjs";
export declare function migrate<TSchema extends Record<string, unknown>>(db: DrizzleD1Database<TSchema>, config: MigrationConfig): Promise<void>;
