import type { DrizzleSqliteDODatabase } from "./driver.cjs";
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
export declare function migrate<TSchema extends Record<string, unknown>>(db: DrizzleSqliteDODatabase<TSchema>, config: MigrationConfig): Promise<void>;
export {};
