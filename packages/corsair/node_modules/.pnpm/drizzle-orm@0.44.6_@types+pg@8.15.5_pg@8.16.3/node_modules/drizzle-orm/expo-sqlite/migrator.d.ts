import type { ExpoSQLiteDatabase } from "./driver.js";
interface MigrationConfig {
    journal: {
        entries: {
            idx: number;
            when: number;
            tag: string;
            breakpoints: boolean;
        }[];
    };
    migrations: Record<string, string>;
}
export declare function migrate<TSchema extends Record<string, unknown>>(db: ExpoSQLiteDatabase<TSchema>, config: MigrationConfig): Promise<void>;
interface State {
    success: boolean;
    error?: Error;
}
export declare const useMigrations: (db: ExpoSQLiteDatabase<any>, migrations: {
    journal: {
        entries: {
            idx: number;
            when: number;
            tag: string;
            breakpoints: boolean;
        }[];
    };
    migrations: Record<string, string>;
}) => State;
export {};
