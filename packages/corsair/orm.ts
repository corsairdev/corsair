import type { Insertable, Kysely, Selectable, Updateable } from 'kysely';

import type { ZodTypeAny, z } from 'zod';

export type CorsairResourcesTable = {
	id: string;
	tenant_id: string;
	resource_id: string;
	resource: string;
	service: string;
	version: string;
	data: unknown;
};

export type CorsairCredentialsTable = {
	id: string;
	tenant_id: string;
	resource: string;
	permissions: string[];
	credentials: unknown;
};

export type CorsairOrmDatabase = {
	corsair_credentials: CorsairCredentialsTable;
	corsair_resources: CorsairResourcesTable;
};

type CorsairResourceRow = Selectable<CorsairResourcesTable>;
type CorsairResourceInsert = Insertable<CorsairResourcesTable>;
type CorsairResourceUpdate = Updateable<CorsairResourcesTable>;

export type CorsairOrmServiceClient<
	Resource extends string,
	Service extends string,
	DataSchema extends ZodTypeAny,
> = {
	/**
	 * Finds a resource row by the external resource id (e.g. Slack message id).
	 *
	 * In multi-tenant mode, this is tenant-scoped (requires `withTenant()`).
	 */
	findByResourceId: (resourceId: string) => Promise<z.infer<DataSchema> | null>;

	/**
	 * Finds a resource row by the internal uuid.
	 */
	findById: (id: string) => Promise<z.infer<DataSchema> | null>;

	/**
	 * Finds many resources by external resource ids.
	 */
	findManyByResourceIds: (
		resourceIds: string[],
	) => Promise<Array<z.infer<DataSchema>>>;

	/**
	 * Lists resources for this resource/service (and tenant if multi-tenant).
	 */
	list: (options?: {
		limit?: number | undefined;
		offset?: number | undefined;
	}) => Promise<Array<z.infer<DataSchema>>>;

	/**
	 * Simple search by `resource_id` substring.
	 */
	searchByResourceId: (options: {
		query: string;
		limit?: number | undefined;
		offset?: number | undefined;
	}) => Promise<Array<z.infer<DataSchema>>>;

	/**
	 * Creates or updates a resource row keyed by `(tenant_id?, resource, service, resource_id)`.
	 *
	 * Note: This implementation is portable across dialects (select then update/insert),
	 * but assumes the combination above is unique at the DB level for true upsert safety.
	 */
	upsertByResourceId: (input: {
		resourceId: string;
		data: z.input<DataSchema>;
	}) => Promise<z.infer<DataSchema>>;

	/**
	 * Deletes by internal id.
	 */
	deleteById: (id: string) => Promise<boolean>;

	/**
	 * Deletes by external resource id.
	 */
	deleteByResourceId: (resourceId: string) => Promise<number>;

	/**
	 * Counts rows for this resource/service (and tenant if multi-tenant).
	 */
	count: () => Promise<number>;
};

export type CorsairPluginOrmSchema<
	Services extends Record<string, ZodTypeAny>,
> = {
	version: string;
	services: Services;
};

export type CorsairOrmConfig = {
	/**
	 * Kysely instance used to query the shared resource table.
	 */
	db: Kysely<CorsairOrmDatabase>;
	/**
	 * Shared table name.
	 *
	 * @default "corsair_resources"
	 */
	tableName?: keyof CorsairOrmDatabase | (string & {}) | undefined;
	/**
	 * Optional id generator for new rows.
	 *
	 * If not provided, Corsair falls back to `generateUuidV4()`.
	 */
	idGenerator?: (() => string) | undefined;
	/**
	 * Used when `multiTenancy: false` (so `withTenant()` isn't used) but the table still
	 * requires a `tenant_id` value.
	 *
	 * @default "default"
	 */
	defaultTenantId?: string | undefined;
};

type CreateServiceOrmArgs<
	Resource extends string,
	Service extends string,
	DataSchema extends ZodTypeAny,
> = {
	orm: CorsairOrmConfig | undefined;
	resource: Resource;
	service: Service;
	tenantId: string | undefined;
	version: string;
	dataSchema: DataSchema;
};

function parseJsonLike(value: unknown): unknown {
	if (typeof value === 'string') {
		try {
			return JSON.parse(value);
		} catch {
			return value;
		}
	}
	return value;
}

function assertOrmConfigured(
	orm: CorsairOrmConfig | undefined,
): asserts orm is CorsairOrmConfig {
	if (!orm?.db) {
		throw new Error(
			'Corsair ORM is not configured. Pass `orm: { db }` to createCorsair(...) to enable plugin service ORM.',
		);
	}
}

function defaultTenantId(orm: CorsairOrmConfig): string {
	return orm.defaultTenantId ?? 'default';
}

