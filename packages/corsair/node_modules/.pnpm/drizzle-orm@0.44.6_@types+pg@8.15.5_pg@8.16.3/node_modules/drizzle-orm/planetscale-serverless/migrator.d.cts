import type { MigrationConfig } from "../migrator.cjs";
import type { PlanetScaleDatabase } from "./driver.cjs";
export declare function migrate<TSchema extends Record<string, unknown>>(db: PlanetScaleDatabase<TSchema>, config: MigrationConfig): Promise<void>;
