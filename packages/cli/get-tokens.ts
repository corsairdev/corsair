import * as https from 'node:https';
import * as querystring from 'node:querystring';
import * as p from '@clack/prompts';
import type { CorsairInternalConfig } from 'corsair/core';
import {
	CORSAIR_INTERNAL,
	createAccountKeyManager,
	createIntegrationKeyManager,
} from 'corsair/core';
import { getCorsairInstance } from './index';

const GOOGLE_SCOPES: Record<string, string[]> = {
	gmail: [
		'https://www.googleapis.com/auth/gmail.modify',
		'https://www.googleapis.com/auth/gmail.labels',
		'https://www.googleapis.com/auth/gmail.send',
		'https://www.googleapis.com/auth/gmail.compose',
	],
	googlesheets: ['https://www.googleapis.com/auth/spreadsheets'],
	googledrive: ['https://www.googleapis.com/auth/drive'],
	googlecalendar: ['https://www.googleapis.com/auth/calendar'],
};

function getScopesForPlugin(pluginId: string): string[] {
	return GOOGLE_SCOPES[pluginId] || [];
}

const REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob';

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

function exchangeCodeForTokens(
	code: string,
	clientId: string,
	clientSecret: string,
): Promise<{
	access_token?: string;
	refresh_token?: string;
	expires_in?: number;
	token_type?: string;
}> {
	return new Promise((resolve, reject) => {
		const postData = querystring.stringify({
			code: code.trim(),
			client_id: clientId,
			client_secret: clientSecret,
			redirect_uri: REDIRECT_URI,
			grant_type: 'authorization_code',
		});

		const options = {
			hostname: 'oauth2.googleapis.com',
			path: '/token',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(postData),
			},
		};

		const req = https.request(options, (res) => {
			let data = '';
			res.on('data', (chunk) => {
				data += chunk;
			});
			res.on('end', () => {
				if (res.statusCode !== 200) {
					const errorData = JSON.parse(data || '{}');
					reject(
						new Error(`Token exchange failed: ${JSON.stringify(errorData)}`),
					);
					return;
				}
				resolve(JSON.parse(data));
			});
		});

		req.on('error', (error) => {
			reject(new Error(`Request failed: ${error.message}`));
		});

		req.write(postData);
		req.end();
	});
}

