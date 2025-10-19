import type { PrismaClient } from '@prisma/client/extension';
import { entityKind } from "../../entity.cjs";
import type { Logger } from "../../logger.cjs";
import { PgDatabase } from "../../pg-core/index.cjs";
import type { DrizzleConfig } from "../../utils.cjs";
import type { PrismaPgQueryResultHKT } from "./session.cjs";
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
