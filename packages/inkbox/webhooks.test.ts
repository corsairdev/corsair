import { createHmac } from 'node:crypto';
import { processWebhook } from 'corsair';
import { createCorsair, logEventFromContext } from 'corsair/core';
import { inkboxWebhookDefinitions } from './endpoints/manifest';
import { inkbox } from './index';
import {
	INKBOX_WEBHOOK_TOLERANCE_SECONDS,
	isInkboxDelivery,
	verifyInkboxWebhook,
	webhookIdFor,
} from './webhooks';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

const mockedLogEvent = jest.mocked(logEventFromContext);

const SECRET = 'whsec_dGVzdC1zaWduaW5nLWtleS1mb3ItaW5rYm94';
const NOW = 1_795_000_000;

function sign(
	body: string,
	{
		secret = SECRET,
		requestId = 'req_01',
		timestamp = String(NOW),
	}: { secret?: string; requestId?: string; timestamp?: string } = {},
): Record<string, string> {
	const key = secret.replace(/^whsec_/, '');
	const digest = createHmac('sha256', key)
		.update(`${requestId}.${timestamp}.${body}`)
		.digest('hex');
	return {
		'content-type': 'application/json',
		'x-inkbox-request-id': requestId,
		'x-inkbox-timestamp': timestamp,
		'x-inkbox-signature': `sha256=${digest}`,
	};
}

const mailEvent = {
	id: 'evt_01JDXQ4R6M2N8P0S',
	event_type: 'message.received',
	timestamp: '2026-11-23T12:00:00Z',
	data: {
		message: {
			id: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
			subject: 'Your order',
			from_address: 'ada@example.com',
		},
	},
};

beforeEach(() => {
	jest.clearAllMocks();
	jest.useFakeTimers({ now: NOW * 1000 });
});

afterEach(() => {
	jest.useRealTimers();
});

describe('verifyInkboxWebhook', () => {
	const body = JSON.stringify(mailEvent);

	it('accepts the signature Inkbox computes over request id, timestamp and raw body', () => {
		expect(
			verifyInkboxWebhook(
				{ payload: mailEvent, headers: sign(body), rawBody: body },
				SECRET,
				NOW,
			),
		).toEqual({ valid: true });
		// The key works with or without its whsec_ prefix.
		expect(
			verifyInkboxWebhook(
				{ payload: mailEvent, headers: sign(body), rawBody: body },
				SECRET.replace(/^whsec_/, ''),
				NOW,
			),
		).toEqual({ valid: true });
	});

	it('refuses a changed body, a wrong key or a forged signature', () => {
		const headers = sign(body);
		expect(
			verifyInkboxWebhook(
				{
					payload: mailEvent,
					headers,
					rawBody: body.replace('Your order', 'Refund'),
				},
				SECRET,
				NOW,
			),
		).toEqual({ valid: false, error: 'Invalid Inkbox webhook signature' });
		expect(
			verifyInkboxWebhook(
				{ payload: mailEvent, headers, rawBody: body },
				'whsec_another-key',
				NOW,
			).valid,
		).toBe(false);
		expect(
			verifyInkboxWebhook(
				{
					payload: mailEvent,
					headers: { ...headers, 'x-inkbox-signature': 'sha256=deadbeef' },
					rawBody: body,
				},
				SECRET,
				NOW,
			).valid,
		).toBe(false);
	});

	it(`refuses a timestamp more than ${INKBOX_WEBHOOK_TOLERANCE_SECONDS} seconds away, signed or not`, () => {
		const old = String(NOW - INKBOX_WEBHOOK_TOLERANCE_SECONDS - 1);
		expect(
			verifyInkboxWebhook(
				{
					payload: mailEvent,
					headers: sign(body, { timestamp: old }),
					rawBody: body,
				},
				SECRET,
				NOW,
			),
		).toEqual({ valid: false, error: 'Stale X-Inkbox-Timestamp' });
		const edge = String(NOW - INKBOX_WEBHOOK_TOLERANCE_SECONDS);
		expect(
			verifyInkboxWebhook(
				{
					payload: mailEvent,
					headers: sign(body, { timestamp: edge }),
					rawBody: body,
				},
				SECRET,
				NOW,
			).valid,
		).toBe(true);
	});

	it('says what is missing: the key, the raw body, the headers', () => {
		expect(
			verifyInkboxWebhook(
				{ payload: mailEvent, headers: sign(body), rawBody: body },
				'',
				NOW,
			).valid,
		).toBe(false);
		expect(
			verifyInkboxWebhook(
				{ payload: mailEvent, headers: sign(body) },
				SECRET,
				NOW,
			),
		).toEqual({ valid: false, error: 'Missing raw body' });
		expect(
			verifyInkboxWebhook(
				{ payload: mailEvent, headers: {}, rawBody: body },
				SECRET,
				NOW,
			),
		).toEqual({ valid: false, error: 'Missing Inkbox signature headers' });
		expect(
			verifyInkboxWebhook(
				{
					payload: mailEvent,
					headers: { ...sign(body), 'x-inkbox-timestamp': 'yesterday' },
					rawBody: body,
				},
				SECRET,
				NOW,
			),
		).toEqual({ valid: false, error: 'Malformed X-Inkbox-Timestamp' });
	});

	it('trusts a delivery the Hub already verified', () => {
		expect(
			verifyInkboxWebhook(
				{ payload: mailEvent, headers: {}, hubVerified: true },
				undefined,
			),
		).toEqual({ valid: true });
	});
});

