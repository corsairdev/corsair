import type { MigrationConfig } from "../migrator.cjs";
import type { VercelPgDatabase } from "./driver.cjs";
export declare function migrate<TSchema extends Record<string, unknown>>(db: VercelPgDatabase<TSchema>, config: MigrationConfig): Promise<void>;
