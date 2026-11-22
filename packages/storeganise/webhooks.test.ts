import { createHmac } from 'node:crypto';
import { logEventFromContext } from 'corsair/core';
import { storeganiseWebhooksNested } from './index';
import { webhookPayload } from './test-fixtures';
import { event } from './webhooks';
import {
	matchStoreganiseWebhook,
	SG_SIGNATURE_HEADER,
	verifyStoreganiseWebhook,
} from './webhooks/types';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const SECRET = 'wh-s3cret';

// unknown: each caller passes a different documented payload object.
function rawBody(payload: unknown) {
	return JSON.stringify(payload);
}

// unknown: same payload-per-caller shape as rawBody above.
function signature(payload: unknown, secret: string) {
	return createHmac('sha256', secret).update(rawBody(payload)).digest('base64');
}

// unknown: the delivery payload is whatever the test feeds the handler.
function request(
	payload: unknown,
	headers: Record<string, string | string[]> = {},
) {
	return {
		payload,
		headers,
		rawBody: rawBody(payload),
	};
}

// The matcher reads the raw delivery (body, not the parsed payload).
// unknown: each test feeds a different delivery body.
function rawRequest(
	body: unknown,
	headers: Record<string, string | string[]> = {},
) {
	return { body, headers, rawBody: rawBody(body) };
}

// unknown: the handler context only carries what the handlers read (ctx.key).
function ctx(secret: string | undefined) {
	return { key: secret ?? '' } as never;
}

beforeEach(() => {
	mockLog.mockClear();
});

describe('verifyStoreganiseWebhook', () => {
	it('accepts the documented base64 digest', () => {
		const delivered = request(webhookPayload, {
			[SG_SIGNATURE_HEADER]: signature(webhookPayload, SECRET),
		});
		expect(verifyStoreganiseWebhook(delivered, SECRET).valid).toBe(true);
	});

	it('rejects a signature made with the wrong secret', () => {
		const delivered = request(webhookPayload, {
			[SG_SIGNATURE_HEADER]: signature(webhookPayload, 'other'),
		});
		const verification = verifyStoreganiseWebhook(delivered, SECRET);
		expect(verification.valid).toBe(false);
		expect(verification.error).toBe('Invalid webhook signature');
	});

	it('rejects a tampered body', () => {
		const delivered = request(webhookPayload, {
			[SG_SIGNATURE_HEADER]: signature(
				{ ...webhookPayload, data: { jobId: 'evil' } },
				SECRET,
			),
		});
		expect(verifyStoreganiseWebhook(delivered, SECRET).valid).toBe(false);
	});

	it('rejects a hex digest, because the docs prescribe base64 only', () => {
		const hex = createHmac('sha256', SECRET)
			.update(rawBody(webhookPayload))
			.digest('hex');
		const delivered = request(webhookPayload, {
			[SG_SIGNATURE_HEADER]: hex,
		});
		expect(verifyStoreganiseWebhook(delivered, SECRET).valid).toBe(false);
	});

	it('rejects a missing signature header', () => {
		const verification = verifyStoreganiseWebhook(
			request(webhookPayload),
			SECRET,
		);
		expect(verification.valid).toBe(false);
		expect(verification.error).toContain(SG_SIGNATURE_HEADER);
	});

	it('rejects a delivery when no secret is configured, because every Storeganise delivery is signed', () => {
		const delivered = request(webhookPayload, {
			[SG_SIGNATURE_HEADER]: signature(webhookPayload, SECRET),
		});
		const verification = verifyStoreganiseWebhook(delivered, undefined);
		expect(verification.valid).toBe(false);
		expect(verification.error).toContain('No webhook secret configured');
	});

	it('rejects a delivery whose body was not captured', () => {
		const verification = verifyStoreganiseWebhook(
			{ payload: webhookPayload, headers: { [SG_SIGNATURE_HEADER]: 'x' } },
			SECRET,
		);
		expect(verification.valid).toBe(false);
		expect(verification.error).toContain('not captured');
	});

	it('accepts a hub-verified delivery without checking the signature', () => {
		const verification = verifyStoreganiseWebhook(
			{ payload: webhookPayload, headers: {}, hubVerified: true },
			SECRET,
		);
		expect(verification.valid).toBe(true);
	});
});

