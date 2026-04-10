import type { ZodTypeAny, z } from 'zod';
import { generateUUID } from '../../core/utils';
import type {
	CorsairAccount,
	CorsairEntity,
	CorsairEvent,
	CorsairIntegration,
	CorsairPermission,
	CorsairPermissionInsert,
} from '../index';
import type { CorsairDatabaseAdapter, CorsairPermissionOps } from '../adapter';
import { createAdapterTransforms } from '../adapter-factory';
import type {
	CorsairOrm,
	CorsairTableClient,
	CorsairIntegrationsClient,
	CorsairAccountsClient,
	CorsairEntitiesClient,
	CorsairEventsClient,
	PluginEntityClient,
	TypedEntity,
} from '../orm';

// ---------------------------------------------------------------------------
// Convex adapter transforms (declared once via capability flags)
// ---------------------------------------------------------------------------

const transforms = createAdapterTransforms({
	dates: 'epoch',
	json: 'native',
	internalFields: ['_id', '_creationTime'],
});

// ---------------------------------------------------------------------------
// Where-clause helper
// ---------------------------------------------------------------------------

function whereToConvex(
	where: Record<string, unknown>,
): Record<string, unknown> {
	const result: Record<string, unknown> = {};
	for (const [key, val] of Object.entries(where)) {
		if (val === undefined) continue;
		result[key] = val;
	}
	return result;
}

// ---------------------------------------------------------------------------
// Convex client abstraction
// ---------------------------------------------------------------------------

/**
 * Minimal interface for a Convex HTTP client.
 * This avoids a hard dependency on the `convex` package — any object that
 * satisfies this shape (e.g. `ConvexHttpClient`) works.
 */
export interface ConvexClient {
	query(functionReference: any, ...args: any[]): Promise<any>;
	mutation(functionReference: any, ...args: any[]): Promise<any>;
}

/**
 * Function to create a typed function reference for Convex.
 * Users must supply this from their Convex setup (e.g. `makeFunctionReference`).
 */
export type ConvexFunctionRefFactory = <T extends 'query' | 'mutation'>(
	type: T,
	name: string,
) => unknown;

// ---------------------------------------------------------------------------
// Adapter options
// ---------------------------------------------------------------------------

export type ConvexDatabaseAdapterOptions = {
	/** A Convex HTTP client instance (e.g. `new ConvexHttpClient(url)`). */
	client: ConvexClient;
	/**
	 * Factory to create typed function references.
	 * Default: uses `makeFunctionReference` from `convex/server`.
	 */
	makeFunctionRef?: ConvexFunctionRefFactory;
};

// ---------------------------------------------------------------------------
// Adapter implementation
// ---------------------------------------------------------------------------

/**
 * Convex implementation of `CorsairDatabaseAdapter`.
 *
 * Uses `createAdapterTransforms` with capability flags to declare that Convex
 * stores dates as epoch milliseconds and handles JSON natively. All
 * input/output type conversions are handled automatically by the factory
 * transforms — this adapter only contains raw Convex CRUD logic.
 */
export class ConvexDatabaseAdapter implements CorsairDatabaseAdapter {
	private client: ConvexClient;
	private ref: (type: 'query' | 'mutation', name: string) => any;
	private _orm: CorsairOrm | undefined;
	private _permissions: CorsairPermissionOps | undefined;

	constructor(options: ConvexDatabaseAdapterOptions) {
		this.client = options.client;
		if (options.makeFunctionRef) {
			this.ref = options.makeFunctionRef;
		} else {
			this.ref = (_type: string, name: string) => name;
		}
	}

	// -- CorsairDatabaseAdapter interface ------------------------------------

	createEntityClient<DataSchema extends ZodTypeAny>(
		getAccountId: () => Promise<string>,
		entityTypeName: string,
		version: string,
		dataSchema: DataSchema,
	): PluginEntityClient<DataSchema> {
		return this.buildEntityClient(
			getAccountId,
			entityTypeName,
			version,
			dataSchema,
		);
	}

	get orm(): CorsairOrm {
		if (!this._orm) {
			this._orm = this.buildOrm();
		}
		return this._orm;
	}

	get permissions(): CorsairPermissionOps {
		if (!this._permissions) {
			this._permissions = this.buildPermissionOps();
		}
		return this._permissions;
	}

