import type { MigrationConfig } from "../migrator.js";
import type { MySql2Database } from "./driver.js";
export declare function migrate<TSchema extends Record<string, unknown>>(db: MySql2Database<TSchema>, config: MigrationConfig): Promise<void>;
