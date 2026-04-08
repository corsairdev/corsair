import { ConvexHttpClient } from 'convex/browser';
import { type FunctionReference, makeFunctionReference } from 'convex/server';
import type { ZodTypeAny, z } from 'zod';
import type {
	CorsairDatabaseAdapter,
	CorsairPermissionOps,
	CorsairIntegration,
	CorsairAccount,
	CorsairEntity,
	CorsairEvent,
	CorsairPermission,
	CorsairPermissionInsert,
} from 'corsair/db';
import type {
	CorsairOrm,
	CorsairTableClient,
	CorsairIntegrationsClient,
	CorsairAccountsClient,
	CorsairEntitiesClient,
	CorsairEventsClient,
	PluginEntityClient,
	TypedEntity,
} from 'corsair/orm';

function ref<T extends 'query' | 'mutation'>(
	type: T,
	name: string,
): FunctionReference<T, 'public', any, any> {
	return makeFunctionReference<T>(name);
}

function generateUUID(): string {
	return crypto.randomUUID();
}

function dateToEpoch(d: Date | undefined): number {
	return d ? d.getTime() : Date.now();
}

function epochToDate(epoch: number): Date {
	return new Date(epoch);
}

/**
 * Strips Convex internal fields (_id, _creationTime) from a document
 * and converts epoch timestamps back to Date objects.
 */
function toRow<T>(doc: Record<string, unknown> | null): T | null {
	if (!doc) return null;
	const { _id, _creationTime, ...rest } = doc;
	if (typeof rest.created_at === 'number') {
		rest.created_at = epochToDate(rest.created_at);
	}
	if (typeof rest.updated_at === 'number') {
		rest.updated_at = epochToDate(rest.updated_at);
	}
	if (rest.config && typeof rest.config === 'string') {
		try {
			rest.config = JSON.parse(rest.config);
		} catch {}
	}
	if (rest.data && typeof rest.data === 'string') {
		try {
			rest.data = JSON.parse(rest.data);
		} catch {}
	}
	if (rest.payload && typeof rest.payload === 'string') {
		try {
			rest.payload = JSON.parse(rest.payload);
		} catch {}
	}
	return rest as T;
}

function toRows<T>(docs: Record<string, unknown>[]): T[] {
	return docs.map((d) => toRow<T>(d)!).filter(Boolean);
}

function whereToConvex(where: Record<string, unknown>): Record<string, unknown> {
	const result: Record<string, unknown> = {};
	for (const [key, val] of Object.entries(where)) {
		if (val === undefined) continue;
		if (typeof val === 'object' && val !== null && !Array.isArray(val) && !(val instanceof Date)) {
			const obj = val as { in?: unknown[]; like?: string };
			if ('in' in obj) {
				result[key] = val;
			} else if ('like' in obj) {
				result[key] = val;
			} else {
				result[key] = val;
			}
		} else {
			result[key] = val;
		}
	}
	return result;
}

export class ConvexDatabaseAdapter implements CorsairDatabaseAdapter {
	private client: ConvexHttpClient;
	private _orm: CorsairOrm | undefined;
	private _permissions: CorsairPermissionOps | undefined;

	constructor(convexUrl: string) {
		this.client = new ConvexHttpClient(convexUrl);
	}

	createEntityClient<DataSchema extends ZodTypeAny>(
		getAccountId: () => Promise<string>,
		entityTypeName: string,
		version: string,
		dataSchema: DataSchema,
	): PluginEntityClient<DataSchema> {
		return this.buildEntityClient(getAccountId, entityTypeName, version, dataSchema);
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

		return {
			findById: async (id: string) => {
				const doc = await client.query(
					ref('query', `${tableName}:findById`),
					{ id },
				);
				return toRow<T>(doc);
			},
			findOne: async (where: Record<string, unknown>) => {
				const doc = await client.query(
					ref('query', `${tableName}:findOne`),
					{ where: whereToConvex(where) },
				);
				return toRow<T>(doc);
			},
			findMany: async (options?: { where?: Record<string, unknown>; limit?: number; offset?: number }) => {
				const docs = await client.query(
					ref('query', `${tableName}:findMany`),
					{
						where: options?.where ? whereToConvex(options.where) : undefined,
						limit: options?.limit,
						offset: options?.offset,
					},
				);
				return toRows<T>(docs);
			},
			create: async (data: Record<string, unknown>) => {
				const now = Date.now();
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
				return toRow<T>(doc)!;
			},
			update: async (id: string, data: Record<string, unknown>) => {
				const doc = await client.mutation(
					ref('mutation', `${tableName}:update`),
					{ id, data },
				);
				return toRow<T>(doc);
			},
			updateMany: async (where: Record<string, unknown>, data: Record<string, unknown>) => {
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

	private buildIntegrationsClient(): CorsairIntegrationsClient {
		const base = this.buildBaseClient<CorsairIntegration>('integrations');
		const client = this.client;

		return {
			...base,
			findByName: async (name: string) => {
				const doc = await client.query(
					ref('query', 'integrations:findByName'),
					{ name },
				);
				return toRow<CorsairIntegration>(doc);
			},
			upsertByName: async (name: string, data: Record<string, unknown>) => {
				const now = Date.now();
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
				return toRow<CorsairIntegration>(doc)!;
			},
		};
	}

	private buildAccountsClient(): CorsairAccountsClient {
		const base = this.buildBaseClient<CorsairAccount>('accounts');
		const client = this.client;

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
				return toRow<CorsairAccount>(doc);
			},
			listByTenant: async (
				tenantId: string,
				options?: { limit?: number; offset?: number },
			) => {
				const docs = await client.query(
					ref('query', 'accounts:listByTenant'),
					{ tenantId, limit: options?.limit, offset: options?.offset },
				);
				return toRows<CorsairAccount>(docs);
			},
			upsertByTenantAndIntegration: async (
				tenantId: string,
				integrationId: string,
				data: Record<string, unknown>,
			) => {
				const now = Date.now();
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
				return toRow<CorsairAccount>(doc)!;
			},
		};
	}

	private buildEntitiesClient(): CorsairEntitiesClient {
		const base = this.buildBaseClient<CorsairEntity>('entities');
		const client = this.client;

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
				return toRow<CorsairEntity>(doc);
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
				return toRows<CorsairEntity>(docs);
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
				return toRows<CorsairEntity>(docs);
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
				return toRows<CorsairEntity>(docs);
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
					options,
				);
				return toRow<CorsairEntity>(doc)!;
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

		return {
			...base,
			listByAccount: async (
				accountId: string,
				options?: { limit?: number; offset?: number },
			) => {
				const docs = await client.query(
					ref('query', 'events:listByAccount'),
					{ accountId, limit: options?.limit, offset: options?.offset },
				);
				return toRows<CorsairEvent>(docs);
			},
			listByStatus: async (
				status: string,
				options?: { accountId?: string; limit?: number; offset?: number },
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
				return toRows<CorsairEvent>(docs);
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
				return toRows<CorsairEvent>(docs);
			},
			updateStatus: async (
				id: string,
				status: string,
			) => {
				const doc = await client.mutation(
					ref('mutation', 'events:update'),
					{ id, data: { status } },
				);
				return toRow<CorsairEvent>(doc);
			},
		};
	}

