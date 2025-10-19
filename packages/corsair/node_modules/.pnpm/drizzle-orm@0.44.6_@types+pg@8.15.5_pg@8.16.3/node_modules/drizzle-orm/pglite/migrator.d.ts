import type { MigrationConfig } from "../migrator.js";
import type { PgliteDatabase } from "./driver.js";
export declare function migrate<TSchema extends Record<string, unknown>>(db: PgliteDatabase<TSchema>, config: MigrationConfig): Promise<void>;
