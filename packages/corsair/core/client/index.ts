import type { ZodTypeAny } from 'zod';
import { withTenantAdapter } from '../../adapters/tenant';
import type { CorsairDbAdapter } from '../../adapters/types';
import type {
	CorsairPluginSchema,
	PluginEntityClient,
	PluginEntityClients,
} from '../../db/orm';
import type { BindEndpoints, EndpointTree } from '../endpoints';
import { bindEndpointsRecursively } from '../endpoints/bind';
import type { CorsairErrorHandler } from '../errors';
import type { CorsairPlugin } from '../plugins';
import type { BindWebhooks, RawWebhookRequest, WebhookTree } from '../webhooks';
import { bindWebhooksRecursively } from '../webhooks/bind';

// ─────────────────────────────────────────────────────────────────────────────
// Entity Client Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extracts typed entity clients from a plugin schema.
 * Each entity type becomes a `PluginEntityClient<DataSchema>`.
 * Entities are nested under `db` to separate them from API endpoints.
 */
export type InferPluginEntities<
	Schema extends CorsairPluginSchema<Record<string, ZodTypeAny>> | undefined,
> = Schema extends CorsairPluginSchema<infer Entities>
	? { db: PluginEntityClients<Entities> }
	: {};

// ─────────────────────────────────────────────────────────────────────────────
// Client Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Utility type that converts a union to an intersection type.
 */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
	k: infer I,
) => void
	? I
	: never;

/**
 * Infers the complete namespace for a single plugin, including API endpoints,
 * database entities, and webhooks if defined.
 */
type InferPluginNamespace<P extends CorsairPlugin> = P extends CorsairPlugin<
	infer Id,
	infer Schema,
	infer Endpoints,
	infer Webhooks,
	infer _Options
>
	? {
			[K in Id]: (Endpoints extends EndpointTree
				? { api: BindEndpoints<Endpoints> }
				: {}) &
				InferPluginEntities<Schema> &
				(Webhooks extends WebhookTree
					? {
							webhooks: BindWebhooks<Webhooks>;
							/**
							 * Synchronously checks if an incoming webhook request is intended for this plugin.
							 * Only present if the plugin defines a `pluginWebhookMatcher`.
							 * Use this as a first-level filter before checking individual webhook matchers.
							 */
							pluginWebhookMatcher?: (request: RawWebhookRequest) => boolean;
						}
					: {});
		}
	: never;

/**
 * Combines all plugin namespaces into a single client interface.
 */
type InferPluginNamespaces<Plugins extends readonly CorsairPlugin[]> =
	UnionToIntersection<InferPluginNamespace<Plugins[number]>>;

/**
 * The main Corsair client type that provides access to all plugin APIs, entities, and webhooks.
 */
export type CorsairClient<Plugins extends readonly CorsairPlugin[]> =
	InferPluginNamespaces<Plugins>;

/**
 * Multi-tenant wrapper that provides a `withTenant` method to scope operations to a specific tenant.
 */
