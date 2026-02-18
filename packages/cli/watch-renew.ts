import { execSync } from 'node:child_process';
import * as crypto from 'node:crypto';
import * as p from '@clack/prompts';
import type { CorsairInternalConfig } from 'corsair/core';
import {
	CORSAIR_INTERNAL,
	createAccountKeyManager,
	createIntegrationKeyManager,
} from 'corsair/core';
import { getCorsairInstance } from './index';

const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1';
const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';

const GOOGLE_PLUGINS = [
	'gmail',
	'googledrive',
	'googlecalendar',
	'googlesheets',
] as const;
type GooglePlugin = (typeof GOOGLE_PLUGINS)[number];

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

async function refreshAccessToken(
	clientId: string,
	clientSecret: string,
	refreshToken: string,
): Promise<string> {
	const response = await fetch('https://oauth2.googleapis.com/token', {
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
		throw new Error(`Failed to refresh access token: ${error}`);
	}

	const data = (await response.json()) as { access_token: string };
	return data.access_token;
}

async function renewGmailWatch(
	accessToken: string,
	topicName: string,
): Promise<void> {
	const watchSpin = p.spinner();
	watchSpin.start('Starting Gmail watch...');

	const response = await fetch(`${GMAIL_API_BASE}/users/me/watch`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			topicName,
			labelIds: ['INBOX'],
		}),
	});

	if (!response.ok) {
		const error = await response.text();
		watchSpin.stop('Failed.');
		p.log.error(`Gmail watch failed: ${error}`);
		p.outro('');
		process.exit(1);
	}

	const data = (await response.json()) as {
		historyId: string;
		expiration: string;
	};

	watchSpin.stop('Watch started.');

	p.note(
		`History ID: ${data.historyId}\nExpiration: ${new Date(Number(data.expiration)).toISOString()}`,
		'Watch Response',
	);
}

async function renewDriveWatch(
	accessToken: string,
	webhookUrl: string,
): Promise<void> {
	const watchSpin = p.spinner();
	watchSpin.start('Getting start page token...');

	const startPageTokenRes = await fetch(
		`${DRIVE_API_BASE}/changes/startPageToken`,
		{
			headers: { Authorization: `Bearer ${accessToken}` },
		},
	);

	if (!startPageTokenRes.ok) {
		const error = await startPageTokenRes.text();
		watchSpin.stop('Failed.');
		p.log.error(`Failed to get start page token: ${error}`);
		p.outro('');
		process.exit(1);
	}

	const startPageTokenData = (await startPageTokenRes.json()) as {
		startPageToken: string;
	};

	watchSpin.message('Starting Drive watch...');

	const channelId = crypto.randomUUID();

	const watchRes = await fetch(
		`${DRIVE_API_BASE}/changes/watch?pageToken=${startPageTokenData.startPageToken}`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id: channelId,
				type: 'web_hook',
				address: webhookUrl,
			}),
		},
	);

	if (!watchRes.ok) {
		const error = await watchRes.text();
		watchSpin.stop('Failed.');
		p.log.error(`Drive watch failed: ${error}`);
		p.outro('');
		process.exit(1);
	}

	const data = (await watchRes.json()) as {
		id: string;
		resourceId: string;
		expiration: string;
	};

	watchSpin.stop('Watch started.');

	p.note(
		`Channel ID: ${channelId}\nResource ID: ${data.resourceId}\nStart Page Token: ${startPageTokenData.startPageToken}\nExpiration: ${new Date(Number(data.expiration)).toISOString()}`,
		'Watch Response',
	);
}

async function renewCalendarWatch(
	accessToken: string,
	webhookUrl: string,
	calendarId: string,
): Promise<void> {
	const watchSpin = p.spinner();
	watchSpin.start('Starting Calendar watch...');

	const channelId = crypto.randomUUID();

	const watchRes = await fetch(
		`${CALENDAR_API_BASE}/calendars/${encodeURIComponent(calendarId)}/events/watch`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id: channelId,
				type: 'web_hook',
				address: webhookUrl,
			}),
		},
	);

	if (!watchRes.ok) {
		const error = await watchRes.text();
		watchSpin.stop('Failed.');
		p.log.error(`Calendar watch failed: ${error}`);
		p.outro('');
		process.exit(1);
	}

	const data = (await watchRes.json()) as {
		id: string;
		resourceId: string;
		expiration: string;
	};

	watchSpin.stop('Watch started.');

	p.note(
		`Channel ID: ${channelId}\nResource ID: ${data.resourceId}\nExpiration: ${new Date(Number(data.expiration)).toISOString()}`,
		'Watch Response',
	);
}

function copyToClipboard(text: string): boolean {
	try {
		const platform = process.platform;
		if (platform === 'darwin') {
			execSync('pbcopy', { input: text });
			return true;
		} else if (platform === 'linux') {
			try {
				execSync('xclip -selection clipboard', { input: text });
				return true;
			} catch {
				try {
					execSync('xsel --clipboard --input', { input: text });
					return true;
				} catch {
					return false;
				}
			}
		} else if (platform === 'win32') {
			execSync('clip', { input: text });
			return true;
		}
		return false;
	} catch {
		return false;
	}
}

