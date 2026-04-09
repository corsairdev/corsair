import * as crypto from 'node:crypto';
import * as p from '@clack/prompts';

const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';

export async function setupCalendarWatch(
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
