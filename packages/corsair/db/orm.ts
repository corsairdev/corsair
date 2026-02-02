import type { ZodTypeAny, z } from 'zod';

import type {
	CorsairDbAdapter,
	CorsairWhere,
	TableInsertType,
	TableUpdateType,
} from '../adapters/types';
import { generateUUID } from '../core/utils';
import type {
	CorsairAccount,
	CorsairEntity,
	CorsairEvent,
	CorsairIntegration,
} from './';
import {
	CorsairAccountsSchema,
	CorsairEntitiesSchema,
	CorsairEventsSchema,
	CorsairIntegrationsSchema,
} from './';

// ─────────────────────────────────────────────────────────────────────────────
// Core Table Types
// ─────────────────────────────────────────────────────────────────────────────

export type CorsairOrmDatabase = {
	corsair_integrations: CorsairIntegration;
	corsair_accounts: CorsairAccount;
	corsair_entities: CorsairEntity;
	corsair_events: CorsairEvent;
};

export type CorsairOrmTableName = keyof CorsairOrmDatabase;

/**
 * Maps table names to their Zod schemas for runtime validation.
 */
const TABLE_SCHEMAS: Record<CorsairOrmTableName, ZodTypeAny> = {
	corsair_integrations: CorsairIntegrationsSchema,
	corsair_accounts: CorsairAccountsSchema,
	corsair_entities: CorsairEntitiesSchema,
	corsair_events: CorsairEventsSchema,
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

export type CorsairIntegrationsClient =
	CorsairTableClient<CorsairIntegration> & {
		findByName: (name: string) => Promise<CorsairIntegration | null>;
		upsertByName: (
			name: string,
			data: Omit<CreateInput<CorsairIntegration>, 'name'>,
		) => Promise<CorsairIntegration>;
	};

export type CorsairAccountsClient = CorsairTableClient<CorsairAccount> & {
	findByTenantAndIntegration: (
		tenantId: string,
		integrationName: string,
	) => Promise<CorsairAccount | null>;
	listByTenant: (
		tenantId: string,
		options?: { limit?: number; offset?: number },
	) => Promise<CorsairAccount[]>;
	upsertByTenantAndIntegration: (
		tenantId: string,
		integrationId: string,
		data: Omit<CreateInput<CorsairAccount>, 'tenant_id' | 'integration_id'>,
	) => Promise<CorsairAccount>;
};

export type CorsairEntitiesClient = CorsairTableClient<CorsairEntity> & {
	findByEntityId: (options: {
		accountId: string;
		entityType: string;
		entityId: string;
	}) => Promise<CorsairEntity | null>;
	findManyByEntityIds: (options: {
		accountId: string;
		entityType: string;
		entityIds: string[];
	}) => Promise<CorsairEntity[]>;
	listByScope: (options: {
		accountId: string;
		entityType: string;
		limit?: number;
		offset?: number;
	}) => Promise<CorsairEntity[]>;
	searchByEntityId: (options: {
		accountId: string;
		entityType: string;
		query: string;
		limit?: number;
		offset?: number;
	}) => Promise<CorsairEntity[]>;
	upsertByEntityId: (options: {
		accountId: string;
		entityType: string;
		entityId: string;
		version: string;
		data: Record<string, unknown>;
	}) => Promise<CorsairEntity>;
	deleteByEntityId: (options: {
		accountId: string;
		entityType: string;
		entityId: string;
	}) => Promise<boolean>;
};

export type CorsairEventsClient = CorsairTableClient<CorsairEvent> & {
	listByAccount: (
		accountId: string,
		options?: { limit?: number; offset?: number },
	) => Promise<CorsairEvent[]>;
	listByStatus: (
		status: 'pending' | 'processing' | 'completed' | 'failed',
		options?: { accountId?: string; limit?: number; offset?: number },
	) => Promise<CorsairEvent[]>;
	listPending: (options?: {
		accountId?: string;
		limit?: number;
	}) => Promise<CorsairEvent[]>;
	updateStatus: (
		id: string,
		status: 'pending' | 'processing' | 'completed' | 'failed',
	) => Promise<CorsairEvent | null>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Base ORM
// ─────────────────────────────────────────────────────────────────────────────

export type CorsairOrm = {
	integrations: CorsairIntegrationsClient;
	accounts: CorsairAccountsClient;
	entities: CorsairEntitiesClient;
	events: CorsairEventsClient;
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

/**
 * Creates a base table client for a specific table.
 * Uses the table name type to properly type adapter calls.
 */
function createBaseTableClient<
	TName extends CorsairOrmTableName,
	TRow extends CorsairOrmDatabase[TName] = CorsairOrmDatabase[TName],
>(
	database: CorsairDbAdapter | undefined,
	tableName: TName,
): CorsairTableClient<TRow> {
	const schema = TABLE_SCHEMAS[tableName];

	function parseRow(row: Record<string, unknown>): TRow {
		if (!row) throw new Error('Row is null');
		const parsed = { ...row };
		for (const key of Object.keys(parsed)) {
			parsed[key] = parseJsonLike(parsed[key]);
		}
		return schema.parse(parsed) as TRow;
	}

	return {
		findById: async (id: string) => {
			assertDatabaseConfigured(database);
			const row = await database.findOne({
				table: tableName,
				where: [{ field: 'id', value: id }],
			});
			return row ? parseRow(row as Record<string, unknown>) : null;
		},

		findOne: async (where: WhereClause<TRow>) => {
			assertDatabaseConfigured(database);
			const row = await database.findOne({
				table: tableName,
				where: buildWhere(where),
			});
			return row ? parseRow(row as Record<string, unknown>) : null;
		},

		findMany: async (options) => {
			assertDatabaseConfigured(database);
			const rows = await database.findMany({
				table: tableName,
				where: buildWhere(options?.where),
				limit: options?.limit ?? 100,
				offset: options?.offset ?? 0,
			});
			return rows.map((row) => parseRow(row as Record<string, unknown>));
		},

		create: async (data: CreateInput<TRow>) => {
			assertDatabaseConfigured(database);
			const now = new Date();
			const insert = {
				id: (data as Record<string, unknown>).id ?? generateUUID(),
				created_at: now,
				updated_at: now,
				...data,
			};
			const row = await database.insert({
				table: tableName,
				data: insert as unknown as TableInsertType<TName>,
			});
			return parseRow(row as Record<string, unknown>);
		},

		update: async (id: string, data: UpdateInput<TRow>) => {
			assertDatabaseConfigured(database);
			const update = { ...data, updated_at: new Date() };
			const row = await database.update({
				table: tableName,
				where: [{ field: 'id', value: id }],
				data: update as unknown as TableUpdateType<TName>,
			});
			return row ? parseRow(row as Record<string, unknown>) : null;
		},

		updateMany: async (where: WhereClause<TRow>, data: UpdateInput<TRow>) => {
			assertDatabaseConfigured(database);
			const update = { ...data, updated_at: new Date() };
			const rows = await database.findMany({
				table: tableName,
				where: buildWhere(where),
				select: ['id'],
			});
			for (const row of rows) {
				const typedRow = row as { id: string };
				await database.update({
					table: tableName,
					where: [{ field: 'id', value: typedRow.id }],
					data: update as unknown as TableUpdateType<TName>,
				});
			}
			return rows.length;
		},

		delete: async (id: string) => {
			assertDatabaseConfigured(database);
			const deleted = await database.deleteMany({
				table: tableName,
				where: [{ field: 'id', value: id }],
			});
			return deleted > 0;
		},

		deleteMany: async (where: WhereClause<TRow>) => {
			assertDatabaseConfigured(database);
			return await database.deleteMany({
				table: tableName,
				where: buildWhere(where),
			});
		},

		count: async (where) => {
			assertDatabaseConfigured(database);
			return await database.count({
				table: tableName,
				where: buildWhere(where),
			});
		},
	};
}

function createIntegrationsClient(
	database: CorsairDbAdapter | undefined,
): CorsairIntegrationsClient {
	const base = createBaseTableClient(database, 'corsair_integrations');

	return {
		...base,
		findByName: (name) => base.findOne({ name }),
		upsertByName: async (name, data) => {
			const existing = await base.findOne({ name });
			if (existing) {
				return (await base.update(existing.id, data))!;
			}
			return base.create({ ...data, name });
		},
	};
}

function createAccountsClient(
	database: CorsairDbAdapter | undefined,
): CorsairAccountsClient {
	const base = createBaseTableClient(database, 'corsair_accounts');

	return {
		...base,
		findByTenantAndIntegration: async (tenantId, integrationName) => {
			assertDatabaseConfigured(database);
			// First find the integration by name
			const integration = await database.findOne({
				table: 'corsair_integrations' as const,
				where: [{ field: 'name', value: integrationName }],
			});
			if (!integration) return null;
			return base.findOne({
				tenant_id: tenantId,
				integration_id: integration.id,
			});
		},
		listByTenant: (tenantId, options) =>
			base.findMany({
				where: { tenant_id: tenantId },
				limit: options?.limit,
				offset: options?.offset,
			}),
		upsertByTenantAndIntegration: async (tenantId, integrationId, data) => {
			const existing = await base.findOne({
				tenant_id: tenantId,
				integration_id: integrationId,
			});
			if (existing) {
				return (await base.update(existing.id, data))!;
			}
			return base.create({
				...data,
				tenant_id: tenantId,
				integration_id: integrationId,
			});
		},
	};
}

function createEntitiesClient(
	database: CorsairDbAdapter | undefined,
): CorsairEntitiesClient {
	const base = createBaseTableClient(database, 'corsair_entities');

	return {
		...base,
		findByEntityId: ({ accountId, entityType, entityId }) =>
			base.findOne({
				account_id: accountId,
				entity_type: entityType,
				entity_id: entityId,
			}),
		findManyByEntityIds: async ({ accountId, entityType, entityIds }) => {
			if (entityIds.length === 0) return [];
			assertDatabaseConfigured(database);
			const rows = await database.findMany({
				table: 'corsair_entities' as const,
				where: [
					{ field: 'account_id', value: accountId },
					{ field: 'entity_type', value: entityType },
					{ field: 'entity_id', operator: 'in', value: entityIds },
				],
			});
			return rows;
		},
		listByScope: ({ accountId, entityType, limit, offset }) =>
			base.findMany({
				where: { account_id: accountId, entity_type: entityType },
				limit,
				offset,
			}),
		searchByEntityId: async ({
			accountId,
			entityType,
			query,
			limit,
			offset,
		}) => {
			assertDatabaseConfigured(database);
			return database.findMany({
				table: 'corsair_entities' as const,
				where: [
					{ field: 'account_id', value: accountId },
					{ field: 'entity_type', value: entityType },
					{ field: 'entity_id', operator: 'like', value: `%${query}%` },
				],
				limit: limit ?? 100,
				offset: offset ?? 0,
			});
		},
		upsertByEntityId: async ({
			accountId,
			entityType,
			entityId,
			version,
			data,
		}) => {
			const existing = await base.findOne({
				account_id: accountId,
				entity_type: entityType,
				entity_id: entityId,
			});
			if (existing) {
				return (await base.update(existing.id, { version, data }))!;
			}
			return base.create({
				account_id: accountId,
				entity_type: entityType,
				entity_id: entityId,
				version,
				data,
			});
		},
		deleteByEntityId: async ({ accountId, entityType, entityId }) => {
			assertDatabaseConfigured(database);
			const deleted = await database.deleteMany({
				table: 'corsair_entities',
				where: [
					{ field: 'account_id', value: accountId },
					{ field: 'entity_type', value: entityType },
					{ field: 'entity_id', value: entityId },
				],
			});
			return deleted > 0;
		},
	};
}

function createEventsClient(
	database: CorsairDbAdapter | undefined,
): CorsairEventsClient {
	const base = createBaseTableClient(database, 'corsair_events');

	return {
		...base,
		listByAccount: (accountId, options) =>
			base.findMany({
				where: { account_id: accountId },
				limit: options?.limit,
				offset: options?.offset,
			}),
		listByStatus: (status, options) => {
			const where: WhereClause<CorsairEvent> = { status };
			if (options?.accountId) where.account_id = options.accountId;
			return base.findMany({
				where,
				limit: options?.limit,
				offset: options?.offset,
			});
		},
		listPending: (options) => {
			const where: WhereClause<CorsairEvent> = { status: 'pending' };
			if (options?.accountId) where.account_id = options.accountId;
			return base.findMany({ where, limit: options?.limit ?? 100 });
		},
		updateStatus: (id, status) => base.update(id, { status }),
	};
}

/**
 * Creates the base Corsair ORM with all table clients.
 */
export function createCorsairOrm(
	database: CorsairDbAdapter | undefined,
): CorsairOrm {
	return {
		integrations: createIntegrationsClient(database),
		accounts: createAccountsClient(database),
		entities: createEntitiesClient(database),
		events: createEventsClient(database),
	};
}

// ─────────────────────────────────────────────────────────────────────────────
// Plugin ORM - Typed entity accessors for plugins
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Plugin schema definition - maps entity type names to their Zod data schemas.
 */
export type CorsairPluginSchema<Entities extends Record<string, ZodTypeAny>> = {
	version: string;
	entities: Entities;
};

/**
 * Typed entity with plugin-specific data type.
 */
export type TypedEntity<DataSchema extends ZodTypeAny> = Omit<
	CorsairEntity,
	'data'
> & {
	data: z.infer<DataSchema>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Search Filter Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Search filter value - can be an exact value or an operator object.
 * @example
 * // Exact match
 * { name: "sdk-test" }
 * // LIKE match (case-insensitive)
 * { name: { contains: "sdk" } }
 */
export type SearchFilterValue<T> = T | { contains: string } | { equals: T };

/**
 * Fields that are automatically filtered by the ORM (not user-searchable).
 */
type AutoFilteredFields = 'account_id' | 'entity_type';

/**
 * Fields that require special handling (pagination, data).
 */
type SpecialFields = 'data' | 'created_at' | 'updated_at';

/**
 * Searchable entity fields derived from CorsairEntity.
 * Excludes auto-filtered fields and special fields.
 */
type SearchableEntityFields = Omit<
	CorsairEntity,
	AutoFilteredFields | SpecialFields
>;

/**
 * Search filter for entity table columns (derived from CorsairEntity).
 * Maps each searchable field to SearchFilterValue.
 */
type EntityFieldsFilter = {
	[K in keyof SearchableEntityFields]?: SearchFilterValue<
		SearchableEntityFields[K]
	>;
};

/**
 * Search filter for JSONB data fields.
 * Only supports top-level fields.
 * Nested objects (like topic, purpose) are excluded.
 */
export type DataSearchFilter<DataSchema extends ZodTypeAny> = {
	[K in keyof z.infer<DataSchema>]?: z.infer<DataSchema>[K] extends
		| string
		| number
		| boolean
		| undefined
		? SearchFilterValue<NonNullable<z.infer<DataSchema>[K]>>
		: never;
};

/**
 * Search options for querying entities.
 * Supports filtering by entity columns (derived from CorsairEntity) and JSONB data fields.
 *
 * @example
 * // Search channels by name in JSONB data
 * await tenant.slack.db.channels.search({
 *   data: { name: "sdk-test" }
 * });
 *
 * // Search with contains (LIKE)
 * await tenant.slack.db.channels.search({
 *   data: { name: { contains: "sdk" } }
 * });
 *
 * // Search by entity_id
 * await tenant.slack.db.channels.search({
 *   entity_id: "C0123456789"
 * });
 */
export type EntitySearchOptions<DataSchema extends ZodTypeAny> =
	EntityFieldsFilter & {
		/** Filter by JSONB data fields */
		data?: DataSearchFilter<DataSchema>;
		/** Maximum number of results */
		limit?: number;
		/** Number of results to skip */
		offset?: number;
	};

/**
 * Entity client for a specific plugin entity type (e.g., slack.messages).
 * Provides typed access to entities with the entity type's data schema.
 */
export type PluginEntityClient<DataSchema extends ZodTypeAny> = {
	/** Find by external entity ID (e.g., Slack message ts). */
	findByEntityId: (entityId: string) => Promise<TypedEntity<DataSchema> | null>;

	/** Find by internal UUID. */
	findById: (id: string) => Promise<TypedEntity<DataSchema> | null>;

	/** Find multiple by external entity IDs. */
	findManyByEntityIds: (
		entityIds: string[],
	) => Promise<TypedEntity<DataSchema>[]>;

	/** List all entities for this entity type. */
	list: (options?: {
		limit?: number;
		offset?: number;
	}) => Promise<TypedEntity<DataSchema>[]>;

	/**
	 * Search entities with typed filters.
	 *
	 * @example
	 * // Search by JSONB data field
	 * await tenant.slack.db.channels.search({
	 *   data: { name: "sdk-test" }
	 * });
	 *
	 * // Search with contains (LIKE)
	 * await tenant.slack.db.channels.search({
	 *   data: { name: { contains: "sdk" } }
	 * });
	 *
	 * // Search by entity_id
	 * await tenant.slack.db.channels.search({
	 *   entity_id: { contains: "C012" }
	 * });
	 */
	search: (
		options: EntitySearchOptions<DataSchema>,
	) => Promise<TypedEntity<DataSchema>[]>;

	/** Create or update by external entity ID. */
	upsertByEntityId: (
		entityId: string,
		data: z.input<DataSchema>,
	) => Promise<TypedEntity<DataSchema>>;

	/** Delete by internal UUID. */
	deleteById: (id: string) => Promise<boolean>;

	/** Delete by external entity ID. */
	deleteByEntityId: (entityId: string) => Promise<boolean>;

	/** Count entities for this entity type. */
	count: () => Promise<number>;
};

/**
 * Maps a plugin schema to its typed entity clients.
 */
export type PluginEntityClients<Entities extends Record<string, ZodTypeAny>> = {
	[K in keyof Entities]: PluginEntityClient<Entities[K]>;
};

/**
 * Context for tenant-scoped operations.
 * This is set synchronously and used to filter all subsequent operations.
 */
export type TenantContext = {
	tenantId: string;
};

/**
 * Context for plugin operations.
 * Includes tenant and integration info for account-scoped filtering.
 */
export type PluginContext = {
	tenantId: string;
	integrationName: string;
};

/**
 * Full plugin ORM with typed entity clients + access to base tables.
 */
export type CorsairPluginOrm<Entities extends Record<string, ZodTypeAny>> =
	PluginEntityClients<Entities> & {
		/** Access to the base ORM for raw table operations. */
		$orm: CorsairOrm;
		/** The integration name this ORM is scoped to. */
		$integrationName: string;
		/** The tenant ID this ORM is scoped to. */
		$tenantId: string;
		/** Get the account ID (async, fetches from DB). */
		$getAccountId: () => Promise<string>;
	};

/**
 * Tenant-scoped ORM that filters all operations by tenant.
 */
export type TenantScopedOrm = {
	/** The tenant ID this ORM is scoped to. */
	$tenantId: string;
	/** Access to the base ORM. */
	$orm: CorsairOrm;

	/** List all accounts for this tenant. */
	listAccounts: (options?: {
		limit?: number;
		offset?: number;
	}) => Promise<CorsairAccount[]>;

	/** Find an account by integration name for this tenant. */
	findAccountByIntegration: (
		integrationName: string,
	) => Promise<CorsairAccount | null>;

	/** List all entities for this tenant (across all accounts). */
	listEntities: (options?: {
		entityType?: string;
		limit?: number;
		offset?: number;
	}) => Promise<CorsairEntity[]>;

	/** List all events for this tenant (across all accounts). */
	listEvents: (options?: {
		status?: 'pending' | 'processing' | 'completed' | 'failed';
		limit?: number;
		offset?: number;
	}) => Promise<CorsairEvent[]>;

	/** Create a plugin ORM scoped to this tenant and an integration. */
	forIntegration: <Entities extends Record<string, ZodTypeAny>>(config: {
		integrationName: string;
		schema: CorsairPluginSchema<Entities>;
	}) => CorsairPluginOrm<Entities>;
};

/**
 * Creates an entity client for a specific plugin entity type.
 * The client lazily resolves the account ID when operations are performed.
 */
function createPluginEntityClient<DataSchema extends ZodTypeAny>(
	database: CorsairDbAdapter | undefined,
	context: PluginContext,
	entityTypeName: string,
	version: string,
	dataSchema: DataSchema,
): PluginEntityClient<DataSchema> {
	// Cache for account ID lookup
	let cachedAccountId: string | null = null;

	async function getAccountId(): Promise<string> {
		if (cachedAccountId !== null) return cachedAccountId;

		assertDatabaseConfigured(database);

		// Find the integration by name
		const integration = await database.findOne({
			table: 'corsair_integrations' as const,
			where: [{ field: 'name', value: context.integrationName }],
		});

		if (!integration) {
			throw new Error(
				`Integration "${context.integrationName}" not found. Make sure to create the integration first.`,
			);
		}

		// Find the account for this tenant and integration
		const account = await database.findOne({
			table: 'corsair_accounts' as const,
			where: [
				{ field: 'tenant_id', value: context.tenantId },
				{ field: 'integration_id', value: integration.id },
			],
		});

		if (!account) {
			throw new Error(
				`Account not found for tenant "${context.tenantId}" and integration "${context.integrationName}". Make sure to create the account first.`,
			);
		}

		cachedAccountId = account.id;
		return cachedAccountId;
	}

	function baseWhere(accountId: string): CorsairWhere[] {
		return [
			{ field: 'account_id', value: accountId },
			{ field: 'entity_type', value: entityTypeName },
		];
	}

	function parseRow(row: CorsairEntity): TypedEntity<DataSchema> {
		const data = parseJsonLike(row.data);
		return {
			...row,
			data: dataSchema.parse(data),
		} as TypedEntity<DataSchema>;
	}

	return {
		findByEntityId: async (entityId) => {
			assertDatabaseConfigured(database);
			const accountId = await getAccountId();
			const row = await database.findOne({
				table: 'corsair_entities' as const,
				where: [
					...baseWhere(accountId),
					{ field: 'entity_id', value: entityId },
				],
			});
			return row ? parseRow(row) : null;
		},

		findById: async (id) => {
			assertDatabaseConfigured(database);
			const accountId = await getAccountId();
			const row = await database.findOne({
				table: 'corsair_entities' as const,
				where: [...baseWhere(accountId), { field: 'id', value: id }],
			});
			return row ? parseRow(row) : null;
		},

		findManyByEntityIds: async (entityIds) => {
			if (entityIds.length === 0) return [];
			assertDatabaseConfigured(database);
			const accountId = await getAccountId();
			const rows = await database.findMany({
				table: 'corsair_entities' as const,
				where: [
					...baseWhere(accountId),
					{ field: 'entity_id', operator: 'in', value: entityIds },
				],
			});
			return rows.map(parseRow);
		},

		list: async (options) => {
			assertDatabaseConfigured(database);
			const accountId = await getAccountId();
			const rows = await database.findMany({
				table: 'corsair_entities' as const,
				where: baseWhere(accountId),
				limit: options?.limit ?? 100,
				offset: options?.offset ?? 0,
			});
			return rows.map(parseRow);
		},

		search: async (options) => {
			assertDatabaseConfigured(database);
			const accountId = await getAccountId();

			// Build where clauses from search options
			const whereConditions: CorsairWhere[] = [...baseWhere(accountId)];

			// Helper to parse filter value into operator and value
			function parseFilterValue(filterValue: unknown): {
				operator: 'like' | '=';
				value: unknown;
			} {
				if (
					typeof filterValue === 'object' &&
					filterValue !== null &&
					!Array.isArray(filterValue)
				) {
					const obj = filterValue as Record<string, unknown>;
					if ('contains' in obj && typeof obj.contains === 'string') {
						return { operator: 'like', value: `%${obj.contains}%` };
					}
					if ('equals' in obj) {
						return { operator: '=', value: obj.equals };
					}
				}
				// Exact match
				return { operator: '=', value: filterValue };
			}

			// Reserved keys that aren't entity column filters
			const reservedKeys = new Set(['data', 'limit', 'offset']);

			// Handle entity column filters (derived from CorsairEntity)
			for (const [key, filterValue] of Object.entries(options)) {
				if (reservedKeys.has(key) || filterValue === undefined) continue;
				const { operator, value } = parseFilterValue(filterValue);
				whereConditions.push({ field: key, operator, value });
			}

			// Handle data (JSONB) filters
			if (options.data && typeof options.data === 'object') {
				for (const [key, filterValue] of Object.entries(options.data)) {
					if (filterValue === undefined) continue;
					const { operator, value } = parseFilterValue(filterValue);
					// Use JSONB path query syntax: data->>'key'
					whereConditions.push({
						field: `data->>'${key}'`,
						operator,
						value,
					});
				}
			}

			const rows = await database.findMany({
				table: 'corsair_entities' as const,
				where: whereConditions,
				limit: options.limit ?? 100,
				offset: options.offset ?? 0,
			});
			return rows.map(parseRow);
		},

		upsertByEntityId: async (entityId, data) => {
			assertDatabaseConfigured(database);
			const accountId = await getAccountId();
			const parsed = dataSchema.parse(data);

			const existing = await database.findOne({
				table: 'corsair_entities' as const,
				select: ['id'],
				where: [
					...baseWhere(accountId),
					{ field: 'entity_id', value: entityId },
				],
			});

			const now = new Date();

			if (existing?.id) {
				await database.update({
					table: 'corsair_entities' as const,
					where: [{ field: 'id', value: existing.id }],
					data: { version, data: parsed, updated_at: now },
				});
				const updated = await database.findOne({
					table: 'corsair_entities' as const,
					where: [{ field: 'id', value: existing.id }],
				});
				return parseRow(updated!);
			}

			const id = generateUUID();
			await database.insert({
				table: 'corsair_entities' as const,
				data: {
					id,
					created_at: now,
					updated_at: now,
					account_id: accountId,
					entity_id: entityId,
					entity_type: entityTypeName,
					version,
					data: parsed,
				},
			});

			const inserted = await database.findOne({
				table: 'corsair_entities' as const,
				where: [{ field: 'id', value: id }],
			});
			return parseRow(inserted!);
		},

		deleteById: async (id) => {
			assertDatabaseConfigured(database);
			const accountId = await getAccountId();
			const deleted = await database.deleteMany({
				table: 'corsair_entities',
				where: [...baseWhere(accountId), { field: 'id', value: id }],
			});
			return deleted > 0;
		},

		deleteByEntityId: async (entityId) => {
			assertDatabaseConfigured(database);
			const accountId = await getAccountId();
			const deleted = await database.deleteMany({
				table: 'corsair_entities',
				where: [
					...baseWhere(accountId),
					{ field: 'entity_id', value: entityId },
				],
			});
			return deleted > 0;
		},

		count: async () => {
			assertDatabaseConfigured(database);
			const accountId = await getAccountId();
			return database.count({
				table: 'corsair_entities',
				where: baseWhere(accountId),
			});
		},
	};
}

/**
 * Creates a plugin ORM with typed entity clients.
 *
 * @example
 * ```ts
 * const SlackSchema = {
 *   version: '1.0.0',
 *   entities: {
 *     messages: SlackMessageSchema,
 *     channels: SlackChannelSchema,
 *     users: SlackUserSchema,
 *   },
 * } as const;
 *
 * const slackOrm = createPluginOrm(database, {
 *   integrationName: 'slack',
 *   schema: SlackSchema,
 *   tenantId: 'tenant-123',
 * });
 *
 * // Typed entity access
 * const message = await slackOrm.messages.findByEntityId('1234567890.123456');
 * // message.data is typed as SlackMessage
 *
 * await slackOrm.channels.upsertByEntityId('C123', {
 *   id: 'C123',
 *   name: 'general',
 *   is_private: false,
 * });
 *
 * // Access base ORM for raw operations
 * const allAccounts = await slackOrm.$orm.accounts.listByTenant('tenant-123');
 * ```
 */
export function createPluginOrm<
	Entities extends Record<string, ZodTypeAny>,
>(config: {
	database: CorsairDbAdapter | undefined;
	integrationName: string;
	schema: CorsairPluginSchema<Entities>;
	tenantId: string;
}): CorsairPluginOrm<Entities> {
	const { database, integrationName, schema, tenantId } = config;
	const baseOrm = createCorsairOrm(database);

	const context: PluginContext = { tenantId, integrationName };

	// Cache for account ID lookup
	let cachedAccountId: string | null = null;

	async function getAccountId(): Promise<string> {
		if (cachedAccountId !== null) return cachedAccountId;

		assertDatabaseConfigured(database);

		const integration = await database.findOne({
			table: 'corsair_integrations' as const,
			where: [{ field: 'name', value: integrationName }],
		});

		if (!integration) {
			throw new Error(
				`Integration "${integrationName}" not found. Make sure to create the integration first.`,
			);
		}

		const account = await database.findOne({
			table: 'corsair_accounts' as const,
			where: [
				{ field: 'tenant_id', value: tenantId },
				{ field: 'integration_id', value: integration.id },
			],
		});

		if (!account) {
			throw new Error(
				`Account not found for tenant "${tenantId}" and integration "${integrationName}". Make sure to create the account first.`,
			);
		}

		cachedAccountId = account.id;
		return cachedAccountId;
	}

	const entityClients: Record<string, PluginEntityClient<ZodTypeAny>> = {};
	for (const [entityTypeName, dataSchema] of Object.entries(schema.entities)) {
		entityClients[entityTypeName] = createPluginEntityClient(
			database,
			context,
			entityTypeName,
			schema.version,
			dataSchema,
		);
	}

	return {
		...(entityClients as unknown as PluginEntityClients<Entities>),
		$orm: baseOrm,
		$integrationName: integrationName,
		$tenantId: tenantId,
		$getAccountId: getAccountId,
	};
}

/**
 * Creates a tenant-scoped ORM that filters all operations by tenant.
 * This is a synchronous operation - the tenant context is just stored
 * and used when actual database operations are performed.
 *
 * @example
 * ```ts
 * const tenantOrm = createTenantScopedOrm(database, 'tenant-123');
 *
 * // List all accounts for this tenant
 * const accounts = await tenantOrm.listAccounts();
 *
 * // Create a plugin ORM for a specific integration
 * const slackOrm = tenantOrm.forIntegration({
 *   integrationName: 'slack',
 *   schema: SlackSchema,
 * });
 *
 * // All operations are scoped to tenant-123 and the slack integration
 * const messages = await slackOrm.messages.list();
 * ```
 */
export function createTenantScopedOrm(
	database: CorsairDbAdapter | undefined,
	tenantId: string,
): TenantScopedOrm {
	const baseOrm = createCorsairOrm(database);

	return {
		$tenantId: tenantId,
		$orm: baseOrm,

		listAccounts: (options) => baseOrm.accounts.listByTenant(tenantId, options),

		findAccountByIntegration: (integrationName) =>
			baseOrm.accounts.findByTenantAndIntegration(tenantId, integrationName),

		listEntities: async (options) => {
			assertDatabaseConfigured(database);

			// Get all account IDs for this tenant
			const accounts = await database.findMany({
				table: 'corsair_accounts' as const,
				where: [{ field: 'tenant_id', value: tenantId }],
				select: ['id'],
			});

			if (accounts.length === 0) return [];

			const accountIds = accounts.map((a) => a.id);

			const where: CorsairWhere[] = [
				{ field: 'account_id', operator: 'in', value: accountIds },
			];

			if (options?.entityType) {
				where.push({ field: 'entity_type', value: options.entityType });
			}

			return database.findMany({
				table: 'corsair_entities' as const,
				where,
				limit: options?.limit ?? 100,
				offset: options?.offset ?? 0,
			});
		},

		listEvents: async (options) => {
			assertDatabaseConfigured(database);

			// Get all account IDs for this tenant
			const accounts = await database.findMany({
				table: 'corsair_accounts' as const,
				where: [{ field: 'tenant_id', value: tenantId }],
				select: ['id'],
			});

			if (accounts.length === 0) return [];

			const accountIds = accounts.map((a) => a.id);

			const where: CorsairWhere[] = [
				{ field: 'account_id', operator: 'in', value: accountIds },
			];

			if (options?.status) {
				where.push({ field: 'status', value: options.status });
			}

			return database.findMany({
				table: 'corsair_events' as const,
				where,
				limit: options?.limit ?? 100,
				offset: options?.offset ?? 0,
			});
		},

		forIntegration: <Entities extends Record<string, ZodTypeAny>>(config: {
			integrationName: string;
			schema: CorsairPluginSchema<Entities>;
		}) =>
			createPluginOrm({
				database,
				integrationName: config.integrationName,
				schema: config.schema,
				tenantId,
			}),
	};
}

/**
 * Creates a plugin ORM factory for a specific integration.
 * Useful when you need to switch tenants frequently.
 *
 * @example
 * ```ts
 * const slackOrmFactory = createPluginOrmFactory(database, {
 *   integrationName: 'slack',
 *   schema: SlackSchema,
 * });
 *
 * const tenant1Orm = slackOrmFactory.forTenant('tenant-1');
 * const tenant2Orm = slackOrmFactory.forTenant('tenant-2');
 * ```
 */
export function createPluginOrmFactory<
	Entities extends Record<string, ZodTypeAny>,
>(
	database: CorsairDbAdapter | undefined,
	config: {
		integrationName: string;
		schema: CorsairPluginSchema<Entities>;
	},
) {
	return {
		forTenant: (tenantId: string): CorsairPluginOrm<Entities> =>
			createPluginOrm({
				database,
				integrationName: config.integrationName,
				schema: config.schema,
				tenantId,
			}),
	};
}
