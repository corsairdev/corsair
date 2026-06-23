import 'dotenv/config';

import { setupCorsair } from 'corsair';
import {
	createHubConnectSession,
	getHubConfig,
	getManagedAccessToken,
	processManagedOAuthDelivery,
} from 'corsair/hub';

import { sqlite } from '@/db';
import { corsair } from '@/server/corsair';

// Single-tenant instances use 'default' for API calls.
const TENANT_ID = 'default';
const APP_URL = process.env.APP_URL ?? 'http://localhost:3001';
const HUB_API_URL = process.env.HUB_API_URL ?? 'https://auth.corsair.dev';

type TestResult = {
	name: string;
	status: 'pass' | 'fail' | 'skip';
	detail?: string;
};

const results: TestResult[] = [];

function record(
	name: string,
	status: TestResult['status'],
	detail?: string,
): void {
	results.push({ name, status, detail });
	const icon = status === 'pass' ? '✓' : status === 'skip' ? '○' : '✗';
	console.log(`${icon} ${name}${detail ? `: ${detail}` : ''}`);
}

async function testHubConfig(): Promise<void> {
	try {
		const hub = getHubConfig(corsair);
		record(
			'Hub config',
			'pass',
			`apiUrl=${hub.apiUrl}, deliveryUrl=${hub.deliveryUrl}`,
		);
	} catch (error) {
		record(
			'Hub config',
			'fail',
			error instanceof Error ? error.message : String(error),
		);
	}
}

async function testDeliveryEndpointHealth(): Promise<void> {
	try {
		const response = await fetch(`${APP_URL}/api/corsair`);
		const body = (await response.json()) as { status?: string };
		if (response.ok && body.status === 'ok') {
			record('Delivery endpoint health', 'pass');
			return;
		}
		record(
			'Delivery endpoint health',
			'fail',
			`HTTP ${response.status}: ${JSON.stringify(body)}`,
		);
	} catch (error) {
		record(
			'Delivery endpoint health',
			'fail',
			error instanceof Error ? error.message : String(error),
		);
	}
}

async function testByoConnectSession(): Promise<void> {
	try {
		const session = await createHubConnectSession(corsair, {
			plugin: 'googlecalendar',
			tenantId: TENANT_ID,
			source: 'client',
			oauthMode: 'byo',
		});

		const connectUrl = session.connectUrl;
		if (!connectUrl.includes('/connect/')) {
			record(
				'BYO connect session',
				'fail',
				`Unexpected connectUrl: ${connectUrl}`,
			);
			return;
		}

		record('BYO connect session', 'pass', connectUrl.slice(0, 100));
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		if (message.includes('client_id not configured')) {
			record(
				'BYO connect session',
				'fail',
				'Google Calendar client_id/client_secret not set — run setupCorsair with credentials',
			);
			return;
		}
		record('BYO connect session', 'fail', message);
	}
}

async function testManagedConnectSession(): Promise<void> {
	try {
		const session = await createHubConnectSession(corsair, {
			plugin: 'github',
			tenantId: TENANT_ID,
			source: 'client',
			oauthMode: 'managed',
		});

		if (!session.connectUrl.includes('/connect/')) {
			record(
				'Managed GitHub connect session',
				'fail',
				`Unexpected connectUrl: ${session.connectUrl}`,
			);
			return;
		}

		record(
			'Managed GitHub connect session',
			'pass',
			session.connectUrl.slice(0, 100),
		);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		if (
			message.includes('Managed OAuth is not configured') ||
			message.includes('managed OAuth requires source: server')
		) {
			record(
				'Managed GitHub connect session',
				'skip',
				'Hub needs GITHUB_MANAGED_CLIENT_ID/SECRET and loopback client-source support deployed',
			);
			return;
		}
		record('Managed GitHub connect session', 'fail', message);
	}
}

async function testIntegrationCredentials(): Promise<void> {
	await setupCorsair(corsair, { backfill: false, tenantId: TENANT_ID });

	const row = sqlite
		.prepare(`SELECT config FROM corsair_integrations WHERE name = ?`)
		.get('googlecalendar') as { config: string | null } | undefined;

	if (!row?.config || row.config.length < 20) {
		record(
			'Google Calendar OAuth app credentials',
			'fail',
			'Integration missing client_id/client_secret',
		);
		return;
	}

	record('Google Calendar OAuth app credentials', 'pass');
}

async function testStoredGoogleCalendarTokens(): Promise<void> {
	const row = sqlite
		.prepare(
			`SELECT a.config
       FROM corsair_accounts a
       JOIN corsair_integrations i ON i.id = a.integration_id
       WHERE i.name = ? AND a.tenant_id = ?`,
		)
		.get('googlecalendar', TENANT_ID) as { config: string | null } | undefined;

	if (!row?.config || row.config === '{}' || row.config.length < 10) {
		record(
			'Stored Google Calendar tokens',
			'skip',
			'No tokens yet — connect Google Calendar via the demo UI',
		);
		return;
	}

	record('Stored Google Calendar tokens', 'pass', `tenant=${TENANT_ID}`);
}

async function testStoredGitHubManagedTokens(): Promise<void> {
	const row = sqlite
		.prepare(
			`SELECT a.config
       FROM corsair_accounts a
       JOIN corsair_integrations i ON i.id = a.integration_id
       WHERE i.name = ? AND a.tenant_id = ?`,
		)
		.get('github', TENANT_ID) as { config: string | null } | undefined;

	if (!row?.config || row.config === '{}' || row.config.length < 10) {
		record(
			'Stored GitHub managed tokens',
			'skip',
			'No tokens yet — connect GitHub via the demo UI',
		);
		return;
	}

	record('Stored GitHub managed tokens', 'pass', `tenant=${TENANT_ID}`);
}

