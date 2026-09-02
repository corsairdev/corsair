export type {
	CorsairClientOptions,
	CorsairManagementClient,
} from './client';
export { CorsairClientError, createCorsairClient } from './client';
export type { ResolveConnectLinkResult } from './core';
export {
	AuthMissingError,
	CorsairKekMissingError,
	createCorsair,
	PermissionRequiredError,
	ReadonlyForbiddenError,
	ReconnectRequiredError,
	resolveConnectLink,
	runReadonly,
} from './core';
export type {
	ConnectionStatus,
	ConnectLink,
	CorsairManageNamespace,
	CreateConnectLinkInput,
	CreateTenantInput,
	ExpressHandler,
	FastifyHandler,
	HonoHandler,
	ManagementHandlerOptions,
	ManagementOk,
	NodeHandler,
	NodeLikeRequest,
	NodeLikeResponse,
	OAuthCallbackInput,
	OAuthCallbackResult,
	PermissionLookupInput,
	PermissionRecord,
	PluginConnectionState,
	PluginInfo,
	ResolvedConnectLink,
	Tenant,
} from './core/management';
export {
	DEFAULT_BODY_STALL_TIMEOUT_MS,
	DEFAULT_MAX_BODY_BYTES,
	managementHandler,
	registerCorsairRawBodyParser,
	resolveBodyStallTimeoutMs,
	resolveMaxBodyBytes,
	toAstroHandler,
	toExpressHandler,
	toFastifyHandler,
	toHonoHandler,
	toNextJsHandler,
	toNodeHandler,
	toNuxtHandler,
	toRemixHandler,
	toSvelteKitHandler,
	toTanStackHandler,
	toWebHandler,
} from './core/management';
export type {
	CorsairManualConfig,
	CorsairPermissionsOptions,
} from './core/plugins';
export {
	collectPluginWebhookMatchers,
	matchWebhookPlugin,
	matchWebhookPluginAndTenant,
	type PluginWebhookMatchers,
	type WebhookPluginTenantMatch,
} from './core/webhooks/tenant-match';
export {
	asRecord,
	decodePubSubData,
	firstString,
	getHeader,
	readBodyRecord,
	toExternalId,
} from './core/webhooks/tenant-match-utils';
export {
	type AnyCorsairInstance,
	type FormFieldSchema,
	formatDocSchemaShape,
	getSchema,
	getStructuredSchema,
	type ListOperationsOptions,
	listOperations,
} from './inspect';
export type { PermissionExecuteResult } from './permissions';
export { executePermission } from './permissions';
export { type SetupCorsairOptions, setupCorsair } from './setup/index';
export {
	type OAuthCallbackTunnelPayload,
	type ProcessCorsairOptions,
	type ProcessCorsairRequest,
	processCorsair,
	type TunnelAck,
	type TunnelEnvelope,
	type TunnelType,
	type WebhookTunnelPayload,
} from './tunnel';
export { processWebhook } from './webhooks';
export {
	type ResolveAccountFromWebhookLinkInput,
	resolveAccountFromWebhookLink,
	resolveTenantFromWebhookLink,
	resolveTenantIdFromWebhookLink,
	setWebhookTenantLink,
	type WebhookTenantLink,
} from './webhooks/tenant-links';
