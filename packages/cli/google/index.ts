import * as p from '@clack/prompts';
import type { CorsairInternalConfig } from 'corsair/core';
import { CORSAIR_INTERNAL, createAccountKeyManager, createIntegrationKeyManager } from 'corsair/core';
import { getCorsairInstance } from '../index';
import { promptTenantId, requireNonInteractive } from '../utils/prompts';
import { setupCalendarWatch } from './calendar';
import { setupDriveWatch } from './drive';
import { setupGmailWatch } from './gmail';
import { refreshGoogleAccessToken } from './shared';
import { setupSheetsWatch } from './sheets';

const GOOGLE_PLUGINS = [
	'gmail',
	'googledrive',
	'googlecalendar',
	'googlesheets',
] as const;
type GooglePlugin = (typeof GOOGLE_PLUGINS)[number];

async function extractInternalConfig(cwd: string): Promise<CorsairInternalConfig> {
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

export async function runGoogleSubscribe({
	cwd,
	pluginId: preselectedPluginId,
	tenantId: presetTenant,
	webhookUrl: presetWebhookUrl,
	topicName: presetTopicName,
	calendarId: presetCalendarId,
}: {
	cwd: string;
	pluginId?: string;
	tenantId?: string;
	webhookUrl?: string;
	topicName?: string;
	calendarId?: string;
}): Promise<void> {
	p.intro('Corsair — Google Webhook Subscribe');

	// In non-interactive mode, pluginId must be provided upfront (it is always
	// set when called from `corsair auth --plugin=<id> --webhook`)
	if (!process.stdin.isTTY && !preselectedPluginId) {
		requireNonInteractive([
			{
				flag: '--plugin=<id>',
				description: 'Google plugin: gmail, googledrive, googlecalendar, googlesheets',
			},
		]);
	}

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
		return (
			opts?.authType === 'oauth_2' &&
			GOOGLE_PLUGINS.includes(pl.id as GooglePlugin)
		);
	});

	if (googlePlugins.length === 0) {
		spin.stop('No Google OAuth2 plugins found.');
		p.outro('');
		process.exit(1);
	}

	spin.stop(
		`Loaded. Found ${googlePlugins.length} Google plugin${googlePlugins.length === 1 ? '' : 's'}.`,
	);

	let pluginType: GooglePlugin;

	if (
		preselectedPluginId &&
		GOOGLE_PLUGINS.includes(preselectedPluginId as GooglePlugin)
	) {
		pluginType = preselectedPluginId as GooglePlugin;
	} else {
		const selected = await p.select({
			message: 'Select a Google integration:',
			options: googlePlugins.map((pl) => ({ value: pl.id, label: pl.id })),
		});
		if (p.isCancel(selected)) {
			p.cancel('Operation cancelled.');
			process.exit(0);
		}
		pluginType = selected as GooglePlugin;
	}

	// Non-interactive check: validate plugin-specific required flags now that
	// we know the pluginType
	if (!process.stdin.isTTY) {
		const missing: { flag: string; description: string }[] = [];
		if (pluginType === 'gmail') {
			if (!presetTopicName)
				missing.push({
					flag: '--topic=<pubsub-topic>',
					description: 'Pub/Sub topic name (e.g. projects/my-project/topics/my-topic)',
				});
		} else {
			// googledrive, googlecalendar, googlesheets all need a webhook URL
			if (!presetWebhookUrl)
				missing.push({ flag: '--webhook-url=<url>', description: 'Public webhook URL' });
		}
		requireNonInteractive(missing);
	}

	if (pluginType === 'googlesheets') {
		let webhookUrl: string;
		if (presetWebhookUrl) {
			webhookUrl = presetWebhookUrl;
		} else {
			const input = await p.text({
				message: 'Enter webhook URL:',
				placeholder: 'https://example.com/api/webhook',
				validate: (v) => {
					if (!v || v.trim().length === 0) return 'Webhook URL is required';
					if (!v.startsWith('http://') && !v.startsWith('https://'))
						return 'Webhook URL must start with http:// or https://';
				},
			});
			if (p.isCancel(input)) {
				p.cancel('Operation cancelled.');
				process.exit(0);
			}
			webhookUrl = input as string;
		}
		await setupSheetsWatch(webhookUrl);
		p.outro('Done!');
		return;
	}

	const tenantId = await promptTenantId(presetTenant);

	const credSpin = p.spinner();
	credSpin.start('Fetching credentials...');

	try {
		const integrationKm = createIntegrationKeyManager({
			authType: 'oauth_2',
			integrationName: pluginType,
			kek,
			database,
		});

		const accountKm = createAccountKeyManager({
			authType: 'oauth_2',
			integrationName: pluginType,
			tenantId,
			kek,
			database,
		});

		const clientId = await integrationKm.get_client_id();
		const clientSecret = await integrationKm.get_client_secret();
		const refreshToken = await accountKm.get_refresh_token();

		if (!clientId || !clientSecret || !refreshToken) {
			credSpin.stop('Missing credentials.');
			p.log.error(
				'Client ID, Client Secret, and Refresh Token are required. Use "corsair auth" to set them.',
			);
			p.outro('');
			process.exit(1);
		}

		const accessToken = await refreshGoogleAccessToken(clientId, clientSecret, refreshToken);

		credSpin.stop('Credentials loaded.');

		if (pluginType === 'gmail') {
			let topicName: string;
			if (presetTopicName) {
				topicName = presetTopicName;
			} else {
				const input = await p.text({
					message: 'Enter Pub/Sub topic name:',
					placeholder: 'projects/my-project/topics/my-topic',
					validate: (v) => {
						if (!v || v.trim().length === 0) return 'Topic name is required';
					},
				});
				if (p.isCancel(input)) {
					p.cancel('Operation cancelled.');
					process.exit(0);
				}
				topicName = input as string;
			}
			await setupGmailWatch(accessToken, topicName);
		} else if (pluginType === 'googledrive') {
			let webhookUrl: string;
			if (presetWebhookUrl) {
				webhookUrl = presetWebhookUrl;
			} else {
				const input = await p.text({
					message: 'Enter webhook URL:',
					placeholder: 'https://example.com/api/webhook',
					validate: (v) => {
						if (!v || v.trim().length === 0) return 'Webhook URL is required';
					},
				});
				if (p.isCancel(input)) {
					p.cancel('Operation cancelled.');
					process.exit(0);
				}
				webhookUrl = input as string;
			}
			await setupDriveWatch(accessToken, webhookUrl);
		} else if (pluginType === 'googlecalendar') {
			let webhookUrl: string;
			if (presetWebhookUrl) {
				webhookUrl = presetWebhookUrl;
			} else {
				const input = await p.text({
					message: 'Enter webhook URL:',
					placeholder: 'https://example.com/api/webhook',
					validate: (v) => {
						if (!v || v.trim().length === 0) return 'Webhook URL is required';
					},
				});
				if (p.isCancel(input)) {
					p.cancel('Operation cancelled.');
					process.exit(0);
				}
				webhookUrl = input as string;
			}
			let calendarId: string;
			if (presetCalendarId) {
				calendarId = presetCalendarId;
			} else {
				// In non-interactive mode this is unreachable (check above requires webhookUrl,
				// and calendarId has a sensible default), but guard anyway
				if (!process.stdin.isTTY) {
					calendarId = 'primary';
				} else {
					const input = await p.text({
						message: 'Enter calendar ID:',
						defaultValue: 'primary',
						placeholder: 'primary',
					});
					if (p.isCancel(input)) {
						p.cancel('Operation cancelled.');
						process.exit(0);
					}
					calendarId = input as string;
				}
			}
			await setupCalendarWatch(accessToken, webhookUrl, calendarId);
		} else {
			p.log.error(`Unsupported Google plugin: ${pluginType}`);
			process.exit(1);
		}
	} catch (error) {
		credSpin.stop('Failed.');
		p.log.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
		process.exit(1);
	}

	p.outro('Done!');
}