async function testGoogleCalendarApiCall(): Promise<void> {
	await setupCorsair(corsair, { backfill: false, tenantId: TENANT_ID });

	try {
		const events = await corsair.googlecalendar.api.events.getMany({
			calendarId: 'primary',
			maxResults: 3,
		});
		const count = Array.isArray(events.items) ? events.items.length : 0;
		record(
			'Google Calendar API (events.getMany)',
			'pass',
			`${count} event(s) returned`,
		);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		if (
			message.includes('invalid_grant') ||
			message.includes('AuthMissing') ||
			message.includes('No client id')
		) {
			record(
				'Google Calendar API (events.getMany)',
				'skip',
				'Tokens missing or expired — reconnect via Hub',
			);
			return;
		}
		record('Google Calendar API (events.getMany)', 'fail', message);
	}
}

async function testManagedOAuthDeliveryHandler(): Promise<void> {
	const deliveryTestTenant = 'managed-delivery-test';
	await setupCorsair(corsair, {
		backfill: false,
		tenantId: deliveryTestTenant,
	});

	try {
		await processManagedOAuthDelivery(corsair, {
			plugin: 'github',
			tenantId: deliveryTestTenant,
			accessToken: 'test-managed-access-token',
			refreshToken: 'test-managed-refresh-token',
			expiresIn: 3600,
			scope: 'repo user',
		});

		record('Managed OAuth delivery handler', 'pass');
	} catch (error) {
		record(
			'Managed OAuth delivery handler',
			'fail',
			error instanceof Error ? error.message : String(error),
		);
	}
}

async function testManagedTokenRefresh(): Promise<void> {
	const hub = getHubConfig(corsair);

	try {
		const response = await fetch(`${hub.apiUrl}/oauth/refresh`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				authorization: `Bearer ${hub.projectApiKey}`,
			},
			body: JSON.stringify({ plugin: 'github', tenantId: TENANT_ID }),
		});

		const payload = (await response.json()) as {
			error?: string;
			message?: string;
			access_token?: string;
		};

		if (response.ok && payload.access_token) {
			record('Managed token refresh (hub /oauth/refresh)', 'pass');
			return;
		}

		const message =
			payload.error ?? payload.message ?? `HTTP ${response.status}`;
		if (
			message.includes('Managed OAuth is not configured') ||
			message.includes('not configured for plugin')
		) {
			record(
				'Managed token refresh (hub /oauth/refresh)',
				'skip',
				'GITHUB_MANAGED credentials not on hub',
			);
			return;
		}
		if (response.status === 404 || message.includes('connection not found')) {
			record(
				'Managed token refresh (hub /oauth/refresh)',
				'skip',
				'No managed GitHub connection on hub yet — connect via UI first',
			);
			return;
		}

		record('Managed token refresh (hub /oauth/refresh)', 'fail', message);
	} catch (error) {
		record(
			'Managed token refresh (hub /oauth/refresh)',
			'fail',
			error instanceof Error ? error.message : String(error),
		);
	}
}

async function testGitHubApiCall(): Promise<void> {
	await setupCorsair(corsair, { backfill: false, tenantId: TENANT_ID });

	const hub = getHubConfig(corsair);
	try {
		await getManagedAccessToken(
			{
				keys: corsair.github.keys,
				hub,
				plugin: 'github',
				tenantId: TENANT_ID,
			},
			{ forceRefresh: true },
		);

		const repositories = await corsair.github.api.repositories.list({});
		const count = Array.isArray(repositories) ? repositories.length : 0;
		record(
			'GitHub API (repositories.list)',
			'pass',
			`${count} repo(s) — managed auth + hub refresh working`,
		);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		if (
			message.includes('AuthMissing') ||
			message.includes('connection not found')
		) {
			record(
				'GitHub API (repositories.list)',
				'skip',
				'Connect GitHub via managed OAuth in the demo UI first',
			);
			return;
		}
		if (
			message.includes('test-managed-access-token') ||
			message.includes('Unauthorized') ||
			message.includes('Bad credentials') ||
			message.includes('401')
		) {
			record(
				'GitHub API (repositories.list)',
				'fail',
				'Token invalid — reconnect GitHub or force refresh from hub',
			);
			return;
		}
		record('GitHub API (repositories.list)', 'fail', message);
	}
}

function printSummary(): void {
	const passed = results.filter((result) => result.status === 'pass').length;
	const failed = results.filter((result) => result.status === 'fail').length;
	const skipped = results.filter((result) => result.status === 'skip').length;

	console.log('\n--- Summary ---');
	console.log(`Passed: ${passed}  Failed: ${failed}  Skipped: ${skipped}`);

	if (failed > 0) {
		process.exitCode = 1;
	}
}

async function main(): Promise<void> {
	console.log('=== Corsair Hub Integration Tests ===\n');
	console.log(`App: ${APP_URL}`);
	console.log(`Hub: ${HUB_API_URL}`);
	console.log(`Tenant: ${TENANT_ID}\n`);

	console.log('--- BYO (Google Calendar) ---');
	await testByoConnectSession();
	await testIntegrationCredentials();
	await testStoredGoogleCalendarTokens();
	await testGoogleCalendarApiCall();

	console.log('\n--- Managed (GitHub) ---');
	await testHubConfig();
	await testDeliveryEndpointHealth();
	await testManagedConnectSession();
	await testStoredGitHubManagedTokens();
	await testManagedTokenRefresh();
	await testGitHubApiCall();
	await testManagedOAuthDeliveryHandler();

	printSummary();
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
