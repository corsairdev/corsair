import type { MigrationConfig } from "../migrator.js";
import type { NeonDatabase } from "./driver.js";
export declare function migrate<TSchema extends Record<string, unknown>>(db: NeonDatabase<TSchema>, config: MigrationConfig): Promise<void>;
