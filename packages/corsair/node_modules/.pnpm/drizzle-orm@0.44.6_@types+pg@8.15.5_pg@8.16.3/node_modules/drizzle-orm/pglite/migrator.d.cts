import type { MigrationConfig } from "../migrator.cjs";
import type { PgliteDatabase } from "./driver.cjs";
export declare function migrate<TSchema extends Record<string, unknown>>(db: PgliteDatabase<TSchema>, config: MigrationConfig): Promise<void>;
