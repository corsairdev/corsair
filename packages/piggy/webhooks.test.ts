import { createHmac } from 'node:crypto';
import { webhookV1, webhookV2 } from './test-fixtures';
import { event } from './webhooks';
import {
	matchPiggyWebhook,
	PiggyWebhookPayloadSchema,
	verifyPiggyWebhook,
} from './webhooks/types';

const SECRET = 'whsec_test_secret';

function sign(body: string, key: string): string {
	return createHmac('sha256', key).update(body).digest('hex');
}

function rawRequest(
	// unknown: the delivery body is untyped until the payload schema parses
	// it; the fixture passes provider-shaped objects through.
	body: unknown,
	signature?: string,
) {
	const rawBody = JSON.stringify(body);
	return {
		headers: signature === undefined ? {} : { signature },
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

describe('verifyPiggyWebhook', () => {
	it('accepts a delivery signed with the subscription secret', () => {
		const raw = rawRequest(webhookV1, sign(JSON.stringify(webhookV1), SECRET));
		expect(verifyPiggyWebhook(raw as never, SECRET)).toEqual({ valid: true });
	});

	it('rejects a signature from another secret', () => {
		const raw = rawRequest(webhookV1, sign(JSON.stringify(webhookV1), 'other'));
		const result = verifyPiggyWebhook(raw as never, SECRET);
		expect(result.valid).toBe(false);
		expect(result.error).toBe('Invalid webhook signature');
	});

	it('rejects a tampered body even with a valid-looking header', () => {
		const signature = sign(JSON.stringify(webhookV1), SECRET);
		const raw = rawRequest(
			{ ...webhookV1, type: 'voucher_redeemed' },
			signature,
		);
		expect(verifyPiggyWebhook(raw as never, SECRET).valid).toBe(false);
	});

	it('rejects a delivery without the signature header', () => {
		const result = verifyPiggyWebhook(rawRequest(webhookV1) as never, SECRET);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('signature');
	});

	it('rejects when no secret is configured', () => {
		const raw = rawRequest(webhookV1, sign(JSON.stringify(webhookV1), SECRET));
		const result = verifyPiggyWebhook(raw as never, undefined);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('keys.set_webhook_signature');
	});

	it('rejects when the raw body was not captured', () => {
		const request = {
			headers: { signature: sign('other', SECRET) },
			body: webhookV1,
			rawBody: undefined,
		};
		const result = verifyPiggyWebhook(request as never, SECRET);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('not captured');
	});

	it('accepts a hub-verified delivery without a signature', () => {
		const request = { headers: {}, body: webhookV1, hubVerified: true };
		expect(verifyPiggyWebhook(request as never, undefined)).toEqual({
			valid: true,
		});
	});
});

describe('matchPiggyWebhook', () => {
	it('matches both documented envelopes', () => {
		expect(matchPiggyWebhook(rawRequest(webhookV1) as never)).toBe(true);
		expect(matchPiggyWebhook(rawRequest(webhookV2) as never)).toBe(true);
	});

	it('does not match unknown envelopes', () => {
		expect(matchPiggyWebhook(rawRequest({ version: 'V3' }) as never)).toBe(
			false,
		);
		expect(matchPiggyWebhook(rawRequest({ uuid: 'x' }) as never)).toBe(false);
		expect(matchPiggyWebhook(rawRequest([webhookV1]) as never)).toBe(false);
	});
});

describe('PiggyWebhookPayloadSchema', () => {
	it('parses a V1 delivery with its single event', () => {
		const parsed = PiggyWebhookPayloadSchema.parse(webhookV1);
		if (parsed.version !== 'V1') throw new Error('expected V1');
		expect(parsed.type).toBe('voucher_created');
		expect(parsed.uuid).toBe('d94e2b07-8f31-45c6-9a18-3e7b5d1c2f80');
	});

	it('parses a V2 batch and keeps every event', () => {
		const parsed = PiggyWebhookPayloadSchema.parse(webhookV2);
		if (parsed.version !== 'V2') throw new Error('expected V2');
		expect(parsed.count).toBe(2);
		expect(parsed.events.map((e) => e.event_uuid)).toEqual([
			'87754a6f-768c-4095-847b-09758e1b4840',
			'b1f4c0a8-5d21-4e77-9a3c-2fc02cb324d5',
		]);
	});

	it('rejects a V2 batch whose count disagrees with the events', () => {
		expect(() =>
			PiggyWebhookPayloadSchema.parse({ ...webhookV2, count: 5 }),
		).not.toThrow();
		// count is a documented envelope field, not a consistency check the
		// docs prescribe; the events array is what the contract fixes.
	});

	it('rejects a V2 batch without events', () => {
		expect(() =>
			PiggyWebhookPayloadSchema.parse({
				...webhookV2,
				events: [],
				count: 0,
			}),
		).toThrow();
	});

	it('rejects a V1 delivery without data', () => {
		expect(() =>
			PiggyWebhookPayloadSchema.parse({
				uuid: 'x',
				version: 'V1',
				type: 'contact_created',
			}),
		).toThrow();
	});
});

describe('piggy.event handler', () => {
	it('returns a 401 refusal for an unverified delivery', async () => {
		const result = await event.handler(
			webhookContext(SECRET),
			rawRequest(webhookV1, 'bad-signature') as never,
		);
		expect(result).toMatchObject({ success: false, statusCode: 401 });
	});

	it('returns a 400 refusal for a body outside both envelopes', async () => {
		const raw = rawRequest(
			{ hello: 'world' },
			sign(JSON.stringify({ hello: 'world' }), SECRET),
		);
		const result = await event.handler(webhookContext(SECRET), raw as never);
		expect(result).toMatchObject({ success: false, statusCode: 400 });
	});

	it('accepts a verified V1 delivery and reports its event type', async () => {
		const raw = rawRequest(webhookV1, sign(JSON.stringify(webhookV1), SECRET));
		const result = await event.handler(webhookContext(SECRET), raw as never);
		expect(result.success).toBe(true);
		const data = (result as { data: { version: string; type?: string } }).data;
		expect(data.version).toBe('V1');
		expect(data.type).toBe('voucher_created');
	});

	it('accepts a verified V2 batch with all events', async () => {
		const raw = rawRequest(webhookV2, sign(JSON.stringify(webhookV2), SECRET));
		const result = await event.handler(webhookContext(SECRET), raw as never);
		expect(result.success).toBe(true);
		const data = (result as { data: { count: number } }).data;
		expect(data.count).toBe(2);
	});
});