function generateUuidV4(): string {
	// Prefer native UUID if available.
	const cryptoAny = globalThis.crypto as unknown as
		| { randomUUID?: () => string }
		| undefined;
	if (cryptoAny?.randomUUID) {
		return cryptoAny.randomUUID();
	}
	// Fallback UUIDv4-ish generator (non-cryptographic).
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

function generateId(orm: CorsairOrmConfig): string {
	return orm.idGenerator?.() ?? generateUuidV4();
}

export function createCorsairServiceOrm<
	Resource extends string,
	Service extends string,
	DataSchema extends ZodTypeAny,
>(
	args: CreateServiceOrmArgs<Resource, Service, DataSchema>,
): CorsairOrmServiceClient<Resource, Service, DataSchema> {
	const tableName = (args.orm?.tableName ?? 'corsair_resources') as any;

	function baseQuery(orm: CorsairOrmConfig) {
		let q = orm.db
			.selectFrom(tableName)
			.selectAll()
			.where('resource', '=', args.resource as any)
			.where('service', '=', args.service as any);
		// IMPORTANT: only tenant-scope if a tenantId was provided (i.e. multiTenancy true + withTenant used).
		if (args.tenantId) {
			q = q.where('tenant_id', '=', args.tenantId as any);
		}
		return q;
	}

	async function findRowBy(where: { id?: string; resource_id?: string }) {
		assertOrmConfigured(args.orm);
		let q = baseQuery(args.orm);
		if (where.id) {
			q = q.where('id', '=', where.id as any);
		}
		if (where.resource_id) {
			q = q.where('resource_id', '=', where.resource_id as any);
		}

		return (await q.executeTakeFirst()) as CorsairResourceRow | null;
	}

	function parseRowData(row: CorsairResourceRow): z.infer<DataSchema> {
		// NOTE: we currently *read* `version` but don't enforce it. We'll likely want to
		// use this for schema migrations later.
		return args.dataSchema.parse(parseJsonLike(row.data));
	}

	return {
		findByResourceId: async (resourceId: string) => {
			const row = await findRowBy({ resource_id: resourceId });
			return row ? parseRowData(row) : null;
		},
		findById: async (id: string) => {
			const row = await findRowBy({ id });
			return row ? parseRowData(row) : null;
		},
		findManyByResourceIds: async (resourceIds: string[]) => {
			assertOrmConfigured(args.orm);
			if (resourceIds.length === 0) return [];
			const rows = (await baseQuery(args.orm)
				.where('resource_id', 'in', resourceIds as any)
				.execute()) as CorsairResourceRow[];
			return rows.map(parseRowData);
		},
		list: async (options) => {
			assertOrmConfigured(args.orm);
			const limit = options?.limit ?? 100;
			const offset = options?.offset ?? 0;
			const rows = (await baseQuery(args.orm)
				.limit(limit as any)
				.offset(offset as any)
				.execute()) as CorsairResourceRow[];
			return rows.map(parseRowData);
		},
		searchByResourceId: async (options) => {
			assertOrmConfigured(args.orm);
			const limit = options.limit ?? 100;
			const offset = options.offset ?? 0;
			const query = options.query ?? '';
			const rows = (await baseQuery(args.orm)
				.where('resource_id', 'like', `%${query}%` as any)
				.limit(limit as any)
				.offset(offset as any)
				.execute()) as CorsairResourceRow[];
			return rows.map(parseRowData);
		},
		upsertByResourceId: async (input) => {
			assertOrmConfigured(args.orm);
			const parsed = args.dataSchema.parse(input.data);
			const tenant_id = args.tenantId ?? defaultTenantId(args.orm);

			const existing = (await args.orm.db
				.selectFrom(tableName)
				.select(['id'] as any)
				.where('resource', '=', args.resource as any)
				.where('service', '=', args.service as any)
				.where('resource_id', '=', input.resourceId as any)
				.where('tenant_id', '=', tenant_id as any)
				.executeTakeFirst()) as { id: string } | undefined;

			if (existing?.id) {
				const update: CorsairResourceUpdate = {
					version: args.version,
					data: parsed as unknown,
				};
				await args.orm.db
					.updateTable(tableName)
					.set(update as any)
					.where('id', '=', existing.id as any)
					.execute();
				return parsed;
			}

			const insert: CorsairResourceInsert = {
				id: generateId(args.orm),
				tenant_id,
				resource_id: input.resourceId,
				resource: args.resource,
				service: args.service,
				version: args.version,
				data: parsed as unknown,
			};
			await args.orm.db
				.insertInto(tableName)
				.values(insert as any)
				.execute();
			return parsed;
		},
		deleteById: async (id: string) => {
			assertOrmConfigured(args.orm);
			const res = await args.orm.db
				.deleteFrom(tableName)
				.where('id', '=', id as any)
				.executeTakeFirst();
			return Number((res as any)?.numDeletedRows ?? 0) > 0;
		},
		deleteByResourceId: async (resourceId: string) => {
			assertOrmConfigured(args.orm);
			let q = args.orm.db
				.deleteFrom(tableName)
				.where('resource', '=', args.resource as any)
				.where('service', '=', args.service as any)
				.where('resource_id', '=', resourceId as any);
			if (args.tenantId) {
				q = q.where('tenant_id', '=', args.tenantId as any);
			}
			const res = await q.executeTakeFirst();
			return Number((res as any)?.numDeletedRows ?? 0);
		},
		count: async () => {
			assertOrmConfigured(args.orm);
			const res = await baseQuery(args.orm)
				.select((eb: any) => eb.fn.count('id').as('count'))
				.executeTakeFirst();
			const countVal = (res as any)?.count;
			if (typeof countVal === 'number') return countVal;
			if (typeof countVal === 'bigint') return Number(countVal);
			return Number.parseInt(String(countVal ?? 0), 10);
		},
	};
}
