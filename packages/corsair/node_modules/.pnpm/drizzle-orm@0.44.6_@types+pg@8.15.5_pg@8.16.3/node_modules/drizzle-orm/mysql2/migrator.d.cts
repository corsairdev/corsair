import type { MigrationConfig } from "../migrator.cjs";
import type { MySql2Database } from "./driver.cjs";
export declare function migrate<TSchema extends Record<string, unknown>>(db: MySql2Database<TSchema>, config: MigrationConfig): Promise<void>;