	// -- ORM ----------------------------------------------------------------

	private buildOrm(): CorsairOrm {
		return {
			integrations: this.buildIntegrationsClient(),
			accounts: this.buildAccountsClient(),
			entities: this.buildEntitiesClient(),
			events: this.buildEventsClient(),
		};
	}

	private buildBaseClient<T>(tableName: string): CorsairTableClient<T> {
		const client = this.client;
		const ref = this.ref.bind(this);

		return {
			findById: async (id: string) => {
				const doc = await client.query(ref('query', `${tableName}:findById`), {
					id,
				});
				return transforms.transformOutput<T>(doc);
			},
			findOne: async (where: Record<string, unknown>) => {
				const doc = await client.query(
					ref('query', `${tableName}:findOne`),
					{ where: whereToConvex(where) },
				);
				return transforms.transformOutput<T>(doc);
			},
			findMany: async (options?: {
				where?: Record<string, unknown>;
				limit?: number;
				offset?: number;
			}) => {
				const docs = await client.query(
					ref('query', `${tableName}:findMany`),
					{
						where: options?.where
							? whereToConvex(options.where)
							: undefined,
						limit: options?.limit,
						offset: options?.offset,
					},
				);
				return transforms.transformOutputMany<T>(docs);
			},
			create: async (data: Record<string, unknown>) => {
				const now = transforms.dateForStorage(new Date());
				const insertData: Record<string, unknown> = {
					id: (data.id as string) ?? generateUUID(),
					created_at: now,
					updated_at: now,
					...data,
				};
				const doc = await client.mutation(
					ref('mutation', `${tableName}:create`),
					{ data: insertData },
				);
				return transforms.transformOutput<T>(doc)!;
			},
			update: async (id: string, data: Record<string, unknown>) => {
				const doc = await client.mutation(
					ref('mutation', `${tableName}:update`),
					{ id, data },
				);
				return transforms.transformOutput<T>(doc);
			},
			updateMany: async (
				where: Record<string, unknown>,
				data: Record<string, unknown>,
			) => {
				return client.mutation(
					ref('mutation', `${tableName}:updateMany`),
					{ where: whereToConvex(where), data },
				);
			},
			delete: async (id: string) => {
				return client.mutation(
					ref('mutation', `${tableName}:remove`),
					{ id },
				);
			},
			deleteMany: async (where: Record<string, unknown>) => {
				return client.mutation(
					ref('mutation', `${tableName}:deleteMany`),
					{ where: whereToConvex(where) },
				);
			},
			count: async (where?: Record<string, unknown>) => {
				return client.query(
					ref('query', `${tableName}:count`),
					{ where: where ? whereToConvex(where) : undefined },
				);
			},
		};
	}

	// -- Table-specific clients ---------------------------------------------

	private buildIntegrationsClient(): CorsairIntegrationsClient {
		const base = this.buildBaseClient<CorsairIntegration>('integrations');
		const client = this.client;
		const ref = this.ref.bind(this);

		return {
			...base,
			findByName: async (name: string) => {
				const doc = await client.query(
					ref('query', 'integrations:findByName'),
					{ name },
				);
				return transforms.transformOutput<CorsairIntegration>(doc);
			},
			upsertByName: async (
				name: string,
				data: Record<string, unknown>,
			) => {
				const now = transforms.dateForStorage(new Date());
				const doc = await client.mutation(
					ref('mutation', 'integrations:upsertByName'),
					{
						name,
						data: {
							id: generateUUID(),
							created_at: now,
							updated_at: now,
							...data,
						},
					},
				);
				return transforms.transformOutput<CorsairIntegration>(doc)!;
			},
		};
	}

