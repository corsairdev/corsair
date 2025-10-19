import type { MigrationConfig } from "../../migrator.js";
import type { AwsDataApiPgDatabase } from "./driver.js";
export declare function migrate<TSchema extends Record<string, unknown>>(db: AwsDataApiPgDatabase<TSchema>, config: MigrationConfig): Promise<void>;
