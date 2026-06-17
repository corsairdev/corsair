import * as querystring from 'node:querystring';
import type {
	CorsairInternalConfig,
	CorsairPlugin,
	OAuthConfig,
} from '../core';
import {
	CORSAIR_INTERNAL,
	createAccountKeyManager,
	createIntegrationKeyManager,
	encryptDEK,
	exchangeCodeForTokens,
	generateDEK,
} from '../core';
import {
	encodeOAuthState,
	signState,
	verifyAndDecodeState,
} from '../core/auth/state';
import { createCorsairOrm } from '../db/orm';
import { resolveOAuthWebhookTenantLink } from '../webhooks/resolve-oauth-tenant-link';
import { setWebhookTenantLink } from '../webhooks/tenant-links';

// Re-export state utilities for backward compatibility (barrel oauth.ts re-exports these)
export { decodeOAuthState, encodeOAuthState } from '../core/auth/state';

// ─────────────────────────────────────────────────────────────────────────────
// Structured errors
//
// Callers (e.g. the management handler) need to map specific failure modes to
// distinct HTTP responses. Matching on free-form `error.message` strings is
// brittle; the `code` field is the contract — `message` is for humans.
// ─────────────────────────────────────────────────────────────────────────────

export type OAuthCallbackErrorCode =
	| 'invalid_corsair_instance'
	| 'no_database'
	| 'invalid_state'
	| 'plugin_not_found'
	| 'plugin_has_no_oauth_config'
	| 'credentials_not_configured'
	| 'no_access_token';

export class OAuthCallbackError extends Error {
	readonly code: OAuthCallbackErrorCode;

