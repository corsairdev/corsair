import 'dotenv/config';
import { makeAgentMailRequest } from './client';
import type {
	MessagesGetResponse,
	MessagesListResponse,
	MessagesSendResponse,
} from './endpoints/types';
import { AgentMailEndpointOutputSchemas } from './endpoints/types';

const LIVE_API_KEY = process.env.AGENTMAIL_API_KEY;
const LIVE_INBOX_ID = process.env.AGENTMAIL_INBOX_ID;
const describeLive = LIVE_API_KEY && LIVE_INBOX_ID ? describe : describe.skip;

describeLive('AgentMail live API', () => {
	it('lists messages with the messages array shape', async () => {
		const response = await makeAgentMailRequest<MessagesListResponse>(
			`inboxes/${encodeURIComponent(LIVE_INBOX_ID!)}/messages`,
			LIVE_API_KEY!,
			{ method: 'GET', query: { limit: 5 } },
		);

		AgentMailEndpointOutputSchemas.messagesList.parse(response);
		expect(Array.isArray(response.messages)).toBe(true);
		expect(typeof response.count).toBe('number');
		expect(response.messages[0]?.message_id).toBeDefined();
		expect(response.messages[0]?.timestamp).toBeDefined();
	});

	it('gets a message by message_id from list', async () => {
		const list = await makeAgentMailRequest<MessagesListResponse>(
			`inboxes/${encodeURIComponent(LIVE_INBOX_ID!)}/messages`,
			LIVE_API_KEY!,
			{ method: 'GET', query: { limit: 1 } },
		);
		const messageId = list.messages[0]?.message_id;
		expect(messageId).toBeTruthy();

		const message = await makeAgentMailRequest<MessagesGetResponse>(
			`inboxes/${encodeURIComponent(LIVE_INBOX_ID!)}/messages/${encodeURIComponent(messageId!)}`,
			LIVE_API_KEY!,
			{ method: 'GET' },
		);

		AgentMailEndpointOutputSchemas.messagesGet.parse(message);
		expect(message.message_id).toBe(messageId);
		expect(typeof message.timestamp).toBe('string');
		expect(message.text || message.html || message.extracted_text).toBeTruthy();
	});

	it('sends an email when AGENTMAIL_CONFIRM_SEND=true', async () => {
		if (process.env.AGENTMAIL_CONFIRM_SEND !== 'true') {
			return;
		}

		const response = await makeAgentMailRequest<MessagesSendResponse>(
			`inboxes/${encodeURIComponent(LIVE_INBOX_ID!)}/messages/send`,
			LIVE_API_KEY!,
			{
				method: 'POST',
				body: {
					to: LIVE_INBOX_ID,
					subject: 'Corsair AgentMail live test',
					text: 'Verified from api.test.ts',
				},
			},
		);

		AgentMailEndpointOutputSchemas.messagesSend.parse(response);
		expect(response.message_id).toBeTruthy();
		expect(response.thread_id).toBeTruthy();
	});
});

describe('AgentMail client error rewrap', () => {
	it('surfaces AgentMailAPIError for failed requests', async () => {
		await expect(
			makeAgentMailRequest('inboxes', 'definitely-invalid-key', {
				method: 'GET',
			}),
		).rejects.toMatchObject({
			name: 'AgentMailAPIError',
		});
	});
});
