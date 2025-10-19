import type { MigrationConfig } from "../migrator.cjs";
import type { SingleStoreRemoteDatabase } from "./driver.cjs";
export type ProxyMigrator = (migrationQueries: string[]) => Promise<void>;
export declare function migrate<TSchema extends Record<string, unknown>>(db: SingleStoreRemoteDatabase<TSchema>, callback: ProxyMigrator, config: MigrationConfig): Promise<void>;
