import type { ExpressionBuilder, Insertable, Updateable } from 'kysely';
import type { ZodTypeAny, z } from 'zod';
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
import type { CorsairDatabase, CorsairKyselyDatabase } from './kysely/database';
import { createKyselyEntityClient } from './kysely/orm';

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

export type CorsairWhereOperator = '=' | 'in' | 'like';

export type CorsairWhere<TField extends string = string> = {
	field: TField;
	value: unknown;
	operator?: CorsairWhereOperator | undefined;
};

const TABLE_SCHEMAS = {
	corsair_integrations: CorsairIntegrationsSchema,
	corsair_accounts: CorsairAccountsSchema,
	corsair_entities: CorsairEntitiesSchema,
	corsair_events: CorsairEventsSchema,
} as const satisfies {
	// Allow different input types (e.g. nullable from DB) as long as output matches
	[K in CorsairOrmTableName]: z.ZodType<
		CorsairOrmDatabase[K],
		z.ZodTypeDef,
		unknown
	>;
};

function getTableSchema<TName extends CorsairOrmTableName>(tableName: TName) {
	return TABLE_SCHEMAS[tableName];
}

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
	database: CorsairDatabase | undefined,
): asserts database is CorsairDatabase {
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

function buildWhere<TRecord>(
	where: WhereClause<TRecord> | undefined,
): CorsairWhere<keyof TRecord & string>[] {
	if (!where) return [];
	const result: CorsairWhere<keyof TRecord & string>[] = [];
	for (const key in where) {
		const field = key as keyof TRecord & string;
		const value = where[field];
		if (value === undefined) continue;
		if (
			typeof value === 'object' &&
			value !== null &&
			!Array.isArray(value) &&
			!(value instanceof Date)
		) {
			const obj = value as { in?: TRecord[keyof TRecord][]; like?: string };
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

type WhereableQuery<TBuilder> = {
	where: (
		column: string,
		operator: CorsairWhereOperator,
		value: unknown,
	) => TBuilder;
};

function applyCorsairWhere<TBuilder>(
	q: TBuilder,
	where: CorsairWhere[] | undefined,
): TBuilder {
	if (!where?.length) return q;
	let next = q as unknown as WhereableQuery<TBuilder>;
	for (const w of where) {
		const operator = w.operator ?? '=';
		next = next.where(
			w.field,
			operator,
			w.value,
		) as unknown as WhereableQuery<TBuilder>;
	}
	return next as TBuilder;
}

function parseCountValue(countVal: unknown): number {
	if (typeof countVal === 'number') return countVal;
	if (typeof countVal === 'bigint') return Number(countVal);
	return Number.parseInt(String(countVal ?? 0), 10);
}

/**
 * Creates a base table client for a specific table.
 * Uses the table name type to properly type adapter calls.
 */
function createBaseTableClient<
	TName extends keyof CorsairKyselyDatabase & CorsairOrmTableName,
>(
	database: CorsairDatabase | undefined,
	tableName: TName,
): CorsairTableClient<CorsairOrmDatabase[TName]> {
	type TableRow = CorsairKyselyDatabase[TName];
	type RowType = CorsairOrmDatabase[TName];
	const schema = getTableSchema(tableName) as unknown as z.ZodType<RowType>;
	type InsertRow = Insertable<TableRow>;
	type UpdateRow = Updateable<TableRow>;
	type SelectBuilder = {
		selectAll: () => SelectBuilder;
		select: (
			selection:
				| string
				| ((eb: ExpressionBuilder<CorsairKyselyDatabase, TName>) => unknown),
		) => SelectBuilder;
		limit: (limit: number) => SelectBuilder;
		offset: (offset: number) => SelectBuilder;
		where: (
			column: string,
			operator: CorsairWhereOperator,
			value: unknown,
		) => SelectBuilder;
		execute: () => Promise<TableRow[]>;
		executeTakeFirst: () => Promise<TableRow | undefined>;
	};
	type InsertBuilder = {
		values: (row: InsertRow) => InsertBuilder;
		returningAll: () => InsertBuilder;
		executeTakeFirst: () => Promise<TableRow | undefined>;
	};
	type UpdateBuilder = {
		set: (update: UpdateRow) => UpdateBuilder;
		returningAll: () => UpdateBuilder;
		where: (
			column: string,
			operator: CorsairWhereOperator,
			value: unknown,
		) => UpdateBuilder;
		execute: () => Promise<unknown>;
		executeTakeFirst: () => Promise<TableRow | undefined>;
	};
	type DeleteBuilder = {
		where: (
			column: string,
			operator: CorsairWhereOperator,
			value: unknown,
		) => DeleteBuilder;
		executeTakeFirst: () => Promise<
			{ numDeletedRows?: bigint | number } | undefined
		>;
	};

	const getDb = () => {
		assertDatabaseConfigured(database);
		return database;
	};
	const selectFromTable = () =>
		getDb().db.selectFrom(tableName) as unknown as SelectBuilder;
	const insertIntoTable = () =>
		getDb().db.insertInto(tableName) as unknown as InsertBuilder;
	const updateTable = () =>
		getDb().db.updateTable(tableName) as unknown as UpdateBuilder;
	const deleteFromTable = () =>
		getDb().db.deleteFrom(tableName) as unknown as DeleteBuilder;

	function parseRow(row: TableRow): RowType {
		const parsed: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(row)) {
			parsed[key] = parseJsonLike(value);
		}
		return schema.parse(parsed);
	}

	function parseRowFromRecord(record: Record<string, unknown>): RowType {
		const parsed: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(record)) {
			parsed[key] = parseJsonLike(value);
		}
		return schema.parse(parsed);
	}

	return {
		findById: async (id: string) => {
			assertDatabaseConfigured(database);
			let q = selectFromTable().selectAll();
			q = applyCorsairWhere(q, [{ field: 'id', value: id }]);
			const row = (await q.executeTakeFirst()) as TableRow | undefined;
			return row ? parseRow(row) : null;
		},

		findOne: async (where: WhereClause<RowType>) => {
			assertDatabaseConfigured(database);
			let q = selectFromTable().selectAll();
			q = applyCorsairWhere(q, buildWhere(where));
			const row = (await q.executeTakeFirst()) as TableRow | undefined;
			return row ? parseRow(row) : null;
		},

		findMany: async (options) => {
			assertDatabaseConfigured(database);
			let q = selectFromTable().selectAll();
			q = applyCorsairWhere(q, buildWhere(options?.where));
			if (typeof options?.limit === 'number') q = q.limit(options.limit);
			if (typeof options?.offset === 'number') q = q.offset(options.offset);
			const rows = (await q.execute()) as TableRow[];
			return rows.map((row) => parseRow(row));
		},

		create: async (data: CreateInput<RowType>) => {
			assertDatabaseConfigured(database);
			const now = new Date();
			const insert = {
				id: data.id ?? generateUUID(),
				created_at: now,
				updated_at: now,
				...data,
			} as InsertRow;
			const row = await insertIntoTable()
				.values(insert)
				.returningAll()
				.executeTakeFirst();
			return row ? parseRow(row) : parseRowFromRecord(insert);
		},

		update: async (id: string, data: UpdateInput<RowType>) => {
			assertDatabaseConfigured(database);
			const update = {
				...data,
				updated_at: new Date(),
			} as UpdateRow;
			let q = updateTable().set(update).returningAll();
			q = applyCorsairWhere(q, [{ field: 'id', value: id }]);
			const row = (await q.executeTakeFirst()) as TableRow | undefined;
			return row ? parseRow(row) : null;
		},

		updateMany: async (
			where: WhereClause<RowType>,
			data: UpdateInput<RowType>,
		) => {
			assertDatabaseConfigured(database);
			const update = {
				...data,
				updated_at: new Date(),
			} as UpdateRow;
			let q = selectFromTable().select('id');
			q = applyCorsairWhere(q, buildWhere(where));
			const rows = (await q.execute()) as Array<{ id: TableRow['id'] }>;
			for (const row of rows) {
				let updateQuery = updateTable().set(update);
				updateQuery = applyCorsairWhere(updateQuery, [
					{ field: 'id', value: row.id },
				]);
				await updateQuery.execute();
			}
			return rows.length;
		},

		delete: async (id: string) => {
			assertDatabaseConfigured(database);
			let q = deleteFromTable();
			q = applyCorsairWhere(q, [{ field: 'id', value: id }]);
			const res = await q.executeTakeFirst();
			return Number(res?.numDeletedRows ?? 0) > 0;
		},

		deleteMany: async (where: WhereClause<RowType>) => {
			assertDatabaseConfigured(database);
			let q = deleteFromTable();
			q = applyCorsairWhere(q, buildWhere(where));
			const res = await q.executeTakeFirst();
			return Number(res?.numDeletedRows ?? 0);
		},

		count: async (where) => {
			assertDatabaseConfigured(database);
			let q = selectFromTable().select(
				(eb: ExpressionBuilder<CorsairKyselyDatabase, TName>) =>
					eb.fn.countAll().as('count'),
			);
			q = applyCorsairWhere(q, buildWhere(where));
			const row = (await q.executeTakeFirst()) as
				| { count?: unknown }
				| undefined;
			return parseCountValue(row?.count);
		},
	};
}

function createIntegrationsClient(
	database: CorsairDatabase | undefined,
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
	database: CorsairDatabase | undefined,
): CorsairAccountsClient {
	const base = createBaseTableClient(database, 'corsair_accounts');

	return {
		...base,
		findByTenantAndIntegration: async (tenantId, integrationName) => {
			assertDatabaseConfigured(database);
			// First find the integration by name
			const integration = await database.db
				.selectFrom('corsair_integrations')
				.selectAll()
				.where('name', '=', integrationName)
				.executeTakeFirst();
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
	database: CorsairDatabase | undefined,
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
			const rows = await database.db
				.selectFrom('corsair_entities')
				.selectAll()
				.where('account_id', '=', accountId)
				.where('entity_type', '=', entityType)
				.where('entity_id', 'in', entityIds)
				.execute();
			return rows as CorsairEntity[];
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
			let q = database.db
				.selectFrom('corsair_entities')
				.selectAll()
				.where('account_id', '=', accountId)
				.where('entity_type', '=', entityType)
				.where('entity_id', 'like', `%${query}%`);
			if (typeof limit === 'number') q = q.limit(limit);
			if (typeof offset === 'number') q = q.offset(offset);
			return (await q.execute()) as CorsairEntity[];
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
			const res = await database.db
				.deleteFrom('corsair_entities')
				.where('account_id', '=', accountId)
				.where('entity_type', '=', entityType)
				.where('entity_id', '=', entityId)
				.executeTakeFirst();
			return (
				Number((res as { numDeletedRows?: bigint | number }).numDeletedRows) > 0
			);
		},
	};
}

function createEventsClient(
	database: CorsairDatabase | undefined,
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
	database: CorsairDatabase | undefined,
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
 * Filter value for entity table columns (e.g., entity_id, version).
 * Supports exact matches, string operations (for string fields), and array membership.
 *
 * @example
 * // Exact match (shorthand)
 * { entity_id: "C0123456789" }
 *
 * @example
 * // Explicit equals
 * { entity_id: { equals: "C0123456789" } }
 *
 * @example
 * // String contains (LIKE '%value%')
 * { entity_id: { contains: "C012" } }
 *
 * @example
 * // String starts with (LIKE 'value%')
 * { entity_id: { startsWith: "C012" } }
 *
 * @example
 * // String ends with (LIKE '%value')
 * { entity_id: { endsWith: "6789" } }
 *
 * @example
 * // Match any value in array (IN clause)
 * { entity_id: { in: ["C0123456789", "C9876543210"] } }
 */
export type SearchFilterValue<T> =
	| T
	| {
			/** Exact match. Equivalent to passing the value directly. */
			equals?: T;
			/** String contains (LIKE '%value%'). Only available for string fields. */
			contains?: T extends string ? string : never;
			/** String starts with (LIKE 'value%'). Only available for string fields. */
			startsWith?: T extends string ? string : never;
			/** String ends with (LIKE '%value'). Only available for string fields. */
			endsWith?: T extends string ? string : never;
			/** Match any value in array (IN clause). */
			in?: T[];
	  };

/**
 * Filter for string fields in JSONB data.
 * Supports exact matches, substring search, prefix/suffix matching, and array membership.
 *
 * @example
 * // Exact match (shorthand)
 * { data: { name: "general" } }
 *
 * @example
 * // Explicit equals
 * { data: { name: { equals: "general" } } }
 *
 * @example
 * // Contains substring (LIKE '%value%')
 * { data: { name: { contains: "gen" } } }
 *
 * @example
 * // Starts with prefix (LIKE 'value%')
 * { data: { name: { startsWith: "gen" } } }
 *
 * @example
 * // Ends with suffix (LIKE '%value')
 * { data: { name: { endsWith: "eral" } } }
 *
 * @example
 * // Match any value in array (IN clause)
 * { data: { name: { in: ["general", "random", "announcements"] } } }
 */
export type StringDataFilter =
	| string
	| {
			/** Exact match. Equivalent to passing the string directly. */
			equals?: string;
			/** Contains substring (LIKE '%value%'). Case-sensitive. */
			contains?: string;
			/** Starts with prefix (LIKE 'value%'). Case-sensitive. */
			startsWith?: string;
			/** Ends with suffix (LIKE '%value'). Case-sensitive. */
			endsWith?: string;
			/** Match any value in array (IN clause). */
			in?: string[];
	  };

/**
 * Filter for number fields in JSONB data.
 * Supports exact matches, range comparisons, and array membership.
 *
 * @example
 * // Exact match (shorthand)
 * { data: { count: 42 } }
 *
 * @example
 * // Explicit equals
 * { data: { count: { equals: 42 } } }
 *
 * @example
 * // Greater than
 * { data: { count: { gt: 10 } } }
 *
 * @example
 * // Greater than or equal
 * { data: { count: { gte: 10 } } }
 *
 * @example
 * // Less than
 * { data: { count: { lt: 100 } } }
 *
 * @example
 * // Less than or equal
 * { data: { count: { lte: 100 } } }
 *
 * @example
 * // Match any value in array (IN clause)
 * { data: { count: { in: [10, 20, 30] } } }
 */
export type NumberDataFilter =
	| number
	| {
			/** Exact match. Equivalent to passing the number directly. */
			equals?: number;
			/** Greater than (>). */
			gt?: number;
			/** Greater than or equal (>=). */
			gte?: number;
			/** Less than (<). */
			lt?: number;
			/** Less than or equal (<=). */
			lte?: number;
			/** Match any value in array (IN clause). */
			in?: number[];
	  };

/**
 * Filter for boolean fields in JSONB data.
 * Supports exact matches only.
 *
 * @example
 * // Exact match (shorthand)
 * { data: { is_private: true } }
 *
 * @example
 * // Explicit equals
 * { data: { is_private: { equals: false } } }
 */
export type BooleanDataFilter =
	| boolean
	| {
			/** Exact match. Equivalent to passing the boolean directly. */
			equals?: boolean;
	  };

/**
 * Filter for date fields in JSONB data.
 * Supports exact matches, before/after comparisons, and date ranges.
 *
 * @example
 * // Exact match (shorthand)
 * { data: { created_at: new Date("2024-01-01") } }
 *
 * @example
 * // Explicit equals
 * { data: { created_at: { equals: new Date("2024-01-01") } } }
 *
 * @example
 * // Before date (<)
 * { data: { created_at: { before: new Date("2024-12-31") } } }
 *
 * @example
 * // After date (>)
 * { data: { created_at: { after: new Date("2024-01-01") } } }
 *
 * @example
 * // Between two dates (inclusive)
 * { data: { created_at: { between: [new Date("2024-01-01"), new Date("2024-12-31")] } } }
 */
export type DateDataFilter =
	| Date
	| {
			/** Exact match. Equivalent to passing the Date directly. */
			equals?: Date;
			/** Before date (<). */
			before?: Date;
			/** After date (>). */
			after?: Date;
			/** Between two dates (inclusive). First element is start, second is end. */
			between?: [Date, Date];
	  };

/**
 * Filter value for JSONB data fields, automatically selected based on field type.
 * Supports different filter operations depending on the data type:
 * - String: exact match, contains, startsWith, endsWith, in
 * - Number: exact match, gt, gte, lt, lte, in
 * - Boolean: exact match only
 * - Date: exact match, before, after, between
 *
 * @example
 * // String field
 * { data: { name: { contains: "test" } } }
 *
 * @example
 * // Number field
 * { data: { count: { gt: 10 } } }
 *
 * @example
 * // Boolean field
 * { data: { is_private: true } }
 *
 * @example
 * // Date field
 * { data: { created_at: { after: new Date("2024-01-01") } } }
 */
export type DataFilterValue<T> = T extends Date
	? DateDataFilter
	: T extends number
		? NumberDataFilter
		: T extends boolean
			? BooleanDataFilter
			: T extends string
				? StringDataFilter
				: never;

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
 * Only supports top-level fields. Nested objects (like topic, purpose) are excluded.
 * Each field uses the appropriate filter type based on its data type.
 *
 * @example
 * // Filter by multiple data fields
 * {
 *   data: {
 *     name: { contains: "general" },
 *     is_private: false,
 *     member_count: { gte: 10 }
 *   }
 * }
 *
 * @example
 * // String field with contains
 * {
 *   data: {
 *     name: { contains: "test" }
 *   }
 * }
 *
 * @example
 * // Number field with range
 * {
 *   data: {
 *     count: { gt: 5, lt: 100 }
 *   }
 * }
 *
 * @example
 * // Date field with range
 * {
 *   data: {
 *     created_at: { between: [new Date("2024-01-01"), new Date("2024-12-31")] }
 *   }
 * }
 */
export type DataSearchFilter<DataSchema extends ZodTypeAny> = {
	[K in keyof z.infer<DataSchema>]?: z.infer<DataSchema>[K] extends
		| string
		| number
		| boolean
		| Date
		| null
		| undefined
		? DataFilterValue<NonNullable<z.infer<DataSchema>[K]>>
		: never;
};

/**
 * Search options for querying entities.
 * Supports filtering by entity table columns (entity_id, version, etc.) and JSONB data fields.
 * All filters are combined with AND logic.
 *
 * @example
 * // Search by entity_id (exact match)
 * await tenant.slack.db.channels.search({
 *   entity_id: "C0123456789"
 * });
 *
 * @example
 * // Search by entity_id with contains
 * await tenant.slack.db.channels.search({
 *   entity_id: { contains: "C012" }
 * });
 *
 * @example
 * // Search by JSONB data field (exact match)
 * await tenant.slack.db.channels.search({
 *   data: { name: "general" }
 * });
 *
 * @example
 * // Search by JSONB data field with contains
 * await tenant.slack.db.channels.search({
 *   data: { name: { contains: "gen" } }
 * });
 *
 * @example
 * // Search with multiple filters
 * await tenant.slack.db.channels.search({
 *   entity_id: { startsWith: "C" },
 *   data: {
 *     name: { contains: "test" },
 *     is_private: false,
 *     member_count: { gte: 10 }
 *   },
 *   limit: 20,
 *   offset: 0
 * });
 *
 * @example
 * // Search with number range
 * await tenant.slack.db.channels.search({
 *   data: {
 *     member_count: { gt: 5, lt: 100 }
 *   }
 * });
 *
 * @example
 * // Search with date range
 * await tenant.slack.db.channels.search({
 *   data: {
 *     created_at: { between: [new Date("2024-01-01"), new Date("2024-12-31")] }
 *   }
 * });
 *
 * @example
 * // Search with pagination
 * await tenant.slack.db.channels.search({
 *   data: { name: { contains: "test" } },
 *   limit: 50,
 *   offset: 100
 * });
 */
export type EntitySearchOptions<DataSchema extends ZodTypeAny> =
	EntityFieldsFilter & {
		/**
		 * Filter by JSONB data fields.
		 * Supports top-level fields only. Each field type has specific filter options.
		 *
		 * @example
		 * { data: { name: { contains: "test" } } }
		 *
		 * @example
		 * { data: { count: { gt: 10 } } }
		 *
		 * @example
		 * { data: { is_private: false } }
		 */
		data?: DataSearchFilter<DataSchema>;
		/**
		 * Maximum number of results to return.
		 *
		 * @example
		 * { limit: 50 }
		 */
		limit?: number;
		/**
		 * Number of results to skip (for pagination).
		 *
		 * @example
		 * { offset: 100 }
		 */
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
	 * Supports filtering by entity table columns and JSONB data fields with various operators.
	 * All filters are combined with AND logic.
	 *
	 * @example
	 * // Search by entity_id (exact match)
	 * await tenant.slack.db.channels.search({
	 *   entity_id: "C0123456789"
	 * });
	 *
	 * @example
	 * // Search by entity_id with contains (LIKE '%value%')
	 * await tenant.slack.db.channels.search({
	 *   entity_id: { contains: "C012" }
	 * });
	 *
	 * @example
	 * // Search by entity_id with startsWith (LIKE 'value%')
	 * await tenant.slack.db.channels.search({
	 *   entity_id: { startsWith: "C" }
	 * });
	 *
	 * @example
	 * // Search by JSONB data field (exact match)
	 * await tenant.slack.db.channels.search({
	 *   data: { name: "general" }
	 * });
	 *
	 * @example
	 * // Search by JSONB string field with contains
	 * await tenant.slack.db.channels.search({
	 *   data: { name: { contains: "gen" } }
	 * });
	 *
	 * @example
	 * // Search by JSONB number field with range
	 * await tenant.slack.db.channels.search({
	 *   data: { member_count: { gt: 10, lt: 100 } }
	 * });
	 *
	 * @example
	 * // Search by JSONB boolean field
	 * await tenant.slack.db.channels.search({
	 *   data: { is_private: false }
	 * });
	 *
	 * @example
	 * // Search by JSONB date field with range
	 * await tenant.slack.db.channels.search({
	 *   data: { created_at: { between: [new Date("2024-01-01"), new Date("2024-12-31")] } }
	 * });
	 *
	 * @example
	 * // Search with multiple filters and pagination
	 * await tenant.slack.db.channels.search({
	 *   entity_id: { startsWith: "C" },
	 *   data: {
	 *     name: { contains: "test" },
	 *     is_private: false,
	 *     member_count: { gte: 10 }
	 *   },
	 *   limit: 20,
	 *   offset: 0
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
	database: CorsairDatabase | undefined,
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

		const integration = await database.db
			.selectFrom('corsair_integrations')
			.selectAll()
			.where('name', '=', context.integrationName)
			.executeTakeFirst();

		if (!integration) {
			throw new Error(
				`Integration "${context.integrationName}" not found. Make sure to create the integration first.`,
			);
		}

		const account = await database.db
			.selectFrom('corsair_accounts')
			.selectAll()
			.where('tenant_id', '=', context.tenantId)
			.where('integration_id', '=', integration.id)
			.executeTakeFirst();

		if (!account) {
			throw new Error(
				`Account not found for tenant "${context.tenantId}" and integration "${context.integrationName}". Make sure to create the account first.`,
			);
		}

		cachedAccountId = account.id;
		return cachedAccountId;
	}

	assertDatabaseConfigured(database);
	return createKyselyEntityClient(
		database.db,
		getAccountId,
		entityTypeName,
		version,
		dataSchema,
	);
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
	database: CorsairDatabase | undefined;
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

		const integration = await database.db
			.selectFrom('corsair_integrations')
			.selectAll()
			.where('name', '=', integrationName)
			.executeTakeFirst();

		if (!integration) {
			throw new Error(
				`Integration "${integrationName}" not found. Make sure to create the integration first.`,
			);
		}

		const account = await database.db
			.selectFrom('corsair_accounts')
			.selectAll()
			.where('tenant_id', '=', tenantId)
			.where('integration_id', '=', integration.id)
			.executeTakeFirst();

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
	database: CorsairDatabase | undefined,
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
			const accounts = await database.db
				.selectFrom('corsair_accounts')
				.select('id')
				.where('tenant_id', '=', tenantId)
				.execute();

			if (accounts.length === 0) return [];

			const accountIds = accounts.map((a) => a.id);

			let q = database.db
				.selectFrom('corsair_entities')
				.selectAll()
				.where('account_id', 'in', accountIds);
			if (options?.entityType) {
				q = q.where('entity_type', '=', options.entityType);
			}
			if (typeof options?.limit === 'number') q = q.limit(options.limit);
			if (typeof options?.offset === 'number') q = q.offset(options.offset);
			return (await q.execute()) as CorsairEntity[];
		},

		listEvents: async (options) => {
			assertDatabaseConfigured(database);

			// Get all account IDs for this tenant
			const accounts = await database.db
				.selectFrom('corsair_accounts')
				.select('id')
				.where('tenant_id', '=', tenantId)
				.execute();

			if (accounts.length === 0) return [];

			const accountIds = accounts.map((a) => a.id);

			let q = database.db
				.selectFrom('corsair_events')
				.selectAll()
				.where('account_id', 'in', accountIds);
			if (options?.status) {
				q = q.where('status', '=', options.status);
			}
			if (typeof options?.limit === 'number') q = q.limit(options.limit);
			if (typeof options?.offset === 'number') q = q.offset(options.offset);
			return (await q.execute()) as CorsairEvent[];
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
	database: CorsairDatabase | undefined,
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
