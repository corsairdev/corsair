import type { CorsairDbAdapter } from '../adapters/types';
import { createMissingConfigProxy } from './auth/errors';
import type { CorsairSingleTenantClient, CorsairTenantWrapper } from './client';
import { buildCorsairClient, buildIntegrationKeys } from './client';
import type { CorsairIntegration, CorsairPlugin } from './plugins';

// ─────────────────────────────────────────────────────────────────────────────
// Internal access for CLI tooling
// ─────────────────────────────────────────────────────────────────────────────

export const CORSAIR_INTERNAL = Symbol.for('corsair:internal');

export type CorsairInternalConfig = {
	plugins: readonly CorsairPlugin[];
	database: CorsairDbAdapter | undefined;
	kek: string;
	multiTenancy: boolean;
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Corsair Factory Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates a Corsair integration with multi-tenancy enabled.
 * Returns a wrapper with a `withTenant()` method to scope operations to specific tenants,
 * and a `keys` property for integration-level key management.
 * @param config - Configuration with plugins, database, and multiTenancy: true
 * @returns A tenant wrapper with `withTenant(tenantId)` method and integration-level `keys`
 */
export function createCorsair<const Plugins extends readonly CorsairPlugin[]>(
	config: CorsairIntegration<Plugins> & { multiTenancy: true },
): CorsairTenantWrapper<Plugins>;

/**
 * Creates a Corsair integration without multi-tenancy.
 * Returns a direct client instance with both plugin APIs and integration-level keys.
 * @param config - Configuration with plugins and optional database
 * @returns A Corsair client instance with plugin APIs and integration-level `keys`
 */
export function createCorsair<const Plugins extends readonly CorsairPlugin[]>(
	config: CorsairIntegration<Plugins> & { multiTenancy?: false | undefined },
): CorsairSingleTenantClient<Plugins>;

/**
 * Main factory function that creates a Corsair integration.
 * Can return either a direct client or a multi-tenant wrapper depending on configuration.
 * @param config - Configuration object with plugins, database, and optional multi-tenancy
 * @returns Either a direct client (with keys) or a tenant wrapper (with keys)
 */
export function createCorsair<const Plugins extends readonly CorsairPlugin[]>(
	config: CorsairIntegration<Plugins>,
): CorsairSingleTenantClient<Plugins> | CorsairTenantWrapper<Plugins> {
	// Build integration-level keys if database and kek are configured
	// Otherwise create a proxy that throws helpful errors
	type IntegrationKeysType = ReturnType<typeof buildIntegrationKeys<Plugins>>;

	const integrationKeys: IntegrationKeysType =
		config.database && config.kek
			? buildIntegrationKeys(config.plugins, config.database, config.kek)
			: createMissingConfigProxy<IntegrationKeysType>(
					!!config.database,
					!!config.kek,
				);

	const internalConfig: CorsairInternalConfig = {
		plugins: config.plugins,
		database: config.database,
		kek: config.kek,
		multiTenancy: !!config.multiTenancy,
	};

	if (config.multiTenancy) {
		return Object.assign(
			{
				withTenant: (tenantId: string) => {
					if (!tenantId) {
						throw new Error(
							'corsair.withTenant(tenantId): tenantId must be a non-empty string',
						);
					}
					return buildCorsairClient(config.plugins, {
						database: config.database,
						tenantId,
						kek: config.kek,
						rootErrorHandlers: config.errorHandlers,
					});
				},
				keys: integrationKeys,
			},
			{ [CORSAIR_INTERNAL]: internalConfig },
		);
	}

	const client = buildCorsairClient(config.plugins, {
		database: config.database,
		tenantId: undefined,
		kek: config.kek,
		rootErrorHandlers: config.errorHandlers,
	});

	return Object.assign({}, client, {
		keys: integrationKeys,
		[CORSAIR_INTERNAL]: internalConfig,
	}) as CorsairSingleTenantClient<Plugins>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Re-exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	AccountConfigFor,
	AccountConfigMap,
	AccountKeyManagerFor,
	AccountKeyManagerMap,
	ApiKeyAccountConfig,
	ApiKeyAccountKeyManager,
	ApiKeyIntegrationConfig,
	ApiKeyIntegrationKeyManager,
	BaseKeyManager,
	BotTokenAccountConfig,
	BotTokenAccountKeyManager,
	BotTokenIntegrationConfig,
	BotTokenIntegrationKeyManager,
	IntegrationConfigFor,
	IntegrationConfigMap,
	IntegrationKeyManagerFor,
	IntegrationKeyManagerMap,
	OAuth2AccountConfig,
	OAuth2AccountKeyManager,
	OAuth2IntegrationConfig,
	OAuth2IntegrationKeyManager,
} from './auth';
// Auth utilities and types
export {
	createAccountKeyManager,
	createIntegrationKeyManager,
	decryptConfig,
	decryptDEK,
	decryptWithDEK,
	encryptConfig,
	encryptDEK,
	encryptWithDEK,
	generateDEK,
	initializeAccountDEK,
	initializeIntegrationDEK,
	reEncryptConfig,
} from './auth';
// Core types
export type {
	CorsairClient,
	CorsairSingleTenantClient,
	CorsairTenantWrapper,
} from './client';
// Constants
export type { AllProviders, AuthTypes, BaseProviders } from './constants';

// Endpoint types
export type {
	BindEndpoints,
	BoundEndpointFn,
	BoundEndpointTree,
	CorsairContext,
	CorsairEndpoint,
	EndpointTree,
} from './endpoints';
// Error handling types
export type {
	CorsairErrorHandler,
	ErrorContext,
	ErrorHandler,
	ErrorHandlerAndMatchFunction,
	ErrorMatcher,
	RetryStrategies,
	RetryStrategy,
} from './errors';
// Plugin types
export type {
	BeforeHookResult,
	CorsairIntegration,
	CorsairKeyBuilder,
	CorsairKeyBuilderBase,
	CorsairPlugin,
	CorsairPluginContext,
	EndpointHooks,
	KeyBuilderContext,
	WebhookHooks,
} from './plugins';

// Utility types
export type { Bivariant, UnionToIntersection } from './utils';
// Webhook types
export type {
	BindWebhooks,
	BoundWebhook,
	BoundWebhookTree,
	CorsairWebhook,
	CorsairWebhookHandler,
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
	WebhookResponse,
	WebhookTree,
} from './webhooks';
