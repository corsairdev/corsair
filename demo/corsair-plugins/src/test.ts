import { corsair } from './';

const main = async () => {
	// const getMessage = await corsair
	// 	.withTenant('default-1')
	// 	.slack.db.messages.findByResourceId('');

	// const postMessage = await corsair.withTenant('').slack.api.messages.post({
	// 	channel: '',
	// 	text: '',
	// });

	const sendEmail = await corsair.withTenant('default-1').resend.api.emails.send({
		from: 'onboarding@resend.dev',
		to: 'onboarding@resend.dev',
		subject: 'Test Email',
		html: '<p>Hello, world!</p>',
	});

	console.log(sendEmail);
};

// biome-ignore lint/nursery/noFloatingPromises: this is just for cli testing right now
main();