	private buildAccountsClient(): CorsairAccountsClient {
		const base = this.buildBaseClient<CorsairAccount>('accounts');
		const client = this.client;
		const ref = this.ref.bind(this);

		return {
			...base,
			findByTenantAndIntegration: async (
				tenantId: string,
				integrationName: string,
			) => {
				const integration = await client.query(
					ref('query', 'integrations:findByName'),
					{ name: integrationName },
				);
				if (!integration) return null;
				const doc = await client.query(
					ref('query', 'accounts:findByTenantAndIntegration'),
					{ tenantId, integrationId: integration.id },
				);
				return transforms.transformOutput<CorsairAccount>(doc);
			},
			listByTenant: async (
				tenantId: string,
				options?: { limit?: number; offset?: number },
			) => {
				const docs = await client.query(
					ref('query', 'accounts:listByTenant'),
					{
						tenantId,
						limit: options?.limit,
						offset: options?.offset,
					},
				);
				return transforms.transformOutputMany<CorsairAccount>(docs);
			},
			upsertByTenantAndIntegration: async (
				tenantId: string,
				integrationId: string,
				data: Record<string, unknown>,
			) => {
				const now = transforms.dateForStorage(new Date());
				const doc = await client.mutation(
					ref('mutation', 'accounts:upsertByTenantAndIntegration'),
					{
						tenantId,
						integrationId,
						data: {
							id: generateUUID(),
							created_at: now,
							updated_at: now,
							...data,
						},
					},
				);
				return transforms.transformOutput<CorsairAccount>(doc)!;
			},
		};
	}

	private buildEntitiesClient(): CorsairEntitiesClient {
		const base = this.buildBaseClient<CorsairEntity>('entities');
		const client = this.client;
		const ref = this.ref.bind(this);

		return {
			...base,
			findByEntityId: async (options: {
				accountId: string;
				entityType: string;
				entityId: string;
			}) => {
				const doc = await client.query(
					ref('query', 'entities:findByEntityId'),
					options,
				);
				return transforms.transformOutput<CorsairEntity>(doc);
			},
			findManyByEntityIds: async (options: {
				accountId: string;
				entityType: string;
				entityIds: string[];
			}) => {
				const docs = await client.query(
					ref('query', 'entities:findManyByEntityIds'),
					options,
				);
				return transforms.transformOutputMany<CorsairEntity>(docs);
			},
			listByScope: async (options: {
				accountId: string;
				entityType: string;
				limit?: number;
				offset?: number;
			}) => {
				const docs = await client.query(
					ref('query', 'entities:listByScope'),
					options,
				);
				return transforms.transformOutputMany<CorsairEntity>(docs);
			},
			searchByEntityId: async (options: {
				accountId: string;
				entityType: string;
				query: string;
				limit?: number;
				offset?: number;
			}) => {
				const docs = await client.query(
					ref('query', 'entities:searchByEntityId'),
					{
						accountId: options.accountId,
						entityType: options.entityType,
						queryStr: options.query,
						limit: options.limit,
						offset: options.offset,
					},
				);
				return transforms.transformOutputMany<CorsairEntity>(docs);
			},
			upsertByEntityId: async (options: {
				accountId: string;
				entityType: string;
				entityId: string;
				version: string;
				data: Record<string, unknown>;
			}) => {
				const doc = await client.mutation(
					ref('mutation', 'entities:upsertByEntityId'),
					{ ...options, data: transforms.sanitizeValue(options.data) },
				);
				return transforms.transformOutput<CorsairEntity>(doc)!;
			},
			deleteByEntityId: async (options: {
				accountId: string;
				entityType: string;
				entityId: string;
			}) => {
				return client.mutation(
					ref('mutation', 'entities:removeByEntityId'),
					options,
				);
			},
		};
	}

	private buildEventsClient(): CorsairEventsClient {
		const base = this.buildBaseClient<CorsairEvent>('events');
		const client = this.client;
		const ref = this.ref.bind(this);

		return {
			...base,
			listByAccount: async (
				accountId: string,
				options?: { limit?: number; offset?: number },
			) => {
				const docs = await client.query(
					ref('query', 'events:listByAccount'),
					{
						accountId,
						limit: options?.limit,
						offset: options?.offset,
					},
				);
				return transforms.transformOutputMany<CorsairEvent>(docs);
			},
			listByStatus: async (
				status: string,
				options?: {
					accountId?: string;
					limit?: number;
					offset?: number;
				},
			) => {
				const docs = await client.query(
					ref('query', 'events:listByStatus'),
					{
						status,
						accountId: options?.accountId,
						limit: options?.limit,
						offset: options?.offset,
					},
				);
				return transforms.transformOutputMany<CorsairEvent>(docs);
			},
			listPending: async (options?: {
				accountId?: string;
				limit?: number;
			}) => {
				const docs = await client.query(
					ref('query', 'events:listByStatus'),
					{
						status: 'pending',
						accountId: options?.accountId,
						limit: options?.limit,
					},
				);
				return transforms.transformOutputMany<CorsairEvent>(docs);
			},
			updateStatus: async (id: string, status: string) => {
				const doc = await client.mutation(
					ref('mutation', 'events:update'),
					{ id, data: { status } },
				);
				return transforms.transformOutput<CorsairEvent>(doc);
			},
		};
	}

