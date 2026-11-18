import type { WebhookRequest } from '../core/webhooks';
import { processWebhook } from '../webhooks/index';

const formBody = 'type=subscribe&data%5Blist_id%5D=a1b2c3';

function makeCorsair(received: WebhookRequest[]) {
	return {
		mailchimp: {
			pluginWebhookMatcher: () => true,
			webhooks: {
				subscribe: {
					match: (request: { body: unknown }) =>
						typeof request.body === 'string' &&
						new URLSearchParams(request.body).get('type') === 'subscribe',
					handler: async (request: WebhookRequest) => {
						received.push(request);
						return { success: true };
					},
				},
			},
		},
	} as any;
}

describe('processWebhook with a form-encoded string body', () => {
	it('dispatches instead of throwing on JSON.parse', async () => {
		const received: WebhookRequest[] = [];
		const result = await processWebhook(
			makeCorsair(received),
			{ 'content-type': 'application/x-www-form-urlencoded' },
			formBody,
		);

		expect(result.plugin).toBe('mailchimp');
		expect(result.action).toBe('subscribe');
		expect(received).toHaveLength(1);
		expect(received[0]!.rawBody).toBe(formBody);
		expect(received[0]!.payload).toBe(formBody);
	});
});
