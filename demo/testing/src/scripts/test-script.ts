import 'dotenv/config';

import { corsair } from '@/server/corsair';

const main = async () => {
	const inboxId = process.env.AGENTMAIL_INBOX_ID;

	if (!process.env.AGENTMAIL_API_KEY || !inboxId) {
		console.log(
			'Skipping AgentMail smoke test: set AGENTMAIL_API_KEY and AGENTMAIL_INBOX_ID to run it.',
		);
		return;
	}

	const listResult = await corsair.agentmail.api.messages.list({
		inbox_id: inboxId,
		limit: 5,
	});

	console.log('AgentMail list messages:', {
		count: listResult.count,
		returned: listResult.messages.length,
		next_page_token: listResult.next_page_token,
	});

	const messageId =
		process.env.AGENTMAIL_MESSAGE_ID || listResult.messages[0]?.message_id;

	if (messageId) {
		const message = await corsair.agentmail.api.messages.get({
			inbox_id: inboxId,
			message_id: messageId,
		});

		console.log('AgentMail get message:', {
			message_id: message.message_id,
			timestamp: message.timestamp,
			subject: message.subject,
		});
	} else {
		console.log(
			'Skipping AgentMail get message: no AGENTMAIL_MESSAGE_ID and no messages returned.',
		);
	}

	const sendTestTo = process.env.AGENTMAIL_SEND_TEST_TO;
	if (sendTestTo) {
		const sendResult = await corsair.agentmail.api.messages.send({
			inbox_id: inboxId,
			to: sendTestTo,
			subject: 'Corsair AgentMail smoke test',
			text: 'This is a manual smoke test from demo/testing.',
		});

		console.log('AgentMail send message:', {
			message_id: sendResult.message_id,
			thread_id: sendResult.thread_id,
		});
	} else {
		console.log(
			'Skipping AgentMail send message: set AGENTMAIL_SEND_TEST_TO to send a test email.',
		);
	}

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
