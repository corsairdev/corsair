import { verifySlackWebhookSignature } from './webhooks/types';

describe('Slack webhook signature verification', () => {
	it.each([undefined, ''])(
		'reports a missing signing secret',
		(signingSecret) => {
			const request = {
				payload: {},
				headers: {},
				rawBody: '{}',
			} as Parameters<typeof verifySlackWebhookSignature>[0];

			expect(verifySlackWebhookSignature(request, signingSecret)).toEqual({
				valid: false,
				error: 'Missing webhook secret',
			});
		},
	);
});
