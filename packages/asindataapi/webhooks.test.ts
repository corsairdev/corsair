import { asindataapi } from './index';
import { collectionCompleted } from './webhooks/collection-completed';
import {
	createAsinDataApiMatch,
	verifyAsinDataApiWebhookSignature,
} from './webhooks/types';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const SECRET = 'whsec-test';
const payload = {
	request_info: {
		success: true,
		type: 'collection_resultset_completed' as const,
	},
	collection: { id: '9E867FAA', name: 'Probe' },
	result_set: { id: 4 },
};

function request(
	query?: Record<string, string>,
	headers: Record<string, string> = {},
) {
	return {
		payload,
		headers,
		query,
	};
}

describe('ASIN Data API webhooks', () => {
	it('rejects missing, blank, and mismatched secrets', () => {
		expect(
			verifyAsinDataApiWebhookSignature(request({ token: SECRET }), undefined)
				.valid,
		).toBe(false);
		expect(
			verifyAsinDataApiWebhookSignature(request({ token: SECRET }), '').valid,
		).toBe(false);
		expect(verifyAsinDataApiWebhookSignature(request(), SECRET).valid).toBe(
			false,
		);
		expect(
			verifyAsinDataApiWebhookSignature(request({ token: 'nope' }), SECRET)
				.valid,
		).toBe(false);
	});

	it('accepts a matching query token or bearer secret', () => {
		expect(
			verifyAsinDataApiWebhookSignature(request({ token: SECRET }), SECRET)
				.valid,
		).toBe(true);
		expect(
			verifyAsinDataApiWebhookSignature(
				request({ webhook_secret: SECRET }),
				SECRET,
			).valid,
		).toBe(true);
		expect(
			verifyAsinDataApiWebhookSignature(
				request(undefined, { authorization: `Bearer ${SECRET}` }),
				SECRET,
			).valid,
		).toBe(true);
	});

	it('keyBuilder returns the webhook secret instead of throwing', async () => {
		const plugin = asindataapi({ webhookSecret: SECRET });
		expect(plugin.keyBuilder).toBeDefined();
		await expect(
			plugin.keyBuilder?.({ authType: 'api_key' } as never, 'webhook'),
		).resolves.toBe(SECRET);
	});

	it('keyBuilder does not let options.key override the webhook secret', async () => {
		const plugin = asindataapi({
			key: 'endpoint-api-key',
			webhookSecret: SECRET,
		});
		await expect(
			plugin.keyBuilder?.({ authType: 'api_key' } as never, 'webhook'),
		).resolves.toBe(SECRET);
		await expect(
			plugin.keyBuilder?.({ authType: 'api_key' } as never, 'endpoint'),
		).resolves.toBe('endpoint-api-key');
	});

	it('handler rejects forged completion events without a secret', async () => {
		const result = await collectionCompleted.handler(
			{ key: SECRET, db: {} } as never,
			request(),
		);
		expect(result.success).toBe(false);
		expect(result.statusCode).toBe(401);
	});

	it('handler publishes a verified completion event', async () => {
		const result = await collectionCompleted.handler(
			{ key: SECRET, db: {} } as never,
			request({ token: SECRET }),
		);
		expect(result.success).toBe(true);
		expect(result.data).toEqual(payload);
	});

	it('matcher still requires the official event type', () => {
		expect(
			createAsinDataApiMatch('collection_resultset_completed')({
				headers: {},
				body: payload,
			}),
		).toBe(true);
		expect(
			createAsinDataApiMatch('collection_resultset_completed')({
				headers: {},
				body: { request_info: { type: 'other' } },
			}),
		).toBe(false);
	});
});
