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

export type PermissionRecord = CorsairPermission & {
	/** Resolved review URL for pending/approved records. Null when not actionable or not configured. */
	approvalUrl: string | null;
};

export type PermissionLookupInput = { id: string } | { token: string };

// ── connect / OAuth ────────────────────────────────────────────────────────

export type CreateConnectLinkInput = {
	/** Required in manual mode. Optional in hub mode (omit to connect all plugins). */
	plugin?: string;
	tenantId?: string;
	/** Hub mode only — BYO uses your OAuth app; managed uses Corsair's. */
	oauthMode?: 'byo' | 'managed';
	/** Hub mode only — override the provider display name. */
	providerName?: string;
};

export type ConnectLink = {
	connectUrl: string;
	expiresAt?: string;
};

export type ResolvedConnectLink = {
	plugin: string;
	tenantId: string;
	providerName: string;
	oauthUrl: string;
	state: string;
};

export type OAuthCallbackInput = {
	code: string;
	state: string;
};

export type OAuthCallbackResult = {
	plugin: string;
	tenantId: string;
};
