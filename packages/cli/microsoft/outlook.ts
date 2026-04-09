import * as p from '@clack/prompts';
import { loadInternalConfig } from '../utils/load-config';
import { promptClientState, promptTenantId, promptWebhookUrl } from '../utils/prompts';
import { resolveAccessToken, saveWebhookSignature } from './credentials';
import { createGraphSubscription } from './graph';

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
		changeType: 'updated,deleted',
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

export async function runOutlookSubscribe({ cwd }: { cwd: string }): Promise<void> {
	const { internal } = await loadInternalConfig(
		cwd,
		'Corsair — Outlook Webhook Subscribe',
		'outlook',
		'Outlook',
	);

	const tenantId = await promptTenantId();
	const { accessToken, accountKm } = await resolveAccessToken(
		'outlook',
		tenantId,
		internal,
	);
	const webhookUrl = await promptWebhookUrl();

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

	const clientState = await promptClientState();

	const results: string[] = [];
	let hasError = false;

	for (const value of selected as OutlookResourceType[]) {
		const cfg = OUTLOOK_RESOURCES[value];
		const subSpin = p.spinner();
		subSpin.start(`Creating subscription: ${cfg.label}...`);
		try {
			const subscription = await createGraphSubscription(
				accessToken,
				webhookUrl,
				cfg.resource,
				cfg.changeType,
				clientState,
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

	await saveWebhookSignature(accountKm, clientState);

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
