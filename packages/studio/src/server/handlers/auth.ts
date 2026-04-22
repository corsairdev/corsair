import * as http from 'node:http';
import * as https from 'node:https';
import * as net from 'node:net';
import * as querystring from 'node:querystring';
import type {
	AuthTypes,
	CorsairPlugin,
	OAuthConfig,
	PluginAuthConfig,
} from 'corsair/core';
import {
	createAccountKeyManager,
	createIntegrationKeyManager,
} from 'corsair/core';
import { readJsonBody } from '../router';
import type { HandlerFn } from '../types';

function getAuthType(plugin: CorsairPlugin): AuthTypes | undefined {
	return (plugin.options as Record<string, unknown> | undefined)?.authType as
		| AuthTypes
		| undefined;
}

function getOAuthConfig(plugin: CorsairPlugin): OAuthConfig | null {
	return (plugin as { oauthConfig?: OAuthConfig }).oauthConfig ?? null;
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

/**
 * Tracks in-flight OAuth code listeners. Key: pluginId:tenantId.
 * Each entry resolves when the user hits the redirect URL with ?code=.
 */
const pendingListeners = new Map<
	string,
	{ redirectUri: string; codePromise: Promise<string>; server: http.Server }
>();

function startCodeListener(port: number): {
	server: http.Server;
	code: Promise<string>;
} {
	let resolveCode!: (code: string) => void;
	let rejectCode!: (err: Error) => void;
	const code = new Promise<string>((resolve, reject) => {
		resolveCode = resolve;
		rejectCode = reject;
	});

	const server = http.createServer((req, res) => {
		const reqUrl = new URL(req.url ?? '/', `http://localhost:${port}`);
		const receivedCode = reqUrl.searchParams.get('code');
		const error = reqUrl.searchParams.get('error');

		if (error) {
			res.writeHead(400, { 'Content-Type': 'text/html' });
			res.end(
				`<html><body style="font-family:system-ui;padding:2rem;"><h2>Authorization failed</h2><p>${error}</p><p>You can close this tab.</p></body></html>`,
			);
			server.close();
			rejectCode(new Error(`OAuth error: ${error}`));
			return;
		}

		if (receivedCode) {
			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.end(
				`<html><body style="font-family:system-ui;padding:2rem;"><h2>Authorization successful</h2><p>You can close this tab and return to Corsair Studio.</p></body></html>`,
			);
			server.close();
			resolveCode(receivedCode);
			return;
		}

		res.writeHead(400, { 'Content-Type': 'text/html' });
		res.end('<html><body><h2>No code received.</h2></body></html>');
	});

	server.listen(port, '127.0.0.1');
	server.on('error', rejectCode);
	return { server, code };
}

function exchangeCodeForTokens(
	code: string,
	clientId: string,
	clientSecret: string,
	oauthConfig: OAuthConfig,
	redirectUri: string,
): Promise<{
	access_token?: string;
	refresh_token?: string;
	expires_in?: number;
}> {
	const tokenUrl = new URL(oauthConfig.tokenUrl);
	const useBasicAuth = oauthConfig.tokenAuthMethod === 'basic';

	return new Promise((resolve, reject) => {
		const params: Record<string, string> = {
			code: code.trim(),
			redirect_uri: redirectUri,
			grant_type: 'authorization_code',
		};
		if (!useBasicAuth) {
			params.client_id = clientId;
			params.client_secret = clientSecret;
		}
		const postData = querystring.stringify(params);
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
				res.on('data', (c) => {
					data += c;
				});
				res.on('end', () => {
					if (res.statusCode !== 200) {
						reject(new Error(`Token exchange failed: ${data}`));
						return;
					}
					try {
						resolve(JSON.parse(data));
					} catch {
						reject(new Error(`Token exchange: invalid JSON response: ${data}`));
					}
				});
			},
		);
		req.on('error', (e) =>
			reject(new Error(`Token exchange request failed: ${e.message}`)),
		);
		req.write(postData);
		req.end();
	});
}

