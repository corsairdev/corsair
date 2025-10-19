import type { MigrationConfig } from "../migrator.js";
import type { PlanetScaleDatabase } from "./driver.js";
export declare function migrate<TSchema extends Record<string, unknown>>(db: PlanetScaleDatabase<TSchema>, config: MigrationConfig): Promise<void>;
