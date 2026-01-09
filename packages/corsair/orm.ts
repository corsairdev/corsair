import type { ZodTypeAny, z } from 'zod';

import type {
	CorsairDbAdapter,
	CorsairTableName,
	CorsairWhere,
} from './adapters/types';

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

type CorsairResourceRow = CorsairResourcesTable;

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

type CreateServiceOrmArgs<
	Resource extends string,
	Service extends string,
	DataSchema extends ZodTypeAny,
> = {
	database: CorsairDbAdapter | undefined;
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

function assertDatabaseConfigured(
	database: CorsairDbAdapter | undefined,
): asserts database is CorsairDbAdapter {
	if (!database) {
		throw new Error(
			'Corsair database is not configured. Pass `database` to createCorsair(...) to enable plugin service ORM.',
		);
	}
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

export function createCorsairServiceOrm<
	Resource extends string,
	Service extends string,
	DataSchema extends ZodTypeAny,
>(
	args: CreateServiceOrmArgs<Resource, Service, DataSchema>,
): CorsairOrmServiceClient<Resource, Service, DataSchema> {
	const tableName = 'corsair_resources' as CorsairTableName;

	function baseWhere(): CorsairWhere[] {
		const where: CorsairWhere[] = [
			{ field: 'resource', value: args.resource },
			{ field: 'service', value: args.service },
		];
		// IMPORTANT: only tenant-scope if a tenantId was provided (i.e. multiTenancy true + withTenant used).
		if (args.tenantId) {
			where.push({ field: 'tenant_id', value: args.tenantId });
		}
		return where;
	}

	async function findRowBy(where: { id?: string; resource_id?: string }) {
		assertDatabaseConfigured(args.database);
		const fullWhere = baseWhere();
		if (where.id) fullWhere.push({ field: 'id', value: where.id });
		if (where.resource_id)
			fullWhere.push({ field: 'resource_id', value: where.resource_id });

		return await args.database.findOne<CorsairResourceRow>({
			table: tableName,
			where: fullWhere,
		});
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
			assertDatabaseConfigured(args.database);
			if (resourceIds.length === 0) return [];
			const rows = await args.database.findMany<CorsairResourceRow>({
				table: tableName,
				where: [
					...baseWhere(),
					{ field: 'resource_id', operator: 'in', value: resourceIds },
				],
			});
			return rows.map(parseRowData);
		},
		list: async (options) => {
			assertDatabaseConfigured(args.database);
			const limit = options?.limit ?? 100;
			const offset = options?.offset ?? 0;
			const rows = await args.database.findMany<CorsairResourceRow>({
				table: tableName,
				where: baseWhere(),
				limit,
				offset,
			});
			return rows.map(parseRowData);
		},
		searchByResourceId: async (options) => {
			assertDatabaseConfigured(args.database);
			const limit = options.limit ?? 100;
			const offset = options.offset ?? 0;
			const query = options.query ?? '';
			const rows = await args.database.findMany<CorsairResourceRow>({
				table: tableName,
				where: [
					...baseWhere(),
					{ field: 'resource_id', operator: 'like', value: `%${query}%` },
				],
				limit,
				offset,
			});
			return rows.map(parseRowData);
		},
		upsertByResourceId: async (input) => {
			assertDatabaseConfigured(args.database);
			const parsed = args.dataSchema.parse(input.data);
			const tenant_id = args.tenantId ?? 'default';

			const existing = await args.database.findOne<{ id: string }>({
				table: tableName,
				select: ['id'],
				where: [
					{ field: 'resource', value: args.resource },
					{ field: 'service', value: args.service },
					{ field: 'resource_id', value: input.resourceId },
					{ field: 'tenant_id', value: tenant_id },
				],
			});

			if (existing?.id) {
				const update = {
					version: args.version,
					data: parsed as unknown,
				};
				await args.database.update({
					table: tableName,
					where: [{ field: 'id', value: existing.id }],
					data: update,
				});
				return parsed;
			}

			const insert = {
				id: generateUuidV4(),
				tenant_id,
				resource_id: input.resourceId,
				resource: args.resource,
				service: args.service,
				version: args.version,
				data: parsed as unknown,
			};
			await args.database.insert({
				table: tableName,
				data: insert,
			});
			return parsed;
		},
		deleteById: async (id: string) => {
			assertDatabaseConfigured(args.database);
			const deleted = await args.database.deleteMany({
				table: tableName,
				where: [{ field: 'id', value: id }],
			});
			return deleted > 0;
		},
		deleteByResourceId: async (resourceId: string) => {
			assertDatabaseConfigured(args.database);
			const deleted = await args.database.deleteMany({
				table: tableName,
				where: [
					{ field: 'resource', value: args.resource },
					{ field: 'service', value: args.service },
					{ field: 'resource_id', value: resourceId },
					...(args.tenantId
						? [{ field: 'tenant_id', value: args.tenantId }]
						: []),
				],
			});
			return deleted;
		},
		count: async () => {
			assertDatabaseConfigured(args.database);
			return await args.database.count({
				table: tableName,
				where: baseWhere(),
			});
		},
	};
}