export const startOAuth: HandlerFn = async (ctx) => {
	const body = await readJsonBody(ctx.req);
	const pluginId = String(body.pluginId ?? '');
	const tenantId = String(body.tenantId ?? 'default');
	if (!pluginId) throw new Error('Missing pluginId.');

	const { internal } = await ctx.getCorsair();
	const database = internal.database;
	if (!database) throw new Error('No database configured.');

	const plugin = internal.plugins.find((p) => p.id === pluginId);
	if (!plugin) throw new Error(`Plugin '${pluginId}' not found.`);

	const authType = getAuthType(plugin);
	if (authType !== 'oauth_2') {
		throw new Error(
			`Plugin '${pluginId}' uses auth type '${authType}', not OAuth. Set credentials via /api/credentials/set.`,
		);
	}

	const oauthCfg = getOAuthConfig(plugin);
	if (!oauthCfg) throw new Error(`No oauthConfig on plugin '${plugin.id}'.`);

	const extraIntegration = getCustomIntegrationFields(plugin, 'oauth_2');
	const integrationKm = createIntegrationKeyManager({
		authType: 'oauth_2',
		integrationName: plugin.id,
		kek: internal.kek,
		database,
		extraIntegrationFields: extraIntegration,
	});

	const clientId = await integrationKm.get_client_id();
	const clientSecret = await integrationKm.get_client_secret();
	if (!clientId || !clientSecret) {
		throw new Error(
			`client_id and/or client_secret not set for '${plugin.id}'. Set them in Credentials first.`,
		);
	}

	let redirectUri: string;
	let localhostPort: number;
	if (oauthCfg.requiresRegisteredRedirect) {
		const stored = await integrationKm.get_redirect_url();
		if (!stored) {
			throw new Error(
				`This provider requires a registered redirect_url. Set it in Credentials first.`,
			);
		}
		redirectUri = stored;
		const m = redirectUri.match(/^https?:\/\/(?:localhost|127\.0\.0\.1):(\d+)/);
		if (!m?.[1]) {
			return {
				status: 'needs_code',
				authUrl: buildAuthUrl(oauthCfg, clientId, redirectUri),
				redirectUri,
				note: 'This redirect URI is not a localhost URL — complete the flow manually and paste the code back in.',
			};
		}
		localhostPort = parseInt(m[1], 10);
	} else {
		localhostPort = await findFreePort();
		redirectUri = `http://localhost:${localhostPort}`;
	}

	const authUrl = buildAuthUrl(oauthCfg, clientId, redirectUri);

	const key = `${pluginId}:${tenantId}`;
	const existing = pendingListeners.get(key);
	if (existing) {
		existing.server.close();
		pendingListeners.delete(key);
	}
	const { server, code } = startCodeListener(localhostPort);
	pendingListeners.set(key, { redirectUri, codePromise: code, server });

	code
		.then(async (receivedCode) => {
			try {
				const tokens = await exchangeCodeForTokens(
					receivedCode,
					clientId,
					clientSecret,
					oauthCfg,
					redirectUri,
				);
				if (!tokens.access_token) return;
				const extraAccount = getCustomAccountFields(plugin, 'oauth_2');
				const accountKm = createAccountKeyManager({
					authType: 'oauth_2',
					integrationName: plugin.id,
					tenantId,
					kek: internal.kek,
					database,
					extraAccountFields: extraAccount,
				});
				await accountKm.set_access_token(tokens.access_token);
				if (tokens.refresh_token)
					await accountKm.set_refresh_token(tokens.refresh_token);
				if (tokens.expires_in)
					await accountKm.set_expires_at(
						(Math.floor(Date.now() / 1000) + tokens.expires_in).toString(),
					);
			} finally {
				pendingListeners.delete(key);
			}
		})
		.catch(() => {
			pendingListeners.delete(key);
		});

	return { status: 'pending_oauth', authUrl, redirectUri };
};

function buildAuthUrl(
	oauthCfg: OAuthConfig,
	clientId: string,
	redirectUri: string,
): string {
	const params: Record<string, string | null> = {
		client_id: clientId,
		redirect_uri: redirectUri,
		response_type: 'code',
		scope: oauthCfg.scopes.join(' '),
		...oauthCfg.authParams,
	};
	return `${oauthCfg.authUrl}?${querystring.stringify(params)}`;
}

export const exchangeOAuth: HandlerFn = async (ctx) => {
	const body = await readJsonBody(ctx.req);
	const pluginId = String(body.pluginId ?? '');
	const tenantId = String(body.tenantId ?? 'default');
	const code = String(body.code ?? '');
	if (!pluginId) throw new Error('Missing pluginId.');
	if (!code) throw new Error('Missing code.');

	const { internal } = await ctx.getCorsair();
	if (!internal.database) throw new Error('No database configured.');

	const plugin = internal.plugins.find((p) => p.id === pluginId);
	if (!plugin) throw new Error(`Plugin '${pluginId}' not found.`);

	const oauthCfg = getOAuthConfig(plugin);
	if (!oauthCfg) throw new Error(`No oauthConfig on plugin '${plugin.id}'.`);

	const extraIntegration = getCustomIntegrationFields(plugin, 'oauth_2');
	const integrationKm = createIntegrationKeyManager({
		authType: 'oauth_2',
		integrationName: plugin.id,
		kek: internal.kek,
		database: internal.database,
		extraIntegrationFields: extraIntegration,
	});

	const clientId = await integrationKm.get_client_id();
	const clientSecret = await integrationKm.get_client_secret();
	const redirectUri = (await integrationKm.get_redirect_url()) ?? '';
	if (!clientId || !clientSecret) {
		throw new Error(
			'client_id/client_secret not set. Set them in Credentials first.',
		);
	}

	const tokens = await exchangeCodeForTokens(
		code,
		clientId,
		clientSecret,
		oauthCfg,
		redirectUri,
	);
	if (!tokens.access_token) {
		throw new Error('No access_token in response from provider.');
	}

	const extraAccount = getCustomAccountFields(plugin, 'oauth_2');
	const accountKm = createAccountKeyManager({
		authType: 'oauth_2',
		integrationName: plugin.id,
		tenantId,
		kek: internal.kek,
		database: internal.database,
		extraAccountFields: extraAccount,
	});
	await accountKm.set_access_token(tokens.access_token);
	if (tokens.refresh_token)
		await accountKm.set_refresh_token(tokens.refresh_token);
	if (tokens.expires_in)
		await accountKm.set_expires_at(
			(Math.floor(Date.now() / 1000) + tokens.expires_in).toString(),
		);

	return { ok: true };
};
