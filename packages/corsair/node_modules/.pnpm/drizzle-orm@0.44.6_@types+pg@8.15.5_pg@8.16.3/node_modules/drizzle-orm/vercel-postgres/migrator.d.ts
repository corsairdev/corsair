import type { MigrationConfig } from "../migrator.js";
import type { VercelPgDatabase } from "./driver.js";
export declare function migrate<TSchema extends Record<string, unknown>>(db: VercelPgDatabase<TSchema>, config: MigrationConfig): Promise<void>;