	private buildPermissionOps(): CorsairPermissionOps {
		const client = this.client;

		return {
			findById: async (id: string) => {
				const doc = await client.query(
					ref('query', 'permissions:findById'),
					{ id },
				);
				return toRow<CorsairPermission>(doc) ?? undefined;
			},
			findByToken: async (token: string) => {
				const doc = await client.query(
					ref('query', 'permissions:findByToken'),
					{ token },
				);
				return toRow<CorsairPermission>(doc) ?? undefined;
			},
			create: async (data: CorsairPermissionInsert) => {
				const now = Date.now();
				const row = {
					id: data.id ?? generateUUID(),
					created_at: dateToEpoch(data.created_at),
					updated_at: dateToEpoch(data.updated_at),
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
				return toRow<CorsairPermission>(doc)!;
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
				return toRow<CorsairPermission>(doc) ?? undefined;
			},
		};
	}

	private buildEntityClient<DataSchema extends ZodTypeAny>(
		getAccountId: () => Promise<string>,
		entityTypeName: string,
		version: string,
		dataSchema: DataSchema,
	): PluginEntityClient<DataSchema> {
		type Entity = TypedEntity<DataSchema>;
		const client = this.client;

		const parseData = (doc: Record<string, unknown> | null): Entity | null => {
			if (!doc) return null;
			const row = toRow<CorsairEntity>(doc);
			if (!row) return null;
			let data = row.data;
			if (typeof data === 'string') {
				try { data = JSON.parse(data); } catch {}
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
				const entityId = options.entity_id as string | { contains?: string; startsWith?: string } | undefined;
				let queryStr = '';
				if (typeof entityId === 'string') {
					queryStr = entityId;
				} else if (entityId && typeof entityId === 'object') {
					queryStr = entityId.contains ?? entityId.startsWith ?? '';
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
						for (const [key, filterVal] of Object.entries(dataFilter)) {
							const entityVal = (entity.data as Record<string, unknown>)?.[key];
							if (typeof filterVal === 'object' && filterVal !== null) {
								const filter = filterVal as Record<string, unknown>;
								if ('contains' in filter && typeof entityVal === 'string') {
									if (!entityVal.toLowerCase().includes((filter.contains as string).toLowerCase())) return false;
								}
								if ('startsWith' in filter && typeof entityVal === 'string') {
									if (!entityVal.toLowerCase().startsWith((filter.startsWith as string).toLowerCase())) return false;
								}
								if ('gt' in filter && typeof entityVal === 'number') {
									if (entityVal <= (filter.gt as number)) return false;
								}
								if ('gte' in filter && typeof entityVal === 'number') {
									if (entityVal < (filter.gte as number)) return false;
								}
								if ('lt' in filter && typeof entityVal === 'number') {
									if (entityVal >= (filter.lt as number)) return false;
								}
								if ('lte' in filter && typeof entityVal === 'number') {
									if (entityVal > (filter.lte as number)) return false;
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
			upsertByEntityId: async (entityId: string, data: z.input<DataSchema>) => {
				const accountId = await resolveAccountId();
				const doc = await client.mutation(
					ref('mutation', 'entities:upsertByEntityId'),
					{
						accountId,
						entityType: entityTypeName,
						entityId,
						version,
						data,
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
				return client.query(
					ref('query', 'entities:count'),
					{
						where: {
							account_id: accountId,
							entity_type: entityTypeName,
						},
					},
				);
			},
		};
	}
}
