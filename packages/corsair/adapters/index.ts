// Drizzle adapter
export type { DrizzleAdapterConfig } from './drizzle';
export { drizzleAdapter } from './drizzle';

// Kysely adapter
export type {
	KyselyAdapterConfig,
	KyselyPostgresAdapterConfig,
} from './kysely';
export { kyselyAdapter, kyselyPostgresAdapter } from './kysely';

// Prisma adapter
export type { PrismaPostgresAdapterConfig } from './prisma';
export { prismaPostgresAdapter } from './prisma';

// Tenant utilities
export { withTenantAdapter } from './tenant';

// Core adapter types
export type {
	CorsairAccountInsert,
	CorsairAccountUpdate,
	CorsairDbAdapter,
	CorsairEntityInsert,
	CorsairEntityUpdate,
	CorsairEventInsert,
	CorsairEventUpdate,
	CorsairIntegrationInsert,
	CorsairIntegrationUpdate,
	CorsairSortBy,
	CorsairTableInsert,
	CorsairTableName,
	CorsairTableRow,
	CorsairTableUpdate,
	CorsairTransactionAdapter,
	CorsairWhere,
	CorsairWhereOperator,
	TableInsertType,
	TableRowType,
	TableUpdateType,
} from './types';
