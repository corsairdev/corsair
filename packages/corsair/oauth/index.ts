import type { AuthTypes } from '../core/constants';
import type {
	CorsairPlugin,
	OAuthConfig,
} from '../core/plugins';
import type { PluginAuthConfig } from '../core/auth/types';
import {
	createAccountKeyManager,
	createIntegrationKeyManager,
} from '../core/auth';
import type { CorsairDatabase } from '../db/kysely/database';
import { createCorsairOrm } from '../db/orm';
import { encryptDEK, generateDEK } from '../core/auth/encryption';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type OAuthCallbackResult = {
	/** The plugin that handled the callback, or null if no match */
	plugin: string | null;
	/** Whether the token exchange succeeded */
	success: boolean;
	/** Error message if the callback failed */
	error?: string;
	/** Tenant ID used for the auth */
	tenantId?: string;
};

export type OAuthCallbackParams = {
	/** Authorization code from the OAuth provider */
	code?: string | null;
	/** Error string from the OAuth provider */
	error?: string | null;
	/** State parameter (round-tripped through OAuth provider) encoding plugin + tenant */
	state?: string | null;
};

type OAuthState = {
	pluginId: string;
	tenantId: string;
};

type CorsairInternalConfig = {
	plugins: readonly CorsairPlugin[];
	database: CorsairDatabase | undefined;
	kek: string;
};

const CORSAIR_INTERNAL = Symbol.for('corsair:internal');