describe('matchStoreganiseWebhook', () => {
	it('matches a delivery that carries id, created and type', () => {
		expect(matchStoreganiseWebhook(rawRequest(webhookPayload))).toBe(true);
	});

	it('does not match a body missing the type', () => {
		expect(
			matchStoreganiseWebhook(
				rawRequest({ id: 'x', created: '2021-11-21T11:26:32.105Z' }),
			),
		).toBe(false);
	});

	it('does not match a non-object body', () => {
		expect(matchStoreganiseWebhook(rawRequest('a string'))).toBe(false);
	});
});

describe('event handler', () => {
	it('rejects an unsigned delivery with 401', async () => {
		const result = await event.handler(
			ctx(SECRET),
			request(webhookPayload) as never,
		);
		expect(result.success).toBe(false);
		expect(result.statusCode).toBe(401);
	});

	it('rejects a wrong signature with 401', async () => {
		const delivered = request(webhookPayload, {
			[SG_SIGNATURE_HEADER]: signature(webhookPayload, 'other'),
		});
		const result = await event.handler(ctx(SECRET), delivered as never);
		expect(result.success).toBe(false);
		expect(result.statusCode).toBe(401);
	});

	it('rejects a signed but malformed payload with 400', async () => {
		const bad = { id: 'x', created: '2021-11-21T11:26:32.105Z' };
		const delivered = request(bad, {
			[SG_SIGNATURE_HEADER]: signature(bad, SECRET),
		});
		const result = await event.handler(ctx(SECRET), delivered as never);
		expect(result.success).toBe(false);
		expect(result.statusCode).toBe(400);
	});

	it('clears the log-wait timer once the log write finishes', async () => {
		const clear = jest.spyOn(globalThis, 'clearTimeout');
		const delivered = request(webhookPayload, {
			[SG_SIGNATURE_HEADER]: signature(webhookPayload, SECRET),
		});
		try {
			await event.handler(ctx(SECRET), delivered as never);
			expect(clear).toHaveBeenCalled();
		} finally {
			clear.mockRestore();
		}
	});

	it('acknowledges a delivery after the wait even when logging never finishes', async () => {
		jest.useFakeTimers();
		let rejectLog: (error: Error) => void = () => undefined;
		mockLog.mockImplementationOnce(
			() =>
				new Promise((_, reject) => {
					rejectLog = reject;
				}),
		);
		const delivered = request(webhookPayload, {
			[SG_SIGNATURE_HEADER]: signature(webhookPayload, SECRET),
		});
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		try {
			const pending = event.handler(ctx(SECRET), delivered as never);
			await jest.advanceTimersByTimeAsync(5_000);
			await expect(pending).resolves.toMatchObject({ success: true });
			// A late failure of the stalled log write is caught, not thrown.
			rejectLog(new Error('insert failed'));
			await jest.advanceTimersByTimeAsync(0);
		} finally {
			warn.mockRestore();
			jest.useRealTimers();
		}
	});

	it('accepts a signed delivery and returns the parsed event', async () => {
		const delivered = request(webhookPayload, {
			[SG_SIGNATURE_HEADER]: signature(webhookPayload, SECRET),
		});
		const result = await event.handler(ctx(SECRET), delivered as never);
		expect(result.success).toBe(true);
		expect(result.data).toEqual(webhookPayload);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'storeganise.webhook.event',
			{
				type: 'job.unit_moveIn.created',
				deliveryId: '5bf48bd975970f170a8e42b7',
				created: '2021-11-21T11:26:32.105Z',
			},
			'completed',
		);
	});

	it('matches the nested webhook registry entry', () => {
		expect(storeganiseWebhooksNested.storeganise.event).toBe(event);
	});
});
