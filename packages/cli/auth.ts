import * as http from 'node:http';
import * as https from 'node:https';
import * as net from 'node:net';
import * as querystring from 'node:querystring';
import type {
	AuthTypes,
	CorsairInternalConfig,
	CorsairPlugin,
	OAuthConfig,
	PluginAuthConfig,
} from 'corsair/core';
import {
	CORSAIR_INTERNAL,
	createAccountKeyManager,
	createIntegrationKeyManager,
	encryptDEK,
	generateDEK,
} from 'corsair/core';
import type { CorsairDatabase } from 'corsair/db';
import { createCorsairOrm } from 'corsair/orm';
import { getCorsairInstance } from './index';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

type GraphSubscriptionResponse = {
	id: string;
	resource?: string;
	changeType?: string;
	expirationDateTime?: string;
	notificationUrl?: string;
};

function createGraphSubscription(
	accessToken: string,
	payload: {
		changeType: string;
		notificationUrl: string;
		resource: string;
		expirationDateTime: string;
		clientState: string;
	},
): Promise<GraphSubscriptionResponse> {
	const postData = JSON.stringify(payload);
	return new Promise((resolve, reject) => {
		const req = https.request(
			{
				hostname: 'graph.microsoft.com',
				path: '/v1.0/subscriptions',
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
					'Content-Length': Buffer.byteLength(postData).toString(),
				},
			},
			(res) => {
				let data = '';
				res.on('data', (chunk) => {
					data += chunk;
				});
				res.on('end', () => {
					const parsed = JSON.parse(data || '{}') as Record<string, unknown>;
					if (
						!res.statusCode ||
						res.statusCode < 200 ||
						res.statusCode >= 300
					) {
						reject(
							new Error(
								`Subscription creation failed (${res.statusCode ?? 'unknown'}): ${JSON.stringify(parsed)}`,
							),
						);
						return;
					}
					resolve(parsed as GraphSubscriptionResponse);
				});
			},
		);
		req.on('error', (error) => {
			reject(new Error(`Subscription request failed: ${error.message}`));
		});
		req.write(postData);
		req.end();
	});
}

function out(data: Record<string, unknown>): void {
	console.log(JSON.stringify(data));
}

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

function findFreePort(): Promise<number> {
	return new Promise((resolve, reject) => {
		const server = net.createServer();
		server.listen(0, '127.0.0.1', () => {
			const address = server.address();
			const port = typeof address === 'object' && address ? address.port : 0;
			server.close((err) => {
				if (err) reject(err);
				else resolve(port);
			});
		});
		server.on('error', reject);
	});
}

function waitForOAuthCode(port: number): Promise<string> {
	return new Promise((resolve, reject) => {
		const server = http.createServer((req, res) => {
			const url = new URL(req.url ?? '/', `http://localhost:${port}`);
			const code = url.searchParams.get('code');
			const error = url.searchParams.get('error');

			if (error) {
				res.writeHead(400, { 'Content-Type': 'text/html' });
				res.end(
					`<html><body><h2>Authorization failed: ${error}</h2><p>You can close this tab.</p></body></html>`,
				);
				server.close();
				reject(new Error(`OAuth error: ${error}`));
				return;
			}

			if (code) {
				res.writeHead(200, { 'Content-Type': 'text/html' });
				res.end(
					'<html><body><h2>Authorization successful!</h2><p>You can close this tab and return to the terminal.</p></body></html>',
				);
				server.close();
				resolve(code);
			} else {
				res.writeHead(400, { 'Content-Type': 'text/html' });
				res.end(
					'<html><body><h2>No code received.</h2><p>You can close this tab.</p></body></html>',
				);
			}
		});

		server.listen(port, '127.0.0.1', () => {});
		server.on('error', reject);
	});
}

