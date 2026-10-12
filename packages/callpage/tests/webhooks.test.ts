import { callpage } from '../index';
import { CallPageWebhooks } from '../webhooks';
import { verifyCallPageWebhookToken } from '../webhooks/types';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

const SECRET = 'hook-token';

type HandlerCtx = Parameters<typeof CallPageWebhooks.event.handler>[0];

function handlerCtx(key: string | undefined): HandlerCtx {
	// Safe: the handler reads only key; the rest of the context needs a live
	// corsair instance, so a narrower type is not practical to build here.
	return { key, options: {} } as never;
}

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
			CallPageWebhooks.event.handler(handlerCtx(''), {
				headers: {},
				payload,
				rawBody: JSON.stringify(payload),
			}),
		).rejects.toThrow('Missing webhook verification token');
	});

	it('accepts events with a valid verification token', async () => {
		const result = await CallPageWebhooks.event.handler(handlerCtx(SECRET), {
			headers: { authorization: SECRET },
			payload,
			rawBody: JSON.stringify(payload),
		});

		expect(result.success).toBe(true);
		expect(result.data).toEqual(payload);
	});

	it('accepts hub-verified events without a verification token', async () => {
		const result = await CallPageWebhooks.event.handler(handlerCtx(undefined), {
			headers: {},
			payload,
			rawBody: JSON.stringify(payload),
			hubVerified: true,
		});

		expect(result.success).toBe(true);
		expect(result.data).toEqual(payload);
	});

	it('plugin matcher requires Authorization when webhookSecret is configured', () => {
		const plugin = callpage({ webhookSecret: SECRET });

		// Safe: the matcher reads only headers and body; the full request type
		// has transport fields these cases do not exercise.
		const request = (headers: Record<string, string>) =>
			({ headers, body: payload }) as never;

		expect(plugin.pluginWebhookMatcher?.(request({}))).toBe(false);

		expect(
			plugin.pluginWebhookMatcher?.(request({ authorization: SECRET })),
		).toBe(true);
	});
});
