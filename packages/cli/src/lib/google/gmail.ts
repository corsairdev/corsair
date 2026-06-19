import * as p from '@clack/prompts';

const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1';

export async function setupGmailWatch(
	accessToken: string,
	topicName: string,
): Promise<{ emailAddress: string | null }> {
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

	const profileResponse = await fetch(
		`${GMAIL_API_BASE}/users/me/profile`,
		{
			headers: { Authorization: `Bearer ${accessToken}` },
		},
	);
	const profile = profileResponse.ok
		? ((await profileResponse.json()) as { emailAddress?: string })
		: null;

	p.note(
		`History ID: ${data.historyId}\nExpiration: ${new Date(Number(data.expiration)).toISOString()}${profile?.emailAddress ? `\nEmail: ${profile.emailAddress}` : ''}`,
		'Watch Response',
	);

	return { emailAddress: profile?.emailAddress ?? null };
}
