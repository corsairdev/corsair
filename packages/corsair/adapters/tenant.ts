import type {
	CorsairDbAdapter,
	CorsairTableName,
	CorsairTransactionAdapter,
	CorsairWhere,
} from './types';

/**
 * Tables that have tenant_id directly and should be filtered.
 * Note: corsair_entities and corsair_events do NOT have tenant_id directly.
 * They are scoped through their account_id → corsair_accounts.tenant_id relationship.
 */
function shouldScopeTable(table: CorsairTableName): boolean {
	return table === 'corsair_accounts';
}

function withTenantWhere(
	table: CorsairTableName,
	where: CorsairWhere[] | undefined,
	tenantId: string,
): CorsairWhere[] {
	if (!shouldScopeTable(table)) return where ?? [];
	return [...(where ?? []), { field: 'tenant_id', value: tenantId }];
}

function withTenantInsertData<T extends Record<string, any>>(
	table: CorsairTableName,
	data: T,
	tenantId: string,
): T {
	if (!shouldScopeTable(table)) return data;
	if ('tenant_id' in data && data.tenant_id && data.tenant_id !== tenantId) {
		throw new Error(
			`Corsair DB adapter: attempted to insert tenant_id "${String(
				data.tenant_id,
			)}" while scoped to tenantId "${tenantId}".`,
		);
	}
	return { ...(data as any), tenant_id: tenantId } as T;
}

/**
 * Wraps a `CorsairDbAdapter` so all queries against tenant-scoped tables
 * are automatically filtered by tenant_id.
 *
 * Note: In the new schema, only `corsair_accounts` has tenant_id directly.
 * `corsair_entities` and `corsair_events` are scoped through their account_id
 * which references corsair_accounts. The ORM layer handles this relationship.
 *
 * This is intended for `createCorsair({ multiTenancy: true }).withTenant(tenantId)`.
 */
export function withTenantAdapter(
	adapter: CorsairDbAdapter,
	tenantId: string,
): CorsairDbAdapter {
	const scopedId = `${adapter.id}:tenant`;

	const scopedTrx = (
		trx: CorsairTransactionAdapter,
	): CorsairTransactionAdapter => {
		return {
			id: `${trx.id}:tenant`,
			findOne: (args) =>
				trx.findOne({
					...args,
					where: withTenantWhere(args.table, args.where, tenantId),
				}),
			findMany: (args) =>
				trx.findMany({
					...args,
					where: withTenantWhere(args.table, args.where, tenantId),
				}),
			insert: (args) =>
				trx.insert({
					...args,
					data: withTenantInsertData(args.table, args.data, tenantId),
				}),
			update: (args) =>
				trx.update({
					...args,
					where: withTenantWhere(args.table, args.where, tenantId),
				}),
			deleteMany: (args) =>
				trx.deleteMany({
					...args,
					where: withTenantWhere(args.table, args.where, tenantId),
				}),
			count: (args) =>
				trx.count({
					...args,
					where: withTenantWhere(args.table, args.where, tenantId),
				}),
		};
	};

	return {
		id: scopedId,
		findOne: (args) =>
			adapter.findOne({
				...args,
				where: withTenantWhere(args.table, args.where, tenantId),
			}),
		findMany: (args) =>
			adapter.findMany({
				...args,
				where: withTenantWhere(args.table, args.where, tenantId),
			}),
		insert: (args) =>
			adapter.insert({
				...args,
				data: withTenantInsertData(args.table, args.data, tenantId),
			}),
		update: (args) =>
			adapter.update({
				...args,
				where: withTenantWhere(args.table, args.where, tenantId),
			}),
		deleteMany: (args) =>
			adapter.deleteMany({
				...args,
				where: withTenantWhere(args.table, args.where, tenantId),
			}),
		count: (args) =>
			adapter.count({
				...args,
				where: withTenantWhere(args.table, args.where, tenantId),
			}),
		transaction: adapter.transaction
			? async <R>(fn: (trx: CorsairTransactionAdapter) => Promise<R>) => {
					return adapter.transaction!(async (trx) => fn(scopedTrx(trx)));
				}
			: undefined,
	};
}
