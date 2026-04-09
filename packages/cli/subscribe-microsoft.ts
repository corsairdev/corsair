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
const MICROSOFT_TOKEN_URL =
	'https://login.microsoftonline.com/common/oauth2/v2.0/token';

// ─────────────────────────────────────────────────────────────────────────────
// Shared helpers
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

async function createGraphSubscription(
	accessToken: string,
	notificationUrl: string,
	resource: string,
	changeType: string,
	clientState: string,
	expiryMinutes: number,
): Promise<{ id: string; expirationDateTime: string }> {
	const expirationDateTime = new Date(
		Date.now() + expiryMinutes * 60 * 1000,
	).toISOString();

	const response = await fetch(`${GRAPH_API_BASE}/subscriptions`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			changeType,
			notificationUrl,
			resource,
			expirationDateTime,
			clientState,
		}),
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Graph subscription failed: ${error}`);
	}

	return response.json() as Promise<{ id: string; expirationDateTime: string }>;
}

async function refreshMicrosoftToken(
	clientId: string,
	clientSecret: string,
	refreshToken: string,
): Promise<{
	access_token: string;
	refresh_token?: string;
	expires_in: number;
}> {
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

// ─────────────────────────────────────────────────────────────────────────────
// Outlook
// ─────────────────────────────────────────────────────────────────────────────

type OutlookResourceType =
	| 'inboxMessages'
	| 'sentMessages'
	| 'newEvents'
	| 'eventChanges'
	| 'newContacts';

const OUTLOOK_RESOURCES: Record<
	OutlookResourceType,
	{ resource: string; changeType: string; label: string; expiryMinutes: number }
> = {
	inboxMessages: {
		resource: 'me/mailFolders/inbox/messages',
		changeType: 'created',
		label: 'Inbox Messages — new messages received',
		expiryMinutes: 4320, // 3 days (max for mail)
	},
	sentMessages: {
		resource: 'me/mailFolders/sentItems/messages',
		changeType: 'created',
		label: 'Sent Items — messages sent',
		expiryMinutes: 4320,
	},
	newEvents: {
		resource: 'me/events',
		changeType: 'created',
		label: 'Calendar Events — new events created',
		expiryMinutes: 4230, // max for calendar
	},
	eventChanges: {
		resource: 'me/events',
		changeType: 'created,updated,deleted',
		label: 'Calendar Events — updates & deletions',
		expiryMinutes: 4230,
	},
	newContacts: {
		resource: 'me/contacts',
		changeType: 'created',
		label: 'Contacts — new contacts created',
		expiryMinutes: 4230, // max for contacts
	},
};

export async function runOutlookSubscribe({
	cwd,
}: {
	cwd: string;
}): Promise<void> {
	p.intro('Corsair — Outlook Webhook Subscribe');

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

	const outlookPlugin = plugins.find((pl) => pl.id === 'outlook');
	if (!outlookPlugin) {
		spin.stop('Outlook plugin not found.');
		p.log.error('Add the outlook plugin to your corsair instance first.');
		p.outro('');
		process.exit(1);
	}

	spin.stop('Loaded.');

	const tenantId = await p.text({
		message: 'Enter tenant ID:',
		defaultValue: 'default',
		placeholder: 'default',
	});
	if (p.isCancel(tenantId)) {
		p.cancel('Operation cancelled.');
		process.exit(0);
	}

	const credSpin = p.spinner();
	credSpin.start('Fetching Outlook credentials...');

	const accountKm = createAccountKeyManager({
		authType: 'oauth_2',
		integrationName: 'outlook',
		tenantId: tenantId as string,
		kek,
		database,
		extraAccountFields: ['one'],
	});

	const accessToken = await accountKm.get_access_token();

	if (!accessToken) {
		credSpin.stop('Missing credentials.');
		p.log.error('Access token not set. Run: pnpm corsair auth --plugin=outlook');
		p.outro('');
		process.exit(1);
	}

	credSpin.stop('Credentials loaded.');

	const webhookUrl = await p.text({
		message: 'Enter your public webhook URL (ngrok or production):',
		placeholder: 'https://abc123.ngrok-free.app/api/webhook',
		validate: (v) => {
			if (!v || v.trim().length === 0) return 'Webhook URL is required';
			if (!v.startsWith('https://'))
				return 'URL must start with https:// (Microsoft Graph requires HTTPS)';
		},
	});
	if (p.isCancel(webhookUrl)) {
		p.cancel('Operation cancelled.');
		process.exit(0);
	}

	const selected = await p.multiselect<OutlookResourceType>({
		message: 'Select resources to subscribe to:',
		options: (
			Object.entries(OUTLOOK_RESOURCES) as [
				OutlookResourceType,
				(typeof OUTLOOK_RESOURCES)[OutlookResourceType],
			][]
		).map(([value, cfg]) => ({
			value,
			label: cfg.label,
			hint: `${cfg.resource} [${cfg.changeType}]`,
		})),
		required: true,
	});
	if (p.isCancel(selected)) {
		p.cancel('Operation cancelled.');
		process.exit(0);
	}

	const autoSecret = crypto.randomBytes(16).toString('hex');
	const clientState = await p.text({
		message: 'Enter a clientState secret (used to verify webhook payloads):',
		defaultValue: autoSecret,
		placeholder: autoSecret,
	});
	if (p.isCancel(clientState)) {
		p.cancel('Operation cancelled.');
		process.exit(0);
	}

	const results: string[] = [];
	let hasError = false;

	for (const value of selected as OutlookResourceType[]) {
		const cfg = OUTLOOK_RESOURCES[value];
		const subSpin = p.spinner();
		subSpin.start(`Creating subscription: ${cfg.label}...`);
		try {
			const subscription = await createGraphSubscription(
				accessToken,
				webhookUrl as string,
				cfg.resource,
				cfg.changeType,
				clientState as string,
				cfg.expiryMinutes,
			);
			subSpin.stop(`Created: ${cfg.label}`);
			results.push(
				`${cfg.label}\n  ID: ${subscription.id}\n  Expires: ${subscription.expirationDateTime}`,
			);
		} catch (error) {
			subSpin.stop(`Failed: ${cfg.label}`);
			p.log.error(error instanceof Error ? error.message : String(error));
			hasError = true;
		}
	}

	if (results.length > 0) {
		p.note(results.join('\n\n'), 'Subscriptions created');
	}

	const saveSpin = p.spinner();
	saveSpin.start('Saving webhook secret...');
	await accountKm.set_webhook_signature(clientState as string);
	saveSpin.stop('Webhook secret saved.');

	if (!hasError) {
		p.log.success('Outlook webhook subscriptions set up successfully.');
	} else {
		p.log.warn('Some subscriptions failed. Check errors above.');
	}

	p.note(
		`ClientState: ${clientState}\nWebhook URL: ${webhookUrl}\n\nNote: Outlook subscriptions expire. Re-run this command to renew.`,
		'Setup complete',
	);

	p.outro('Done!');
}

// ─────────────────────────────────────────────────────────────────────────────
// SharePoint
// ─────────────────────────────────────────────────────────────────────────────

const SHAREPOINT_MAX_EXPIRY_DAYS = 180;

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

	const data = (await response.json()) as {
		value?: Array<{ id: string; displayName: string; webUrl?: string }>;
	};
	return data.value ?? [];
}

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

export async function runSharepointSubscribe({
	cwd,
}: {
	cwd: string;
}): Promise<void> {
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
	if (p.isCancel(tenantId)) {
		p.cancel('Operation cancelled.');
		process.exit(0);
	}

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

	const [
		clientId,
		clientSecret,
		storedAccessToken,
		expiresAt,
		storedRefreshToken,
	] = await Promise.all([
		integrationKm.get_client_id(),
		integrationKm.get_client_secret(),
		accountKm.get_access_token(),
		accountKm.get_expires_at(),
		accountKm.get_refresh_token(),
	]);

	if (!storedRefreshToken) {
		credSpin.stop('Missing credentials.');
		p.log.error(
			'No refresh token found. Run: pnpm corsair auth --plugin=sharepoint',
		);
		p.outro('');
		process.exit(1);
	}

	if (!clientId || !clientSecret) {
		credSpin.stop('Missing credentials.');
		p.log.error(
			'Client ID/Secret not configured. Run: pnpm corsair setup --sharepoint',
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
			'Could not obtain a valid access token. Run: pnpm corsair auth --plugin=sharepoint',
		);
		p.outro('');
		process.exit(1);
	}

	credSpin.stop('Credentials loaded.');

	const webhookUrl = await p.text({
		message: 'Enter your public webhook URL (ngrok or production):',
		placeholder: 'https://abc123.ngrok-free.app/api/webhook',
		validate: (v) => {
			if (!v || v.trim().length === 0) return 'Webhook URL is required';
			if (!v.startsWith('https://'))
				return 'URL must start with https:// (SharePoint requires HTTPS)';
		},
	});
	if (p.isCancel(webhookUrl)) {
		p.cancel('Operation cancelled.');
		process.exit(0);
	}

	const pluginOptions = sharepointPlugin.options as
		| Record<string, unknown>
		| undefined;
	const defaultSiteId = (pluginOptions?.siteId as string | undefined) ?? '';

	const siteId = await p.text({
		message: 'Enter SharePoint site ID:',
		defaultValue: defaultSiteId,
		placeholder:
			'corsairdev.sharepoint.com:/sites/MySite  or  tenant.sharepoint.com,siteGuid,webGuid',
		validate: (v) => {
			if (!v || v.trim().length === 0) return 'Site ID is required';
		},
	});
	if (p.isCancel(siteId)) {
		p.cancel('Operation cancelled.');
		process.exit(0);
	}

	const listSpin = p.spinner();
	listSpin.start('Fetching lists from site...');

	let siteLists: Array<{ id: string; displayName: string; webUrl?: string }> =
		[];
	try {
		siteLists = await fetchSiteLists(accessToken, siteId as string);
		listSpin.stop(
			`Found ${siteLists.length} list${siteLists.length === 1 ? '' : 's'}.`,
		);
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
		if (p.isCancel(picked)) {
			p.cancel('Operation cancelled.');
			process.exit(0);
		}
		listId = picked as string;
	} else {
		const manualId = await p.text({
			message: 'Enter list ID (GUID) to subscribe to:',
			placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
			validate: (v) => {
				if (!v || v.trim().length === 0) return 'List ID is required';
			},
		});
		if (p.isCancel(manualId)) {
			p.cancel('Operation cancelled.');
			process.exit(0);
		}
		listId = manualId as string;
	}

	const expiryInput = await p.text({
		message: `Enter subscription expiry in days (max ${SHAREPOINT_MAX_EXPIRY_DAYS}):`,
		defaultValue: String(SHAREPOINT_MAX_EXPIRY_DAYS),
		placeholder: String(SHAREPOINT_MAX_EXPIRY_DAYS),
		validate: (v) => {
			const n = Number(v);
			if (isNaN(n) || n < 1) return 'Must be a positive number';
			if (n > SHAREPOINT_MAX_EXPIRY_DAYS)
				return `Max expiry is ${SHAREPOINT_MAX_EXPIRY_DAYS} days`;
		},
	});
	if (p.isCancel(expiryInput)) {
		p.cancel('Operation cancelled.');
		process.exit(0);
	}

	const autoSecret = crypto.randomBytes(16).toString('hex');
	const clientState = await p.text({
		message: 'Enter a clientState secret (used to verify webhook payloads):',
		defaultValue: autoSecret,
		placeholder: autoSecret,
	});
	if (p.isCancel(clientState)) {
		p.cancel('Operation cancelled.');
		process.exit(0);
	}

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

// ─────────────────────────────────────────────────────────────────────────────
// Teams
// ─────────────────────────────────────────────────────────────────────────────

type TeamsResourceType =
	| 'channelMessage'
	| 'chatMessage'
	| 'channelCreated'
	| 'membershipChanged';

function buildTeamsResource(
	resourceType: TeamsResourceType,
	ids: Record<string, string>,
): string {
	switch (resourceType) {
		case 'channelMessage':
			return `teams/${ids.teamId}/channels/${ids.channelId}/messages`;
		case 'chatMessage':
			return `chats/${ids.chatId}/messages`;
		case 'channelCreated':
			return `teams/${ids.teamId}/channels`;
		case 'membershipChanged':
			return `teams/${ids.teamId}/members`;
	}
}

const TEAMS_MAX_EXPIRY_MINUTES: Record<TeamsResourceType, number> = {
	channelMessage: 60,
	chatMessage: 60,
	channelCreated: 4230,
	membershipChanged: 60,
};

export async function runTeamsSubscribe({
	cwd,
}: {
	cwd: string;
}): Promise<void> {
	p.intro('Corsair — Microsoft Teams Webhook Subscribe');

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

	const teamsPlugin = plugins.find((pl) => pl.id === 'teams');
	if (!teamsPlugin) {
		spin.stop('Teams plugin not found.');
		p.log.error('Add the teams plugin to your corsair instance first.');
		p.outro('');
		process.exit(1);
	}

	spin.stop('Loaded.');

	const tenantId = await p.text({
		message: 'Enter tenant ID:',
		defaultValue: 'default',
		placeholder: 'default',
	});
	if (p.isCancel(tenantId)) {
		p.cancel('Operation cancelled.');
		process.exit(0);
	}

	const credSpin = p.spinner();
	credSpin.start('Fetching Teams credentials...');

	const accountKm = createAccountKeyManager({
		authType: 'oauth_2',
		integrationName: 'teams',
		tenantId: tenantId as string,
		kek,
		database,
		extraAccountFields: ['one'],
	});

	const accessToken = await accountKm.get_access_token();

	if (!accessToken) {
		credSpin.stop('Missing credentials.');
		p.log.error('Access token not set. Run: pnpm corsair auth --plugin=teams');
		p.outro('');
		process.exit(1);
	}

	credSpin.stop('Credentials loaded.');

	const webhookUrl = await p.text({
		message: 'Enter your public webhook URL (ngrok or production):',
		placeholder: 'https://abc123.ngrok-free.app/api/webhook',
		validate: (v) => {
			if (!v || v.trim().length === 0) return 'Webhook URL is required';
			if (!v.startsWith('https://'))
				return 'URL must start with https:// (Microsoft Graph requires HTTPS)';
		},
	});
	if (p.isCancel(webhookUrl)) {
		p.cancel('Operation cancelled.');
		process.exit(0);
	}

	const selectedResourceTypes = await p.multiselect<TeamsResourceType>({
		message: 'Select resources to subscribe to:',
		options: [
			{
				value: 'channelMessage',
				label: 'Channel Messages  (teams/{id}/channels/{id}/messages)',
			},
			{
				value: 'chatMessage',
				label: 'Chat Messages     (chats/{id}/messages)',
			},
			{
				value: 'channelCreated',
				label: 'Channel Created   (teams/{id}/channels)',
			},
			{
				value: 'membershipChanged',
				label: 'Membership Changed (teams/{id}/members)',
			},
		],
		required: true,
	});
	if (p.isCancel(selectedResourceTypes)) {
		p.cancel('Operation cancelled.');
		process.exit(0);
	}

	const resourceConfigs: Array<{
		resourceType: TeamsResourceType;
		ids: Record<string, string>;
	}> = [];

	for (const resourceType of selectedResourceTypes as TeamsResourceType[]) {
		const ids: Record<string, string> = {};

		if (resourceType === 'chatMessage') {
			const chatId = await p.text({
				message: `[${resourceType}] Enter chat ID:`,
				placeholder: '19:abc123@thread.v2',
				validate: (v) => {
					if (!v || !v.trim()) return 'Chat ID is required';
				},
			});
			if (p.isCancel(chatId)) {
				p.cancel('Operation cancelled.');
				process.exit(0);
			}
			ids.chatId = chatId as string;
		} else {
			const teamId = await p.text({
				message: `[${resourceType}] Enter team ID:`,
				placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
				validate: (v) => {
					if (!v || !v.trim()) return 'Team ID is required';
				},
			});
			if (p.isCancel(teamId)) {
				p.cancel('Operation cancelled.');
				process.exit(0);
			}
			ids.teamId = teamId as string;

			if (resourceType === 'channelMessage') {
				const channelId = await p.text({
					message: `[${resourceType}] Enter channel ID:`,
					placeholder: '19:abc123@thread.skype',
					validate: (v) => {
						if (!v || !v.trim()) return 'Channel ID is required';
					},
				});
				if (p.isCancel(channelId)) {
					p.cancel('Operation cancelled.');
					process.exit(0);
				}
				ids.channelId = channelId as string;
			}
		}

		resourceConfigs.push({ resourceType, ids });
	}

	const autoSecret = crypto.randomBytes(16).toString('hex');
	const clientState = await p.text({
		message: 'Enter a clientState secret (used to verify webhook payloads):',
		defaultValue: autoSecret,
		placeholder: autoSecret,
	});
	if (p.isCancel(clientState)) {
		p.cancel('Operation cancelled.');
		process.exit(0);
	}

	const results: string[] = [];
	let hasError = false;

	for (const { resourceType, ids } of resourceConfigs) {
		const resource = buildTeamsResource(resourceType, ids);
		const expiryMinutes = TEAMS_MAX_EXPIRY_MINUTES[resourceType];

		const subSpin = p.spinner();
		subSpin.start(`Creating subscription: ${resourceType}...`);
		try {
			const subscription = await createGraphSubscription(
				accessToken,
				webhookUrl as string,
				resource,
				'created,updated,deleted',
				clientState as string,
				expiryMinutes,
			);
			subSpin.stop(`Created: ${resourceType}`);
			results.push(
				`${resourceType}\n  Resource: ${resource}\n  ID: ${subscription.id}\n  Expires: ${subscription.expirationDateTime}`,
			);
		} catch (error) {
			subSpin.stop(`Failed: ${resourceType}`);
			p.log.error(error instanceof Error ? error.message : String(error));
			hasError = true;
		}
	}

	if (results.length > 0) {
		p.note(results.join('\n\n'), 'Subscriptions created');
	}

	const saveSpin = p.spinner();
	saveSpin.start('Saving webhook secret...');
	await accountKm.set_webhook_signature(clientState as string);
	saveSpin.stop('Webhook secret saved.');

	if (!hasError) {
		p.log.success('Teams webhook subscriptions set up successfully.');
	} else {
		p.log.warn('Some subscriptions failed. Check errors above.');
	}

	p.note(
		`ClientState: ${clientState}\nWebhook URL: ${webhookUrl}\n\nNote: Teams subscriptions expire. Re-run this command to renew.`,
		'Setup complete',
	);

	p.outro('Done!');
}

// ─────────────────────────────────────────────────────────────────────────────
// OneDrive
// ─────────────────────────────────────────────────────────────────────────────

// Microsoft Graph max subscription lifetime for drive resources (minutes)
const ONEDRIVE_MAX_EXPIRY_MINUTES = 4230;

type OnedriveResourceType = 'personalDrive' | 'specificDrive' | 'specificFolder';

const ONEDRIVE_RESOURCE_OPTIONS: {
	value: OnedriveResourceType;
	label: string;
	hint: string;
}[] = [
	{
		value: 'personalDrive',
		label: "Personal Drive Root — all changes to the user's drive",
		hint: 'me/drive/root',
	},
	{
		value: 'specificDrive',
		label: 'Specific Drive Root — all changes to a given drive ID',
		hint: 'drives/{driveId}/root',
	},
	{
		value: 'specificFolder',
		label: 'Specific Folder — changes within a given item/folder',
		hint: 'me/drive/items/{itemId}',
	},
];

function buildOnedriveResource(
	resourceType: OnedriveResourceType,
	ids: { driveId?: string; itemId?: string },
): string {
	switch (resourceType) {
		case 'personalDrive':
			return 'me/drive/root';
		case 'specificDrive':
			return `drives/${ids.driveId}/root`;
		case 'specificFolder':
			return `me/drive/items/${ids.itemId}`;
	}
}

export async function runOnedriveSubscribe({
	cwd,
}: {
	cwd: string;
}): Promise<void> {
	p.intro('Corsair — OneDrive Webhook Subscribe');

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

	const onedrivePlugin = plugins.find((pl) => pl.id === 'onedrive');
	if (!onedrivePlugin) {
		spin.stop('OneDrive plugin not found.');
		p.log.error('Add the onedrive plugin to your corsair instance first.');
		p.outro('');
		process.exit(1);
	}

	spin.stop('Loaded.');

	const tenantId = await p.text({
		message: 'Enter tenant ID:',
		defaultValue: 'default',
		placeholder: 'default',
	});
	if (p.isCancel(tenantId)) {
		p.cancel('Operation cancelled.');
		process.exit(0);
	}

	const credSpin = p.spinner();
	credSpin.start('Fetching OneDrive credentials...');

	const accountKm = createAccountKeyManager({
		authType: 'oauth_2',
		integrationName: 'onedrive',
		tenantId: tenantId as string,
		kek,
		database,
	});

	const accessToken = await accountKm.get_access_token();

	if (!accessToken) {
		credSpin.stop('Missing credentials.');
		p.log.error(
			'Access token not set. Run: pnpm corsair auth --plugin=onedrive',
		);
		p.outro('');
		process.exit(1);
	}

	credSpin.stop('Credentials loaded.');

	const webhookUrl = await p.text({
		message: 'Enter your public webhook URL (ngrok or production):',
		placeholder: 'https://abc123.ngrok-free.app/api/webhook',
		validate: (v) => {
			if (!v || v.trim().length === 0) return 'Webhook URL is required';
			if (!v.startsWith('https://'))
				return 'URL must start with https:// (Microsoft Graph requires HTTPS)';
		},
	});
	if (p.isCancel(webhookUrl)) {
		p.cancel('Operation cancelled.');
		process.exit(0);
	}

	const selectedResourceTypes = await p.multiselect<OnedriveResourceType>({
		message: 'Select resources to subscribe to:',
		options: ONEDRIVE_RESOURCE_OPTIONS,
		required: true,
	});
	if (p.isCancel(selectedResourceTypes)) {
		p.cancel('Operation cancelled.');
		process.exit(0);
	}

	const resourceConfigs: Array<{
		resourceType: OnedriveResourceType;
		ids: { driveId?: string; itemId?: string };
	}> = [];

	for (const resourceType of selectedResourceTypes as OnedriveResourceType[]) {
		const ids: { driveId?: string; itemId?: string } = {};

		if (resourceType === 'specificDrive') {
			const driveId = await p.text({
				message: `[${resourceType}] Enter drive ID:`,
				placeholder: 'b!abc123...',
				validate: (v) => {
					if (!v || !v.trim()) return 'Drive ID is required';
				},
			});
			if (p.isCancel(driveId)) {
				p.cancel('Operation cancelled.');
				process.exit(0);
			}
			ids.driveId = driveId as string;
		} else if (resourceType === 'specificFolder') {
			const itemId = await p.text({
				message: `[${resourceType}] Enter item/folder ID:`,
				placeholder: '01ABC123...',
				validate: (v) => {
					if (!v || !v.trim()) return 'Item ID is required';
				},
			});
			if (p.isCancel(itemId)) {
				p.cancel('Operation cancelled.');
				process.exit(0);
			}
			ids.itemId = itemId as string;
		}

		resourceConfigs.push({ resourceType, ids });
	}

	const autoSecret = crypto.randomBytes(16).toString('hex');
	const clientState = await p.text({
		message: 'Enter a clientState secret (used to verify webhook payloads):',
		defaultValue: autoSecret,
		placeholder: autoSecret,
	});
	if (p.isCancel(clientState)) {
		p.cancel('Operation cancelled.');
		process.exit(0);
	}

	const results: string[] = [];
	let hasError = false;

	for (const { resourceType, ids } of resourceConfigs) {
		const resource = buildOnedriveResource(resourceType, ids);

		const subSpin = p.spinner();
		subSpin.start(`Creating subscription: ${resourceType}...`);
		try {
			// OneDrive drive resources only support 'updated' as changeType
			const subscription = await createGraphSubscription(
				accessToken,
				webhookUrl as string,
				resource,
				'updated',
				clientState as string,
				ONEDRIVE_MAX_EXPIRY_MINUTES,
			);
			subSpin.stop(`Created: ${resourceType}`);
			results.push(
				`${resourceType}\n  Resource: ${resource}\n  ID: ${subscription.id}\n  Expires: ${subscription.expirationDateTime}`,
			);
		} catch (error) {
			subSpin.stop(`Failed: ${resourceType}`);
			p.log.error(error instanceof Error ? error.message : String(error));
			hasError = true;
		}
	}

	if (results.length > 0) {
		p.note(results.join('\n\n'), 'Subscriptions created');
	}

	const saveSpin = p.spinner();
	saveSpin.start('Saving webhook secret...');
	await accountKm.set_webhook_signature(clientState as string);
	saveSpin.stop('Webhook secret saved.');

	if (!hasError) {
		p.log.success('OneDrive webhook subscriptions set up successfully.');
	} else {
		p.log.warn('Some subscriptions failed. Check errors above.');
	}

	p.note(
		`ClientState: ${clientState}\nWebhook URL: ${webhookUrl}\n\nNote: OneDrive subscriptions expire. Re-run this command to renew.`,
		'Setup complete',
	);

	p.outro('Done!');
}
