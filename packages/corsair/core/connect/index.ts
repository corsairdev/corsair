import * as querystring from 'node:querystring';
import type { CorsairInternalConfig, CorsairPlugin, OAuthConfig } from '..';
import { CORSAIR_INTERNAL, createIntegrationKeyManager } from '..';
import { verifyAndDecodeState } from '../auth/state';

// ─────────────────────────────────────────────────────────────────────────────
// Structured errors
//
// Callers (e.g. the management handler) need to map specific failure modes to
// distinct HTTP responses. Matching on free-form `error.message` strings is
// brittle: a future copy-edit silently changes the classification. The `code`
// field is the contract — `message` is for humans.
// ─────────────────────────────────────────────────────────────────────────────

export type ConnectErrorCode =
	| 'invalid_corsair_instance'
	| 'no_database'
	| 'no_redirect_uri'
	| 'invalid_state'
	| 'plugin_not_found'
	| 'plugin_has_no_oauth_config'
	| 'client_id_not_configured';

export class ConnectError extends Error {
	readonly code: ConnectErrorCode;

	constructor(code: ConnectErrorCode, message: string) {
		super(message);
		this.name = 'ConnectError';
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
		throw new ConnectError(
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
		throw new ConnectError(
			'plugin_not_found',
			`Plugin '${pluginId}' not found`,
		);
	}
	return plugin;
}

function getOAuthConfig(plugin: CorsairPlugin): OAuthConfig {
	const cfg = (plugin as { oauthConfig?: OAuthConfig }).oauthConfig;
	if (!cfg) {
		throw new ConnectError(
			'plugin_has_no_oauth_config',
			`Plugin '${plugin.id}' has no oauthConfig`,
		);
	}
	return cfg;
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

export type ResolveConnectLinkResult = {
	/** Plugin ID extracted from the signed state. */
	plugin: string;
	/** Tenant ID extracted from the signed state. */
	tenantId: string;
	/** Human-readable provider name from the plugin's oauthConfig. */
	providerName: string;
	/** The full OAuth authorization URL. Redirect the user here to start the OAuth flow. */
	oauthUrl: string;
	/** The signed state parameter (pass to processOAuthCallback after redirect). */
	state: string;
};

/**
 * Resolves a connect link request on the consumer's `/connect` page.
 *
 * Call this when your connect page receives a `state` query parameter.
 * It verifies the HMAC-signed state, looks up the plugin's OAuth config,
 * and returns the full OAuth authorization URL so you just have to render
 * a "Connect" button linking to `result.oauthUrl`.
 *
 * Uses the `redirectUri` from `createCorsair({ connect: { redirectUri } })`.
 *
 * @param corsair - The corsair instance
 * @param state - The `state` query parameter from the connect URL
 * @returns Plugin info and the full OAuth authorization URL
 *
 * @example
 * ```ts
 * // On your /connect page handler:
 * const { providerName, oauthUrl } = await resolveConnectLink(corsair, stateQueryParam)
 * // Render a "Connect {providerName}" button linking to oauthUrl
 * // After OAuth redirect, call processOAuthCallback(corsair, { code, state, redirectUri })
 * ```
 */
export async function resolveConnectLink(
	corsair: unknown,
	state: string,
): Promise<ResolveConnectLinkResult> {
	const internal = getInternal(corsair);

	if (!internal.database) {
		throw new ConnectError(
			'no_database',
			'No database configured on corsair instance',
		);
	}

	const redirectUri = internal.connect?.redirectUri;
	if (!redirectUri) {
		throw new ConnectError(
			'no_redirect_uri',
			'No redirectUri configured. Set connect.redirectUri in createCorsair().',
		);
	}

	const decoded = verifyAndDecodeState(state, internal.kek);
	if (!decoded) {
		throw new ConnectError(
			'invalid_state',
			'Invalid or tampered state parameter',
		);
	}

	const { plugin: pluginId, tenantId } = decoded;
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
		throw new ConnectError(
			'client_id_not_configured',
			`client_id not configured for '${pluginId}'`,
		);
	}

	const params: Record<string, string> = {
		...oauthCfg.authParams,
		client_id: clientId,
		redirect_uri: redirectUri,
		response_type: 'code',
		scope: oauthCfg.scopes.join(' '),
		state,
	};

	const oauthUrl = `${oauthCfg.authUrl}?${querystring.stringify(params)}`;

	return {
		plugin: pluginId,
		tenantId,
		providerName: oauthCfg.providerName,
		oauthUrl,
		state,
	};
}
