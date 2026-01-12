import type { ZodTypeAny, z } from 'zod';

import type {
	CorsairDbAdapter,
	CorsairTableName,
	CorsairWhere,
} from './adapters/types';

import type {
	CorsairConnection,
	CorsairResource,
	CorsairEvent,
	CorsairProvider,
} from './db';

import {
	CorsairConnectionsSchema,
	CorsairResourcesSchema,
	CorsairEventsSchema,
	CorsairProvidersSchema,
} from './db';

// ─────────────────────────────────────────────────────────────────────────────
// Core Table Types
// ─────────────────────────────────────────────────────────────────────────────

export type CorsairOrmDatabase = {
	corsair_connections: CorsairConnection;
	corsair_resources: CorsairResource;
	corsair_events: CorsairEvent;
	corsair_providers: CorsairProvider;
};

export type CorsairOrmTableName = keyof CorsairOrmDatabase;

/**
 * Maps table names to their Zod schemas for runtime validation.
 */
const TABLE_SCHEMAS: Record<CorsairOrmTableName, ZodTypeAny> = {
	corsair_connections: CorsairConnectionsSchema,
	corsair_resources: CorsairResourcesSchema,
	corsair_events: CorsairEventsSchema,
	corsair_providers: CorsairProvidersSchema,
};

// ─────────────────────────────────────────────────────────────────────────────
// Utility Functions
// ─────────────────────────────────────────────────────────────────────────────

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
			'Corsair database is not configured. Pass `database` to createCorsair(...) to enable ORM.',
		);
	}
}

