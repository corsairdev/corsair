/**
 * Corsair Hub client — integrates a Corsair instance with the remote Corsair Hub
 * (auth.corsair.dev or self-hosted).
 *
 * ## Delivery transports
 *
 * Development and production are separate environments with distinct API keys:
 *
 * - **Development (`ck_dev_`)** — browser delivery (GET `?d=<token>`). The SDK
 *   auto-detects your localhost delivery URL.
 * - **Production (`ck_prod_`)** — server delivery (POST, HMAC-signed envelope) to
 *   the delivery URL registered in the hub dashboard.
 *
 * ## Connect flow
 *
 * `createHubConnectSession` introspects configured plugins, POSTs a manifest to the hub,
 * and returns a connect URL for the hosted onboarding UI.
 *
 * ## Framework helpers
 *
 * `createHubRouteHandlers(corsair)` is optional when using `toNextJsHandler` — hub
 * delivery at the base path is handled automatically. Use it only for custom
 * routing or non-Next.js setups that mount delivery separately.
 */
export { formatProviderDisplayName } from '../core/constants';
export {
	DEFAULT_HUB_API_URL,
	getHubConfig,
	HubNotConfiguredError,
	inferHubEnvironmentSlug,
	normalizeHubConfig,
	resolveHubOAuthCallbackUrl,
} from './config';
export { createHubConnectSession } from './connect';
export {
	type ConnectAuthFieldStatus,
	type ConnectAuthStatusLevel,
	type ConnectStatusPluginEntry,
	type ConnectStatusResponse,
	getConnectStatusForTenant,
} from './connect-status';
export { listHubProjectConnections } from './connections';
export {
	type ConnectAuthKind,
	type ConnectPluginManifestEntry,
	parseConnectSessionResponse,
	parseConnectStatusResponse,
	parseHubApiErrorBody,
	parseOAuthRefreshResponse,
	parsePermissionSessionResponse,
	parseProjectConnectionsResponse,
} from './contracts/connect-api';
export {
	isLoopbackUrl,
	resolveDeliveryTransport,
	usesBrowserDelivery,
	validateProductionDeliveryUrl,
} from './contracts/environment';
export {
	type BrowserDeliveryMode,
	SIGNED_TUNNEL_REPLAY_WINDOW_MS,
} from './contracts/tunnel';
export {
	type HubDeliveryRequest,
	type HubDeliveryResult,
	handleHubDeliveryGet,
	handleHubDeliveryPost,
	handleHubDeliveryRequest,
	hubDeliveryToResponse,
	respondToHubDelivery,
	respondToHubDeliveryFromRequest,
} from './delivery';
export {
	IntegrationCredentialsDeliveryError,
	processIntegrationCredentialsDelivery,
} from './integration-credentials-delivery';
export {
	attachManagedRefreshAuth,
	getManagedAccessToken,
	type ManagedAccessTokenResult,
	type ManagedAuthContext,
} from './managed-auth';
export {
	ManagedOAuthDeliveryError,
	type ProcessManagedOAuthDeliveryOptions,
	type ProcessManagedOAuthDeliveryResult,
	processManagedOAuthDelivery,
} from './managed-oauth';
export {
	createHubPermissionSession,
	formatHubApprovalMessage,
} from './permission';
export type { ReportConnectionStatusInput } from './report-connection-status';
export {
	reportConnectionStatus,
	reportConnectionStatusForHub,
	reportPluginConnectionAuthMissing,
	reportPluginConnectionStatus,
	reportPluginConnectionStatusFromBinding,
	reportPluginConnectionVerified,
} from './report-connection-status';
export { resolveHubDeliveryUrl } from './resolve-delivery-url';
export { createHubRouteHandlers } from './route-handlers';
export {
	BROWSER_DELIVERY_TTL_MS,
	type BrowserDeliveryPayload,
	buildBrowserDeliveryRedirectUrl,
	type ConnectSessionTokenPayload,
	type ConnectTokenPayload,
	createConnectSessionJti,
	createConnectTokenJti,
	createPermissionSessionJti,
	createSignedTokenJti,
	decodeConnectSessionTokenFromPath,
	decodeConnectTokenFromPath,
	decodePermissionTokenFromPath,
	deliverSignedEnvelope,
	type ExpiringTokenPayload,
	encodeConnectTokenForPath,
	formatServerDeliveryError,
	getConnectSessionExpiryMs,
	getConnectTokenExpiryMs,
	isServerDeliveryAckSuccessful,
	type PermissionTokenPayload,
	parseServerDeliveryAckBody,
	type ServerDeliveryAckBody,
	type SignedDeliveryHeaders,
	type SignedEnvelopeDeliveryResult,
	signBrowserDeliveryToken,
	signConnectSessionToken,
	signConnectToken,
	signDeliveryEnvelope,
	signPermissionToken,
	verifyBrowserDeliveryToken,
	verifyConnectSessionToken,
	verifyConnectToken,
	verifyDeliveryEnvelope,
	verifyPermissionToken,
	verifySignedToken,
	verifySignedTunnelDelivery,
} from './signing';
export type {
	CreateConnectSessionRequestBody,
	CreatePermissionSessionRequestBody,
	DeliveryTransport,
	HubConfig,
	HubConfigInput,
	HubConnectSessionInput,
	HubConnectSessionResult,
	HubEnvironmentSlug,
	HubListProjectConnectionsInput,
	HubOAuthMode,
	HubOAuthRefreshResponse,
	HubPermissionSessionInput,
	HubPermissionSessionResult,
	HubProjectConnection,
	TunnelEnvelope,
	TunnelType,
} from './types';
