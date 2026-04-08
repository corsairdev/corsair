import * as crypto from 'node:crypto';
import * as p from '@clack/prompts';
import type { CorsairInternalConfig } from 'corsair/core';
import { CORSAIR_INTERNAL, createAccountKeyManager } from 'corsair/core';
import { getCorsairInstance } from './index';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const GRAPH_API_BASE = 'https://graph.microsoft.com/v1.0';

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

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

async function extractInternalConfig(cwd: string): Promise<CorsairInternalConfig> {
	const instance = await getCorsairInstance({ cwd, shouldThrowOnError: true });
	const internal = (instance as Record<string | symbol, unknown>)[CORSAIR_INTERNAL] as
		| CorsairInternalConfig
		| undefined;
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
	const expirationDateTime = new Date(Date.now() + expiryMinutes * 60 * 1000).toISOString();

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

// ─────────────────────────────────────────────────────────────────────────────
// Entry point
// ─────────────────────────────────────────────────────────────────────────────

export async function runOutlookSubscribe({ cwd }: { cwd: string }): Promise<void> {
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
	if (p.isCancel(tenantId)) { p.cancel('Operation cancelled.'); process.exit(0); }

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
		p.log.error('Access token not set. Run: corsair auth --plugin=outlook');
		p.outro('');
		process.exit(1);
	}

	credSpin.stop('Credentials loaded.');

	// Webhook URL
	const webhookUrl = await p.text({
		message: 'Enter your public webhook URL (ngrok or production):',
		placeholder: 'https://abc123.ngrok-free.app/api/webhook',
		validate: (v) => {
			if (!v || v.trim().length === 0) return 'Webhook URL is required';
			if (!v.startsWith('https://')) return 'URL must start with https:// (Microsoft Graph requires HTTPS)';
		},
	});
	if (p.isCancel(webhookUrl)) { p.cancel('Operation cancelled.'); process.exit(0); }

	// Resource selection (multiselect — Outlook subscriptions are per-resource)
	const selected = await p.multiselect<OutlookResourceType>({
		message: 'Select resources to subscribe to:',
		options: (Object.entries(OUTLOOK_RESOURCES) as [OutlookResourceType, typeof OUTLOOK_RESOURCES[OutlookResourceType]][]).map(
			([value, cfg]) => ({
				value,
				label: cfg.label,
				hint: `${cfg.resource} [${cfg.changeType}]`,
			}),
		),
		required: true,
	});
	if (p.isCancel(selected)) { p.cancel('Operation cancelled.'); process.exit(0); }

	// clientState (webhook secret for signature verification)
	const autoSecret = crypto.randomBytes(16).toString('hex');
	const clientState = await p.text({
		message: 'Enter a clientState secret (used to verify webhook payloads):',
		defaultValue: autoSecret,
		placeholder: autoSecret,
	});
	if (p.isCancel(clientState)) { p.cancel('Operation cancelled.'); process.exit(0); }

	// Create subscriptions
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

	// Save clientState as webhook_signature
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
