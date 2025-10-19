import type { MigrationConfig } from "../migrator.js";
import type { TiDBServerlessDatabase } from "./driver.js";
export declare function migrate<TSchema extends Record<string, unknown>>(db: TiDBServerlessDatabase<TSchema>, config: MigrationConfig): Promise<void>;
