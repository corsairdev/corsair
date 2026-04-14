import * as p from '@clack/prompts';
import { loadInternalConfig } from '../utils/load-config';
import { promptClientState, promptTenantId, promptWebhookUrl, requireNonInteractive } from '../utils/prompts';
import { resolveAccessToken, saveWebhookSignature } from './credentials';
import { createGraphSubscription } from './graph';

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
	tenantId: presetTenant,
	webhookUrl: presetWebhookUrl,
	clientState: presetClientState,
	resources: presetResources,
	driveId: presetDriveId,
	itemId: presetItemId,
}: {
	cwd: string;
	tenantId?: string;
	webhookUrl?: string;
	clientState?: string;
	resources?: string[];
	driveId?: string;
	itemId?: string;
}): Promise<void> {
	const { internal } = await loadInternalConfig(
		cwd,
		'Corsair — OneDrive Webhook Subscribe',
		'onedrive',
		'OneDrive',
	);

	if (!process.stdin.isTTY) {
		const missing: { flag: string; description: string }[] = [];
		if (!presetWebhookUrl)
			missing.push({ flag: '--webhook-url=<url>', description: 'Public HTTPS webhook URL' });
		if (!presetResources?.length)
			missing.push({
				flag: '--resources=<comma-list>',
				description: 'personalDrive, specificDrive, specificFolder',
			});
		if (presetResources?.length) {
			if (presetResources.includes('specificDrive') && !presetDriveId)
				missing.push({
					flag: '--drive-id=<id>',
					description: 'Drive ID (required for specificDrive)',
				});
			if (presetResources.includes('specificFolder') && !presetItemId)
				missing.push({
					flag: '--item-id=<id>',
					description: 'Item/folder ID (required for specificFolder)',
				});
		}
		requireNonInteractive(missing);
	}

	const tenantId = await promptTenantId(presetTenant);
	const { accessToken, accountKm } = await resolveAccessToken(
		'onedrive',
		tenantId,
		internal,
	);
	const webhookUrl = await promptWebhookUrl(presetWebhookUrl);

	let selectedResourceTypes: OnedriveResourceType[];
	if (presetResources?.length) {
		selectedResourceTypes = presetResources as OnedriveResourceType[];
	} else {
		const picked = await p.multiselect<OnedriveResourceType>({
			message: 'Select resources to subscribe to:',
			options: ONEDRIVE_RESOURCE_OPTIONS,
			required: true,
		});
		if (p.isCancel(picked)) {
			p.cancel('Operation cancelled.');
			process.exit(0);
		}
		selectedResourceTypes = picked as OnedriveResourceType[];
	}

	const resourceConfigs: Array<{
		resourceType: OnedriveResourceType;
		ids: { driveId?: string; itemId?: string };
	}> = [];

	for (const resourceType of selectedResourceTypes) {
		const ids: { driveId?: string; itemId?: string } = {};

		if (resourceType === 'specificDrive') {
			if (presetDriveId) {
				ids.driveId = presetDriveId;
			} else {
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
			}
		} else if (resourceType === 'specificFolder') {
			if (presetItemId) {
				ids.itemId = presetItemId;
			} else {
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
		}

		resourceConfigs.push({ resourceType, ids });
	}

	const clientState = await promptClientState(presetClientState);

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
				webhookUrl,
				resource,
				'updated',
				clientState,
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

	await saveWebhookSignature(accountKm, clientState);

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