	constructor(code: OAuthCallbackErrorCode, message: string) {
		super(message);
		this.name = 'OAuthCallbackError';
		this.code = code;
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

function getInternal(corsair: unknown): CorsairInternalConfig {
	const internal = (corsair as Record<symbol, unknown>)[CORSAIR_INTERNAL] as
		| CorsairInternalConfig
		| undefined;
	if (!internal) {
		throw new OAuthCallbackError(
			'invalid_corsair_instance',
			'Invalid corsair instance',
		);
	}
	return internal;
}

function findPlugin(
	internal: CorsairInternalConfig,
	pluginId: string,
): CorsairPlugin {
	const plugin = internal.plugins.find((p) => p.id === pluginId);
	if (!plugin) {
		throw new OAuthCallbackError(
			'plugin_not_found',
			`Plugin '${pluginId}' not found`,
		);
	}
	return plugin;
}

function getOAuthConfig(plugin: CorsairPlugin): OAuthConfig {
	const cfg = (plugin as { oauthConfig?: OAuthConfig }).oauthConfig;
	if (!cfg) {
		throw new OAuthCallbackError(
			'plugin_has_no_oauth_config',
			`Plugin '${plugin.id}' has no oauthConfig`,
		);
	}
	return cfg;
}

async function ensureAccount(
	database: NonNullable<CorsairInternalConfig['database']>,
	pluginId: string,
	tenantId: string,
	kek: string,
): Promise<void> {
	const orm = createCorsairOrm(database);

	const integration = await orm.integrations.findByName(pluginId);
	if (!integration) {
		throw new Error(
			`Integration '${pluginId}' not found. Run setupCorsair first.`,
		);
	}

	const existing = await orm.accounts.findOne({
		tenant_id: tenantId,
		integration_id: integration.id,
	});
	if (existing) return;

	const dek = generateDEK();
	const encryptedDek = await encryptDEK(dek, kek);
	await orm.accounts.create({
		tenant_id: tenantId,
		integration_id: integration.id,
		config: {},
		dek: encryptedDek,
	});
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

export type GenerateOAuthUrlOptions = {
	tenantId: string;
	redirectUri: string;
};

export type GenerateOAuthUrlResult = {
	url: string;
	state: string;
};

/**
 * Builds an OAuth authorization URL for the given plugin and tenant.
 *
 * Embed the returned `url` in a button or link for the customer to click.
 * The returned `state` is HMAC-signed — pass it to processOAuthCallback as-is.
 *
 * Requires the plugin to have an oauthConfig (e.g. googlecalendar, gmail,
 * notion, spotify). Plugins like slack and linear use API keys, not OAuth.
 * The plugin's client_id and client_secret must be set via `corsair setup`.
 *
 * Works for both multi-tenant and single-tenant corsair instances.
 */
export async function generateOAuthUrl(
	corsair: unknown,
	pluginId: string,
	options: GenerateOAuthUrlOptions,
): Promise<GenerateOAuthUrlResult> {
	const { tenantId, redirectUri } = options;
	const internal = getInternal(corsair);

	if (!internal.database) {
		throw new Error('No database configured on corsair instance');
	}

	const plugin = findPlugin(internal, pluginId);
	const oauthCfg = getOAuthConfig(plugin);

	const integrationKm = createIntegrationKeyManager({
		authType: 'oauth_2',
		integrationName: pluginId,
		kek: internal.kek,
		database: internal.database,
	});

	const clientId = await integrationKm.get_client_id();
	if (!clientId) {
		throw new Error(`client_id not configured for '${pluginId}'`);
	}

	const state = signState(encodeOAuthState(pluginId, tenantId), internal.kek);

	const params: Record<string, string> = {
		...oauthCfg.authParams,
		client_id: clientId,
		redirect_uri: redirectUri,
		response_type: 'code',
		scope: oauthCfg.scopes.join(' '),
		state,
	};

	return {
		url: `${oauthCfg.authUrl}?${querystring.stringify(params)}`,
		state,
	};
}

export type ProcessOAuthCallbackOptions = {
	code: string;
	state: string;
	/** Must exactly match the redirectUri passed to generateOAuthUrl. */
	redirectUri: string;
};

export type ProcessOAuthCallbackResult = {
	plugin: string;
	tenantId: string;
};

/**
 * Completes the OAuth flow by exchanging the authorization code for tokens
 * and storing them encrypted in the database for the tenant.
 *
 * Call this inside your /api/auth route after receiving `code` and `state`
 * from the provider redirect.
 *
 * @throws if state is invalid, credentials are missing, or token exchange fails
 */
export async function processOAuthCallback(
	corsair: unknown,
	options: ProcessOAuthCallbackOptions,
): Promise<ProcessOAuthCallbackResult> {
	const { code, state, redirectUri } = options;

	const internal = getInternal(corsair);

	const decoded = verifyAndDecodeState(state, internal.kek);
	if (!decoded) {
		throw new OAuthCallbackError(
			'invalid_state',
			'Invalid or tampered state parameter',
		);
	}

	const { plugin: pluginId, tenantId } = decoded;

	if (!internal.database) {
		throw new OAuthCallbackError(
			'no_database',
			'No database configured on corsair instance',
		);
	}

	const plugin = findPlugin(internal, pluginId);
	const oauthCfg = getOAuthConfig(plugin);

	const integrationKm = createIntegrationKeyManager({
		authType: 'oauth_2',
		integrationName: pluginId,
		kek: internal.kek,
		database: internal.database,
	});

	const clientId = await integrationKm.get_client_id();
	const clientSecret = await integrationKm.get_client_secret();
	if (!clientId || !clientSecret) {
		throw new OAuthCallbackError(
			'credentials_not_configured',
			`Credentials not configured for '${pluginId}'`,
		);
	}

	// Ensure tenant account row exists before writing tokens
	await ensureAccount(internal.database, pluginId, tenantId, internal.kek);

	const tokens = await exchangeCodeForTokens(
		code,
		clientId,
		clientSecret,
		oauthCfg,
		redirectUri,
	);

	if (!tokens.access_token) {
		throw new OAuthCallbackError(
			'no_access_token',
			`No access_token returned from ${oauthCfg.providerName}`,
		);
	}

	const accountKm = createAccountKeyManager({
		authType: 'oauth_2',
		integrationName: pluginId,
		tenantId,
		kek: internal.kek,
		database: internal.database,
	});

	await accountKm.set_access_token(tokens.access_token);
	if (tokens.refresh_token) {
		await accountKm.set_refresh_token(tokens.refresh_token);
	}
	if (tokens.expires_in) {
		await accountKm.set_expires_at(
			String(Math.floor(Date.now() / 1000) + tokens.expires_in),
		);
	}

	const tenantLink = await resolveOAuthWebhookTenantLink(
		internal.plugins,
		pluginId,
		tokens,
	);
	if (tenantLink) {
		const extraAccountFields = plugin.authConfig?.oauth_2?.account ?? [];
		await setWebhookTenantLink({
			database: internal.database,
			kek: internal.kek,
			pluginId,
			tenantId,
			link: tenantLink,
			authType: 'oauth_2',
			extraAccountFields,
		});
	}

	return { plugin: pluginId, tenantId };
}
