import { createHmac } from 'node:crypto';
import { webhookEvent } from './test-fixtures';
import { event } from './webhooks';
import {
	matchPayhereEvent,
	matchPayhereWebhook,
	PAYHERE_SIGNATURE_HEADER,
	PayhereWebhookPayloadSchema,
	verifyPayhereWebhook,
} from './webhooks/types';

const SECRET = 'whsec_test_secret';

function sign(body: string, key: string): string {
	return createHmac('sha1', key).update(body).digest('hex');
}

function rawRequest(
	// unknown: the delivery body is untyped until the payload schema parses
	// it; the fixture passes provider-shaped objects through.
	body: unknown,
	signature?: string,
) {
	const rawBody = JSON.stringify(body);
	return {
		headers:
			signature === undefined ? {} : { [PAYHERE_SIGNATURE_HEADER]: signature },
		payload: body,
		body,
		rawBody,
	};
}

// unknown: the handler reads fields the webhook fixture does not carry; the
// runtime key manager carries many more methods than this stub implements.
function webhookContext(secret: string | undefined) {
	return {
		key: secret,
		keys: { get_webhook_signature: () => Promise.resolve(secret ?? null) },
	} as never;
}

describe('verifyPayhereWebhook', () => {
	it('accepts a delivery signed with the shared secret', () => {
		const raw = rawRequest(
			webhookEvent,
			sign(JSON.stringify(webhookEvent), SECRET),
		);
		expect(verifyPayhereWebhook(raw as never, SECRET)).toEqual({ valid: true });
	});

	it('rejects a signature from another secret', () => {
		const raw = rawRequest(
			webhookEvent,
			sign(JSON.stringify(webhookEvent), 'whsec_other'),
		);
		const result = verifyPayhereWebhook(raw as never, SECRET);
		expect(result.valid).toBe(false);
		expect(result.error).toBe('Invalid webhook signature');
	});

	it('rejects a delivery without the signature header', () => {
		const result = verifyPayhereWebhook(
			rawRequest(webhookEvent) as never,
			SECRET,
		);
		expect(result.valid).toBe(false);
		expect(result.error).toContain(PAYHERE_SIGNATURE_HEADER);
	});

	it('rejects when no secret is configured', () => {
		const raw = rawRequest(
			webhookEvent,
			sign(JSON.stringify(webhookEvent), SECRET),
		);
		const result = verifyPayhereWebhook(raw as never, undefined);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('keys.set_webhook_signature');
	});

	it('rejects when the raw body was not captured', () => {
		const request = {
			headers: { [PAYHERE_SIGNATURE_HEADER]: sign('other', SECRET) },
			body: webhookEvent,
			rawBody: undefined,
		};
		const result = verifyPayhereWebhook(request as never, SECRET);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('not captured');
	});

	it('accepts a hub-verified delivery without a signature', () => {
		const request = { headers: {}, body: webhookEvent, hubVerified: true };
		expect(verifyPayhereWebhook(request as never, undefined)).toEqual({
			valid: true,
		});
	});
});

describe('matchPayhereWebhook', () => {
	it('matches a signed delivery with the documented event envelope', () => {
		expect(matchPayhereWebhook(rawRequest(webhookEvent, 'abc') as never)).toBe(
			true,
		);
	});

	it('leaves an unsigned { event } body (Razorpay) to other plugins', () => {
		expect(
			matchPayhereWebhook(
				rawRequest({ event: 'payment.captured', payload: {} }) as never,
			),
		).toBe(false);
	});

	it('does not match bodies without an event string', () => {
		expect(
			matchPayhereWebhook(rawRequest({ payment: {} }, 'abc') as never),
		).toBe(false);
		expect(
			matchPayhereWebhook(rawRequest([webhookEvent], 'abc') as never),
		).toBe(false);
	});
});

describe('matchPayhereEvent', () => {
	it('matches a Hub-routed delivery without the signature header', () => {
		expect(matchPayhereEvent(rawRequest(webhookEvent) as never)).toBe(true);
	});
});

describe('PayhereWebhookPayloadSchema', () => {
	it('parses a delivery', () => {
		const parsed = PayhereWebhookPayloadSchema.parse(webhookEvent);
		expect(parsed.event).toBe('payment.success');
	});

	it('rejects a delivery without an event', () => {
		expect(() => PayhereWebhookPayloadSchema.parse({ payment: {} })).toThrow();
	});
});

describe('payhere.event handler', () => {
	it('returns a 401 refusal for an unverified delivery', async () => {
		const result = await event.handler(
			webhookContext(SECRET),
			rawRequest(webhookEvent, 'bad-signature') as never,
		);
		expect(result).toMatchObject({ success: false, statusCode: 401 });
	});

	it('returns a 400 refusal for a body the payload schema rejects', async () => {
		const body = { no_event_here: true };
		const result = await event.handler(
			webhookContext(SECRET),
			rawRequest(body, sign(JSON.stringify(body), SECRET)) as never,
		);
		expect(result).toMatchObject({ success: false, statusCode: 400 });
	});

	it('returns the parsed event for a verified delivery', async () => {
		const result = await event.handler(
			webhookContext(SECRET),
			rawRequest(
				webhookEvent,
				sign(JSON.stringify(webhookEvent), SECRET),
			) as never,
		);
		expect(result.success).toBe(true);
		// unknown: the handler's data field is the parsed event object.
		const data = (result as { data?: { event?: string } }).data;
		expect(data?.event).toBe('payment.success');
	});
});
