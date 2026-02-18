import type { ZodTypeAny } from 'zod';
import type { CorsairDatabase } from '../../db/kysely/database';
import { createKyselyEntityClient } from '../../db/kysely/orm';
import type {
	CorsairPluginSchema,
	PluginEntityClient,
	PluginEntityClients,
} from '../../db/orm';
import {
	createAccountKeyManager,
	createIntegrationKeyManager,
} from '../auth/key-manager';
import type {
	AccountKeyManagerFor,
	IntegrationKeyManagerFor,
	PluginAuthConfig,
} from '../auth/types';
import type { AuthTypes } from '../constants';
import type { BindEndpoints, EndpointTree } from '../endpoints';
import { bindEndpointsRecursively } from '../endpoints/bind';
import type { CorsairErrorHandler } from '../errors';
import type { CorsairKeyBuilderBase, CorsairPlugin } from '../plugins';
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
 * Extracts the authType from plugin options.
 * @template Options - The plugin options type
 * @template DefaultAuthType - Optional default auth type to use when authType is optional or not present
 *
 * Priority:
 * 1. If authType is a specific single AuthType (not a union), use that
 * 2. If DefaultAuthType parameter is provided, use that as the fallback
 * 3. Otherwise use the non-nullable union from authType
 * 4. If authType is not in Options at all, fall back to DefaultAuthType
 */
export type ExtractAuthType<
	Options,
	DefaultAuthType extends AuthTypes | undefined = undefined,
> = 'authType' extends keyof Options
	? // Check if authType is a specific single auth type (narrowed, not a union)
		Options['authType'] extends AuthTypes
		? // authType is narrowed to a specific type - use it
			Options['authType']
		: // authType is optional or a union - use DefaultAuthType if provided
			DefaultAuthType extends AuthTypes
			? DefaultAuthType
			: NonNullable<Options['authType']> extends AuthTypes
				? NonNullable<Options['authType']>
				: never
	: // authType is not in Options - fall back to DefaultAuthType
		DefaultAuthType extends AuthTypes
		? DefaultAuthType
		: never;

/**
 * Extracts Options type from plugin's options property.
 */
type InferPluginOptions<P> = P extends { options?: infer O } ? O : never;

/**
 * Extracts DefaultAuthType from plugin's __defaultAuthType property.
 * Uses NonNullable<D> because the __defaultAuthType property is optional,
 * which causes TypeScript to infer D as `AuthType | undefined`.
 */
type InferDefaultAuthType<P> = P extends { __defaultAuthType?: infer D }
	? NonNullable<D> extends AuthTypes
		? NonNullable<D>
		: undefined
	: undefined;

/**
 * Extracts the AuthConfig from a plugin's authConfig property.
 */
type InferAuthConfig<P> = P extends { authConfig?: infer C }
	? C extends PluginAuthConfig
		? C
		: undefined
	: undefined;

/**
 * Infers the complete namespace for a single plugin, including API endpoints,
 * database entities, webhooks, and account-level keys.
 */
type InferPluginNamespace<P extends CorsairPlugin> = P extends CorsairPlugin<
	infer Id,
	infer Schema,
	infer Endpoints,
	infer Webhooks
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
					: {}) &
				// Account-level keys (per-tenant secrets like bot_token, api_key, access_token)
				(ExtractAuthType<
					InferPluginOptions<P>,
					InferDefaultAuthType<P>
				> extends AuthTypes
					? {
							keys: AccountKeyManagerFor<
								ExtractAuthType<InferPluginOptions<P>, InferDefaultAuthType<P>>,
								InferAuthConfig<P>
							>;
						}
					: {});
		}
	: never;

/**
 * Infers the integration-level key manager for a single plugin.
 */
type InferIntegrationKeys<P extends CorsairPlugin> = P extends CorsairPlugin<
	infer Id
>
	? ExtractAuthType<
			InferPluginOptions<P>,
			InferDefaultAuthType<P>
		> extends AuthTypes
		? {
				[K in Id]: IntegrationKeyManagerFor<
					ExtractAuthType<InferPluginOptions<P>, InferDefaultAuthType<P>>,
					InferAuthConfig<P>
				>;
			}
		: never
	: never;

/**
 * Combines all integration-level keys into a single interface.
 */
type InferAllIntegrationKeys<Plugins extends readonly CorsairPlugin[]> =
	UnionToIntersection<InferIntegrationKeys<Plugins[number]>>;

/**
 * Combines all plugin namespaces into a single client interface.
 */
type InferPluginNamespaces<Plugins extends readonly CorsairPlugin[]> =
	UnionToIntersection<InferPluginNamespace<Plugins[number]>>;

/**
 * The main Corsair client type that provides access to all plugin APIs, entities, webhooks, and keys.
 */
export type CorsairClient<Plugins extends readonly CorsairPlugin[]> =
	InferPluginNamespaces<Plugins>;

/**
 * Multi-tenant wrapper that provides a `withTenant` method to scope operations to a specific tenant.
 * Also includes integration-level `keys` for managing shared secrets (OAuth2 client credentials, etc.)
 */
export type CorsairTenantWrapper<Plugins extends readonly CorsairPlugin[]> = {
	withTenant: (tenantId: string) => CorsairClient<Plugins>;
	/**
	 * Integration-level key managers for each plugin.
	 * Used to manage secrets shared across all tenants (e.g., OAuth2 client_id, client_secret).
	 */
	keys: InferAllIntegrationKeys<Plugins>;
};

/**
 * Single-tenant client that includes both plugin APIs and integration-level keys.
 */
export type CorsairSingleTenantClient<
	Plugins extends readonly CorsairPlugin[],
