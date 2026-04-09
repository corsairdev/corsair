import * as p from '@clack/prompts';

const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1';

export async function setupGmailWatch(
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
