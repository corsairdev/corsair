import * as crypto from 'node:crypto';
import * as p from '@clack/prompts';

const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';

export async function setupDriveWatch(
	accessToken: string,
	webhookUrl: string,
): Promise<void> {
	const watchSpin = p.spinner();
	watchSpin.start('Getting start page token...');

	const startPageTokenRes = await fetch(`${DRIVE_API_BASE}/changes/startPageToken`, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});

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