> = CorsairClient<Plugins> & {
	/**
	 * Integration-level key managers for each plugin.
	 * Used to manage secrets shared across all tenants (e.g., OAuth2 client_id, client_secret).
	 */
	keys: InferAllIntegrationKeys<Plugins>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Account ID Resolver
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates a cached account ID resolver for a specific tenant and integration.
 * The account ID is lazily fetched on first access and cached for subsequent calls.
 */
function createAccountIdResolver(
	database: CorsairDatabase | undefined,
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

		// Find the account for this tenant and integration
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
	};
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
	database: CorsairDatabase | undefined,
	getAccountId: () => Promise<string>,
	entityTypeName: string,
	version: string,
	dataSchema: ZodTypeAny,
): PluginEntityClient<ZodTypeAny> {
	if (database) {
		return createKyselyEntityClient(
			database.db,
			getAccountId,
			entityTypeName,
			version,
			dataSchema,
		);
	}

	return {
		findByEntityId: async () => null,
		findById: async () => null,
		findManyByEntityIds: async () => [],
		list: async () => [],
		search: async () => [],
		upsertByEntityId: async () => {
			throw new Error('Database not configured');
		},
		deleteById: async () => false,
		deleteByEntityId: async () => false,
		count: async () => 0,
	};
}

// ─────────────────────────────────────────────────────────────────────────────
// Client Builder Options
// ─────────────────────────────────────────────────────────────────────────────

export type BuildCorsairClientOptions = {
	database: CorsairDatabase | undefined;
	tenantId: string | undefined;
	kek: string | undefined;
	rootErrorHandlers?: CorsairErrorHandler;
};

// ─────────────────────────────────────────────────────────────────────────────
// Client Builder
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Builds a Corsair client instance with all plugin APIs, entities, webhooks, and account-level keys bound.
 * @param plugins - Array of plugin definitions to include in the client
 * @param options - Client build options including database, tenantId, and kek
 * @returns A fully configured Corsair client with account-level keys
 */
export function buildCorsairClient<
	const Plugins extends readonly CorsairPlugin[],
>(
	plugins: Plugins,
	options: BuildCorsairClientOptions,
): CorsairClient<Plugins> {
	const { database, tenantId, kek, rootErrorHandlers } = options;

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
			database,
			plugin.id,
			effectiveTenantId,
		);

		// Create typed entity clients from plugin schema, nested under `db`
		if (schema?.entities) {
			const dbClients: Record<string, unknown> = {};
			for (const [entityTypeName, dataSchema] of Object.entries(
				schema.entities,
			)) {
				const entityClient = database
					? createKyselyEntityClient(
							database.db,
							getAccountId,
							entityTypeName,
							schema.version,
							dataSchema,
						)
					: createEntityClient(
							undefined,
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

		// Create account-level key manager BEFORE binding endpoints so keyBuilder can access it
		const pluginOptions = plugin.options as
			| { authType?: AuthTypes }
			| undefined;
		const authConfig = plugin.authConfig as PluginAuthConfig | undefined;
		let accountKeyManager: AccountKeyManagerFor<AuthTypes> | undefined;
		if (database && kek && pluginOptions?.authType) {
			// Extract extra account fields from plugin authConfig
			const extraAccountFields =
				authConfig?.[pluginOptions.authType]?.account ?? [];

			accountKeyManager = createAccountKeyManager({
				authType: pluginOptions.authType,
				integrationName: plugin.id,
				tenantId: effectiveTenantId,
				kek,
				database,
				extraAccountFields,
			});
			apiUnsafe[plugin.id]!.keys = accountKeyManager;
		}

		// Build plugin context with entity clients under `db`, account ID resolver, and keys manager
		const ctxForPlugin: Record<string, unknown> = {
			database,
			db: pluginEntitiesUnsafe[plugin.id]?.db ?? {},
			$getAccountId: getAccountId,
			...(plugin.options ? { options: plugin.options } : {}),
			// Include keys manager and authType in context so keyBuilder can access and narrow types
			...(accountKeyManager
				? { keys: accountKeyManager, authType: pluginOptions?.authType }
				: {}),
			// Include tenantId in context so it's available in webhook hooks
			...(tenantId ? { tenantId } : {}),
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
			keyBuilder: plugin.keyBuilder as CorsairKeyBuilderBase | undefined,
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
				keyBuilder: plugin.keyBuilder as CorsairKeyBuilderBase | undefined,
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

// ─────────────────────────────────────────────────────────────────────────────
// Integration Keys Builder
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Builds integration-level key managers for all plugins.
 * These manage secrets shared across all tenants (OAuth2 client credentials, etc.)
 * @param plugins - Array of plugin definitions
 * @param database - Database adapter for storage
 * @param kek - Key Encryption Key for envelope encryption
 * @returns An object with key managers for each plugin
 */
export function buildIntegrationKeys<
	const Plugins extends readonly CorsairPlugin[],
>(
	plugins: Plugins,
	database: CorsairDatabase,
	kek: string,
): InferAllIntegrationKeys<Plugins> {
	const keysUnsafe: Record<string, unknown> = {};

	for (const plugin of plugins) {
		const pluginOptions = plugin.options as
			| { authType?: AuthTypes }
			| undefined;
		const authConfig = plugin.authConfig as PluginAuthConfig | undefined;
		if (pluginOptions?.authType) {
			// Extract extra integration fields from plugin authConfig
			const extraIntegrationFields =
				authConfig?.[pluginOptions.authType]?.integration ?? [];

			const integrationKeyManager = createIntegrationKeyManager({
				authType: pluginOptions.authType,
				integrationName: plugin.id,
				kek,
				database,
				extraIntegrationFields,
			});
			keysUnsafe[plugin.id] = integrationKeyManager;
		}
	}

	return keysUnsafe as InferAllIntegrationKeys<Plugins>;
}
