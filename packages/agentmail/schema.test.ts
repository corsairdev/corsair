import {
	AgentMailEndpointInputSchemas,
	AgentMailEndpointOutputSchemas,
} from './endpoints/types';
import { MessageReceivedEventSchema } from './webhooks/types';

const ENDPOINTS = ['messagesList', 'messagesGet', 'messagesSend'] as const;

describe('AgentMail endpoint schemas', () => {
	it('defines input and output schemas for every endpoint', () => {
		for (const endpoint of ENDPOINTS) {
			expect(AgentMailEndpointInputSchemas[endpoint]).toBeDefined();
			expect(AgentMailEndpointOutputSchemas[endpoint]).toBeDefined();
		}
	});

	it('rejects invalid messagesGet input', () => {
		const result = AgentMailEndpointInputSchemas.messagesGet.safeParse({
			inbox_id: 42,
		});
		expect(result.success).toBe(false);
	});

	it('accepts a minimal valid messagesList input', () => {
		const result = AgentMailEndpointInputSchemas.messagesList.safeParse({
			inbox_id: 'user@agentmail.to',
			limit: 5,
		});
		expect(result.success).toBe(true);
	});

	it('accepts a messagesSend input with to/subject/text', () => {
		const result = AgentMailEndpointInputSchemas.messagesSend.safeParse({
			inbox_id: 'user@agentmail.to',
			to: 'other@example.com',
			subject: 'Hello',
			text: 'World',
		});
		expect(result.success).toBe(true);
	});

	it('parses a message.received webhook payload', () => {
		const result = MessageReceivedEventSchema.safeParse({
			type: 'event',
			event_type: 'message.received',
			event_id: 'evt_1',
			message: {
				inbox_id: 'user@agentmail.to',
				thread_id: 'thread_1',
				message_id: '<msg@example.com>',
				labels: ['received'],
				timestamp: '2026-08-06T00:00:00.000Z',
				from: 'sender@example.com',
				to: ['user@agentmail.to'],
				size: 100,
				updated_at: '2026-08-06T00:00:00.000Z',
				created_at: '2026-08-06T00:00:00.000Z',
			},
			thread: {
				inbox_id: 'user@agentmail.to',
				thread_id: 'thread_1',
				labels: ['received'],
				timestamp: '2026-08-06T00:00:00.000Z',
				senders: ['sender@example.com'],
				recipients: ['user@agentmail.to'],
				last_message_id: '<msg@example.com>',
				message_count: 1,
				size: 100,
				updated_at: '2026-08-06T00:00:00.000Z',
				created_at: '2026-08-06T00:00:00.000Z',
			},
		});
		expect(result.success).toBe(true);
	});
});
