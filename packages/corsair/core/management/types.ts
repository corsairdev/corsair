import type { CorsairPermission } from '../../db';
import type { AuthTypes } from '../constants';

// ─────────────────────────────────────────────────────────────────────────────
// Response shapes for the management control plane
// ─────────────────────────────────────────────────────────────────────────────

export type Tenant = {
	id: string;
	accounts: Array<{
		integrationName: string;
		hasCredentials: boolean;
	}>;
	connectedPlugins: string[];
};

export type CreateTenantInput = {
	id: string;
};

export type PluginInfo = {
	id: string;
	authType: AuthTypes | null;
	configured: boolean;
	missingFields: string[];
	oauth: {
		providerName: string;
		scopes: string[];
		requiresRegisteredRedirect: boolean;
	} | null;
};

export type PluginConnectionState =
	| 'connected'
	| 'missing_credentials'
	| 'not_connected';

export type ConnectionStatus = Record<string, PluginConnectionState>;

export type ManagementOk = { ok: true };

export type PermissionRecord = CorsairPermission;
