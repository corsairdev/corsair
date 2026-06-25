import { buildOAuthAuthorizeUrl } from '../../oauth/authorize-url';
import type { CorsairPlugin, OAuthConfig } from '..';
import { createIntegrationKeyManager } from '..';
import { verifyAndDecodeState } from '../auth/state';
import {
	getCorsairInternal,
	requireCorsairPlugin,
} from '../utils/corsair-instance';

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
 * Uses the `redirectUri` from `createCorsair({ manual: { redirectUri } })`.
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
	const internal = getCorsairInternal(
		corsair,
		() =>
			new ConnectError('invalid_corsair_instance', 'Invalid corsair instance'),
	);

	if (!internal.database) {
		throw new ConnectError(
			'no_database',
			'No database configured on corsair instance',
		);
	}

	const redirectUri = internal.manual?.redirectUri;
	if (!redirectUri) {
		throw new ConnectError(
			'no_redirect_uri',
			'No redirectUri configured. Set manual.redirectUri in createCorsair().',
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
	const plugin = requireCorsairPlugin(
		internal,
		pluginId,
		(message) => new ConnectError('plugin_not_found', message),
	);
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

	const oauthUrl = buildOAuthAuthorizeUrl({
		oauthConfig: oauthCfg,
		clientId,
		redirectUri,
		state,
	});

	return {
		plugin: pluginId,
		tenantId,
		providerName: oauthCfg.providerName,
		oauthUrl,
		state,
	};
}
