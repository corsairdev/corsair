import * as querystring from 'node:querystring';
import type { CorsairInternalConfig, CorsairPlugin, OAuthConfig } from '..';
import { CORSAIR_INTERNAL, createIntegrationKeyManager } from '..';
import { verifyAndDecodeState } from '../auth/state';

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

function getInternal(corsair: unknown): CorsairInternalConfig {
	const internal = (corsair as Record<symbol, unknown>)[CORSAIR_INTERNAL] as
		| CorsairInternalConfig
		| undefined;
	if (!internal) throw new Error('Invalid corsair instance');
	return internal;
}

function findPlugin(
	internal: CorsairInternalConfig,
	pluginId: string,
): CorsairPlugin {
	const plugin = internal.plugins.find((p) => p.id === pluginId);
	if (!plugin) throw new Error(`Plugin '${pluginId}' not found`);
	return plugin;
}

function getOAuthConfig(plugin: CorsairPlugin): OAuthConfig {
	const cfg = (plugin as { oauthConfig?: OAuthConfig }).oauthConfig;
	if (!cfg) throw new Error(`Plugin '${plugin.id}' has no oauthConfig`);
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
		throw new Error('No database configured on corsair instance');
	}

	const redirectUri = internal.connect?.redirectUri;
	if (!redirectUri) {
		throw new Error(
			'No redirectUri configured. Set connect.redirectUri in createCorsair().',
		);
	}

	const decoded = verifyAndDecodeState(state, internal.kek);
	if (!decoded) throw new Error('Invalid or tampered state parameter');

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
		throw new Error(`client_id not configured for '${pluginId}'`);
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
