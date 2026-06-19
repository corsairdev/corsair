import type { CorsairDatabase } from '../db/kysely/database';
import { createCorsairDatabase } from '../db/kysely/database';
import type { HubConfig } from '../hub';
import { normalizeHubConfig } from '../hub';
import { createMissingConfigProxy } from './auth/errors';
import type { CorsairSingleTenantClient, CorsairTenantWrapper } from './client';
import { buildCorsairClient, buildIntegrationKeys } from './client';
import { buildManagementNamespace } from './management';
import { buildPermissionsNamespace } from './permissions';
import type { CorsairIntegration, CorsairPlugin } from './plugins';

// ─────────────────────────────────────────────────────────────────────────────
// Internal access for CLI tooling
// ─────────────────────────────────────────────────────────────────────────────

export const CORSAIR_INTERNAL = Symbol.for('corsair:internal');

export type CorsairInternalConfig = {
	plugins: readonly CorsairPlugin[];
	database: CorsairDatabase | undefined;
	kek: string;
	multiTenancy: boolean;
	approval?: {
		timeout: string;
		onTimeout: 'deny' | 'approve';
		mode?:
			| 'synchronous'
			| 'asynchronous'
			| (() => 'synchronous' | 'asynchronous');
		/** Called when a permission is blocked in async mode. Return the message surfaced to the LLM. */
		formatAsyncMessage?: (opts: {
			token: string;
			id: string;
			plugin: string;
			endpoint: string;
			args: unknown;
		}) => string;
	};
	connect?: {
		baseUrl: string;
		redirectUri: string;
		onAuthMissing?: (opts: {
			plugin: string;
			connectUrl: string;
			state: string;
		}) => string;
	};
	hub?: HubConfig;
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
	const resolvedDatabase = config.database
		? createCorsairDatabase(config.database)
		: undefined;

	// Build integration-level keys if database and kek are configured
	// Otherwise create a proxy that throws helpful errors
	type IntegrationKeysType = ReturnType<typeof buildIntegrationKeys<Plugins>>;

	const integrationKeys: IntegrationKeysType =
		resolvedDatabase && config.kek
			? buildIntegrationKeys(config.plugins, resolvedDatabase, config.kek)
			: createMissingConfigProxy<IntegrationKeysType>(
					!!resolvedDatabase,
					!!config.kek,
				);

	const internalConfig: CorsairInternalConfig = {
		plugins: config.plugins,
		database: resolvedDatabase,
		kek: config.kek,
		multiTenancy: !!config.multiTenancy,
		approval: config.approval,
		connect: config.connect,
		hub: config.hub ? normalizeHubConfig(config.hub) : undefined,
	};

	const permissions = buildPermissionsNamespace(resolvedDatabase);
	const manage = buildManagementNamespace(internalConfig);

	if (config.multiTenancy) {
		return Object.assign(
			{
				withTenant: (tenantId: string) => {
					if (!tenantId) {
						throw new Error(
							'corsair.withTenant(tenantId): tenantId must be a non-empty string',
						);
					}
					const client = buildCorsairClient(config.plugins, {
						database: resolvedDatabase,
						tenantId,
						kek: config.kek,
						rootErrorHandlers: config.errorHandlers,
						approvalConfig: config.approval,
						connectConfig: config.connect,
					});
					return Object.assign(client as object, {
						[CORSAIR_INTERNAL]: internalConfig,
					}) as unknown as typeof client;
				},
				keys: integrationKeys,
				permissions,
				manage,
			},
			{ [CORSAIR_INTERNAL]: internalConfig },
		);
	}

	const client = buildCorsairClient(config.plugins, {
		database: resolvedDatabase,
		tenantId: undefined,
		kek: config.kek,
		rootErrorHandlers: config.errorHandlers,
		approvalConfig: config.approval,
		connectConfig: config.connect,
	});

	return Object.assign({}, client, {
		keys: integrationKeys,
		permissions,
		manage,
		[CORSAIR_INTERNAL]: internalConfig,
	}) as CorsairSingleTenantClient<Plugins>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Re-exports
// ─────────────────────────────────────────────────────────────────────────────

export type { EventLoggingContext } from '../plugins/utils/events';
// Event logging utilities for plugins
export { logEvent, logEventFromContext } from '../plugins/utils/events';
export type {
	AccountFieldNames,
	AccountKeyManagerFor,
	BaseAuthFieldConfig,
	BaseKeyManager,
	IntegrationFieldNames,
	IntegrationKeyManagerFor,
	OAuth2IntegrationCredentials,
	PluginAuthConfig,
	TokenResponse,
} from './auth';
// Auth utilities and types
export {
	AuthMissingError,
	BASE_AUTH_FIELDS,
	createAccountKeyManager,
	createIntegrationKeyManager,
	decryptConfig,
	decryptDEK,
	decryptWithDEK,
	encryptConfig,
	encryptDEK,
	encryptWithDEK,
	exchangeCodeForTokens,
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
// Connect link utilities
export type { ResolveConnectLinkResult } from './connect';
export { resolveConnectLink } from './connect';
// Constants
export type {
	AllProviders,
	AuthTypes,
	BaseProviders,
	PickAuth,
} from './constants';
export { formatProviderDisplayName, ProviderDisplayNames } from './constants';
// Endpoint types
export type {
	BindEndpoints,
	BoundEndpointFn,
	BoundEndpointTree,
	CorsairContext,
	CorsairEndpoint,
	EndpointPathsOf,
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
// Inspection types
export type {
	DocSchemaFieldRow,
	DocSchemaShape,
	DocsApiEndpoint,
	DocsDbEntity,
	DocsDbFilterField,
	DocsWebhook,
	EndpointSchemaResult,
	IntrospectPluginForDocsResult,
	ListOperationsOptions,
	PluginDocsIntrospection,
} from './inspect';
export { formatDocSchemaShape, introspectPluginForDocs } from './inspect';
export type {
	CorsairPermissionsNamespace,
	EnforcePermissionOptions,
	EnforcePermissionResult,
} from './permissions';
// Plugin types
export type {
	BeforeHookResult,
	CorsairIntegration,
	CorsairKeyBuilder,
	CorsairKeyBuilderBase,
	CorsairPlugin,
	CorsairPluginContext,
	EndpointHooks,
	EndpointMetaEntry,
	EndpointRiskLevel,
	KeyBuilderContext,
	OAuthConfig,
	PermissionMode,
	PermissionPolicy,
	PluginEndpointMeta,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
	WebhookHooks,
} from './plugins';
// Utility types
export type { Bivariant, UnionToIntersection } from './utils';
// Webhook types
export type {
	BindWebhooks,
	BoundWebhook,
	BoundWebhookTree,
	CorsairOAuthWebhookTenantLinkResolver,
	CorsairWebhook,
	CorsairWebhookHandler,
	CorsairWebhookMatcher,
	CorsairWebhookTenantMatcher,
	RawWebhookRequest,
	WebhookPathsOf,
	WebhookRequest,
	WebhookResponse,
	WebhookTenantMatch,
	WebhookTree,
} from './webhooks';
export {
	collectPluginWebhookMatchers,
	matchWebhookPlugin,
	matchWebhookPluginAndTenant,
	type PluginWebhookMatchers,
	type WebhookPluginTenantMatch,
} from './webhooks/tenant-match';
export {
	asRecord,
	decodePubSubData,
	extractMicrosoftGraphValidationToken,
	firstString,
	getHeader,
	isMicrosoftGraphValidationHandshake,
	readBodyRecord,
	readQueryParam,
	toExternalId,
} from './webhooks/tenant-match-utils';
