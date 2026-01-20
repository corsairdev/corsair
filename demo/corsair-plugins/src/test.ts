import { corsair } from './';

function createEmailMessage(from: string, to: string, subject: string, body: string): string {
	const email = [
		`From: ${from}`,
		`To: ${to}`,
		`Subject: ${subject}`,
		'',
		body,
	].join('\r\n');

	return Buffer.from(email)
		.toString('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');
}

const main = async () => {
	const raw = createEmailMessage(
		'test@example.com',
		'recipient@example.com',
		'Test Email',
		'This is a test email body.',
	);

	const message = await corsair
		.withTenant('default-1').gmail.api.messages.send({
			userId: 'me',
			raw,
		})
	console.log(message);
};

// biome-ignore lint/nursery/noFloatingPromises: this is just for cli testing right now
main();