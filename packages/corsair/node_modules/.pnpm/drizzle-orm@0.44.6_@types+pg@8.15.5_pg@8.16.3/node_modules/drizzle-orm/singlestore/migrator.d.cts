import type { MigrationConfig } from "../migrator.cjs";
import type { SingleStoreDriverDatabase } from "./driver.cjs";
export declare function migrate<TSchema extends Record<string, unknown>>(db: SingleStoreDriverDatabase<TSchema>, config: MigrationConfig): Promise<void>;
