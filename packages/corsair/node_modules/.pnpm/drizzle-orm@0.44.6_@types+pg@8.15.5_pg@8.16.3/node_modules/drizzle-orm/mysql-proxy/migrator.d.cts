import type { MigrationConfig } from "../migrator.cjs";
import type { MySqlRemoteDatabase } from "./driver.cjs";
export type ProxyMigrator = (migrationQueries: string[]) => Promise<void>;
export declare function migrate<TSchema extends Record<string, unknown>>(db: MySqlRemoteDatabase<TSchema>, callback: ProxyMigrator, config: MigrationConfig): Promise<void>;
