import * as crypto from 'node:crypto';
import * as p from '@clack/prompts';
import type { CorsairInternalConfig } from 'corsair/core';
import {
	CORSAIR_INTERNAL,
	createAccountKeyManager,
	createIntegrationKeyManager,
} from 'corsair/core';
import { getCorsairInstance } from './index';

const GRAPH_API_BASE = 'https://graph.microsoft.com/v1.0';
const MICROSOFT_TOKEN_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';

// SharePoint webhook subscriptions expire after a maximum of 180 days
const SHAREPOINT_MAX_EXPIRY_DAYS = 180;

// ─────────────────────────────────────────────────────────────────────────────
// Token refresh
// ─────────────────────────────────────────────────────────────────────────────

async function refreshToken(
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

	// Microsoft token response is untyped; cast to extract the expected fields
	return response.json() as Promise<{ access_token: string; refresh_token?: string; expires_in: number }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

async function extractInternalConfig(cwd: string): Promise<CorsairInternalConfig> {
	const instance = await getCorsairInstance({ cwd, shouldThrowOnError: true });

	// CORSAIR_INTERNAL is a well-known symbol; cast to access it on the instance
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
// SharePoint API helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Builds a full Graph API URL for a site sub-resource, handling both site ID
 * formats:
 *   - hostname:path  e.g. "tenant.sharepoint.com:/sites/MySite"
 *     → /sites/tenant.sharepoint.com:/sites/MySite:/subpath
 *   - GUID           e.g. "tenant.sharepoint.com,siteGuid,webGuid"
 *     → /sites/tenant.sharepoint.com,siteGuid,webGuid/subpath
 *
 * The colon before the sub-resource is required by Graph API when using the
 * hostname:path format — without it, Graph returns itemNotFound.
 */
function buildSiteUrl(siteId: string, subpath: string): string {
	const isHostnamePath = siteId.includes(':') && !siteId.includes(',');
	return isHostnamePath
		? `${GRAPH_API_BASE}/sites/${siteId}:/${subpath}`
		: `${GRAPH_API_BASE}/sites/${siteId}/${subpath}`;
}

async function fetchSiteLists(
	accessToken: string,
	siteId: string,
): Promise<Array<{ id: string; displayName: string; webUrl?: string }>> {
	const response = await fetch(
		`${buildSiteUrl(siteId, 'lists')}?$select=id,displayName,webUrl`,
		{
			headers: { Authorization: `Bearer ${accessToken}` },
		},
	);

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Failed to fetch site lists: ${error}`);
	}

	// Graph API response is untyped; cast to extract the value array
	const data = (await response.json()) as { value?: Array<{ id: string; displayName: string; webUrl?: string }> };
	return data.value ?? [];
}

// ─────────────────────────────────────────────────────────────────────────────
// SharePoint subscription
// ─────────────────────────────────────────────────────────────────────────────

async function createSharepointSubscription(
	accessToken: string,
	siteId: string,
	listId: string,
	notificationUrl: string,
	clientState: string,
	expiryDays: number,
): Promise<{ id: string; expirationDateTime: string }> {
	const expirationDateTime = new Date(
		Date.now() + expiryDays * 24 * 60 * 60 * 1000,
	).toISOString();

	const response = await fetch(
		buildSiteUrl(siteId, `lists/${encodeURIComponent(listId)}/subscriptions`),
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				notificationUrl,
				expirationDateTime,
				clientState,
			}),
		},
	);

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`SharePoint subscription failed: ${error}`);
	}

	return response.json() as Promise<{ id: string; expirationDateTime: string }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// CLI command
// ─────────────────────────────────────────────────────────────────────────────

export async function runSharepointSubscribe({ cwd }: { cwd: string }): Promise<void> {
	p.intro('Corsair — SharePoint Webhook Subscribe');

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

	const sharepointPlugin = plugins.find((pl) => pl.id === 'sharepoint');
	if (!sharepointPlugin) {
		spin.stop('SharePoint plugin not found.');
		p.log.error('Add the sharepoint plugin to your corsair instance first.');
		p.outro('');
		process.exit(1);
	}

	spin.stop('Loaded.');

	const tenantId = await p.text({
		message: 'Enter tenant ID:',
		defaultValue: 'default',
		placeholder: 'default',
	});
	if (p.isCancel(tenantId)) { p.cancel('Operation cancelled.'); process.exit(0); }

	const credSpin = p.spinner();
	credSpin.start('Fetching SharePoint credentials...');

	const integrationKm = createIntegrationKeyManager({
		authType: 'oauth_2',
		integrationName: 'sharepoint',
		kek,
		database,
	});

	const accountKm = createAccountKeyManager({
		authType: 'oauth_2',
		integrationName: 'sharepoint',
		tenantId: tenantId as string,
		kek,
		database,
	});

	const [clientId, clientSecret, storedAccessToken, expiresAt, storedRefreshToken] = await Promise.all([
		integrationKm.get_client_id(),
		integrationKm.get_client_secret(),
		accountKm.get_access_token(),
		accountKm.get_expires_at(),
		accountKm.get_refresh_token(),
	]);

	if (!storedRefreshToken) {
		credSpin.stop('Missing credentials.');
		p.log.error('No refresh token found. Run: pnpm corsair auth --plugin=sharepoint');
		p.outro('');
		process.exit(1);
	}

	if (!clientId || !clientSecret) {
		credSpin.stop('Missing credentials.');
		p.log.error('Client ID/Secret not configured. Run: pnpm corsair setup --sharepoint');
		p.outro('');
		process.exit(1);
	}

	// Refresh if the stored token is missing or expired
	let accessToken = storedAccessToken;
	const now = Math.floor(Date.now() / 1000);
	const needsRefresh = !accessToken || !expiresAt || Number(expiresAt) <= now + 5 * 60;

	if (needsRefresh) {
		credSpin.message('Refreshing access token...');
		try {
			const tokenData = await refreshToken(clientId, clientSecret, storedRefreshToken);
			accessToken = tokenData.access_token;
			await accountKm.set_access_token(tokenData.access_token);
			await accountKm.set_expires_at(String(now + tokenData.expires_in));
			// Microsoft issues a new refresh token on each refresh — persist it
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
		p.log.error('Could not obtain a valid access token. Run: pnpm corsair auth --plugin=sharepoint');
		p.outro('');
		process.exit(1);
	}

	credSpin.stop('Credentials loaded.');

	// Site ID — pre-filled from plugin options if available
	const pluginOptions = sharepointPlugin.options as Record<string, unknown> | undefined;
	const defaultSiteId = (pluginOptions?.siteId as string | undefined) ?? '';

	const siteId = await p.text({
		message: 'Enter SharePoint site ID:',
		defaultValue: defaultSiteId,
		placeholder: 'corsairdev.sharepoint.com:/sites/MySite  or  tenant.sharepoint.com,siteGuid,webGuid',
		validate: (v) => {
			if (!v || v.trim().length === 0) return 'Site ID is required';
		},
	});
	if (p.isCancel(siteId)) { p.cancel('Operation cancelled.'); process.exit(0); }

	// Fetch lists from the site so the user can pick by name rather than entering a raw GUID
	const listSpin = p.spinner();
	listSpin.start('Fetching lists from site...');

	let siteLists: Array<{ id: string; displayName: string; webUrl?: string }> = [];
	try {
		siteLists = await fetchSiteLists(accessToken, siteId as string);
		listSpin.stop(`Found ${siteLists.length} list${siteLists.length === 1 ? '' : 's'}.`);
	} catch (error) {
		listSpin.stop('Could not fetch lists.');
		p.log.warn(error instanceof Error ? error.message : String(error));
	}

	let listId: string;

	if (siteLists.length > 0) {
		const picked = await p.select({
			message: 'Select a list to subscribe to:',
			options: siteLists.map((l) => ({
				value: l.id,
				label: l.displayName,
				hint: l.id,
			})),
		});
		if (p.isCancel(picked)) { p.cancel('Operation cancelled.'); process.exit(0); }
		listId = picked as string;
	} else {
		// Fallback: manual GUID entry if list fetch failed or returned nothing
		const manualId = await p.text({
			message: 'Enter list ID (GUID) to subscribe to:',
			placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
			validate: (v) => {
				if (!v || v.trim().length === 0) return 'List ID is required';
			},
		});
		if (p.isCancel(manualId)) { p.cancel('Operation cancelled.'); process.exit(0); }
		listId = manualId as string;
	}

	// Webhook URL
	const webhookUrl = await p.text({
		message: 'Enter your public webhook URL (ngrok or production):',
		placeholder: 'https://abc123.ngrok-free.app/api/webhook',
		validate: (v) => {
			if (!v || v.trim().length === 0) return 'Webhook URL is required';
			if (!v.startsWith('https://')) return 'URL must start with https:// (SharePoint requires HTTPS)';
		},
	});
	if (p.isCancel(webhookUrl)) { p.cancel('Operation cancelled.'); process.exit(0); }

	// Expiry days
	const expiryInput = await p.text({
		message: `Enter subscription expiry in days (max ${SHAREPOINT_MAX_EXPIRY_DAYS}):`,
		defaultValue: String(SHAREPOINT_MAX_EXPIRY_DAYS),
		placeholder: String(SHAREPOINT_MAX_EXPIRY_DAYS),
		validate: (v) => {
			const n = Number(v);
			if (isNaN(n) || n < 1) return 'Must be a positive number';
			if (n > SHAREPOINT_MAX_EXPIRY_DAYS) return `Max expiry is ${SHAREPOINT_MAX_EXPIRY_DAYS} days`;
		},
	});
	if (p.isCancel(expiryInput)) { p.cancel('Operation cancelled.'); process.exit(0); }

	// clientState (webhook secret used to verify incoming payloads)
	const autoSecret = crypto.randomBytes(16).toString('hex');
	const clientState = await p.text({
		message: 'Enter a clientState secret (used to verify webhook payloads):',
		defaultValue: autoSecret,
		placeholder: autoSecret,
	});
	if (p.isCancel(clientState)) { p.cancel('Operation cancelled.'); process.exit(0); }

	const expiryDays = Number(expiryInput);

	const subSpin = p.spinner();
	subSpin.start('Creating SharePoint webhook subscription...');

	let subscription: { id: string; expirationDateTime: string };
	try {
		subscription = await createSharepointSubscription(
			accessToken,
			siteId as string,
			listId,
			webhookUrl as string,
			clientState as string,
			expiryDays,
		);
	} catch (error) {
		subSpin.stop('Failed.');
		p.log.error(error instanceof Error ? error.message : String(error));
		p.outro('');
		process.exit(1);
	}

	subSpin.stop('Subscription created.');

	// Persist clientState so the webhook handler can verify incoming payloads
	const saveSpin = p.spinner();
	saveSpin.start('Saving webhook secret...');
	await accountKm.set_webhook_signature(clientState as string);
	saveSpin.stop('Webhook secret saved.');

	p.note(
		`Subscription ID:  ${subscription.id}\nSite ID:          ${siteId}\nList ID:          ${listId}\nExpires:          ${subscription.expirationDateTime}\nClientState:      ${clientState}\nWebhook URL:      ${webhookUrl}\n\nNote: SharePoint subscriptions expire after ${SHAREPOINT_MAX_EXPIRY_DAYS} days max. Re-run this command to renew.`,
		'SharePoint Subscription Created',
	);

	p.outro('Done!');
}
