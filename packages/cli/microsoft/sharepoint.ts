import * as p from '@clack/prompts';
import { loadInternalConfig } from '../utils/load-config';
import { promptClientState, promptTenantId, promptWebhookUrl, requireNonInteractive } from '../utils/prompts';
import { resolveAccessToken, saveWebhookSignature } from './credentials';
import { GRAPH_API_BASE } from './graph';

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
		{ headers: { Authorization: `Bearer ${accessToken}` } },
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
			body: JSON.stringify({ notificationUrl, expirationDateTime, clientState }),
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
	tenantId: presetTenant,
	webhookUrl: presetWebhookUrl,
	clientState: presetClientState,
	siteId: presetSiteId,
	listId: presetListId,
}: {
	cwd: string;
	tenantId?: string;
	webhookUrl?: string;
	clientState?: string;
	siteId?: string;
	listId?: string;
}): Promise<void> {
	const { internal, plugin: sharepointPlugin } = await loadInternalConfig(
		cwd,
		'Corsair — SharePoint Webhook Subscribe',
		'sharepoint',
		'SharePoint',
	);

	if (!process.stdin.isTTY) {
		const missing: { flag: string; description: string }[] = [];
		if (!presetWebhookUrl)
			missing.push({ flag: '--webhook-url=<url>', description: 'Public HTTPS webhook URL' });
		if (!presetSiteId)
			missing.push({
				flag: '--site-id=<id>',
				description: 'SharePoint site ID (e.g. tenant.sharepoint.com:/sites/MySite)',
			});
		if (!presetListId)
			missing.push({ flag: '--list-id=<id>', description: 'List GUID to subscribe to' });
		requireNonInteractive(missing);
	}

	const tenantId = await promptTenantId(presetTenant);
	const { accessToken, accountKm } = await resolveAccessToken(
		'sharepoint',
		tenantId,
		internal,
	);
	const webhookUrl = await promptWebhookUrl(presetWebhookUrl);

	const pluginOptions = (
		sharepointPlugin as { options?: Record<string, unknown> }
	).options;
	const defaultSiteId = (pluginOptions?.siteId as string | undefined) ?? '';

	let siteId: string;
	if (presetSiteId) {
		siteId = presetSiteId;
	} else {
		const input = await p.text({
			message: 'Enter SharePoint site ID:',
			defaultValue: defaultSiteId,
			placeholder:
				'corsairdev.sharepoint.com:/sites/MySite  or  tenant.sharepoint.com,siteGuid,webGuid',
			validate: (v) => {
				if (!v || v.trim().length === 0) return 'Site ID is required';
			},
		});
		if (p.isCancel(input)) {
			p.cancel('Operation cancelled.');
			process.exit(0);
		}
		siteId = input as string;
	}

	let listId: string;
	if (presetListId) {
		listId = presetListId;
	} else {
		const listSpin = p.spinner();
		listSpin.start('Fetching lists from site...');

		let siteLists: Array<{ id: string; displayName: string; webUrl?: string }> = [];
		try {
			siteLists = await fetchSiteLists(accessToken, siteId);
			listSpin.stop(
				`Found ${siteLists.length} list${siteLists.length === 1 ? '' : 's'}.`,
			);
		} catch (error) {
			listSpin.stop('Could not fetch lists.');
			p.log.warn(error instanceof Error ? error.message : String(error));
		}

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
	}

	const clientState = await promptClientState(presetClientState);
	const expiryDays = SHAREPOINT_MAX_EXPIRY_DAYS;

	const subSpin = p.spinner();
	subSpin.start('Creating SharePoint webhook subscription...');

	let subscription: { id: string; expirationDateTime: string };
	try {
		subscription = await createSharepointSubscription(
			accessToken,
			siteId,
			listId,
			webhookUrl,
			clientState,
			expiryDays,
		);
	} catch (error) {
		subSpin.stop('Failed.');
		p.log.error(error instanceof Error ? error.message : String(error));
		p.outro('');
		process.exit(1);
	}

	subSpin.stop('Subscription created.');

	await saveWebhookSignature(accountKm, clientState);

	p.note(
		`Subscription ID:  ${subscription.id}\nSite ID:          ${siteId}\nList ID:          ${listId}\nExpires:          ${subscription.expirationDateTime}\nClientState:      ${clientState}\nWebhook URL:      ${webhookUrl}\n\nNote: SharePoint subscriptions expire after ${SHAREPOINT_MAX_EXPIRY_DAYS} days max. Re-run this command to renew.`,
		'SharePoint Subscription Created',
	);

	p.outro('Done!');
}
