import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { corsair } from '@/server/corsair';

async function setInstagramCredentials() {
	const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, IG_ACCESS_TOKEN } = process.env;

	if (FACEBOOK_APP_ID) {
		await corsair.keys.instagram.set_client_id(FACEBOOK_APP_ID);
	}
	if (FACEBOOK_APP_SECRET) {
		await corsair.keys.instagram.set_client_secret(FACEBOOK_APP_SECRET);
	}
	if (IG_ACCESS_TOKEN) {
		await corsair.instagram.keys.set_access_token(IG_ACCESS_TOKEN);
	}
}

const main = async () => {
	const inboxId = process.env.AGENTMAIL_INBOX_ID;

	if (process.env.AGENTMAIL_API_KEY && inboxId) {
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
		}

		return;
	}

	await setInstagramCredentials();

	const res = await corsair.slack.api.messages.post({
		channel: 'general',
		text: 'hello',
	});

	console.log(res);
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
