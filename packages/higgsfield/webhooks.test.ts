import type { WebhookRequest } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import {
	COMPLETED_RAW_BODY,
	FAILED_RAW_BODY,
	NSFW_RAW_BODY,
	OTHER_WEBHOOK_SECRET,
	REQUEST_ID,
	signature,
	signedHeaders,
	WEBHOOK_SECRET,
} from './test-fixtures';
import { RequestWebhooks } from './webhooks';
import {
	isHiggsfieldWebhook,
	verifyHiggsfieldWebhookSignature,
} from './webhooks/types';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const delivery = (
	rawBody: string,
	headers: Record<string, string>,
	// unknown: these tests sign and verify raw bytes; the parsed payload plays no part.
): WebhookRequest<unknown> => ({
	payload: JSON.parse(rawBody),
	headers,
	rawBody,
});

describe('verifyHiggsfieldWebhookSignature', () => {
	const verify = (
		rawBody: string,
		headers: Record<string, string>,
		secret: string | undefined = WEBHOOK_SECRET,
	) => verifyHiggsfieldWebhookSignature(delivery(rawBody, headers), secret);

	it('accepts a delivery signed with the secret', () => {
		expect(
			verify(COMPLETED_RAW_BODY, signedHeaders(COMPLETED_RAW_BODY)),
		).toEqual({ valid: true });
	});

	it('refuses a tampered body', () => {
		const headers = signedHeaders(COMPLETED_RAW_BODY);
		const tampered = COMPLETED_RAW_BODY.replace('boat.png', 'evil.png');
		expect(verify(tampered, headers).valid).toBe(false);
	});

	it('refuses a tampered id or timestamp', () => {
		const headers = signedHeaders(COMPLETED_RAW_BODY);
		expect(
			verify(COMPLETED_RAW_BODY, { ...headers, 'webhook-id': 'msg_other' })
				.valid,
		).toBe(false);
		expect(
			verify(COMPLETED_RAW_BODY, {
				...headers,
				'webhook-timestamp': String(Number(headers['webhook-timestamp']) - 1),
			}).valid,
		).toBe(false);
	});

	it('refuses a body rebuilt from parsed JSON: only the raw bytes verify', () => {
		const headers = signedHeaders(COMPLETED_RAW_BODY);
		const rebuilt = JSON.stringify(JSON.parse(COMPLETED_RAW_BODY));
		expect(rebuilt).not.toBe(COMPLETED_RAW_BODY);
		const result = verify(rebuilt, headers);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('raw body');
	});

	it('refuses a delivery signed with another secret', () => {
		expect(
			verify(
				COMPLETED_RAW_BODY,
				signedHeaders(COMPLETED_RAW_BODY, { secret: OTHER_WEBHOOK_SECRET }),
			).valid,
		).toBe(false);
	});

	it('accepts any matching signature, as during a secret rotation', () => {
		const timestampSeconds = Math.floor(Date.now() / 1000);
		const old = signature(
			OTHER_WEBHOOK_SECRET,
			`msg_01TESTDELIVERY.${timestampSeconds}.${COMPLETED_RAW_BODY}`,
		);
		expect(
			verify(
				COMPLETED_RAW_BODY,
				signedHeaders(COMPLETED_RAW_BODY, {
					timestampSeconds,
					extraSignature: old,
				}),
			).valid,
		).toBe(true);
		expect(
			verify(
				COMPLETED_RAW_BODY,
				signedHeaders(COMPLETED_RAW_BODY, {
					timestampSeconds,
					secret: OTHER_WEBHOOK_SECRET,
					extraSignature: 'v1,bm90LXRoZS1yaWdodC1zaWduYXR1cmU=',
				}),
				OTHER_WEBHOOK_SECRET,
			).valid,
		).toBe(true);
	});

	it('ignores other versions and malformed entries', () => {
		const headers = signedHeaders(COMPLETED_RAW_BODY);
		const good = headers['webhook-signature'] as string;
		const onlyEncoded = good.slice('v1,'.length);
		for (const value of [
			`v2,${onlyEncoded}`,
			onlyEncoded,
			'v1,',
			'v1,not base64!',
			'v1,AAAA',
			',',
			'   ',
		]) {
			expect(
				verify(COMPLETED_RAW_BODY, { ...headers, 'webhook-signature': value })
					.valid,
			).toBe(false);
		}
	});

	it.each([
		['six minutes old', -360],
		['six minutes ahead', 360],
	])('refuses a timestamp %s', (_label, offset) => {
		const timestampSeconds = Math.floor(Date.now() / 1000) + offset;
		expect(
			verify(
				COMPLETED_RAW_BODY,
				signedHeaders(COMPLETED_RAW_BODY, { timestampSeconds }),
			),
		).toEqual({ valid: false, error: 'The webhook timestamp is out of range' });
	});

	it('accepts a timestamp four minutes old', () => {
		const timestampSeconds = Math.floor(Date.now() / 1000) - 240;
		expect(
			verify(
				COMPLETED_RAW_BODY,
				signedHeaders(COMPLETED_RAW_BODY, { timestampSeconds }),
			).valid,
		).toBe(true);
	});

	it('honours the clock it is given', () => {
		const timestampSeconds = 1_800_000_000;
		const request = delivery(
			COMPLETED_RAW_BODY,
			signedHeaders(COMPLETED_RAW_BODY, { timestampSeconds }),
		);
		expect(
			verifyHiggsfieldWebhookSignature(request, WEBHOOK_SECRET, {
				now: timestampSeconds * 1000,
			}).valid,
		).toBe(true);
		expect(
			verifyHiggsfieldWebhookSignature(request, WEBHOOK_SECRET, {
				now: (timestampSeconds + 301) * 1000,
			}).valid,
		).toBe(false);
	});

	it.each(['soon', '-1', '1.5', '', '99999999999999'])(
		'refuses the malformed timestamp %p',
		(timestamp) => {
			const headers = signedHeaders(COMPLETED_RAW_BODY);
			expect(
				verify(COMPLETED_RAW_BODY, {
					...headers,
					'webhook-timestamp': timestamp,
				}).valid,
			).toBe(false);
		},
	);

	it.each(['webhook-id', 'webhook-timestamp', 'webhook-signature'])(
		'refuses a delivery without %s',
		(name) => {
			const headers = signedHeaders(COMPLETED_RAW_BODY);
			delete headers[name];
			expect(verify(COMPLETED_RAW_BODY, headers)).toEqual({
				valid: false,
				error: 'The delivery is not signed',
			});
		},
	);

	it('refuses an unsigned delivery, as an account without a revealed secret sends', () => {
		expect(
			verify(COMPLETED_RAW_BODY, { 'content-type': 'application/json' }).valid,
		).toBe(false);
	});

	it('fails closed with no secret', () => {
		const result = verifyHiggsfieldWebhookSignature(
			delivery(COMPLETED_RAW_BODY, signedHeaders(COMPLETED_RAW_BODY)),
			'',
		);
		expect(result).toEqual({ valid: false, error: 'Missing webhook secret' });
	});

	it.each(['not-a-secret', 'whsec_', 'whsec_not base64!', 'c2VjcmV0'])(
		'refuses the malformed secret %p',
		(secret) => {
			const result = verify(
				COMPLETED_RAW_BODY,
				signedHeaders(COMPLETED_RAW_BODY),
				secret,
			);
			expect(result.valid).toBe(false);
			expect(result.error).toContain('malformed');
		},
	);

	it('refuses a request with no raw body', () => {
		const request = delivery(
			COMPLETED_RAW_BODY,
			signedHeaders(COMPLETED_RAW_BODY),
		);
		request.rawBody = undefined;
		expect(verifyHiggsfieldWebhookSignature(request, WEBHOOK_SECRET)).toEqual({
			valid: false,
			error: 'Missing raw body',
		});
	});

	it('reads header names in any case', () => {
		const headers = signedHeaders(COMPLETED_RAW_BODY);
		expect(
			verify(COMPLETED_RAW_BODY, {
				'Webhook-Id': headers['webhook-id'] as string,
				'Webhook-Timestamp': headers['webhook-timestamp'] as string,
				'Webhook-Signature': headers['webhook-signature'] as string,
			}).valid,
		).toBe(true);
	});
});