	// -- Permissions --------------------------------------------------------

	private buildPermissionOps(): CorsairPermissionOps {
		const client = this.client;
		const ref = this.ref.bind(this);

		return {
			findById: async (id: string) => {
				const doc = await client.query(
					ref('query', 'permissions:findById'),
					{ id },
				);
				return transforms.transformOutput<CorsairPermission>(doc) ?? undefined;
			},
			findByToken: async (token: string) => {
				const doc = await client.query(
					ref('query', 'permissions:findByToken'),
					{ token },
				);
				return transforms.transformOutput<CorsairPermission>(doc) ?? undefined;
			},
			create: async (data: CorsairPermissionInsert) => {
				const row = {
					id: data.id ?? generateUUID(),
					created_at: transforms.dateForStorage(data.created_at),
					updated_at: transforms.dateForStorage(data.updated_at),
					token: data.token,
					plugin: data.plugin,
					endpoint: data.endpoint,
					args: data.args,
					tenant_id: data.tenant_id ?? 'default',
					status: data.status ?? 'pending',
					expires_at: data.expires_at,
					error: data.error ?? null,
				};
				const doc = await client.mutation(
					ref('mutation', 'permissions:create'),
					{ data: row },
				);
				return transforms.transformOutput<CorsairPermission>(doc)!;
			},
			updateStatus: async (
				id: string,
				status: string,
				extra?: { error?: string | null },
			) => {
				await client.mutation(
					ref('mutation', 'permissions:updateStatus'),
					{ id, status, error: extra?.error },
				);
			},
			findActiveForEndpoint: async (opts: {
				plugin: string;
				endpoint: string;
				args: string;
				tenantId: string;
				now: string;
			}) => {
				const doc = await client.query(
					ref('query', 'permissions:findActiveForEndpoint'),
					{
						plugin: opts.plugin,
						endpoint: opts.endpoint,
						argsStr: opts.args,
						tenantId: opts.tenantId,
						now: opts.now,
					},
				);
				return transforms.transformOutput<CorsairPermission>(doc) ?? undefined;
			},
		};
	}

	// -- Plugin entity client -----------------------------------------------

