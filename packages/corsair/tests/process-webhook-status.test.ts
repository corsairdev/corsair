import { processWebhook } from '../webhooks/index';

describe('processWebhook status propagation', () => {
	it('forwards success: false and statusCode from the handler', async () => {
		const corsair = {
			notion: {
				webhooks: {
					verification: {
						match: () => true,
						handler: async () => ({
							success: false,
							statusCode: 401,
							error: 'Invalid verification token',
						}),
					},
				},
				pluginWebhookMatcher: () => true,
			},
		} as any;

		const result = await processWebhook(
			corsair,
			{ 'content-type': 'application/json' },
			{ type: 'url_verification', verification_token: 'x' },
			undefined,
			{ plugin: 'notion' },
		);

		expect(result.plugin).toBe('notion');
		expect(result.response).toEqual({
			success: false,
			statusCode: 401,
			error: 'Invalid verification token',
			data: undefined,
		});
	});

	it('maps thrown handler errors to success: false with statusCode 500', async () => {
		const corsair = {
			notion: {
				webhooks: {
					verification: {
						match: () => true,
						handler: async () => {
							throw new Error('boom');
						},
					},
				},
				pluginWebhookMatcher: () => true,
			},
		} as any;

		const result = await processWebhook(
			corsair,
			{ 'content-type': 'application/json' },
			{ type: 'url_verification' },
			undefined,
			{ plugin: 'notion' },
		);

		expect(result.response).toEqual({
			success: false,
			statusCode: 500,
			error: 'Internal server error',
		});
	});
});
