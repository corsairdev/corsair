import type { PrismaClient } from '@prisma/client/extension';
import { entityKind } from "../../entity.js";
import type { Logger } from "../../logger.js";
import { PgDatabase } from "../../pg-core/index.js";
import type { DrizzleConfig } from "../../utils.js";
import type { PrismaPgQueryResultHKT } from "./session.js";
export declare class PrismaPgDatabase extends PgDatabase<PrismaPgQueryResultHKT, Record<string, never>> {
    static readonly [entityKind]: string;
    constructor(client: PrismaClient, logger: Logger | undefined);
}
export type PrismaPgConfig = Omit<DrizzleConfig, 'schema'>;
export declare function drizzle(config?: PrismaPgConfig): (client: any) => {
    $extends: {
        extArgs: {
            result: {};
            model: {};
            query: {};
            client: {
                $drizzle: () => PrismaPgDatabase;
            };
        };
    };
};