type CorsairInstance = Record<string, unknown> & {
	[key: symbol]: CorsairInternalConfig | undefined;
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getOAuthConfigForPlugin(plugin: CorsairPlugin): OAuthConfig | null {
	return (plugin as { oauthConfig?: OAuthConfig }).oauthConfig ?? null;
}

function getAuthType(plugin: CorsairPlugin): AuthTypes | undefined {
	return (plugin.options as Record<string, unknown> | undefined)?.authType as
		| AuthTypes
		| undefined;
}

function getCustomIntegrationFields(
	plugin: CorsairPlugin,
	authType: AuthTypes,
): readonly string[] {
	const authConfig = plugin.authConfig as PluginAuthConfig | undefined;
	return authConfig?.[authType]?.integration ?? [];
}

function getCustomAccountFields(
	plugin: CorsairPlugin,
	authType: AuthTypes,
): readonly string[] {
	const authConfig = plugin.authConfig as PluginAuthConfig | undefined;
	return authConfig?.[authType]?.account ?? [];
}

/**
 * Encodes plugin ID and tenant ID into a base64 state string for OAuth round-trip.
 */
export function encodeOAuthState(pluginId: string, tenantId: string): string {
	const state: OAuthState = { pluginId, tenantId };
	return Buffer.from(JSON.stringify(state)).toString('base64url');
}

/**
 * Decodes the state parameter back into plugin ID and tenant ID.
 */
function decodeOAuthState(state: string): OAuthState | null {
	try {
		const decoded = Buffer.from(state, 'base64url').toString('utf-8');
		const parsed = JSON.parse(decoded) as Record<string, unknown>;
		if (
			typeof parsed.pluginId === 'string' &&
			typeof parsed.tenantId === 'string'
		) {
			return parsed as unknown as OAuthState;
		}
		return null;
	} catch {
		return null;
	}
}

async function ensureIntegration(
	database: CorsairDatabase,
	pluginId: string,
	kek: string,
): Promise<{ id: string }> {
	const orm = createCorsairOrm(database);
	const existing = await orm.integrations.findByName(pluginId);
	if (existing) return { id: existing.id };

	const dek = generateDEK();
	const encryptedDek = await encryptDEK(dek, kek);
	const row = await orm.integrations.create({
		name: pluginId,
		config: {},
		dek: encryptedDek,
	});
	return { id: row.id };
}

async function ensureAccount(
	database: CorsairDatabase,
	integrationId: string,
	tenantId: string,
	kek: string,
): Promise<void> {
	const orm = createCorsairOrm(database);
	const existing = await orm.accounts.findOne({
		tenant_id: tenantId,
		integration_id: integrationId,
	});
	if (existing) return;

	const dek = generateDEK();
	const encryptedDek = await encryptDEK(dek, kek);
	await orm.accounts.create({
		tenant_id: tenantId,
		integration_id: integrationId,
		config: {},
		dek: encryptedDek,
	});
}

async function exchangeCodeForTokens(
	code: string,
	clientId: string,
	clientSecret: string,
	oauthConfig: OAuthConfig,
	redirectUri: string,
): Promise<{
	access_token?: string;
	refresh_token?: string;
	expires_in?: number;
	token_type?: string;
}> {
	const tokenUrl = new URL(oauthConfig.tokenUrl);
	const useBasicAuth = oauthConfig.tokenAuthMethod === 'basic';

	const params = new URLSearchParams();
	params.set('code', code.trim());
	params.set('redirect_uri', redirectUri);
	params.set('grant_type', 'authorization_code');

	if (!useBasicAuth) {
		params.set('client_id', clientId);
		params.set('client_secret', clientSecret);
	}

	const headers: Record<string, string> = {
		'Content-Type': 'application/x-www-form-urlencoded',
	};

	if (useBasicAuth) {
		headers.Authorization = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;
	}

	const response = await fetch(tokenUrl.toString(), {
		method: 'POST',
		headers,
		body: params.toString(),
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(`Token exchange failed (${response.status}): ${text}`);
	}

	return response.json();
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates the OAuth authorization URL for a plugin, including a `state`
 * parameter that encodes the plugin ID and tenant ID for the callback.
 *
 * Use this to build the URL that the user should visit to authorize.
 * After authorization, the provider redirects to `redirectUrl` with
 * `code` and `state` query params, which `processOAuthCallback` handles.
 *
 * @param corsair - The corsair instance (returned from createCorsair)
 * @param pluginId - The plugin to generate the auth URL for (e.g. 'onedrive')
 * @param redirectUrl - The callback URL (e.g. 'https://your-app.ngrok.io/api/auth')
 * @param options - Optional tenant ID
 * @returns The authorization URL and state string, or an error
 *
 * @example
 * ```ts
 * const result = await generateOAuthUrl(corsair, 'onedrive', 'https://abc.ngrok.io/api/auth');
 * // Redirect user to result.authUrl
 * ```
 */
export async function generateOAuthUrl(
	corsair: unknown,
	pluginId: string,
	redirectUrl: string,
	options?: { tenantId?: string },
): Promise<
	| { authUrl: string; state: string }
	| { error: string }
> {
	const internal = (corsair as CorsairInstance)[CORSAIR_INTERNAL];
	if (!internal) {
		return { error: 'Could not read internal config from Corsair instance.' };
	}

	const { plugins, database, kek } = internal;
	if (!database) {
		return { error: 'No database adapter configured.' };
	}

	const plugin = plugins.find((pl) => pl.id === pluginId);
	if (!plugin) {
		return { error: `Plugin '${pluginId}' not found.` };
	}

	const oauthCfg = getOAuthConfigForPlugin(plugin);
	if (!oauthCfg) {
		return { error: `No oauthConfig defined on plugin '${pluginId}'.` };
	}

	const extraFields = getCustomIntegrationFields(plugin, 'oauth_2');
	const integrationKm = createIntegrationKeyManager({
		authType: 'oauth_2',
		integrationName: plugin.id,
		kek,
		database,
		extraIntegrationFields: extraFields,
	});

	const clientId = await integrationKm.get_client_id();
	if (!clientId) {
		return {
			error: `client_id not set for '${pluginId}'. Run: corsair setup --${pluginId} client_id=YOUR_CLIENT_ID`,
		};
	}

	const tenantId = options?.tenantId ?? 'default';
	const state = encodeOAuthState(pluginId, tenantId);

	const authParams = new URLSearchParams({
		client_id: clientId,
		redirect_uri: redirectUrl,
		response_type: 'code',
		scope: oauthCfg.scopes.join(' '),
		state,
		...oauthCfg.authParams,
	});

	return {
		authUrl: `${oauthCfg.authUrl}?${authParams.toString()}`,
		state,
	};
}

/**
 * Processes an incoming OAuth callback request.
 *
 * Decodes the `state` parameter to identify the plugin,
 * exchanges the authorization code for tokens, and stores them
 * in the Corsair database.
 *
 * The tenant ID is resolved in order of priority:
 * 1. `options.tenantId` (from the URL path, e.g. `/api/auth/123`)
 * 2. The tenant ID encoded in the `state` parameter
 *
 * @param corsair - The corsair instance (returned from createCorsair)
 * @param params - The query parameters from the OAuth callback (code, state, error)
 * @param options - Optional overrides (tenantId from URL path)
 * @returns The result with plugin, success status, and optional error
 *
 * @example
 * ```ts
 * // Route: /api/auth/[tenantId]/route.ts
 * const result = await processOAuthCallback(corsair,
 *   { code, state, error },
 *   { tenantId: 'tenant-123' },
 * );
 * ```
 */
export async function processOAuthCallback(
	corsair: unknown,
	params: OAuthCallbackParams,
	options?: { tenantId?: string },
): Promise<OAuthCallbackResult> {
	if (params.error) {
		return {
			plugin: null,
			success: false,
			error: `OAuth provider returned error: ${params.error}`,
		};
	}

	if (!params.code) {
		return {
			plugin: null,
			success: false,
			error: 'No authorization code received.',
		};
	}

	if (!params.state) {
		return {
			plugin: null,
			success: false,
			error: 'No state parameter received. The OAuth request may not have been initiated through Corsair.',
		};
	}

	const oauthState = decodeOAuthState(params.state);
	if (!oauthState) {
		return {
			plugin: null,
			success: false,
			error: 'Invalid state parameter. Could not decode plugin and tenant information.',
		};
	}

	const { pluginId } = oauthState;
	let tenantId = options?.tenantId ?? oauthState.tenantId;

	const internal = (corsair as CorsairInstance)[CORSAIR_INTERNAL];
	if (!internal) {
		return {
			plugin: null,
			success: false,
			error: 'Could not read internal config from Corsair instance.',
		};
	}

	const { plugins, database, kek } = internal;
	if (!database) {
		return {
			plugin: null,
			success: false,
			error: 'No database adapter configured.',
		};
	}

	const plugin = plugins.find((pl) => pl.id === pluginId);
	if (!plugin) {
		return {
			plugin: null,
			success: false,
			error: `Plugin '${pluginId}' not found in Corsair instance.`,
		};
	}

	const authType = getAuthType(plugin);
	if (authType !== 'oauth_2') {
		return {
			plugin: pluginId,
			success: false,
			error: `Plugin '${pluginId}' does not use OAuth 2.0.`,
		};
	}

	const oauthCfg = getOAuthConfigForPlugin(plugin);
	if (!oauthCfg) {
		return {
			plugin: pluginId,
			success: false,
			error: `No oauthConfig defined on plugin '${pluginId}'.`,
		};
	}

	const integration = await ensureIntegration(database, pluginId, kek);

	const extraIntegrationFields = getCustomIntegrationFields(plugin, 'oauth_2');
	const integrationKm = createIntegrationKeyManager({
		authType: 'oauth_2',
		integrationName: pluginId,
		kek,
		database,
		extraIntegrationFields,
	});

	const clientId = await integrationKm.get_client_id();
	const clientSecret = await integrationKm.get_client_secret();
	const storedRedirectUrl = await integrationKm.get_redirect_url();

	if (storedRedirectUrl && !options?.tenantId) {
		try {
			const parsed = new URL(storedRedirectUrl);
			const segments = parsed.pathname.split('/').filter(Boolean);
			if (segments.length >= 3) {
				tenantId = segments[segments.length - 1]!;
			}
		} catch {
			// not a valid URL, ignore
		}
	}

	await ensureAccount(database, integration.id, tenantId, kek);

	if (!clientId || !clientSecret) {
		return {
			plugin: pluginId,
			success: false,
			error: `client_id and client_secret must be set for '${pluginId}' before exchanging a code.`,
		};
	}

	if (!storedRedirectUrl) {
		return {
			plugin: pluginId,
			success: false,
			error: `No redirect_url found for '${pluginId}'. Set one via: corsair setup --${pluginId} redirect_url=YOUR_REDIRECT_URL`,
		};
	}

	let tokens: {
		access_token?: string;
		refresh_token?: string;
		expires_in?: number;
	};
	try {
		tokens = await exchangeCodeForTokens(
			params.code,
			clientId,
			clientSecret,
			oauthCfg,
			storedRedirectUrl,
		);
	} catch (err) {
		return {
			plugin: pluginId,
			success: false,
			error: `Token exchange failed: ${err instanceof Error ? err.message : String(err)}`,
		};
	}

	if (!tokens.access_token) {
		return {
			plugin: pluginId,
			success: false,
			error: `No access_token in response from ${oauthCfg.providerName}.`,
		};
	}

	const extraAccountFields = getCustomAccountFields(plugin, 'oauth_2');
	const accountKm = createAccountKeyManager({
		authType: 'oauth_2',
		integrationName: pluginId,
		tenantId,
		kek,
		database,
		extraAccountFields,
	});

	await accountKm.set_access_token(tokens.access_token);
	if (tokens.refresh_token) {
		await accountKm.set_refresh_token(tokens.refresh_token);
	}
	if (tokens.expires_in) {
		await accountKm.set_expires_at(
			(Math.floor(Date.now() / 1000) + tokens.expires_in).toString(),
		);
	}

	return {
		plugin: pluginId,
		success: true,
		tenantId,
	};
}
