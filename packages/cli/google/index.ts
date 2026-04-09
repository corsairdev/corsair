import * as p from '@clack/prompts';
import type { CorsairInternalConfig } from 'corsair/core';
import { CORSAIR_INTERNAL, createAccountKeyManager, createIntegrationKeyManager } from 'corsair/core';
import { getCorsairInstance } from '../index';
import { promptTenantId } from '../utils/prompts';
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
}: {
	cwd: string;
	pluginId?: string;
}): Promise<void> {
	p.intro('Corsair — Google Webhook Subscribe');

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

	if (pluginType === 'googlesheets') {
		const webhookUrl = await p.text({
			message: 'Enter webhook URL:',
			placeholder: 'https://example.com/api/webhook',
			validate: (v) => {
				if (!v || v.trim().length === 0) return 'Webhook URL is required';
				if (!v.startsWith('http://') && !v.startsWith('https://'))
					return 'Webhook URL must start with http:// or https://';
			},
		});
		if (p.isCancel(webhookUrl)) {
			p.cancel('Operation cancelled.');
			process.exit(0);
		}
		await setupSheetsWatch(webhookUrl as string);
		p.outro('Done!');
		return;
	}

	const tenantId = await promptTenantId();

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
			const topicName = await p.text({
				message: 'Enter Pub/Sub topic name:',
				placeholder: 'projects/my-project/topics/my-topic',
				validate: (v) => {
					if (!v || v.trim().length === 0) return 'Topic name is required';
				},
			});
			if (p.isCancel(topicName)) {
				p.cancel('Operation cancelled.');
				process.exit(0);
			}
			await setupGmailWatch(accessToken, topicName as string);
		} else if (pluginType === 'googledrive') {
			const webhookUrl = await p.text({
				message: 'Enter webhook URL:',
				placeholder: 'https://example.com/api/webhook',
				validate: (v) => {
					if (!v || v.trim().length === 0) return 'Webhook URL is required';
				},
			});
			if (p.isCancel(webhookUrl)) {
				p.cancel('Operation cancelled.');
				process.exit(0);
			}
			await setupDriveWatch(accessToken, webhookUrl as string);
		} else if (pluginType === 'googlecalendar') {
			const webhookUrl = await p.text({
				message: 'Enter webhook URL:',
				placeholder: 'https://example.com/api/webhook',
				validate: (v) => {
					if (!v || v.trim().length === 0) return 'Webhook URL is required';
				},
			});
			if (p.isCancel(webhookUrl)) {
				p.cancel('Operation cancelled.');
				process.exit(0);
			}
			const calendarId = await p.text({
				message: 'Enter calendar ID:',
				defaultValue: 'primary',
				placeholder: 'primary',
			});
			if (p.isCancel(calendarId)) {
				p.cancel('Operation cancelled.');
				process.exit(0);
			}
			await setupCalendarWatch(accessToken, webhookUrl as string, calendarId as string);
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