function exchangeCodeForTokens(
	code: string,
	clientId: string,
	clientSecret: string,
	oauthConfig: OAuthConfig,
	redirectUri: string | null,
): Promise<{
	access_token?: string;
	refresh_token?: string;
	expires_in?: number;
	token_type?: string;
}> {
	const tokenUrl = new URL(oauthConfig.tokenUrl);
	const useBasicAuth = oauthConfig.tokenAuthMethod === 'basic';

	return new Promise((resolve, reject) => {
		const postDataParams: Record<string, string | null> = {
			code: code.trim(),
			redirect_uri: redirectUri,
			grant_type: 'authorization_code',
		};

		if (!useBasicAuth) {
			postDataParams.client_id = clientId;
			postDataParams.client_secret = clientSecret;
		}

		const postData = querystring.stringify(postDataParams);
		const headers: Record<string, string> = {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': Buffer.byteLength(postData).toString(),
		};

		if (useBasicAuth) {
			headers.Authorization = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;
		}

		const req = https.request(
			{
				hostname: tokenUrl.hostname,
				path: tokenUrl.pathname,
				method: 'POST',
				headers,
			},
			(res) => {
				let data = '';
				res.on('data', (chunk) => {
					data += chunk;
				});
				res.on('end', () => {
					if (res.statusCode !== 200) {
						reject(new Error(`Token exchange failed: ${data}`));
						return;
					}
					resolve(JSON.parse(data));
				});
			},
		);
		req.on('error', (error) =>
			reject(new Error(`Request failed: ${error.message}`)),
		);
		req.write(postData);
		req.end();
	});
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal config loader
// ─────────────────────────────────────────────────────────────────────────────

async function extractInternalConfig(
	cwd: string,
): Promise<CorsairInternalConfig> {
	const instance = await getCorsairInstance({ cwd, shouldThrowOnError: true });
	const internal = (instance as Record<string | symbol, unknown>)[
		CORSAIR_INTERNAL
	] as CorsairInternalConfig | undefined;
	if (!internal) {
		throw new Error(
			'Could not read internal config from Corsair instance. Make sure you are using the latest version of corsair.',
		);
	}
	return internal;
}

// ─────────────────────────────────────────────────────────────────────────────
// Auto-init helpers (no prompts)
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// OAuth flow
// ─────────────────────────────────────────────────────────────────────────────

async function oauthGetUrl(
	database: CorsairDatabase,
	plugin: CorsairPlugin,
	kek: string,
	tenantId: string,
): Promise<void> {
	const oauthCfg = getOAuthConfigForPlugin(plugin);
	if (!oauthCfg) {
		out({ error: `No oauthConfig defined on plugin '${plugin.id}'.` });
		return;
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
		out({
			error: `client_id not set for '${plugin.id}'. Run: corsair setup --${plugin.id} client_id=YOUR_CLIENT_ID`,
		});
		return;
	}

	const clientSecret = await integrationKm.get_client_secret();
	if (!clientSecret) {
		out({
			error: `client_secret not set for '${plugin.id}'. Run: corsair setup --${plugin.id} client_secret=YOUR_CLIENT_SECRET`,
		});
		return;
	}

	let redirectUri: string;
	if (oauthCfg.requiresRegisteredRedirect) {
		const stored = await integrationKm.get_redirect_url();
		if (!stored) {
			out({
				error: `redirect_url required for '${plugin.id}'. Run: corsair setup --${plugin.id} redirect_url=YOUR_REDIRECT_URI`,
			});
			return;
		}
		redirectUri = stored;
	} else {
		const port = await findFreePort();
		redirectUri = `http://localhost:${port}`;
	}

	const authParams: Record<string, string | null> = {
		client_id: clientId,
		redirect_uri: redirectUri,
		response_type: 'code',
		scope: oauthCfg.scopes.join(' '),
		...oauthCfg.authParams,
	};

	const authUrl = `${oauthCfg.authUrl}?${querystring.stringify(authParams)}`;

	// If the redirect is a localhost URL with a port, spin up a local server and wait for the code.
	// This works whether the redirect is dynamic (requiresRegisteredRedirect: false) or a
	// pre-registered localhost:PORT URL (requiresRegisteredRedirect: true, e.g. Notion).
	const localhostPortMatch = redirectUri.match(
		/^https?:\/\/(?:localhost|127\.0\.0\.1):(\d+)/,
	);
	const localhostPort = localhostPortMatch?.[1]
		? parseInt(localhostPortMatch[1], 10)
		: null;
	if (localhostPort) {
		out({
			status: 'pending_oauth',
			authUrl,
			redirectUri,
			plugin: plugin.id,
			tenant: tenantId,
			note: 'Open authUrl in a browser. Tokens will be saved automatically once authorized.',
		});
		let code: string;
		try {
			code = await waitForOAuthCode(localhostPort);
		} catch (err) {
			out({
				error: `Authorization failed: ${err instanceof Error ? err.message : String(err)}`,
			});
			return;
		}
		await oauthExchangeCode(
			database,
			plugin,
			kek,
			tenantId,
			code,
			redirectUri,
			clientId,
			clientSecret,
			oauthCfg,
		);
		return;
	}

	// Registered redirect is not a localhost:PORT URL — can't auto-capture, output the URL
	out({
		status: 'needs_code',
		authUrl,
		redirectUri,
		plugin: plugin.id,
		tenant: tenantId,
		note: 'Open authUrl, complete auth, then run: corsair auth --plugin=<id> --code=CODE',
	});
}

async function oauthExchangeCode(
	database: CorsairDatabase,
	plugin: CorsairPlugin,
	kek: string,
	tenantId: string,
	code: string,
	redirectUri: string,
	clientId: string,
	clientSecret: string,
	oauthCfg: OAuthConfig,
): Promise<void> {
	let tokens: {
		access_token?: string;
		refresh_token?: string;
		expires_in?: number;
	};
	try {
		tokens = await exchangeCodeForTokens(
			code,
			clientId,
			clientSecret,
			oauthCfg,
			redirectUri,
		);
	} catch (err) {
		out({
			error: `Token exchange failed: ${err instanceof Error ? err.message : String(err)}`,
		});
		return;
	}

	if (!tokens.access_token) {
		out({
			error: `No access_token in response from ${oauthCfg.providerName}.`,
		});
		return;
	}

	const extraAccountFields = getCustomAccountFields(plugin, 'oauth_2');
	const accountKm = createAccountKeyManager({
		authType: 'oauth_2',
		integrationName: plugin.id,
		tenantId,
		kek,
		database,
		extraAccountFields,
	});

	await accountKm.set_access_token(tokens.access_token);
	if (tokens.refresh_token)
		await accountKm.set_refresh_token(tokens.refresh_token);
	if (tokens.expires_in)
		await accountKm.set_expires_at(
			(Math.floor(Date.now() / 1000) + tokens.expires_in).toString(),
		);

	out({ status: 'success', plugin: plugin.id, tenant: tenantId });
}

async function oauthWithCode(
	database: CorsairDatabase,
	plugin: CorsairPlugin,
	kek: string,
	tenantId: string,
	code: string,
): Promise<void> {
	const oauthCfg = getOAuthConfigForPlugin(plugin);
	if (!oauthCfg) {
		out({ error: `No oauthConfig defined on plugin '${plugin.id}'.` });
		return;
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
	const clientSecret = await integrationKm.get_client_secret();
	const redirectUri = (await integrationKm.get_redirect_url()) ?? '';

	if (!clientId || !clientSecret) {
		out({
			error: `client_id and client_secret must be set before exchanging a code.`,
		});
		return;
	}

	await oauthExchangeCode(
		database,
		plugin,
		kek,
		tenantId,
		code,
		redirectUri,
		clientId,
		clientSecret,
		oauthCfg,
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// Credential display
// ─────────────────────────────────────────────────────────────────────────────

async function getCredentials(
	database: CorsairDatabase,
	plugin: CorsairPlugin,
	kek: string,
	tenantId: string,
): Promise<void> {
	const authType = getAuthType(plugin);
	const result: Record<string, string | null> = {};

	if (authType === 'oauth_2') {
		const extraIntegrationFields = getCustomIntegrationFields(plugin, authType);
		const integrationKm = createIntegrationKeyManager({
			authType,
			integrationName: plugin.id,
			kek,
			database,
			extraIntegrationFields,
		});
		result.client_id = await integrationKm.get_client_id();
		result.client_secret = await integrationKm.get_client_secret();
		result.redirect_url = await integrationKm.get_redirect_url();
		for (const field of extraIntegrationFields) {
			const fn = (integrationKm as Record<string, unknown>)[`get_${field}`];
			if (typeof fn === 'function')
				result[field] = await (fn as () => Promise<string | null>)();
		}

		const extraAccountFields = getCustomAccountFields(plugin, authType);
		const accountKm = createAccountKeyManager({
			authType,
			integrationName: plugin.id,
			tenantId,
			kek,
			database,
			extraAccountFields,
		});
		result.access_token = await accountKm.get_access_token();
		result.refresh_token = await accountKm.get_refresh_token();
		result.expires_at = await accountKm.get_expires_at();
		result.webhook_signature = await accountKm.get_webhook_signature();
		for (const field of extraAccountFields) {
			const fn = (accountKm as Record<string, unknown>)[`get_${field}`];
			if (typeof fn === 'function')
				result[field] = await (fn as () => Promise<string | null>)();
		}
	} else if (authType === 'api_key') {
		const extraAccountFields = getCustomAccountFields(plugin, authType);
		const accountKm = createAccountKeyManager({
			authType,
			integrationName: plugin.id,
			tenantId,
			kek,
			database,
			extraAccountFields,
		});
		result.api_key = await accountKm.get_api_key();
		result.webhook_signature = await accountKm.get_webhook_signature();
	} else if (authType === 'bot_token') {
		const extraAccountFields = getCustomAccountFields(plugin, authType);
		const accountKm = createAccountKeyManager({
			authType,
			integrationName: plugin.id,
			tenantId,
			kek,
			database,
			extraAccountFields,
		});
		result.bot_token = await accountKm.get_bot_token();
		result.webhook_signature = await accountKm.get_webhook_signature();
	}

	// Mask values for display
	const masked: Record<string, string | null> = {};
	for (const [k, v] of Object.entries(result)) {
		if (!v) {
			masked[k] = null;
			continue;
		}
		masked[k] = v.length <= 9 ? '***' : `${v.slice(0, 6)}...${v.slice(-3)}`;
	}

	out({ plugin: plugin.id, tenant: tenantId, credentials: masked });
}

// ─────────────────────────────────────────────────────────────────────────────
// Entry point
// ─────────────────────────────────────────────────────────────────────────────

export async function runAuth({
	cwd,
	pluginId: pluginIdArg,
	tenantId: tenantIdArg,
	code: codeArg,
	credentials: showCredentials = false,
}: {
	cwd: string;
	pluginId?: string;
	tenantId?: string;
	/** OAuth authorization code to exchange for tokens. */
	code?: string;
	/** Output current credential status instead of starting OAuth flow. */
	credentials?: boolean;
}): Promise<void> {
	let internal: CorsairInternalConfig;
	try {
		internal = await extractInternalConfig(cwd);
	} catch (error) {
		out({ error: error instanceof Error ? error.message : String(error) });
		process.exit(1);
	}

	const { plugins, database, kek } = internal;

	if (!database) {
		out({ error: 'No database adapter configured.' });
		process.exit(1);
	}

	if (!pluginIdArg) {
		out({
			error: 'No plugin specified. Use --plugin=<id>.',
			available: plugins.map((pl) => ({
				id: pl.id,
				authType: getAuthType(pl),
			})),
		});
		process.exit(1);
	}

	const plugin = plugins.find((pl) => pl.id === pluginIdArg);
	if (!plugin) {
		out({
			error: `Plugin '${pluginIdArg}' not found.`,
			available: plugins.map((pl) => pl.id),
		});
		process.exit(1);
	}

	const integration = await ensureIntegration(database, plugin.id, kek);
	const tenantId = tenantIdArg ?? 'default';
	await ensureAccount(database, integration.id, tenantId, kek);

	if (showCredentials) {
		await getCredentials(database, plugin, kek, tenantId);
		return;
	}

	const authType = getAuthType(plugin);

	if (authType !== 'oauth_2') {
		out({
			error: `'corsair auth' is for OAuth flows. Plugin '${plugin.id}' uses '${authType}'. Set credentials via: corsair setup --${plugin.id} <field>=<value>`,
		});
		return;
	}

	if (codeArg) {
		await oauthWithCode(database, plugin, kek, tenantId, codeArg);
	} else {
		await oauthGetUrl(database, plugin, kek, tenantId);
	}
}
