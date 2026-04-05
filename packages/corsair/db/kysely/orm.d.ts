import type { Kysely } from 'kysely';
import type { ZodTypeAny } from 'zod';
import type { PluginEntityClient } from '../orm';
import type { CorsairKyselyDatabase } from './database';
export declare function createKyselyEntityClient<DataSchema extends ZodTypeAny>(db: Kysely<CorsairKyselyDatabase>, getAccountId: () => Promise<string>, entityTypeName: string, version: string, dataSchema: DataSchema): PluginEntityClient<DataSchema>;
//# sourceMappingURL=orm.d.ts.map