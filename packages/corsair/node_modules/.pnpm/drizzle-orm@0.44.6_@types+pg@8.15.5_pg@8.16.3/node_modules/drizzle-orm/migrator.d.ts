export interface KitConfig {
    out: string;
    schema: string;
}
export interface MigrationConfig {
    migrationsFolder: string;
    migrationsTable?: string;
    migrationsSchema?: string;
}
export interface MigrationMeta {
    sql: string[];
    folderMillis: number;
    hash: string;
    bps: boolean;
}
export declare function readMigrationFiles(config: MigrationConfig): MigrationMeta[];
