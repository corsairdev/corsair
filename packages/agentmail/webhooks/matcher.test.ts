import { createAgentMailMatch } from './types';

describe('AgentMail webhook match helpers', () => {
	it('matches message.received event_type payloads', () => {
		const match = createAgentMailMatch('message.received');
		expect(
			match({
				headers: {},
				body: {
					type: 'event',
					event_type: 'message.received',
				},
			}),
		).toBe(true);
	});

	it('does not match Resend-style email.* payloads', () => {
		const match = createAgentMailMatch('message.received');
		expect(
			match({
				headers: { 'svix-signature': 'v1,abc' },
				body: {
					type: 'email.sent',
					data: {},
				},
			}),
		).toBe(false);
	});
});