function generateUuidV4(): string {
	const cryptoAny = globalThis.crypto as unknown as
		| { randomUUID?: () => string }
		| undefined;
	if (cryptoAny?.randomUUID) {
		return cryptoAny.randomUUID();
	}
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

// ─────────────────────────────────────────────────────────────────────────────
// Generic Table ORM Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Input type for creating a new row (without auto-generated fields).
 */
type CreateInput<T> = Omit<T, 'id' | 'created_at' | 'updated_at'> & {
	id?: string;
};

/**
 * Input type for updating an existing row.
 */
type UpdateInput<T> = Partial<Omit<T, 'id' | 'created_at' | 'updated_at'>>;

/**
 * Where clause builder for type-safe filtering.
 */
type WhereClause<T> = {
	[K in keyof T]?: T[K] | { in: T[K][] } | { like: string };
};

/**
 * Base table ORM client with common CRUD operations.
 */
export type CorsairTableClient<T> = {
	findById: (id: string) => Promise<T | null>;
	findOne: (where: WhereClause<T>) => Promise<T | null>;
	findMany: (options?: {
		where?: WhereClause<T>;
		limit?: number;
		offset?: number;
	}) => Promise<T[]>;
	create: (data: CreateInput<T>) => Promise<T>;
	update: (id: string, data: UpdateInput<T>) => Promise<T | null>;
	updateMany: (where: WhereClause<T>, data: UpdateInput<T>) => Promise<number>;
	delete: (id: string) => Promise<boolean>;
	deleteMany: (where: WhereClause<T>) => Promise<number>;
	count: (where?: WhereClause<T>) => Promise<number>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Table-Specific Extensions
// ─────────────────────────────────────────────────────────────────────────────

export type CorsairConnectionsClient = CorsairTableClient<CorsairConnection> & {
	findByTenantAndResource: (
		tenantId: string,
		resource: string,
	) => Promise<CorsairConnection | null>;
	listByTenant: (
		tenantId: string,
		options?: { limit?: number; offset?: number },
	) => Promise<CorsairConnection[]>;
	upsertByTenantAndResource: (
		tenantId: string,
		resource: string,
		data: Omit<CreateInput<CorsairConnection>, 'tenant_id' | 'resource'>,
	) => Promise<CorsairConnection>;
};

export type CorsairResourcesClient = CorsairTableClient<CorsairResource> & {
	findByResourceId: (options: {
		tenantId: string;
		resource: string;
		service: string;
		resourceId: string;
	}) => Promise<CorsairResource | null>;
	findManyByResourceIds: (options: {
		tenantId: string;
		resource: string;
		service: string;
		resourceIds: string[];
	}) => Promise<CorsairResource[]>;
	listByScope: (options: {
		tenantId: string;
		resource: string;
		service: string;
		limit?: number;
		offset?: number;
	}) => Promise<CorsairResource[]>;
	searchByResourceId: (options: {
		tenantId: string;
		resource: string;
		service: string;
		query: string;
		limit?: number;
		offset?: number;
	}) => Promise<CorsairResource[]>;
	upsertByResourceId: (options: {
		tenantId: string;
		resource: string;
		service: string;
		resourceId: string;
		version: string;
		data: Record<string, unknown>;
	}) => Promise<CorsairResource>;
	deleteByResourceId: (options: {
		tenantId: string;
		resource: string;
		service: string;
		resourceId: string;
	}) => Promise<boolean>;
};

export type CorsairEventsClient = CorsairTableClient<CorsairEvent> & {
	listByTenant: (
		tenantId: string,
		options?: { limit?: number; offset?: number },
	) => Promise<CorsairEvent[]>;
	listByStatus: (
		status: 'pending' | 'processing' | 'completed' | 'failed',
		options?: { tenantId?: string; limit?: number; offset?: number },
	) => Promise<CorsairEvent[]>;
	listPending: (options?: {
		tenantId?: string;
		limit?: number;
	}) => Promise<CorsairEvent[]>;
	updateStatus: (
		id: string,
		status: 'pending' | 'processing' | 'completed' | 'failed',
	) => Promise<CorsairEvent | null>;
	incrementRetry: (id: string) => Promise<CorsairEvent | null>;
};

export type CorsairProvidersClient = CorsairTableClient<CorsairProvider> & {
	findByName: (name: string) => Promise<CorsairProvider | null>;
	upsertByName: (
		name: string,
		data: Omit<CreateInput<CorsairProvider>, 'name'>,
	) => Promise<CorsairProvider>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Base ORM
// ─────────────────────────────────────────────────────────────────────────────

export type CorsairOrm = {
	connections: CorsairConnectionsClient;
	resources: CorsairResourcesClient;
	events: CorsairEventsClient;
	providers: CorsairProvidersClient;
};

function buildWhere<T>(where: WhereClause<T> | undefined): CorsairWhere[] {
	if (!where) return [];
	const result: CorsairWhere[] = [];
	for (const [field, value] of Object.entries(where)) {
		if (value === undefined) continue;
		if (
			typeof value === 'object' &&
			value !== null &&
			!Array.isArray(value) &&
			!(value instanceof Date)
		) {
			const obj = value as { in?: unknown[]; like?: string };
			if ('in' in obj && Array.isArray(obj.in)) {
				result.push({ field, operator: 'in', value: obj.in });
			} else if ('like' in obj && typeof obj.like === 'string') {
				result.push({ field, operator: 'like', value: obj.like });
			}
		} else {
			result.push({ field, value });
		}
	}
	return result;
}

function createBaseTableClient<T>(
	database: CorsairDbAdapter | undefined,
	tableName: CorsairOrmTableName,
): CorsairTableClient<T> {
	const schema = TABLE_SCHEMAS[tableName];

	function parseRow(row: unknown): T {
		if (!row) throw new Error('Row is null');
		const parsed = { ...(row as Record<string, unknown>) };
		for (const key of Object.keys(parsed)) {
			parsed[key] = parseJsonLike(parsed[key]);
		}
		return schema.parse(parsed) as T;
	}

	return {
		findById: async (id: string) => {
			assertDatabaseConfigured(database);
			const row = await database.findOne<T>({
				table: tableName as CorsairTableName,
				where: [{ field: 'id', value: id }],
			});
			return row ? parseRow(row) : null;
		},

		findOne: async (where: WhereClause<T>) => {
			assertDatabaseConfigured(database);
			const row = await database.findOne<T>({
				table: tableName as CorsairTableName,
				where: buildWhere(where),
			});
			return row ? parseRow(row) : null;
		},

		findMany: async (options) => {
			assertDatabaseConfigured(database);
			const rows = await database.findMany<T>({
				table: tableName as CorsairTableName,
				where: buildWhere(options?.where),
				limit: options?.limit ?? 100,
				offset: options?.offset ?? 0,
			});
			return rows.map(parseRow);
		},

		create: async (data: CreateInput<T>) => {
			assertDatabaseConfigured(database);
			const now = new Date();
			const insert = {
				id: (data as any).id ?? generateUuidV4(),
				created_at: now,
				updated_at: now,
				...data,
			};
			const row = await database.insert<typeof insert, T>({
				table: tableName as CorsairTableName,
				data: insert,
			});
			return parseRow(row);
		},

		update: async (id: string, data: UpdateInput<T>) => {
			assertDatabaseConfigured(database);
			const update = { ...data, updated_at: new Date() };
			const row = await database.update<T>({
				table: tableName as CorsairTableName,
				where: [{ field: 'id', value: id }],
				data: update,
			});
			return row ? parseRow(row) : null;
		},

		updateMany: async (where: WhereClause<T>, data: UpdateInput<T>) => {
			assertDatabaseConfigured(database);
			const update = { ...data, updated_at: new Date() };
			const rows = await database.findMany<{ id: string }>({
				table: tableName as CorsairTableName,
				where: buildWhere(where),
				select: ['id'],
			});
			for (const row of rows) {
				await database.update({
					table: tableName as CorsairTableName,
					where: [{ field: 'id', value: row.id }],
					data: update,
				});
			}
			return rows.length;
		},

		delete: async (id: string) => {
			assertDatabaseConfigured(database);
			const deleted = await database.deleteMany({
				table: tableName as CorsairTableName,
				where: [{ field: 'id', value: id }],
			});
			return deleted > 0;
		},

		deleteMany: async (where: WhereClause<T>) => {
			assertDatabaseConfigured(database);
			return await database.deleteMany({
				table: tableName as CorsairTableName,
				where: buildWhere(where),
			});
		},

		count: async (where) => {
			assertDatabaseConfigured(database);
			return await database.count({
				table: tableName as CorsairTableName,
				where: buildWhere(where),
			});
		},
	};
}

function createConnectionsClient(
	database: CorsairDbAdapter | undefined,
): CorsairConnectionsClient {
	const base = createBaseTableClient<CorsairConnection>(
		database,
		'corsair_connections',
	);

	return {
		...base,
		findByTenantAndResource: (tenantId, resource) =>
			base.findOne({ tenant_id: tenantId, resource } as any),
		listByTenant: (tenantId, options) =>
			base.findMany({
				where: { tenant_id: tenantId } as any,
				limit: options?.limit,
				offset: options?.offset,
			}),
		upsertByTenantAndResource: async (tenantId, resource, data) => {
			const existing = await base.findOne({
				tenant_id: tenantId,
				resource,
			} as any);
			if (existing) {
				return (await base.update(existing.id, data as any))!;
			}
			return base.create({ ...data, tenant_id: tenantId, resource } as any);
		},
	};
}

function createResourcesClient(
	database: CorsairDbAdapter | undefined,
): CorsairResourcesClient {
	const base = createBaseTableClient<CorsairResource>(
		database,
		'corsair_resources',
	);

	return {
		...base,
		findByResourceId: ({ tenantId, resource, service, resourceId }) =>
			base.findOne({
				tenant_id: tenantId,
				resource,
				service,
				resource_id: resourceId,
			} as any),
		findManyByResourceIds: async ({
			tenantId,
			resource,
			service,
			resourceIds,
		}) => {
			if (resourceIds.length === 0) return [];
			assertDatabaseConfigured(database);
			return database.findMany<CorsairResource>({
				table: 'corsair_resources' as CorsairTableName,
				where: [
					{ field: 'tenant_id', value: tenantId },
					{ field: 'resource', value: resource },
					{ field: 'service', value: service },
					{ field: 'resource_id', operator: 'in', value: resourceIds },
				],
			});
		},
		listByScope: ({ tenantId, resource, service, limit, offset }) =>
			base.findMany({
				where: { tenant_id: tenantId, resource, service } as any,
				limit,
				offset,
			}),
		searchByResourceId: async ({
			tenantId,
			resource,
			service,
			query,
			limit,
			offset,
		}) => {
			assertDatabaseConfigured(database);
			return database.findMany<CorsairResource>({
				table: 'corsair_resources' as CorsairTableName,
				where: [
					{ field: 'tenant_id', value: tenantId },
					{ field: 'resource', value: resource },
					{ field: 'service', value: service },
					{ field: 'resource_id', operator: 'like', value: `%${query}%` },
				],
				limit: limit ?? 100,
				offset: offset ?? 0,
			});
		},
		upsertByResourceId: async ({
			tenantId,
			resource,
			service,
			resourceId,
			version,
			data,
		}) => {
			const existing = await base.findOne({
				tenant_id: tenantId,
				resource,
				service,
				resource_id: resourceId,
			} as any);
			if (existing) {
				return (await base.update(existing.id, { version, data } as any))!;
			}
			return base.create({
				tenant_id: tenantId,
				resource,
				service,
				resource_id: resourceId,
				version,
				data,
			} as any);
		},
		deleteByResourceId: async ({ tenantId, resource, service, resourceId }) => {
			assertDatabaseConfigured(database);
			const deleted = await database.deleteMany({
				table: 'corsair_resources' as CorsairTableName,
				where: [
					{ field: 'tenant_id', value: tenantId },
					{ field: 'resource', value: resource },
					{ field: 'service', value: service },
					{ field: 'resource_id', value: resourceId },
				],
			});
			return deleted > 0;
		},
	};
}

function createEventsClient(
	database: CorsairDbAdapter | undefined,
): CorsairEventsClient {
	const base = createBaseTableClient<CorsairEvent>(database, 'corsair_events');

	return {
		...base,
		listByTenant: (tenantId, options) =>
			base.findMany({
				where: { tenant_id: tenantId } as any,
				limit: options?.limit,
				offset: options?.offset,
			}),
		listByStatus: (status, options) => {
			const where: any = { status };
			if (options?.tenantId) where.tenant_id = options.tenantId;
			return base.findMany({
				where,
				limit: options?.limit,
				offset: options?.offset,
			});
		},
		listPending: (options) => {
			const where: any = { status: 'pending' };
			if (options?.tenantId) where.tenant_id = options.tenantId;
			return base.findMany({ where, limit: options?.limit ?? 100 });
		},
		updateStatus: (id, status) => base.update(id, { status } as any),
		incrementRetry: async (id) => {
			const event = await base.findById(id);
			if (!event) return null;
			return base.update(id, {
				retry_count: (event.retry_count ?? 0) + 1,
			} as any);
		},
	};
}

function createProvidersClient(
	database: CorsairDbAdapter | undefined,
): CorsairProvidersClient {
	const base = createBaseTableClient<CorsairProvider>(
		database,
		'corsair_providers',
	);

	return {
		...base,
		findByName: (name) => base.findOne({ name } as any),
		upsertByName: async (name, data) => {
			const existing = await base.findOne({ name } as any);
			if (existing) {
				return (await base.update(existing.id, data as any))!;
			}
			return base.create({ ...data, name } as any);
		},
	};
}

/**
 * Creates the base Corsair ORM with all table clients.
 */
export function createCorsairOrm(
	database: CorsairDbAdapter | undefined,
): CorsairOrm {
	return {
		connections: createConnectionsClient(database),
		resources: createResourcesClient(database),
		events: createEventsClient(database),
		providers: createProvidersClient(database),
	};
}

// ─────────────────────────────────────────────────────────────────────────────
// Plugin ORM - Typed service accessors for plugins
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Plugin schema definition - maps service names to their Zod data schemas.
 */
export type CorsairPluginSchema<Services extends Record<string, ZodTypeAny>> = {
	version: string;
	services: Services;
};

/**
 * Typed resource with plugin-specific data type.
 */
export type TypedResource<DataSchema extends ZodTypeAny> = Omit<
	CorsairResource,
	'data'
> & {
	data: z.infer<DataSchema>;
};

/**
 * Service client for a specific plugin service (e.g., slack.messages).
 * Provides typed access to resources with the service's data schema.
 */
export type PluginServiceClient<DataSchema extends ZodTypeAny> = {
	/** Find by external resource ID (e.g., Slack message ts). */
	findByResourceId: (
		resourceId: string,
	) => Promise<TypedResource<DataSchema> | null>;

	/** Find by internal UUID. */
	findById: (id: string) => Promise<TypedResource<DataSchema> | null>;

	/** Find multiple by external resource IDs. */
	findManyByResourceIds: (
		resourceIds: string[],
	) => Promise<TypedResource<DataSchema>[]>;

	/** List all resources for this service. */
	list: (options?: {
		limit?: number;
		offset?: number;
	}) => Promise<TypedResource<DataSchema>[]>;

	/** Search by resource ID substring. */
	search: (options: {
		query: string;
		limit?: number;
		offset?: number;
	}) => Promise<TypedResource<DataSchema>[]>;

	/** Create or update by external resource ID. */
	upsert: (
		resourceId: string,
		data: z.input<DataSchema>,
	) => Promise<TypedResource<DataSchema>>;

	/** Delete by internal UUID. */
	deleteById: (id: string) => Promise<boolean>;

	/** Delete by external resource ID. */
	deleteByResourceId: (resourceId: string) => Promise<boolean>;

	/** Count resources for this service. */
	count: () => Promise<number>;
};

/**
 * Maps a plugin schema to its typed service clients.
 */
export type PluginServiceClients<Services extends Record<string, ZodTypeAny>> =
	{
		[K in keyof Services]: PluginServiceClient<Services[K]>;
	};

/**
 * Full plugin ORM with typed service clients + access to base tables.
 */
export type CorsairPluginOrm<Services extends Record<string, ZodTypeAny>> =
	PluginServiceClients<Services> & {
		/** Access to the base ORM for raw table operations. */
		$orm: CorsairOrm;
		/** The plugin ID this ORM is scoped to. */
		$pluginId: string;
		/** The tenant ID this ORM is scoped to. */
		$tenantId: string;
	};

/**
 * Creates a service client for a specific plugin service.
 */
function createPluginServiceClient<DataSchema extends ZodTypeAny>(
	database: CorsairDbAdapter | undefined,
	pluginId: string,
	serviceName: string,
	tenantId: string,
	version: string,
	dataSchema: DataSchema,
): PluginServiceClient<DataSchema> {
	const tableName = 'corsair_resources' as CorsairTableName;

	function baseWhere(): CorsairWhere[] {
		return [
			{ field: 'tenant_id', value: tenantId },
			{ field: 'resource', value: pluginId },
			{ field: 'service', value: serviceName },
		];
	}

	function parseRow(row: CorsairResource): TypedResource<DataSchema> {
		const data = parseJsonLike(row.data);
		return {
			...row,
			data: dataSchema.parse(data),
		} as TypedResource<DataSchema>;
	}

	return {
		findByResourceId: async (resourceId) => {
			assertDatabaseConfigured(database);
			const row = await database.findOne<CorsairResource>({
				table: tableName,
				where: [...baseWhere(), { field: 'resource_id', value: resourceId }],
			});
			return row ? parseRow(row) : null;
		},

		findById: async (id) => {
			assertDatabaseConfigured(database);
			const row = await database.findOne<CorsairResource>({
				table: tableName,
				where: [...baseWhere(), { field: 'id', value: id }],
			});
			return row ? parseRow(row) : null;
		},

		findManyByResourceIds: async (resourceIds) => {
			if (resourceIds.length === 0) return [];
			assertDatabaseConfigured(database);
			const rows = await database.findMany<CorsairResource>({
				table: tableName,
				where: [
					...baseWhere(),
					{ field: 'resource_id', operator: 'in', value: resourceIds },
				],
			});
			return rows.map(parseRow);
		},

		list: async (options) => {
			assertDatabaseConfigured(database);
			const rows = await database.findMany<CorsairResource>({
				table: tableName,
				where: baseWhere(),
				limit: options?.limit ?? 100,
				offset: options?.offset ?? 0,
			});
			return rows.map(parseRow);
		},

		search: async ({ query, limit, offset }) => {
			assertDatabaseConfigured(database);
			const rows = await database.findMany<CorsairResource>({
				table: tableName,
				where: [
					...baseWhere(),
					{ field: 'resource_id', operator: 'like', value: `%${query}%` },
				],
				limit: limit ?? 100,
				offset: offset ?? 0,
			});
			return rows.map(parseRow);
		},

		upsert: async (resourceId, data) => {
			assertDatabaseConfigured(database);
			const parsed = dataSchema.parse(data);

			const existing = await database.findOne<{ id: string }>({
				table: tableName,
				select: ['id'],
				where: [...baseWhere(), { field: 'resource_id', value: resourceId }],
			});

			const now = new Date();

			if (existing?.id) {
				await database.update({
					table: tableName,
					where: [{ field: 'id', value: existing.id }],
					data: { version, data: parsed, updated_at: now },
				});
				const updated = await database.findOne<CorsairResource>({
					table: tableName,
					where: [{ field: 'id', value: existing.id }],
				});
				return parseRow(updated!);
			}

			const id = generateUuidV4();
			await database.insert({
				table: tableName,
				data: {
					id,
					created_at: now,
					updated_at: now,
					tenant_id: tenantId,
					resource_id: resourceId,
					resource: pluginId,
					service: serviceName,
					version,
					data: parsed,
				},
			});

			const inserted = await database.findOne<CorsairResource>({
				table: tableName,
				where: [{ field: 'id', value: id }],
			});
			return parseRow(inserted!);
		},

		deleteById: async (id) => {
			assertDatabaseConfigured(database);
			const deleted = await database.deleteMany({
				table: tableName,
				where: [...baseWhere(), { field: 'id', value: id }],
			});
			return deleted > 0;
		},

		deleteByResourceId: async (resourceId) => {
			assertDatabaseConfigured(database);
			const deleted = await database.deleteMany({
				table: tableName,
				where: [...baseWhere(), { field: 'resource_id', value: resourceId }],
			});
			return deleted > 0;
		},

		count: async () => {
			assertDatabaseConfigured(database);
			return database.count({ table: tableName, where: baseWhere() });
		},
	};
}

/**
 * Creates a plugin ORM with typed service clients.
 *
 * @example
 * ```ts
 * const SlackSchema = {
 *   version: '1.0.0',
 *   services: {
 *     messages: SlackMessageSchema,
 *     channels: SlackChannelSchema,
 *     users: SlackUserSchema,
 *   },
 * } as const;
 *
 * const slackOrm = createPluginOrm(database, {
 *   pluginId: 'slack',
 *   schema: SlackSchema,
 *   tenantId: 'tenant-123',
 * });
 *
 * // Typed service access
 * const message = await slackOrm.messages.findByResourceId('1234567890.123456');
 * // message.data is typed as SlackMessage
 *
 * await slackOrm.channels.upsert('C123', {
 *   id: 'C123',
 *   name: 'general',
 *   is_private: false,
 * });
 *
 * // Access base ORM for raw operations
 * const allConnections = await slackOrm.$orm.connections.listByTenant('tenant-123');
 * ```
 */
export function createPluginOrm<
	Services extends Record<string, ZodTypeAny>,
>(config: {
	database: CorsairDbAdapter | undefined;
	pluginId: string;
	schema: CorsairPluginSchema<Services>;
	tenantId: string;
}): CorsairPluginOrm<Services> {
	const { database, pluginId, schema, tenantId } = config;
	const baseOrm = createCorsairOrm(database);

	const serviceClients = {} as PluginServiceClients<Services>;
	for (const [serviceName, dataSchema] of Object.entries(schema.services)) {
		(serviceClients as any)[serviceName] = createPluginServiceClient(
			database,
			pluginId,
			serviceName,
			tenantId,
			schema.version,
			dataSchema,
		);
	}

	return {
		...serviceClients,
		$orm: baseOrm,
		$pluginId: pluginId,
		$tenantId: tenantId,
	};
}

/**
 * Creates a tenant-scoped factory for plugin ORMs.
 * Useful when you need to switch tenants frequently.
 *
 * @example
 * ```ts
 * const slackOrmFactory = createPluginOrmFactory(database, {
 *   pluginId: 'slack',
 *   schema: SlackSchema,
 * });
 *
 * const tenant1Orm = slackOrmFactory.forTenant('tenant-1');
 * const tenant2Orm = slackOrmFactory.forTenant('tenant-2');
 * ```
 */
export function createPluginOrmFactory<
	Services extends Record<string, ZodTypeAny>,
>(
	database: CorsairDbAdapter | undefined,
	config: {
		pluginId: string;
		schema: CorsairPluginSchema<Services>;
	},
) {
	return {
		forTenant: (tenantId: string): CorsairPluginOrm<Services> =>
			createPluginOrm({
				database,
				pluginId: config.pluginId,
				schema: config.schema,
				tenantId,
			}),
	};
}
