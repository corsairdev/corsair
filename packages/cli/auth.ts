import type { SpawnOptions } from 'node:child_process';
import { spawn } from 'node:child_process';
import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import * as http from 'node:http';
import * as https from 'node:https';
import * as net from 'node:net';
import * as os from 'node:os';
import * as path from 'node:path';
import * as querystring from 'node:querystring';
import type {
	AuthTypes,
	CorsairInternalConfig,
	CorsairPlugin,
	OAuthConfig,
	PluginAuthConfig,
	TokenResponse,
} from 'corsair/core';
import {
	CORSAIR_INTERNAL,
	createAccountKeyManager,
	createIntegrationKeyManager,
	encryptDEK,
	exchangeCodeForTokens,
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

function authStateFile(sessionId: string): string {
	return path.join(os.tmpdir(), `corsair-auth-${sessionId}.json`);
}

function writeAuthState(
	sessionId: string,
	state: Record<string, unknown>,
): void {
	fs.writeFileSync(authStateFile(sessionId), JSON.stringify(state));
}

function pollAuthState(
	sessionId: string,
	timeoutMs: number,
): Promise<Record<string, unknown>> {
	return new Promise((resolve, reject) => {
		const file = authStateFile(sessionId);
		const start = Date.now();
		const interval = setInterval(() => {
			try {
				const state = JSON.parse(fs.readFileSync(file, 'utf8')) as Record<
					string,
					unknown
				>;
				clearInterval(interval);
				resolve(state);
			} catch {
				if (Date.now() - start > timeoutMs) {
					clearInterval(interval);
					reject(new Error('Timed out waiting for OAuth server to start'));
				}
			}
		}, 100);
	});
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
): Promise<boolean> {
	let tokens: TokenResponse;
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
		return false;
	}

	if (!tokens.access_token) {
		out({
			error: `No access_token in response from ${oauthCfg.providerName}.`,
		});
		return false;
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
	return true;
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
// Background listen mode (used by --agent via detached spawn)
// ─────────────────────────────────────────────────────────────────────────────

async function oauthListen(
	database: CorsairDatabase,
	plugin: CorsairPlugin,
	kek: string,
	tenantId: string,
	sessionId: string,
): Promise<void> {
	const oauthCfg = getOAuthConfigForPlugin(plugin);
	if (!oauthCfg) {
		writeAuthState(sessionId, {
			status: 'error',
			error: `No oauthConfig defined on plugin '${plugin.id}'.`,
		});
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
		writeAuthState(sessionId, {
			status: 'error',
			error: `client_id not set for '${plugin.id}'.`,
		});
		return;
	}

	const clientSecret = await integrationKm.get_client_secret();
	if (!clientSecret) {
		writeAuthState(sessionId, {
			status: 'error',
			error: `client_secret not set for '${plugin.id}'.`,
		});
		return;
	}

	let redirectUri: string;
	let localhostPort: number;

	if (oauthCfg.requiresRegisteredRedirect) {
		const stored = await integrationKm.get_redirect_url();
		if (!stored) {
			writeAuthState(sessionId, {
				status: 'error',
				error: `redirect_url required for '${plugin.id}'.`,
			});
			return;
		}
		const match = stored.match(/^https?:\/\/(?:localhost|127\.0\.0\.1):(\d+)/);
		if (!match) {
			// Non-localhost registered redirect — can't auto-capture; signal caller to use --code flow
			const authParams: Record<string, string | null> = {
				client_id: clientId,
				redirect_uri: stored,
				response_type: 'code',
				scope: oauthCfg.scopes.join(' '),
				...oauthCfg.authParams,
			};
			const authUrl = `${oauthCfg.authUrl}?${querystring.stringify(authParams)}`;
			writeAuthState(sessionId, {
				status: 'needs_code',
				url: authUrl,
				redirectUri: stored,
			});
			return;
		}
		redirectUri = stored;
		localhostPort = parseInt(match[1]!, 10);
	} else {
		localhostPort = await findFreePort();
		redirectUri = `http://localhost:${localhostPort}`;
	}

	const authParams: Record<string, string | null> = {
		client_id: clientId,
		redirect_uri: redirectUri,
		response_type: 'code',
		scope: oauthCfg.scopes.join(' '),
		...oauthCfg.authParams,
	};
	const authUrl = `${oauthCfg.authUrl}?${querystring.stringify(authParams)}`;

	// Write the URL immediately so the parent --agent process can read it and exit
	writeAuthState(sessionId, { status: 'listening', url: authUrl });

	// Auto-kill after 10 minutes if user never completes sign-in
	const timeout = setTimeout(
		() => {
			writeAuthState(sessionId, {
				status: 'error',
				error: 'OAuth session timed out after 10 minutes.',
			});
			process.exit(0);
		},
		10 * 60 * 1000,
	);
	timeout.unref();

	let code: string;
	try {
		code = await waitForOAuthCode(localhostPort);
	} catch (err) {
		writeAuthState(sessionId, {
			status: 'error',
			error: `Authorization failed: ${err instanceof Error ? err.message : String(err)}`,
		});
		return;
	}

	const success = await oauthExchangeCode(
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
	writeAuthState(
		sessionId,
		success
			? { status: 'complete' }
			: { status: 'error', error: 'Token exchange failed.' },
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// Collect mode — check whether a background listen session completed
// ─────────────────────────────────────────────────────────────────────────────

async function oauthCollect(
	database: CorsairDatabase,
	plugin: CorsairPlugin,
	kek: string,
	tenantId: string,
	sessionId: string,
): Promise<void> {
	const extraAccountFields = getCustomAccountFields(plugin, 'oauth_2');
	const accountKm = createAccountKeyManager({
		authType: 'oauth_2',
		integrationName: plugin.id,
		tenantId,
		kek,
		database,
		extraAccountFields,
	});

	const accessToken = await accountKm.get_access_token();
	if (accessToken) {
		try {
			fs.unlinkSync(authStateFile(sessionId));
		} catch {
			/* already gone */
		}
		out({ status: 'success', plugin: plugin.id, tenant: tenantId });
		return;
	}

	// Check state file for errors from the background process
	try {
		const state = JSON.parse(
			fs.readFileSync(authStateFile(sessionId), 'utf8'),
		) as Record<string, unknown>;
		if (state.status === 'error') {
			out({ status: 'error', error: state.error });
			return;
		}
	} catch {
		/* state file gone or unreadable */
	}

	out({
		status: 'pending',
		message:
			'User has not completed sign-in yet. Try again after the user visits the auth URL.',
	});
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
	listen: listenMode = false,
	collect: collectMode = false,
	sessionId,
}: {
	cwd: string;
	pluginId?: string;
	tenantId?: string;
	/** OAuth authorization code to exchange for tokens. */
	code?: string;
	/** Output current credential status instead of starting OAuth flow. */
	credentials?: boolean;
	/** Internal: run as the background OAuth callback server for a given session. */
	listen?: boolean;
	/** Check whether the background OAuth session completed and tokens are stored. */
	collect?: boolean;
	/** Session ID tying --listen and --collect together. */
	sessionId?: string;
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

	if (listenMode) {
		if (!sessionId) {
			out({ error: '--listen requires --session=<id>.' });
			process.exit(1);
		}
		await oauthListen(database, plugin, kek, tenantId, sessionId);
		return;
	}

	if (collectMode) {
		if (!sessionId) {
			out({ error: '--collect requires --session=<id>.' });
			process.exit(1);
		}
		await oauthCollect(database, plugin, kek, tenantId, sessionId);
		return;
	}

	if (codeArg) {
		await oauthWithCode(database, plugin, kek, tenantId, codeArg);
		return;
	}

	// Default: spawn a background OAuth server, return the URL and the collect command.
	const session = crypto.randomUUID().slice(0, 8);
	const needsQuoting = tenantIdArg && /[^a-zA-Z0-9_\-.]/.test(tenantIdArg);
	const tenantFlag =
		tenantIdArg && tenantIdArg !== 'default'
			? `--tenant=${needsQuoting ? `"${tenantIdArg}"` : tenantIdArg}`
			: '';

	const spawnOpts: SpawnOptions = {
		detached: true,
		stdio: 'ignore',
		cwd: process.cwd(),
		env: process.env,
	};
	const child = spawn(
		process.execPath,
		[
			...process.execArgv,
			process.argv[1] ?? '',
			'auth',
			`--plugin=${plugin.id}`,
			'--listen',
			`--session=${session}`,
			...(tenantFlag ? [tenantFlag] : []),
		],
		spawnOpts,
	);
	child.unref();

	let state: Record<string, unknown>;
	try {
		state = await pollAuthState(session, 5000);
	} catch (err) {
		out({
			error: `Failed to start OAuth server: ${err instanceof Error ? err.message : String(err)}`,
		});
		return;
	}

	if (state.status === 'needs_code') {
		console.log(`\nAuthorize ${plugin.id}\n`);
		console.log(`  Open this URL in your browser:\n`);
		console.log(`    ${state.url as string}\n`);
		console.log(
			`  Once you've signed in, copy the code from the redirect URL and run:\n`,
		);
		console.log(`    pnpm corsair auth --plugin=${plugin.id} --code=CODE\n`);
		return;
	}

	if (state.status === 'error') {
		out({ error: state.error });
		return;
	}

	const collectCmd = [
		`pnpm corsair auth --plugin=${plugin.id}`,
		'--collect',
		`--session=${session}`,
		...(tenantFlag ? [tenantFlag] : []),
	].join(' ');

	console.log(`\nAuthorize ${plugin.id}\n`);
	console.log(`  Open this URL in your browser:\n`);
	console.log(`    ${state.url as string}\n`);
	console.log(`  Once you've signed in, run:\n`);
	console.log(`    ${collectCmd}\n`);
}
