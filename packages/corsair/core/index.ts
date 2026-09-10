import type { CorsairDatabase } from '../db/kysely/database';
import { createCorsairDatabase } from '../db/kysely/database';
import type { HubConfig } from '../hub';
import { resolveHubConfigInput } from '../hub';
import {
	CORSAIR_TUNNEL_PATH,
	CORSAIR_TUNNEL_ZONE,
} from '../hub/tunnel/constants';
import { createMissingConfigProxy } from './auth/errors';
import type { CorsairSingleTenantClient, CorsairTenantWrapper } from './client';
import { buildCorsairClient, buildIntegrationKeys } from './client';
import { resolveRootPermissionsConfig } from './config/resolve-root-permissions';
import { buildManagementNamespace } from './management';
import { buildPermissionsNamespace } from './permissions';
import type {
	CorsairIntegration,
	CorsairManualConfig,
	CorsairPermissionsOptions,
	CorsairPlugin,
} from './plugins';

// ─────────────────────────────────────────────────────────────────────────────
// Internal access for CLI tooling
// ─────────────────────────────────────────────────────────────────────────────

export const CORSAIR_INTERNAL = Symbol.for('corsair:internal');

export type CorsairInternalConfig = {
	plugins: readonly CorsairPlugin[];
	database: CorsairDatabase | undefined;
	kek: string;
	multiTenancy: boolean;
	permissions?: CorsairPermissionsOptions;
	manual?: CorsairManualConfig;
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

	const kek = config.kek;

	// Build integration-level keys when database + KEK are configured;
	// otherwise a proxy throws a clear error on first key access.
	type IntegrationKeysType = ReturnType<typeof buildIntegrationKeys<Plugins>>;

	const integrationKeys: IntegrationKeysType =
		resolvedDatabase && kek
			? buildIntegrationKeys(config.plugins, resolvedDatabase, kek)
			: createMissingConfigProxy<IntegrationKeysType>(
					!!resolvedDatabase,
					!!kek,
				);

	const rootPermissions = resolveRootPermissionsConfig(config);

	const internalConfig: CorsairInternalConfig = {
		plugins: config.plugins,
		database: resolvedDatabase,
		kek,
		multiTenancy: !!config.multiTenancy,
		permissions: rootPermissions,
		manual: config.manual,
		hub: config.hub ? resolveHubConfigInput(config.hub) : undefined,
	};

	const permissions = buildPermissionsNamespace(resolvedDatabase);
	const manage = buildManagementNamespace(internalConfig);

	if (config.multiTenancy) {
		const tenantWrapper = Object.assign(
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
						kek,
						rootErrorHandlers: config.errorHandlers,
						permissionsOptions: rootPermissions,
						manualConfig: config.manual,
						hubConfig: internalConfig.hub,
						internalConfig,
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
		maybeStartConnectLoop(tenantWrapper, internalConfig.hub);
		maybeStartTunnel(tenantWrapper, internalConfig.hub);
		return tenantWrapper;
	}

	const client = buildCorsairClient(config.plugins, {
		database: resolvedDatabase,
		tenantId: undefined,
		kek,
		rootErrorHandlers: config.errorHandlers,
		permissionsOptions: rootPermissions,
		manualConfig: config.manual,
		hubConfig: internalConfig.hub,
		internalConfig,
	});

	const singleTenant = Object.assign({}, client, {
		keys: integrationKeys,
		permissions,
		manage,
		[CORSAIR_INTERNAL]: internalConfig,
	}) as CorsairSingleTenantClient<Plugins>;
	maybeStartConnectLoop(singleTenant, internalConfig.hub);
	maybeStartTunnel(singleTenant, internalConfig.hub);
	return singleTenant;
}

function maybeStartConnectLoop(
	instance: unknown,
	hub: HubConfig | undefined,
): void {
	// Only dev keys use connect; prod is out of scope. Delegate the execution-flag
	// decision to startConnectLoop (the single owner of the "flag is off" warning) —
	// short-circuiting on the flag here would swallow that warning silently.
	if (!hub?.projectApiKey?.startsWith('ck_dev_')) {
		return;
	}
	void import('../hub/connect/loop')
		.then((m) => m.startConnectLoop(instance))
		.catch(() => {});
}

export function shouldStartTunnel(hub: HubConfig | undefined): boolean {
	if (!hub?.projectApiKey?.startsWith('ck_dev_')) return false;
	// A `ck_dev_` key tunnels automatically (like Clerk's `pk_test_`). No config.
	// Opt out with `tunnel: false` or CORSAIR_TUNNEL=0.
	return hub.tunnel !== false && process.env.CORSAIR_TUNNEL !== '0';
}

const activeTunnels: Set<string> = ((
	globalThis as typeof globalThis & {
		__corsairTunnels?: Set<string>;
	}
).__corsairTunnels ??= new Set<string>());

function maybeStartTunnel(
	_instance: unknown,
	hub: HubConfig | undefined,
): void {
	if (!shouldStartTunnel(hub)) return;
	const key = hub!.projectApiKey;
	if (activeTunnels.has(key)) return;
	const port = Number(process.env.PORT);
	if (!Number.isInteger(port) || port < 1 || port > 65535) {
		console.error(
			'[corsair] PORT is not set — dev tunnel skipped. Set PORT to your app port, or run `corsair http <port>`.',
		);
		return;
	}
	activeTunnels.add(key);
	// Everything below is internal Corsair infra, not dev config: the Hub owns
	// the slug and the share host is a constant. `cfg`/env are advanced overrides.
	const cfg = typeof hub!.tunnel === 'object' ? hub!.tunnel : {};
	const shareHost =
		process.env.CORSAIR_FRP_HOST ?? cfg.shareHost ?? CORSAIR_TUNNEL_ZONE;
	void import('../hub/tunnel/run-tunnel')
		.then((m) =>
			m.runTunnel({
				port,
				apiUrl: hub!.apiUrl,
				apiKey: key,
				shareHost,
				onClose: () => activeTunnels.delete(key),
			}),
		)
		.then(({ url }) => {
			console.log(`[corsair] tunnel active: ${url}${CORSAIR_TUNNEL_PATH}`);
		})
		.catch((err: unknown) => {
			activeTunnels.delete(key);
			console.warn(
				`[corsair] tunnel failed to start: ${err instanceof Error ? err.message : String(err)}. Run \`corsair setup\` to enable your dev tunnel.`,
			);
		});
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
	CorsairKekMissingError,
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
	getOAuthAccessToken,
	initializeAccountDEK,
	initializeIntegrationDEK,
	ReconnectRequiredError,
	reEncryptConfig,
} from './auth';
// Agent chats namespace
export type {
	AgentMessageRole,
	AgentReply,
	ChatHandle,
	ChatMessage,
	ChatSummary,
	CorsairChatsNamespace,
	CreateChatResult,
} from './chats';
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
export {
	assertReadonlyAllowed,
	isReadonlyScopeActive,
	PermissionRequiredError,
	ReadonlyForbiddenError,
	runReadonly,
} from './permissions';
// Plugin types
export type {
	BeforeHookResult,
	CorsairIntegration,
	CorsairKeyBuilder,
	CorsairKeyBuilderBase,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairPluginSubscribe,
	CorsairPluginSubscribeResult,
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
// Workflow runs namespace
export type {
	CorsairRunsNamespace,
	WorkflowRun,
	WorkflowRunStatus,
	WorkflowRunStep,
} from './runs';
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
export { googleChannelSubscribe } from './webhooks/google-channel-subscribe';
export {
	MS_GRAPH_API_BASE,
	msGraphSubscribe,
} from './webhooks/ms-graph-subscribe';
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
// Workflows namespace
export type {
	CorsairWorkflowsNamespace,
	TriggerRunResult,
	WorkflowStatus,
	WorkflowSummary,
} from './workflows';