export type CorsairTenantWrapper<Plugins extends readonly CorsairPlugin[]> = {
	withTenant: (tenantId: string) => CorsairClient<Plugins>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Account ID Resolver
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates a cached account ID resolver for a specific tenant and integration.
 * The account ID is lazily fetched on first access and cached for subsequent calls.
 */
function createAccountIdResolver(
	database: CorsairDbAdapter | undefined,
	integrationName: string,
	tenantId: string,
): () => Promise<string> {
	let cachedAccountId: string | null = null;

	return async () => {
		if (cachedAccountId) return cachedAccountId;

		if (!database) {
			throw new Error('Database not configured');
		}

		// Find the integration by name
		const integration = await database.findOne({
			table: 'corsair_integrations',
			where: [{ field: 'name', value: integrationName }],
		});

		if (!integration) {
			throw new Error(
				`Integration "${integrationName}" not found. Make sure to create the integration first.`,
			);
		}

		// Find the account for this tenant and integration
		const account = await database.findOne({
			table: 'corsair_accounts',
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
	};
}

// ─────────────────────────────────────────────────────────────────────────────
// Entity Client Factory
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates a UUID v4 string using crypto.randomUUID() if available,
 * otherwise falls back to a Math.random() implementation.
 * @returns A UUID v4 string
 */
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

/**
 * Attempts to parse a value as JSON if it's a string, otherwise returns the value unchanged.
 * @param value - The value to parse
 * @returns The parsed value or the original value if parsing fails
 */
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

/**
 * Creates an entity client for a specific plugin and entity type with database operations.
 * The client lazily resolves the account ID when operations are performed.
 * @param database - The database adapter instance
 * @param getAccountId - Function to get the account ID
 * @param entityTypeName - The name of the entity type
 * @param version - The schema version for data validation
 * @param dataSchema - The Zod schema for data validation
 * @returns An entity client with CRUD operations
 */
function createEntityClient(
	database: CorsairDbAdapter | undefined,
	getAccountId: () => Promise<string>,
	entityTypeName: string,
	version: string,
	dataSchema: ZodTypeAny,
): PluginEntityClient<ZodTypeAny> {
	const tableName = 'corsair_entities';

	function baseWhere(accountId: string) {
		return [
			{ field: 'account_id', value: accountId },
			{ field: 'entity_type', value: entityTypeName },
		];
	}

	function parseRow(row: any) {
		const data = parseJsonLike(row.data);
		return { ...row, data: dataSchema.parse(data) };
	}

	return {
		findByEntityId: async (entityId) => {
			if (!database) return null;
			const accountId = await getAccountId();
			const row = await database.findOne({
				table: tableName,
				where: [
					...baseWhere(accountId),
					{ field: 'entity_id', value: entityId },
				],
			});
			return row ? parseRow(row) : null;
		},

		findById: async (id) => {
			if (!database) return null;
			const accountId = await getAccountId();
			const row = await database.findOne({
				table: tableName,
				where: [...baseWhere(accountId), { field: 'id', value: id }],
			});
			return row ? parseRow(row) : null;
		},

		findManyByEntityIds: async (entityIds) => {
			if (!database || entityIds.length === 0) return [];
			const accountId = await getAccountId();
			const rows = await database.findMany({
				table: tableName,
				where: [
					...baseWhere(accountId),
					{ field: 'entity_id', operator: 'in' as const, value: entityIds },
				],
			});
			return rows.map(parseRow);
		},

		list: async (options) => {
			if (!database) return [];
			const accountId = await getAccountId();
			const rows = await database.findMany({
				table: tableName,
				where: baseWhere(accountId),
				limit: options?.limit ?? 100,
				offset: options?.offset ?? 0,
			});
			return rows.map(parseRow);
		},

		search: async ({ query, limit, offset }) => {
			if (!database) return [];
			const accountId = await getAccountId();
			const rows = await database.findMany({
				table: tableName,
				where: [
					...baseWhere(accountId),
					{
						field: 'entity_id',
						operator: 'like' as const,
						value: `%${query}%`,
					},
				],
				limit: limit ?? 100,
				offset: offset ?? 0,
			});
			return rows.map(parseRow);
		},

		upsert: async (entityId, data) => {
			if (!database) throw new Error('Database not configured');
			const accountId = await getAccountId();
			const parsed = dataSchema.parse(data);
			const now = new Date();

			const existing = await database.findOne({
				table: tableName,
				select: ['id'],
				where: [
					...baseWhere(accountId),
					{ field: 'entity_id', value: entityId },
				],
			});

			if (existing?.id) {
				await database.update({
					table: tableName,
					where: [{ field: 'id', value: existing.id }],
					data: { version, data: parsed, updated_at: now },
				});
				const updated = await database.findOne({
					table: tableName,
					where: [{ field: 'id', value: existing.id }],
				});
				return parseRow(updated);
			}

			const id = generateUuidV4();
			await database.insert({
				table: tableName,
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
				table: tableName,
				where: [{ field: 'id', value: id }],
			});
			return parseRow(inserted);
		},

		deleteById: async (id) => {
			if (!database) return false;
			const accountId = await getAccountId();
			const deleted = await database.deleteMany({
				table: tableName,
				where: [...baseWhere(accountId), { field: 'id', value: id }],
			});
			return deleted > 0;
		},

		deleteByEntityId: async (entityId) => {
			if (!database) return false;
			const accountId = await getAccountId();
			const deleted = await database.deleteMany({
				table: tableName,
				where: [
					...baseWhere(accountId),
					{ field: 'entity_id', value: entityId },
				],
			});
			return deleted > 0;
		},

		count: async () => {
			if (!database) return 0;
			const accountId = await getAccountId();
			return database.count({ table: tableName, where: baseWhere(accountId) });
		},
	};
}

// ─────────────────────────────────────────────────────────────────────────────
// Client Builder
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Builds a Corsair client instance with all plugin APIs, entities, and webhooks bound.
 * @param plugins - Array of plugin definitions to include in the client
 * @param database - Optional database adapter for ORM entities
 * @param tenantId - Optional tenant ID for multi-tenant setups
 * @param rootErrorHandlers - Optional root-level error handlers
 * @returns A fully configured Corsair client
 */
export function buildCorsairClient<
	const Plugins extends readonly CorsairPlugin[],
>(
	plugins: Plugins,
	database: CorsairDbAdapter | undefined,
	tenantId: string | undefined,
	rootErrorHandlers?: CorsairErrorHandler,
): CorsairClient<Plugins> {
	const scopedDatabase =
		database && tenantId ? withTenantAdapter(database, tenantId) : database;

	const apiUnsafe: Record<string, Record<string, unknown>> = {};
	const pluginEntitiesUnsafe: Record<string, Record<string, unknown>> = {};

	for (const plugin of plugins) {
		apiUnsafe[plugin.id] = {};
		pluginEntitiesUnsafe[plugin.id] = {};
	}

	for (const plugin of plugins) {
		const schema = plugin.schema;
		const effectiveTenantId = tenantId ?? 'default';

		// Create a shared account ID resolver for this plugin
		const getAccountId = createAccountIdResolver(
			scopedDatabase,
			plugin.id,
			effectiveTenantId,
		);

		// Create typed entity clients from plugin schema, nested under `db`
		if (schema?.entities) {
			const dbClients: Record<string, unknown> = {};
			for (const [entityTypeName, dataSchema] of Object.entries(
				schema.entities,
			)) {
				const entityClient = createEntityClient(
					scopedDatabase,
					getAccountId,
					entityTypeName,
					schema.version,
					dataSchema,
				);
				dbClients[entityTypeName] = entityClient;
			}
			pluginEntitiesUnsafe[plugin.id]!.db = dbClients;
			apiUnsafe[plugin.id]!.db = dbClients;
		}

		// Build plugin context with entity clients under `db` and account ID resolver
		const ctxForPlugin: Record<string, unknown> = {
			database: scopedDatabase,
			db: pluginEntitiesUnsafe[plugin.id]?.db ?? {},
			$getAccountId: getAccountId,
			...(plugin.options ? { options: plugin.options } : {}),
		};

		const endpoints = plugin.endpoints ?? {};
		const hooks = plugin.hooks;

		// Combine plugin and root error handlers, plugin handlers first for priority
		const allErrorHandlers = {
			...rootErrorHandlers,
			...plugin.errorHandlers,
		};

		// Create bound endpoints under `api` (supports nested structures)
		const boundTree: Record<string, unknown> = {};

		bindEndpointsRecursively({
			endpoints,
			hooks,
			ctx: ctxForPlugin,
			tree: boundTree,
			pluginId: plugin.id,
			errorHandlers: allErrorHandlers,
			currentPath: [],
			keyBuilder: plugin.keyBuilder,
		});

		if (Object.keys(boundTree).length > 0) {
			apiUnsafe[plugin.id]!.api = boundTree;
		}

		ctxForPlugin.endpoints = boundTree;

		// Create bound webhooks under `webhooks` (supports nested structures)
		const webhooks = (plugin.webhooks ?? {}) satisfies Record<string, unknown>;
		const webhookHooks = plugin.webhookHooks satisfies
			| Record<string, unknown>
			| undefined;

		if (Object.keys(webhooks).length > 0) {
			const boundWebhooks: Record<string, unknown> = {};
			bindWebhooksRecursively({
				webhooks,
				hooks: webhookHooks,
				ctx: ctxForPlugin,
				webhooksTree: boundWebhooks,
			});
			apiUnsafe[plugin.id]!.webhooks = boundWebhooks;

			// Only expose pluginWebhookMatcher if the plugin has a pluginWebhookMatcher defined
			// This is the first-level check to see if the webhook is for this plugin
			if (plugin.pluginWebhookMatcher) {
				apiUnsafe[plugin.id]!.pluginWebhookMatcher =
					plugin.pluginWebhookMatcher;
			}
		}
	}

	const api = apiUnsafe as InferPluginNamespaces<Plugins>;

	return {
		...(api as unknown as Record<string, unknown>),
	} as CorsairClient<Plugins>;
}
