import type { PrismaClient } from '@prisma/client/extension';
import { entityKind } from "../../entity.js";
import type { Logger } from "../../logger.js";
import { MySqlDatabase } from "../../mysql-core/index.js";
import type { DrizzleConfig } from "../../utils.js";
import type { PrismaMySqlPreparedQueryHKT, PrismaMySqlQueryResultHKT } from "./session.js";
export declare class PrismaMySqlDatabase extends MySqlDatabase<PrismaMySqlQueryResultHKT, PrismaMySqlPreparedQueryHKT, Record<string, never>> {
    static readonly [entityKind]: string;
    constructor(client: PrismaClient, logger: Logger | undefined);
}
export type PrismaMySqlConfig = Omit<DrizzleConfig, 'schema'>;
export declare function drizzle(config?: PrismaMySqlConfig): (client: any) => {
    $extends: {
        extArgs: {
            result: {};
            model: {};
            query: {};
            client: {
                $drizzle: () => PrismaMySqlDatabase;
            };
        };
    };
};
