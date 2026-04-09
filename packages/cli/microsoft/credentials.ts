import * as p from '@clack/prompts';
import type { CorsairInternalConfig } from 'corsair/core';
import { createAccountKeyManager, createIntegrationKeyManager } from 'corsair/core';

const MICROSOFT_TOKEN_URL =
	'https://login.microsoftonline.com/common/oauth2/v2.0/token';

// Structural type scoped to the methods callers actually use, avoiding the
// generic variance issue with ReturnType<typeof createAccountKeyManager>.
export type MicrosoftAccountKm = {
	set_access_token(value: string | null): Promise<void>;
	set_expires_at(value: string | null): Promise<void>;
	set_refresh_token(value: string | null): Promise<void>;
	set_webhook_signature(value: string | null): Promise<void>;
};

async function refreshMicrosoftToken(
	clientId: string,
	clientSecret: string,
	refreshToken: string,
): Promise<{ access_token: string; refresh_token?: string; expires_in: number }> {
	const response = await fetch(MICROSOFT_TOKEN_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			client_id: clientId,
			client_secret: clientSecret,
			refresh_token: refreshToken,
			grant_type: 'refresh_token',
		}),
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Token refresh failed: ${error}`);
	}

	return response.json() as Promise<{
		access_token: string;
		refresh_token?: string;
		expires_in: number;
	}>;
}

export async function resolveAccessToken(
	integrationName: string,
	tenantId: string,
	internal: CorsairInternalConfig,
): Promise<{ accessToken: string; accountKm: MicrosoftAccountKm }> {
	const { kek, database } = internal;

	const credSpin = p.spinner();
	credSpin.start(`Fetching ${integrationName} credentials...`);

	const integrationKm = createIntegrationKeyManager({
		authType: 'oauth_2',
		integrationName,
		kek,
		database: database!,
	});

	const accountKm = createAccountKeyManager({
		authType: 'oauth_2',
		integrationName,
		tenantId,
		kek,
		database: database!,
	});

	const [clientId, clientSecret, storedAccessToken, expiresAt, storedRefreshToken] =
		await Promise.all([
			integrationKm.get_client_id(),
			integrationKm.get_client_secret(),
			accountKm.get_access_token(),
			accountKm.get_expires_at(),
			accountKm.get_refresh_token(),
		]);

	if (!storedRefreshToken) {
		credSpin.stop('Missing credentials.');
		p.log.error(
			`No refresh token found. Run: pnpm corsair auth --plugin=${integrationName}`,
		);
		p.outro('');
		process.exit(1);
	}

	if (!clientId || !clientSecret) {
		credSpin.stop('Missing credentials.');
		p.log.error(
			`Client ID/Secret not configured. Run: pnpm corsair setup --${integrationName}`,
		);
		p.outro('');
		process.exit(1);
	}

	let accessToken = storedAccessToken;
	const now = Math.floor(Date.now() / 1000);
	const needsRefresh =
		!accessToken || !expiresAt || Number(expiresAt) <= now + 5 * 60;

	if (needsRefresh) {
		credSpin.message('Refreshing access token...');
		try {
			const tokenData = await refreshMicrosoftToken(
				clientId,
				clientSecret,
				storedRefreshToken,
			);
			accessToken = tokenData.access_token;
			await accountKm.set_access_token(tokenData.access_token);
			await accountKm.set_expires_at(String(now + tokenData.expires_in));
			if (tokenData.refresh_token) {
				await accountKm.set_refresh_token(tokenData.refresh_token);
			}
		} catch (error) {
			credSpin.stop('Failed.');
			p.log.error(error instanceof Error ? error.message : String(error));
			p.outro('');
			process.exit(1);
		}
	}

	if (!accessToken) {
		credSpin.stop('Missing credentials.');
		p.log.error(
			`Could not obtain a valid access token. Run: pnpm corsair auth --plugin=${integrationName}`,
		);
		p.outro('');
		process.exit(1);
	}

	credSpin.stop('Credentials loaded.');
	return { accessToken, accountKm };
}

export async function saveWebhookSignature(
	accountKm: { set_webhook_signature(sig: string): Promise<void> },
	clientState: string,
): Promise<void> {
	const saveSpin = p.spinner();
	saveSpin.start('Saving webhook secret...');
	await accountKm.set_webhook_signature(clientState);
	saveSpin.stop('Webhook secret saved.');
}