export async function runGetTokens({ cwd }: { cwd: string }): Promise<void> {
	p.intro('Corsair — Google OAuth2 Token Generator');

	const spin = p.spinner();
	spin.start('Loading corsair instance...');

	let internal: CorsairInternalConfig;
	try {
		internal = await extractInternalConfig(cwd);
	} catch (error) {
		spin.stop('Failed to load.');
		p.log.error(error instanceof Error ? error.message : String(error));
		p.outro('');
		process.exit(1);
	}

	const { plugins, database, kek } = internal;

	if (!database) {
		spin.stop('Failed.');
		p.log.error('No database adapter configured.');
		p.outro('');
		process.exit(1);
	}

	const googlePlugins = plugins.filter((pl) => {
		const opts = pl.options as Record<string, unknown> | undefined;
		return opts?.authType === 'oauth_2';
	});

	if (googlePlugins.length === 0) {
		spin.stop('No OAuth2 plugins found.');
		p.outro('');
		process.exit(1);
	}

	spin.stop(
		`Loaded. Found ${googlePlugins.length} OAuth2 plugin${googlePlugins.length === 1 ? '' : 's'}.`,
	);

	const pluginId = await p.select({
		message: 'Select a plugin to get tokens for:',
		options: googlePlugins.map((pl) => ({
			value: pl.id,
			label: pl.id,
		})),
	});

	if (p.isCancel(pluginId)) {
		p.cancel('Operation cancelled.');
		process.exit(0);
	}

	const integrationKm = createIntegrationKeyManager({
		authType: 'oauth_2',
		integrationName: pluginId as string,
		kek,
		database,
	});

	let clientId: string | null = null;
	let clientSecret: string | null = null;

	try {
		clientId = await integrationKm.get_client_id();
		clientSecret = await integrationKm.get_client_secret();
	} catch {
		// credentials not set yet
	}

	if (!clientId) {
		const inputClientId = await p.text({
			message: 'Enter Google Client ID:',
			validate: (v) => {
				if (!v || v.trim().length === 0) return 'Client ID is required';
			},
		});
		if (p.isCancel(inputClientId)) {
			p.cancel('Operation cancelled.');
			process.exit(0);
		}
		clientId = inputClientId as string;
	} else {
		p.log.info(`Using Client ID from corsair: ${clientId.slice(0, 12)}...`);
	}

	if (!clientSecret) {
		const inputClientSecret = await p.password({
			message: 'Enter Google Client Secret:',
			mask: '*',
		});
		if (p.isCancel(inputClientSecret)) {
			p.cancel('Operation cancelled.');
			process.exit(0);
		}
		clientSecret = inputClientSecret as string;
	} else {
		p.log.info('Using Client Secret from corsair.');
	}

	const scopes = getScopesForPlugin(pluginId as string);
	if (scopes.length === 0) {
		p.log.error(`No scopes configured for plugin: ${pluginId}`);
		p.outro('');
		process.exit(1);
	}

	const authParams = querystring.stringify({
		client_id: clientId,
		redirect_uri: REDIRECT_URI,
		response_type: 'code',
		scope: scopes.join(' '),
		access_type: 'offline',
		prompt: 'consent',
	});

	const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${authParams}`;

	p.log.info('\n1. Visit this URL in your browser:');
	console.log(`\n${authUrl}\n`);
	p.log.info('2. Authorize the application');
	p.log.info('3. Copy the authorization code\n');

	const code = await p.text({
		message: 'Enter the authorization code:',
		validate: (v) => {
			if (!v || v.trim().length === 0) return 'Authorization code is required';
		},
	});

	if (p.isCancel(code)) {
		p.cancel('Operation cancelled.');
		process.exit(0);
	}

	const tokenSpin = p.spinner();
	tokenSpin.start('Exchanging authorization code for tokens...');

	try {
		const tokens = await exchangeCodeForTokens(
			code as string,
			clientId,
			clientSecret,
		);

		if (!tokens.access_token) {
			tokenSpin.stop('Failed.');
			p.log.error('No access token received from Google.');
			p.outro('');
			process.exit(1);
		}

		tokenSpin.stop('Tokens received.');

		const lines: string[] = [];
		lines.push(`Access Token: ${tokens.access_token.slice(0, 20)}...`);
		if (tokens.refresh_token) {
			lines.push(`Refresh Token: ${tokens.refresh_token.slice(0, 20)}...`);
		}
		lines.push(`Expires In: ${tokens.expires_in} seconds`);
		if (!tokens.refresh_token) {
			lines.push(
				'\nWarning: No refresh token received. You may need to re-authorize.',
			);
		}
		p.note(lines.join('\n'), 'Tokens');

		const tenantId = await p.text({
			message: 'Enter tenant ID to save tokens for:',
			defaultValue: 'default',
			placeholder: 'default',
		});

		if (p.isCancel(tenantId)) {
			p.cancel('Operation cancelled.');
			process.exit(0);
		}

		const shouldSave = await p.confirm({
			message: `Save tokens to corsair for tenant '${tenantId}'?`,
		});

		if (p.isCancel(shouldSave) || !shouldSave) {
			p.log.info('Tokens not saved.');
			p.outro('Done!');
			return;
		}

		const saveSpin = p.spinner();
		saveSpin.start('Saving tokens...');

		const accountKm = createAccountKeyManager({
			authType: 'oauth_2',
			integrationName: pluginId as string,
			tenantId: tenantId as string,
			kek,
			database,
		});

		await accountKm.set_access_token(tokens.access_token);
		if (tokens.refresh_token) {
			await accountKm.set_refresh_token(tokens.refresh_token);
		}
		if (tokens.expires_in) {
			await accountKm.set_expires_at(
				(Date.now() + tokens.expires_in * 1000).toString(),
			);
		}

		saveSpin.stop('Tokens saved to corsair.');
	} catch (error) {
		tokenSpin.stop('Failed.');
		p.log.error(
			`Error: ${error instanceof Error ? error.message : String(error)}`,
		);
		process.exit(1);
	}

	p.outro('Done!');
}