	private buildEntityClient<DataSchema extends ZodTypeAny>(
		getAccountId: () => Promise<string>,
		entityTypeName: string,
		version: string,
		dataSchema: DataSchema,
	): PluginEntityClient<DataSchema> {
		type Entity = TypedEntity<DataSchema>;
		const client = this.client;
		const ref = this.ref.bind(this);

		const parseData = (
			doc: Record<string, unknown> | null,
		): Entity | null => {
			if (!doc) return null;
			const row = transforms.transformOutput<CorsairEntity>(doc);
			if (!row) return null;
			let data = row.data;
			if (typeof data === 'string') {
				try {
					data = JSON.parse(data);
				} catch {}
			}
			const parsed = dataSchema.safeParse(data);
			return {
				...row,
				data: parsed.success ? parsed.data : data,
			} as Entity;
		};

		const parseDocs = (docs: Record<string, unknown>[]): Entity[] => {
			return docs.map((d) => parseData(d)!).filter(Boolean);
		};

		let cachedAccountId: string | undefined;
		const resolveAccountId = async () => {
			if (!cachedAccountId) {
				cachedAccountId = await getAccountId();
			}
			return cachedAccountId;
		};

		return {
			findByEntityId: async (entityId: string) => {
				const accountId = await resolveAccountId();
				const doc = await client.query(
					ref('query', 'entities:findByEntityId'),
					{ accountId, entityType: entityTypeName, entityId },
				);
				return parseData(doc);
			},
			findById: async (id: string) => {
				const doc = await client.query(
					ref('query', 'entities:findById'),
					{ id },
				);
				return parseData(doc);
			},
			findManyByEntityIds: async (entityIds: string[]) => {
				const accountId = await resolveAccountId();
				const docs = await client.query(
					ref('query', 'entities:findManyByEntityIds'),
					{ accountId, entityType: entityTypeName, entityIds },
				);
				return parseDocs(docs);
			},
			list: async (options?: { limit?: number; offset?: number }) => {
				const accountId = await resolveAccountId();
				const docs = await client.query(
					ref('query', 'entities:listByScope'),
					{
						accountId,
						entityType: entityTypeName,
						limit: options?.limit,
						offset: options?.offset,
					},
				);
				return parseDocs(docs);
			},
			search: async (options: Record<string, unknown>) => {
				const accountId = await resolveAccountId();
				const entityId = options.entity_id as
					| string
					| { contains?: string; startsWith?: string }
					| undefined;
				let queryStr = '';
				if (typeof entityId === 'string') {
					queryStr = entityId;
				} else if (entityId && typeof entityId === 'object') {
					queryStr =
						entityId.contains ?? entityId.startsWith ?? '';
				}
				if (queryStr) {
					const docs = await client.query(
						ref('query', 'entities:searchByEntityId'),
						{
							accountId,
							entityType: entityTypeName,
							queryStr,
							limit: options.limit as number | undefined,
							offset: options.offset as number | undefined,
						},
					);
					return parseDocs(docs);
				}
				const docs = await client.query(
					ref('query', 'entities:listByScope'),
					{
						accountId,
						entityType: entityTypeName,
						limit: options.limit as number | undefined,
						offset: options.offset as number | undefined,
					},
				);
				let results = parseDocs(docs);
				if (options.data && typeof options.data === 'object') {
					const dataFilter = options.data as Record<string, unknown>;
					results = results.filter((entity) => {
						for (const [key, filterVal] of Object.entries(
							dataFilter,
						)) {
							const entityVal = (
								entity.data as Record<string, unknown>
							)?.[key];
							if (
								typeof filterVal === 'object' &&
								filterVal !== null
							) {
								const filter = filterVal as Record<
									string,
									unknown
								>;
								if (
									'contains' in filter &&
									typeof entityVal === 'string'
								) {
									if (
										!entityVal
											.toLowerCase()
											.includes(
												(
													filter.contains as string
												).toLowerCase(),
											)
									)
										return false;
								}
								if (
									'startsWith' in filter &&
									typeof entityVal === 'string'
								) {
									if (
										!entityVal
											.toLowerCase()
											.startsWith(
												(
													filter.startsWith as string
												).toLowerCase(),
											)
									)
										return false;
								}
								if (
									'gt' in filter &&
									typeof entityVal === 'number'
								) {
									if (
										entityVal <=
										(filter.gt as number)
									)
										return false;
								}
								if (
									'gte' in filter &&
									typeof entityVal === 'number'
								) {
									if (
										entityVal <
										(filter.gte as number)
									)
										return false;
								}
								if (
									'lt' in filter &&
									typeof entityVal === 'number'
								) {
									if (
										entityVal >=
										(filter.lt as number)
									)
										return false;
								}
								if (
									'lte' in filter &&
									typeof entityVal === 'number'
								) {
									if (
										entityVal >
										(filter.lte as number)
									)
										return false;
								}
							} else {
								if (entityVal !== filterVal) return false;
							}
						}
						return true;
					});
				}
				return results;
			},
			upsertByEntityId: async (
				entityId: string,
				data: z.input<DataSchema>,
			) => {
				const accountId = await resolveAccountId();
				const doc = await client.mutation(
					ref('mutation', 'entities:upsertByEntityId'),
					{
						accountId,
						entityType: entityTypeName,
						entityId,
						version,
						data: transforms.sanitizeValue(data),
					},
				);
				return parseData(doc)!;
			},
			deleteById: async (id: string) => {
				return client.mutation(
					ref('mutation', 'entities:remove'),
					{ id },
				);
			},
			deleteByEntityId: async (entityId: string) => {
				const accountId = await resolveAccountId();
				return client.mutation(
					ref('mutation', 'entities:removeByEntityId'),
					{
						accountId,
						entityType: entityTypeName,
						entityId,
					},
				);
			},
			count: async () => {
				const accountId = await resolveAccountId();
				return client.query(ref('query', 'entities:count'), {
					where: {
						account_id: accountId,
						entity_type: entityTypeName,
					},
				});
			},
		};
	}
}
