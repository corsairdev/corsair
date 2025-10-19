import type { MigrationConfig } from "../migrator.cjs";
import type { NodePgDatabase } from "./driver.cjs";
export declare function migrate<TSchema extends Record<string, unknown>>(db: NodePgDatabase<TSchema>, config: MigrationConfig): Promise<void>;