async function renewSheetsWatch(webhookUrl: string): Promise<void> {
	const appsScriptCode = `var WEBHOOK_URL = "${webhookUrl}";

function onEditTrigger(e) {
  if (!e || !e.range) return;

  var sheet = e.range.getSheet();
  var payload = {
    spreadsheetId: e.source.getId(),
    sheetName: sheet.getName(),
    range: e.range.getA1Notation(),
    values: e.range.getValues(),
    eventType: "rangeUpdated",
    timestamp: new Date().toISOString()
  };

  UrlFetchApp.fetch(WEBHOOK_URL, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  });
}

function onChangeTrigger(e) {
  if (!e) return;

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow === 0 || lastCol === 0) return;

  var values = sheet.getRange(lastRow, 1, 1, lastCol).getValues();

  var payload = {
    spreadsheetId: ss.getId(),
    sheetName: sheet.getName(),
    range: "A" + lastRow + ":" + String.fromCharCode(64 + lastCol) + lastRow,
    values: values,
    eventType: "rangeUpdated",
    timestamp: new Date().toISOString()
  };

  UrlFetchApp.fetch(WEBHOOK_URL, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  });
}

function createTriggers() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  ScriptApp.newTrigger("onEditTrigger").forSpreadsheet(ss).onEdit().create();
  ScriptApp.newTrigger("onChangeTrigger").forSpreadsheet(ss).onChange().create();
  
  Logger.log("Triggers created successfully!");
}

function removeTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(trigger) {
    ScriptApp.deleteTrigger(trigger);
  });
  Logger.log("All triggers removed.");
}`;

	p.log.info('Google Sheets does not have a native watch API.');
	p.log.info(
		'Instead, you need to set up Google Apps Script triggers in your spreadsheet.',
	);
	p.log.info('');

	const shouldCopy = await p.confirm({
		message: 'Copy Apps Script code to clipboard?',
		initialValue: true,
	});

	let copied = false;
	if (shouldCopy) {
		copied = copyToClipboard(appsScriptCode);
		if (copied) {
			p.log.success('Apps Script code copied to clipboard!');
		} else {
			p.log.warn('Failed to copy to clipboard. Code will be displayed below.');
		}
	}

	p.log.info('');
	p.log.info('Setup Instructions:');
	p.log.info('1. Open your Google Sheet');
	p.log.info('2. Go to Extensions > Apps Script');
	p.log.info('3. Paste the code into the script editor');
	p.log.info(
		'4. Run the "createTriggers" function once to install the triggers',
	);
	p.log.info('5. Authorize the script when prompted');
	p.log.info('');

	if (!copied) {
		p.log.info('Apps Script Code:');
		p.log.info('');
		p.log.info(appsScriptCode);
		p.log.info('');
	}

	p.note(
		`Webhook URL: ${webhookUrl}\n\nThe Apps Script code ${copied ? 'has been copied to your clipboard' : 'is displayed above'}. Paste it into your Google Sheet's Apps Script editor.`,
		'Google Sheets Setup',
	);
}

export async function runWatchRenew({ cwd }: { cwd: string }): Promise<void> {
	p.intro('Corsair — Google Watch Renewal');

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

	const pluginId = await p.select({
		message: 'Select a Google integration:',
		options: googlePlugins.map((pl) => ({
			value: pl.id,
			label: pl.id,
		})),
	});

	if (p.isCancel(pluginId)) {
		p.cancel('Operation cancelled.');
		process.exit(0);
	}

	const pluginType = pluginId as GooglePlugin;

	if (pluginType === 'googlesheets') {
		const webhookUrl = await p.text({
			message: 'Enter webhook URL:',
			placeholder: 'https://example.com/api/webhook',
			validate: (v) => {
				if (!v || v.trim().length === 0) return 'Webhook URL is required';
				if (!v.startsWith('http://') && !v.startsWith('https://')) {
					return 'Webhook URL must start with http:// or https://';
				}
			},
		});

		if (p.isCancel(webhookUrl)) {
			p.cancel('Operation cancelled.');
			process.exit(0);
		}

		await renewSheetsWatch(webhookUrl as string);
		p.outro('Done!');
		return;
	}

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
	credSpin.start('Fetching credentials...');

	try {
		const integrationKm = createIntegrationKeyManager({
			authType: 'oauth_2',
			integrationName: pluginId as string,
			kek,
			database,
		});

		const accountKm = createAccountKeyManager({
			authType: 'oauth_2',
			integrationName: pluginId as string,
			tenantId: tenantId as string,
			kek,
			database,
		});

		const clientId = await integrationKm.getClientId();
		const clientSecret = await integrationKm.getClientSecret();
		const refreshToken = await accountKm.getRefreshToken();

		if (!clientId || !clientSecret || !refreshToken) {
			credSpin.stop('Missing credentials.');
			p.log.error(
				'Client ID, Client Secret, and Refresh Token are required. Use "corsair auth" to set them.',
			);
			p.outro('');
			process.exit(1);
		}

		const accessToken = await refreshAccessToken(
			clientId,
			clientSecret,
			refreshToken,
		);

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

			await renewGmailWatch(accessToken, topicName as string);
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

			await renewDriveWatch(accessToken, webhookUrl as string);
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

			await renewCalendarWatch(
				accessToken,
				webhookUrl as string,
				calendarId as string,
			);
		} else {
			p.log.error(`Unsupported Google plugin: ${pluginType}`);
			process.exit(1);
		}
	} catch (error) {
		credSpin.stop('Failed.');
		p.log.error(
			`Error: ${error instanceof Error ? error.message : String(error)}`,
		);
		process.exit(1);
	}

	p.outro('Done!');
}
