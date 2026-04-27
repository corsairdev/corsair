import * as querystring from 'node:querystring';
import {
	CORSAIR_INTERNAL,
	createAccountKeyManager,
	createIntegrationKeyManager,
	encryptDEK,
	exchangeCodeForTokens,
	generateDEK,
} from '../core';
import type {
	CorsairInternalConfig,
	CorsairPlugin,
	OAuthConfig,
} from '../core';
import { createCorsairOrm } from '../db/orm';

// ─────────────────────────────────────────────────────────────────────────────
// State encoding
// ─────────────────────────────────────────────────────────────────────────────

type OAuthState = { plugin: string; tenantId: string };

export function encodeOAuthState(plugin: string, tenantId: string): string {
	return Buffer.from(JSON.stringify({ plugin, tenantId })).toString('base64url');
}

export function decodeOAuthState(state: string): OAuthState | null {
	try {
		const decoded = JSON.parse(
			Buffer.from(state, 'base64url').toString('utf-8'),
		) as unknown;
		if (
			decoded !== null &&
			typeof decoded === 'object' &&
			'plugin' in decoded &&
			'tenantId' in decoded &&
			typeof (decoded as OAuthState).plugin === 'string' &&
			typeof (decoded as OAuthState).tenantId === 'string'
		) {
			return decoded as OAuthState;
		}
		return null;
	} catch {
		return null;
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

function getInternal(corsair: unknown): CorsairInternalConfig {
	const internal = (corsair as Record<symbol, unknown>)[
		CORSAIR_INTERNAL
	] as CorsairInternalConfig | undefined;
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
 * Persist `state` server-side (e.g. in a session cookie) so you can verify
 * it matches when processOAuthCallback is called.
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

	const state = encodeOAuthState(pluginId, tenantId);

	const params: Record<string, string> = {
		client_id: clientId,
		redirect_uri: redirectUri,
		response_type: 'code',
		scope: oauthCfg.scopes.join(' '),
		state,
		...oauthCfg.authParams,
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

	const decoded = decodeOAuthState(state);
	if (!decoded) throw new Error('Invalid or malformed state parameter');

	const { plugin: pluginId, tenantId } = decoded;
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
	const clientSecret = await integrationKm.get_client_secret();
	if (!clientId || !clientSecret) {
		throw new Error(`Credentials not configured for '${pluginId}'`);
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
		throw new Error(`No access_token returned from ${oauthCfg.providerName}`);
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

	return { plugin: pluginId, tenantId };
}
