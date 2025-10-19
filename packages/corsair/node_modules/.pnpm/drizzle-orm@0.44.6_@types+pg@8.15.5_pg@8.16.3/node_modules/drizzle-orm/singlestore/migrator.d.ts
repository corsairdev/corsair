import type { MigrationConfig } from "../migrator.js";
import type { SingleStoreDriverDatabase } from "./driver.js";
export declare function migrate<TSchema extends Record<string, unknown>>(db: SingleStoreDriverDatabase<TSchema>, config: MigrationConfig): Promise<void>;
