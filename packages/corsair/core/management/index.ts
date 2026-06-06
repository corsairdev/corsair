import type { CorsairInternalConfig } from '..';
import {
	createTenant,
	getConnectionStatus,
	getPermission,
	getPermissionByToken,
	getPlugin,
	getTenant,
	listPlugins,
	listTenants,
	ok,
} from './operations';
import type {
	ConnectionStatus,
	CreateTenantInput,
	ManagementOk,
	PermissionRecord,
	PluginInfo,
	Tenant,
} from './types';

// ─────────────────────────────────────────────────────────────────────────────
// `corsair.manage` namespace — in-process equivalent of the HTTP handler.
// Same logic, no HTTP. Useful for tests and for callers who don't want to
// hop through fetch.
// ─────────────────────────────────────────────────────────────────────────────

export type CorsairManageNamespace = {
	ok: () => ManagementOk;
	tenants: {
		list: () => Promise<Tenant[]>;
		create: (input: CreateTenantInput) => Promise<Tenant>;
		get: (id: string) => Promise<Tenant>;
	};
	plugins: {
		list: () => Promise<PluginInfo[]>;
		get: (id: string) => Promise<PluginInfo>;
	};
	connectionStatus: {
		get: (query?: { tenantId?: string }) => Promise<ConnectionStatus>;
	};
	permissions: {
		get: (id: string) => Promise<PermissionRecord>;
		getByToken: (token: string) => Promise<PermissionRecord>;
	};
};

export function buildManagementNamespace(
	internal: CorsairInternalConfig,
): CorsairManageNamespace {
	return {
		ok,
		tenants: {
			list: () => listTenants(internal),
			create: (input) => createTenant(internal, input),
			get: (id) => getTenant(internal, id),
		},
		plugins: {
			list: () => listPlugins(internal),
			get: (id) => getPlugin(internal, id),
		},
		connectionStatus: {
			get: (q) => getConnectionStatus(internal, q?.tenantId),
		},
		permissions: {
			get: (id) => getPermission(internal, id),
			getByToken: (token) => getPermissionByToken(internal, token),
		},
	};
}

export type { ExpressHandler, HonoHandler } from './adapters';
export {
	toExpressHandler,
	toHonoHandler,
	toNextJsHandler,
} from './adapters';
export { managementHandler } from './handler';
export type { ManagementHandlerOptions } from './handler';
export type {
	ConnectionStatus,
	CreateTenantInput,
	ManagementOk,
	PermissionRecord,
	PluginConnectionState,
	PluginInfo,
	Tenant,
} from './types';
