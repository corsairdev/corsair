import type { PrismaClient } from '@prisma/client/extension';
import { entityKind } from "../../entity.cjs";
import type { Logger } from "../../logger.cjs";
import { MySqlDatabase } from "../../mysql-core/index.cjs";
import type { DrizzleConfig } from "../../utils.cjs";
import type { PrismaMySqlPreparedQueryHKT, PrismaMySqlQueryResultHKT } from "./session.cjs";
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
