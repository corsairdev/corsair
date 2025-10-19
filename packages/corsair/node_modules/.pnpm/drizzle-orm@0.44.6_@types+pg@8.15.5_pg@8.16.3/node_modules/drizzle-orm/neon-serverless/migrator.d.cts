import type { MigrationConfig } from "../migrator.cjs";
import type { NeonDatabase } from "./driver.cjs";
export declare function migrate<TSchema extends Record<string, unknown>>(db: NeonDatabase<TSchema>, config: MigrationConfig): Promise<void>;
