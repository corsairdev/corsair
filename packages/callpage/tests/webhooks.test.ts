import { callpage } from '../index';
import { CallPageWebhooks } from '../webhooks';
import { verifyCallPageWebhookToken } from '../webhooks/types';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

const SECRET = 'hook-token';

describe('verifyCallPageWebhookToken', () => {
	it('accepts a matching Authorization header', () => {
		const result = verifyCallPageWebhookToken(
			{
				headers: { authorization: SECRET },
				payload: {},
				rawBody: '{}',
			},
			SECRET,
		);
		expect(result.valid).toBe(true);
	});

	it('rejects missing or invalid tokens', () => {
		expect(
			verifyCallPageWebhookToken(
				{ headers: {}, payload: {}, rawBody: '{}' },
				SECRET,
			).valid,
		).toBe(false);
		expect(
			verifyCallPageWebhookToken(
				{ headers: { authorization: 'wrong' }, payload: {}, rawBody: '{}' },
				SECRET,
			).valid,
		).toBe(false);
	});

	it('accepts a hub-verified delivery without a token', () => {
		expect(
			verifyCallPageWebhookToken(
				{
					headers: {},
					payload: {},
					rawBody: '{}',
					hubVerified: true,
				},
				undefined,
			),
		).toEqual({ valid: true });
	});
});

describe('CallPage webhook handler', () => {
	const payload = {
		data: {
			event: 'call.completed',
			id: 1,
			status: 'completed',
		},
	};

	it('rejects forged events without a verification token', async () => {
		await expect(
			CallPageWebhooks.event.handler({ key: '', options: {} } as never, {
				headers: {},
				payload,
				rawBody: JSON.stringify(payload),
			}),
		).rejects.toThrow('Missing webhook verification token');
	});

	it('accepts events with a valid verification token', async () => {
		const result = await CallPageWebhooks.event.handler(
			{ key: SECRET, options: {} } as never,
			{
				headers: { authorization: SECRET },
				payload,
				rawBody: JSON.stringify(payload),
			},
		);

		expect(result.success).toBe(true);
		expect(result.data).toEqual(payload);
	});

	it('accepts hub-verified events without a verification token', async () => {
		const result = await CallPageWebhooks.event.handler(
			{ key: undefined, options: {} } as never,
			{
				headers: {},
				payload,
				rawBody: JSON.stringify(payload),
				hubVerified: true,
			},
		);

		expect(result.success).toBe(true);
		expect(result.data).toEqual(payload);
	});

	it('plugin matcher requires Authorization when webhookSecret is configured', () => {
		const plugin = callpage({ webhookSecret: SECRET });

		expect(
			plugin.pluginWebhookMatcher?.({
				headers: {},
				body: payload,
			} as never),
		).toBe(false);

		expect(
			plugin.pluginWebhookMatcher?.({
				headers: { authorization: SECRET },
				body: payload,
			} as never),
		).toBe(true);
	});
});