describe('matching', () => {
	it.each(
		inkboxWebhookDefinitions.map((webhook) => [webhook.id, webhook.events]),
	)('routes every %s event type to that webhook', (id, events) => {
		for (const eventType of events as string[]) {
			expect([eventType, webhookIdFor(eventType)]).toEqual([eventType, id]);
		}
	});

	it('recognises an Inkbox envelope and nothing else', () => {
		expect(isInkboxDelivery({ headers: {}, body: mailEvent })).toBe(true);
		expect(
			isInkboxDelivery({
				headers: {},
				body: { ...mailEvent, event_type: 'push' },
			}),
		).toBe(false);
		expect(isInkboxDelivery({ headers: {}, body: { type: 'message' } })).toBe(
			false,
		);
		// The synchronous incoming-call callback is not an event envelope.
		expect(
			isInkboxDelivery({
				headers: {},
				body: { id: 'call_1', direction: 'inbound', status: 'ringing' },
			}),
		).toBe(false);
	});
});

describe('processWebhook', () => {
	const corsair = () =>
		createCorsair({
			plugins: [inkbox({ key: 'ApiKey_test', webhookSecret: SECRET })],
		});

	it('handles a signed mail event and returns it parsed', async () => {
		const body = JSON.stringify(mailEvent);
		const result = await processWebhook(corsair(), sign(body), body);
		expect(result.plugin).toBe('inkbox');
		expect(result.action).toBe('mail.messageEvent');
		expect(result.response?.success).toBe(true);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			expect.anything(),
			'inkbox.webhook.mail.messageEvent',
			{ eventType: 'message.received', eventId: 'evt_01JDXQ4R6M2N8P0S' },
			'completed',
		);
	});

	it('routes text, call and Slack events to their own webhooks', async () => {
		for (const [eventType, action] of [
			['text.received', 'phone.textEvent'],
			['call.ended', 'phone.callEnded'],
			['slack.dm_received', 'slack.event'],
			['a2a.task.created', 'a2a.taskEvent'],
			['message.transcription_finished', 'transcriptions.finished'],
		]) {
			const body = JSON.stringify({
				...mailEvent,
				event_type: eventType,
				data: {},
			});
			const result = await processWebhook(corsair(), sign(body), body);
			expect([eventType, result.action]).toEqual([eventType, action]);
		}
	});

	it('refuses an unsigned or wrongly signed delivery with 401, before logging anything', async () => {
		const body = JSON.stringify(mailEvent);
		const unsigned = await processWebhook(
			corsair(),
			{ 'content-type': 'application/json' },
			body,
		);
		expect(unsigned.response).toEqual({
			success: false,
			error: 'Missing Inkbox signature headers',
			statusCode: 401,
		});
		const forged = await processWebhook(
			corsair(),
			sign(body, { secret: 'whsec_not-the-key' }),
			body,
		);
		expect(forged.response?.statusCode).toBe(401);
		expect(mockedLogEvent).not.toHaveBeenCalled();
	});

	it('refuses a payload that breaks its documented schema, naming paths only', async () => {
		const body = JSON.stringify({
			...mailEvent,
			timestamp: 12345,
			data: 'not-an-object',
		});
		const result = await processWebhook(corsair(), sign(body), body);
		// A data value that is not an object is not an Inkbox envelope at all.
		expect(result.plugin).toBeNull();
		const wrongType = JSON.stringify({
			...mailEvent,
			id: 'evt_1',
			data: { message: 42 },
		});
		const typed = await processWebhook(corsair(), sign(wrongType), wrongType);
		expect(typed.plugin).toBe('inkbox');
		expect(typed.response?.success).toBe(false);
		expect(typed.response?.error ?? '').not.toContain('42');
	});
});