describe('isHiggsfieldWebhook', () => {
	// unknown: the matcher sees whatever body a transport hands it.
	const match = (body: unknown, headers: Record<string, string> = {}) =>
		isHiggsfieldWebhook({ headers, body });

	it.each([COMPLETED_RAW_BODY, FAILED_RAW_BODY, NSFW_RAW_BODY])(
		'matches an envelope, parsed or as text: %s',
		(raw) => {
			expect(match(JSON.parse(raw))).toBe(true);
			expect(match(raw)).toBe(true);
		},
	);

	it.each([
		// fal's envelope: same shape, its own status words.
		{ request_id: 'x', status: 'OK', payload: {}, gateway_request_id: 'x' },
		{ request_id: 'x', status: 'ERROR', payload: null },
		{ request_id: 'x', status: 'queued', payload: null },
		{ request_id: 'x', status: 'completed' },
		{ status: 'completed', payload: {} },
		{ id: 'pred', status: 'succeeded', output: [] },
		null,
		'not json',
		[],
	])('leaves %j alone', (body) => {
		expect(match(body)).toBe(false);
	});

	describe('a failure with no payload key', () => {
		const signed = {
			'webhook-id': 'msg_1',
			'webhook-timestamp': '1800000000',
			'webhook-signature': 'v1,AAAA',
		};

		it.each(['failed', 'nsfw', 'canceled'])(
			'matches a signed %s delivery',
			(status) => {
				expect(match({ request_id: 'x', status }, signed)).toBe(true);
			},
		);

		it('reads the signature headers in any case', () => {
			expect(
				match(
					{ request_id: 'x', status: 'failed' },
					{ 'Webhook-Id': 'msg_1', 'Webhook-Signature': 'v1,AAAA' },
				),
			).toBe(true);
		});

		it('leaves another provider’s unsigned failure alone', () => {
			expect(match({ request_id: 'x', status: 'failed', error: 'no' })).toBe(
				false,
			);
		});

		it('leaves a signed success with no output alone', () => {
			expect(match({ request_id: 'x', status: 'completed' }, signed)).toBe(
				false,
			);
		});

		it('leaves another signed provider’s status words alone', () => {
			expect(match({ request_id: 'x', status: 'ERROR' }, signed)).toBe(false);
		});
	});
});

