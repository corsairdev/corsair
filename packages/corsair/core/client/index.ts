import type { ZodTypeAny } from 'zod';
import { withTenantAdapter } from '../../adapters/tenant';
import type { CorsairDbAdapter } from '../../adapters/types';
import type {
	CorsairPluginSchema,
	PluginServiceClient,
	PluginServiceClients,
} from '../../db/orm';
import type { BindEndpoints, EndpointTree } from '../endpoints';
import { bindEndpointsRecursively } from '../endpoints/bind';
import type { CorsairErrorHandler } from '../errors';
import type { CorsairPlugin } from '../plugins';
import type { BindWebhooks, RawWebhookRequest, WebhookTree } from '../webhooks';
import { bindWebhooksRecursively } from '../webhooks/bind';

// ─────────────────────────────────────────────────────────────────────────────
// Service Client Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extracts typed service clients from a plugin schema.
 * Each service becomes a `PluginServiceClient<DataSchema>`.
 * Services are nested under `db` to separate them from API endpoints.
 */
export type InferPluginServices<
	Schema extends CorsairPluginSchema<Record<string, ZodTypeAny>> | undefined,
> = Schema extends CorsairPluginSchema<infer Services>
	? { db: PluginServiceClients<Services> }
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
 * database services, and webhooks if defined.
 */
type InferPluginNamespace<P extends CorsairPlugin> = P extends CorsairPlugin<
	infer Id,
	infer Endpoints,
	infer Schema,
	infer _Options,
	infer Webhooks
>
	? {
			[K in Id]: (Endpoints extends EndpointTree
				? { api: BindEndpoints<Endpoints> }
				: {}) &
				InferPluginServices<Schema> &
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
 * The main Corsair client type that provides access to all plugin APIs, services, and webhooks.
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
// Service Client Factory
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
 * Creates a service client for a specific plugin and service with database operations.
 * @param database - The database adapter instance
 * @param pluginId - The ID of the plugin this service belongs to
 * @param serviceName - The name of the service
 * @param tenantId - The tenant ID for multi-tenant setups
 * @param version - The schema version for data validation
 * @param dataSchema - The Zod schema for data validation
 * @returns A service client with CRUD operations
 */
function createServiceClient(
	database: CorsairDbAdapter | undefined,
	pluginId: string,
	serviceName: string,
	tenantId: string,
	version: string,
	dataSchema: ZodTypeAny,
): PluginServiceClient<ZodTypeAny> {
	const tableName = 'corsair_resources';

	function baseWhere() {
		return [
			{ field: 'tenant_id', value: tenantId },
			{ field: 'resource', value: pluginId },
			{ field: 'service', value: serviceName },
		];
	}

	function parseRow(row: any) {
		const data = parseJsonLike(row.data);
		return { ...row, data: dataSchema.parse(data) };
	}

	return {
		findByResourceId: async (resourceId) => {
			if (!database) return null;
			const row = await database.findOne<any>({
				table: tableName,
				where: [...baseWhere(), { field: 'resource_id', value: resourceId }],
			});
			return row ? parseRow(row) : null;
		},

		findById: async (id) => {
			if (!database) return null;
			const row = await database.findOne<any>({
				table: tableName,
				where: [...baseWhere(), { field: 'id', value: id }],
			});
			return row ? parseRow(row) : null;
		},

		findManyByResourceIds: async (resourceIds) => {
			if (!database || resourceIds.length === 0) return [];
			const rows = await database.findMany<any>({
				table: tableName,
				where: [
					...baseWhere(),
					{ field: 'resource_id', operator: 'in' as const, value: resourceIds },
				],
			});
			return rows.map(parseRow);
		},

		list: async (options) => {
			if (!database) return [];
			const rows = await database.findMany<any>({
				table: tableName,
				where: baseWhere(),
				limit: options?.limit ?? 100,
				offset: options?.offset ?? 0,
			});
			return rows.map(parseRow);
		},

		search: async ({ query, limit, offset }) => {
			if (!database) return [];
			const rows = await database.findMany<any>({
				table: tableName,
				where: [
					...baseWhere(),
					{
						field: 'resource_id',
						operator: 'like' as const,
						value: `%${query}%`,
					},
				],
				limit: limit ?? 100,
				offset: offset ?? 0,
			});
			return rows.map(parseRow);
		},

		upsert: async (resourceId, data) => {
			if (!database) throw new Error('Database not configured');
			const parsed = dataSchema.parse(data);
			const now = new Date();

			const existing = await database.findOne<{ id: string }>({
				table: tableName,
				select: ['id'],
				where: [...baseWhere(), { field: 'resource_id', value: resourceId }],
			});

			if (existing?.id) {
				await database.update({
					table: tableName,
					where: [{ field: 'id', value: existing.id }],
					data: { version, data: parsed, updated_at: now },
				});
				const updated = await database.findOne<any>({
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
					tenant_id: tenantId,
					resource_id: resourceId,
					resource: pluginId,
					service: serviceName,
					version,
					data: parsed,
				},
			});

			const inserted = await database.findOne<any>({
				table: tableName,
				where: [{ field: 'id', value: id }],
			});
			return parseRow(inserted);
		},

		deleteById: async (id) => {
			if (!database) return false;
			const deleted = await database.deleteMany({
				table: tableName,
				where: [...baseWhere(), { field: 'id', value: id }],
			});
			return deleted > 0;
		},

		deleteByResourceId: async (resourceId) => {
			if (!database) return false;
			const deleted = await database.deleteMany({
				table: tableName,
				where: [...baseWhere(), { field: 'resource_id', value: resourceId }],
			});
			return deleted > 0;
		},

		count: async () => {
			if (!database) return 0;
			return database.count({ table: tableName, where: baseWhere() });
		},
	};
}

// ─────────────────────────────────────────────────────────────────────────────
// Client Builder
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Builds a Corsair client instance with all plugin APIs, services, and webhooks bound.
 * @param plugins - Array of plugin definitions to include in the client
 * @param database - Optional database adapter for ORM services
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
	const pluginServicesUnsafe: Record<string, Record<string, unknown>> = {};

	for (const plugin of plugins) {
		apiUnsafe[plugin.id] = {};
		pluginServicesUnsafe[plugin.id] = {};
	}

	for (const plugin of plugins) {
		const schema = plugin.schema as
			| CorsairPluginSchema<Record<string, ZodTypeAny>>
			| undefined;

		// Create typed service clients from plugin schema, nested under `db`
		if (schema?.services) {
			const dbClients: Record<string, unknown> = {};
			for (const [serviceName, dataSchema] of Object.entries(schema.services)) {
				const serviceClient = createServiceClient(
					scopedDatabase,
					plugin.id,
					serviceName,
					tenantId ?? 'default',
					schema.version,
					dataSchema,
				);
				dbClients[serviceName] = serviceClient;
			}
			pluginServicesUnsafe[plugin.id]!.db = dbClients;
			apiUnsafe[plugin.id]!.db = dbClients;
		}

		// Build plugin context with service clients under `db`
		const ctxForPlugin: Record<string, unknown> = {
			database: scopedDatabase,
			db: pluginServicesUnsafe[plugin.id]?.db ?? {},
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
			bindWebhooksRecursively(
				webhooks,
				webhookHooks,
				ctxForPlugin,
				boundWebhooks,
			);
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
