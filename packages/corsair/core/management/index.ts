import type { CorsairInternalConfig } from '..';
import { CORSAIR_INTERNAL } from '..';
import {
	completeOAuthCallback,
	createConnectLink,
	createTenant,
	getConnectionStatus,
	getPermission,
	getPermissionByToken,
	getPlugin,
	getTenant,
	listPlugins,
	listTenants,
	ok,
	resolveConnect,
} from './operations';
import type {
	ConnectionStatus,
	ConnectLink,
	CreateConnectLinkInput,
	CreateTenantInput,
	ManagementOk,
	OAuthCallbackInput,
	OAuthCallbackResult,
	PermissionRecord,
	PluginInfo,
	ResolvedConnectLink,
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
	connect: {
		createLink: (input: CreateConnectLinkInput) => Promise<ConnectLink>;
		resolve: (state: string) => Promise<ResolvedConnectLink>;
		oauthCallback: (input: OAuthCallbackInput) => Promise<OAuthCallbackResult>;
	};
};

export function buildManagementNamespace(
	internal: CorsairInternalConfig,
): CorsairManageNamespace {
	// Underlying oauth utilities read the internal config via the CORSAIR_INTERNAL
	// symbol on the corsair instance. A symbol-bearing shim is enough — the
	// utilities only look at that one key.
	const corsairShim: unknown = { [CORSAIR_INTERNAL]: internal };

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
		connect: {
			createLink: (input) => createConnectLink(internal, input),
			resolve: (state) => resolveConnect(corsairShim, internal, state),
			oauthCallback: (input) =>
				completeOAuthCallback(corsairShim, internal, input),
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
	ConnectLink,
	CreateConnectLinkInput,
	CreateTenantInput,
	ManagementOk,
	OAuthCallbackInput,
	OAuthCallbackResult,
	PermissionRecord,
	PluginConnectionState,
	PluginInfo,
	ResolvedConnectLink,
	Tenant,
} from './types';
