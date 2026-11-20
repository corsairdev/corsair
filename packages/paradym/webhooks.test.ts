import { createHmac } from 'node:crypto';
import { webhookEvent } from './test-fixtures';
import { event } from './webhooks';
import {
	matchParadymWebhook,
	PARADYM_SIGNATURE_HEADER,
	ParadymWebhookPayloadSchema,
	verifyParadymWebhook,
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
	headers: Record<string, string> = {},
) {
	const rawBody = JSON.stringify(body);
	return {
		headers,
		payload: body,
		body,
		rawBody,
		query: undefined,
		...(signature !== undefined
			? { headers: { ...headers, [PARADYM_SIGNATURE_HEADER]: signature } }
			: {}),
	};
}

// unknown: the handler reads fields the webhook fixture does not carry.
function webhookContext(secret: string | undefined) {
	return { key: secret } as never;
}

describe('verifyParadymWebhook', () => {
	it('accepts a delivery signed with the subscription secret', () => {
		const raw = rawRequest(
			webhookEvent,
			sign(JSON.stringify(webhookEvent), SECRET),
		);
		expect(verifyParadymWebhook(raw as never, SECRET)).toEqual({ valid: true });
	});

	it('rejects a signature from another secret', () => {
		const raw = rawRequest(
			webhookEvent,
			sign(JSON.stringify(webhookEvent), 'whsec_other'),
		);
		const result = verifyParadymWebhook(raw as never, SECRET);
		expect(result.valid).toBe(false);
		expect(result.error).toBe('Invalid webhook signature');
	});

	it('rejects a delivery without the signature header', () => {
		const result = verifyParadymWebhook(
			rawRequest(webhookEvent) as never,
			SECRET,
		);
		expect(result.valid).toBe(false);
		expect(result.error).toContain(PARADYM_SIGNATURE_HEADER);
	});

	it('rejects when no secret is configured', () => {
		const raw = rawRequest(
			webhookEvent,
			sign(JSON.stringify(webhookEvent), SECRET),
		);
		const result = verifyParadymWebhook(raw as never, undefined);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('keys.set_webhook_signature');
	});

	it('rejects when the raw body was not captured', () => {
		const request = {
			headers: { [PARADYM_SIGNATURE_HEADER]: sign('other', SECRET) },
			body: webhookEvent,
			rawBody: undefined,
		};
		const result = verifyParadymWebhook(request as never, SECRET);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('not captured');
	});

	it('accepts a hub-verified delivery without a signature', () => {
		const request = { headers: {}, body: webhookEvent, hubVerified: true };
		expect(verifyParadymWebhook(request as never, undefined)).toEqual({
			valid: true,
		});
	});
});

describe('matchParadymWebhook', () => {
	it('matches the documented envelope', () => {
		expect(matchParadymWebhook(rawRequest(webhookEvent) as never)).toBe(true);
	});

	it('does not match objects without eventType and walletId, or arrays', () => {
		expect(matchParadymWebhook(rawRequest({ eventType: 'x' }) as never)).toBe(
			false,
		);
		expect(matchParadymWebhook(rawRequest({ walletId: 'w' }) as never)).toBe(
			false,
		);
		expect(matchParadymWebhook(rawRequest([webhookEvent]) as never)).toBe(
			false,
		);
		expect(matchParadymWebhook(rawRequest('plain') as never)).toBe(false);
	});
});

describe('ParadymWebhookPayloadSchema', () => {
	it('parses a delivery', () => {
		const parsed = ParadymWebhookPayloadSchema.parse(webhookEvent);
		expect(parsed.eventType).toBe('openid4vc.issuance.completed');
		expect(parsed.payload?.openId4VcIssuanceId).toBe('issuance_1');
	});

	it('rejects a delivery without an eventType', () => {
		expect(() =>
			ParadymWebhookPayloadSchema.parse({
				...webhookEvent,
				eventType: undefined,
			}),
		).toThrow();
	});
});

describe('paradym.event handler', () => {
	it('returns a 401 refusal for an unverified delivery', async () => {
		const result = await event.handler(
			webhookContext(SECRET),
			rawRequest(webhookEvent, 'bad-signature') as never,
		);
		expect(result).toMatchObject({ success: false, statusCode: 401 });
	});

	it('returns a 400 refusal for a body the payload schema rejects', async () => {
		const body = { walletId: 'w', webhookId: 'x', webhookPublishedAt: 't' };
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
		const data = (result as { data?: { eventType?: string } }).data;
		expect(data?.eventType).toBe('openid4vc.issuance.completed');
	});
});
