/**
 * Corsair Hub client — integrates a Corsair instance with the remote Corsair Hub
 * (auth.corsair.dev or self-hosted).
 *
 * ## Delivery transports
 *
 * The app's `deliveryUrl` (e.g. `/api/corsair`) receives hub payloads two ways:
 *
 * - **Browser delivery (GET `?d=<token>`)** — used for local dev and `source: "client"`.
 *   The hub redirects the user's browser with a signed token; OAuth codes/tokens and
 *   permission decisions are applied, then the user is redirected to the hub success page.
 *
 * - **Server delivery (POST, HMAC-signed envelope)** — used in production with a public
 *   `deliveryUrl`. The hub POSTs signed JSON (`oauth.callback`, `oauth.tokens`,
 *   `webhook`, `permission.approve|deny`, `auth.credentials`) to the app.
 *
 * ## Connect flow
 *
 * `createHubConnectSession` introspects configured plugins, POSTs a manifest to the hub,
 * and returns a connect URL for the hosted onboarding UI.
 *
 * ## Framework helpers
 *
 * `createHubRouteHandlers(corsair)` returns `{ delivery, createConnectSession }` for
 * Next.js App Router route exports.
 */
export { formatProviderDisplayName } from '../core/constants';
export {
	DEFAULT_HUB_API_URL,
	getHubConfig,
	HubNotConfiguredError,
	normalizeHubConfig,
	resolveHubOAuthCallbackUrl,
} from './config';
export { createHubConnectSession } from './connect';
export {
	type HubConnectSessionParseError,
	type HubConnectSessionRequestBody,
	type HubConnectSessionResponseOptions,
	type HubConnectSessionSuccessBody,
	handleHubConnectSessionRequest,
	parseHubConnectSessionBody,
	parseHubConnectSessionSearchParams,
	type ResolveHubConnectTenantId,
	respondToHubConnectSession,
	respondToHubConnectSessionFromRequest,
} from './connect-response';
export {
	isLoopbackDeliveryUrl,
	resolveConnectSourceFromDeliveryUrl,
	shouldUseBrowserConnectDelivery,
	validateExplicitConnectSource,
} from './contracts/delivery-mode';
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
export {
	createHubRouteHandlers,
	type HubRouteHandlersOptions,
} from './route-handlers';
export type {
	ConnectAuthKind,
	ConnectPluginManifestEntry,
	ConnectSourceValidationError,
	CreateConnectSessionRequestBody,
	CreatePermissionSessionRequestBody,
	HubConfig,
	HubConfigInput,
	HubConnectSessionInput,
	HubConnectSessionResult,
	HubConnectSource,
	HubOAuthMode,
	HubOAuthRefreshResponse,
	HubPermissionSessionInput,
	HubPermissionSessionResult,
	TunnelEnvelope,
	TunnelType,
} from './types';