describe('requests.completed handler', () => {
	const ctxWith = (key: string | undefined) =>
		// unknown: the handler reads only ctx.key here; the rest of the context is the runtime's.
		({ key }) as unknown as Parameters<
			typeof RequestWebhooks.completed.handler
		>[0];

	beforeEach(() => {
		(logEventFromContext as jest.Mock).mockClear();
	});

	it('answers the envelope with webhook_id, and logs ids rather than URLs', async () => {
		const result = await RequestWebhooks.completed.handler(
			ctxWith(WEBHOOK_SECRET),
			delivery(COMPLETED_RAW_BODY, signedHeaders(COMPLETED_RAW_BODY)) as never,
		);
		expect(result.success).toBe(true);
		expect(result.data).toMatchObject({
			request_id: REQUEST_ID,
			status: 'completed',
			webhook_id: 'msg_01TESTDELIVERY',
			payload: { images: [{ url: 'https://cdn.example.com/boat.png' }] },
		});
		expect(logEventFromContext).toHaveBeenCalledWith(
			expect.anything(),
			'higgsfield.webhook.requests.completed',
			{ requestId: REQUEST_ID, status: 'completed' },
			'completed',
		);
	});

	it.each([
		[FAILED_RAW_BODY, 'failed'],
		[NSFW_RAW_BODY, 'nsfw'],
	])('passes %s through with its status intact', async (raw, status) => {
		const result = await RequestWebhooks.completed.handler(
			ctxWith(WEBHOOK_SECRET),
			delivery(raw, signedHeaders(raw)) as never,
		);
		expect(result.success).toBe(true);
		expect(result.data?.status).toBe(status);
		expect(result.data?.payload).toBeNull();
	});

	it('keeps an artifact field it does not know', async () => {
		const raw = `{"request_id": "${REQUEST_ID}", "status": "completed", "error": null, "payload": {"video": {"url": "https://cdn.example.com/v.mp4"}, "fbx": {"url": "https://cdn.example.com/m.fbx"}}}`;
		const result = await RequestWebhooks.completed.handler(
			ctxWith(WEBHOOK_SECRET),
			delivery(raw, signedHeaders(raw)) as never,
		);
		expect(result.data?.payload).toHaveProperty('fbx');
	});

	it('throws on a bad signature, without logging it', async () => {
		await expect(
			RequestWebhooks.completed.handler(
				ctxWith(WEBHOOK_SECRET),
				delivery(COMPLETED_RAW_BODY, {
					...signedHeaders(COMPLETED_RAW_BODY),
					'webhook-signature': 'v1,AAAA',
				}) as never,
			),
		).rejects.toThrow('The signature does not match');
		expect(logEventFromContext).not.toHaveBeenCalled();
	});

	it('throws on an unsigned delivery while a secret is set', async () => {
		await expect(
			RequestWebhooks.completed.handler(
				ctxWith(WEBHOOK_SECRET),
				delivery(COMPLETED_RAW_BODY, {}) as never,
			),
		).rejects.toThrow('The delivery is not signed');
	});

	it('throws with no secret set, so the sender is told to retry', async () => {
		await expect(
			RequestWebhooks.completed.handler(
				ctxWith(''),
				delivery(
					COMPLETED_RAW_BODY,
					signedHeaders(COMPLETED_RAW_BODY),
				) as never,
			),
		).rejects.toThrow('No Higgsfield webhook secret is set');
	});

	it('trusts a delivery the Hub already verified', async () => {
		const result = await RequestWebhooks.completed.handler(ctxWith(undefined), {
			...delivery(COMPLETED_RAW_BODY, {}),
			hubVerified: true,
		} as never);
		expect(result.success).toBe(true);
	});

	it('throws on a signed body that is not the envelope', async () => {
		const raw = '{"request_id": 5, "status": "completed", "payload": null}';
		await expect(
			RequestWebhooks.completed.handler(
				ctxWith(WEBHOOK_SECRET),
				delivery(raw, signedHeaders(raw)) as never,
			),
		).rejects.toThrow('does not match the webhook envelope');
		expect(logEventFromContext).not.toHaveBeenCalled();
	});

	it('takes a signed failure with no payload key', async () => {
		const raw = `{"request_id": "${REQUEST_ID}", "status": "failed", "error": "Generation failed"}`;
		const result = await RequestWebhooks.completed.handler(
			ctxWith(WEBHOOK_SECRET),
			delivery(raw, signedHeaders(raw)) as never,
		);
		expect(result.data).toMatchObject({
			status: 'failed',
			error: 'Generation failed',
		});
	});
});
