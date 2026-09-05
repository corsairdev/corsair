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

/**
 * Where a single plugin stands for a tenant:
 * - `connected` — a usable credential is stored; calls go through.
 * - `missing_credentials` — the plugin is configured but the tenant hasn't
 *   authorized it (or the stored credential can no longer be used).
 * - `not_connected` — the plugin isn't set up for this tenant at all.
 */
export type PluginConnectionState =
	| 'connected'
	| 'missing_credentials'
	| 'not_connected';

/** Per-plugin connection state for a tenant, keyed by plugin id, e.g.
 * `{ linear: 'connected', slack: 'not_connected' }`. */
export type ConnectionStatus = Record<string, PluginConnectionState>;

/** A live connect-request — the client reads this on-demand to drive the dialog. */
export type ConnectRequest = {
	plugin: string;
	connectUrl: string;
	requestedAt: string;
	/** The tenant the server resolved this request under, so the client can scope. */
	tenantId: string;
};

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
	/** The tenant the link connects, so the client scopes the flow to it. */
	tenantId: string;
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
	// Extra provider query params from the callback URL (e.g. GitHub's
	// installation_id) that aren't in the token body. Needed for correct webhook
	// tenant routing in manual/BYO mode, where no Hub records the link server-side.
	callbackParams?: Record<string, string>;
};

export type OAuthCallbackResult = {
	plugin: string;
	tenantId: string;
};
