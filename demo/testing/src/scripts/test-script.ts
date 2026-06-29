import 'dotenv/config';

import { corsair } from '@/server/corsair';

const main = async () => {
	const slackRes = await corsair.slack.api.messages.post({
		channel: 'general',
		text: 'hello',
	});
	console.log('Slack message response:', slackRes);

	const whatsappRes = await corsair.whatsapp.api.phoneNumbers.get({
		phoneNumberId: 'test-phone-id',
	});
	console.log('WhatsApp phone number response:', whatsappRes);

	// Example: Test Twilio API endpoints
	// const sms = await corsair.twilio.api.messages.send({
	// 	To: '+1234567890',
	// 	From: '+1098765432',
	// 	Body: 'Hello from Corsair!',
	// });
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
