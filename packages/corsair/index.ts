export type {
	CorsairClientOptions,
	CorsairManagementClient,
} from './client';
export { CorsairClientError, createCorsairClient } from './client';
export type { ResolveConnectLinkResult } from './core';
export { AuthMissingError, createCorsair, resolveConnectLink } from './core';
export type {
	ConnectionStatus,
	ConnectLink,
	CorsairManageNamespace,
	CreateConnectLinkInput,
	CreateTenantInput,
	ExpressHandler,
	HonoHandler,
	ManagementHandlerOptions,
	ManagementOk,
	OAuthCallbackInput,
	OAuthCallbackResult,
	PermissionRecord,
	PluginConnectionState,
	PluginInfo,
	ResolvedConnectLink,
	Tenant,
} from './core/management';
export {
	managementHandler,
	toExpressHandler,
	toHonoHandler,
	toNextJsHandler,
} from './core/management';
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
