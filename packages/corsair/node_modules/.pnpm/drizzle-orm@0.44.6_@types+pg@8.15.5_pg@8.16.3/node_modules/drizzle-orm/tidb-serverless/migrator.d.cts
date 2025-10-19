import type { MigrationConfig } from "../migrator.cjs";
import type { TiDBServerlessDatabase } from "./driver.cjs";
export declare function migrate<TSchema extends Record<string, unknown>>(db: TiDBServerlessDatabase<TSchema>, config: MigrationConfig): Promise<void>;
