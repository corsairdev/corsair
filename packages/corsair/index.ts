export type {
	CorsairClientOptions,
	CorsairManagementClient,
} from './client';
export { createCorsairClient, CorsairClientError } from './client';
export type { ResolveConnectLinkResult } from './core';
export { AuthMissingError, createCorsair, resolveConnectLink } from './core';
export type {
	ConnectionStatus,
	CorsairManageNamespace,
	CreateTenantInput,
	ManagementHandlerOptions,
	ManagementOk,
	PermissionRecord,
	PluginConnectionState,
	PluginInfo,
	Tenant,
} from './core/management';
export { managementHandler } from './core/management';
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
export { processWebhook } from './webhooks';
