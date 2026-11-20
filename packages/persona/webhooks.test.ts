import { createHmac } from 'node:crypto';
import { inquiry, webhookEvent } from './test-fixtures';
import { event } from './webhooks';
import {
	matchPersonaWebhook,
	PersonaWebhookPayloadSchema,
	verifyPersonaWebhook,
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
		headers: signature === undefined ? {} : { 'persona-signature': signature },
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

describe('verifyPersonaWebhook', () => {
	it('accepts a delivery signed with the webhook secret', () => {
		const raw = rawRequest(
			webhookEvent,
			sign(JSON.stringify(webhookEvent), SECRET),
		);
		expect(verifyPersonaWebhook(raw as never, SECRET)).toEqual({ valid: true });
	});

	it('rejects a signature from another secret', () => {
		const raw = rawRequest(
			webhookEvent,
			sign(JSON.stringify(webhookEvent), 'whsec_other'),
		);
		const result = verifyPersonaWebhook(raw as never, SECRET);
		expect(result.valid).toBe(false);
		expect(result.error).toBe('Invalid webhook signature');
	});

	it('rejects a delivery without the signature header', () => {
		const result = verifyPersonaWebhook(
			rawRequest(webhookEvent) as never,
			SECRET,
		);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('persona-signature');
	});

	it('rejects when no secret is configured', () => {
		const raw = rawRequest(
			webhookEvent,
			sign(JSON.stringify(webhookEvent), SECRET),
		);
		const result = verifyPersonaWebhook(raw as never, undefined);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('keys.set_webhook_signature');
	});

	it('rejects when the raw body was not captured', () => {
		const request = {
			headers: { 'persona-signature': sign('other', SECRET) },
			body: webhookEvent,
			rawBody: undefined,
		};
		const result = verifyPersonaWebhook(request as never, SECRET);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('not captured');
	});

	it('accepts a hub-verified delivery without a signature', () => {
		const request = { headers: {}, body: webhookEvent, hubVerified: true };
		expect(verifyPersonaWebhook(request as never, undefined)).toEqual({
			valid: true,
		});
	});
});

describe('matchPersonaWebhook', () => {
	it('matches the documented envelope with type and data', () => {
		expect(matchPersonaWebhook(rawRequest(webhookEvent) as never)).toBe(true);
	});

	it('does not match bodies without type or data', () => {
		expect(matchPersonaWebhook(rawRequest({ type: 'x' }) as never)).toBe(false);
		expect(matchPersonaWebhook(rawRequest({ data: {} }) as never)).toBe(false);
		expect(matchPersonaWebhook(rawRequest([webhookEvent]) as never)).toBe(
			false,
		);
	});
});

describe('PersonaWebhookPayloadSchema', () => {
	it('parses a delivery', () => {
		const parsed = PersonaWebhookPayloadSchema.parse(webhookEvent);
		expect(parsed.type).toBe('inquiry.approved');
		expect(parsed.data?.id).toBe(inquiry.id);
	});

	it('rejects a delivery without a type', () => {
		expect(() => PersonaWebhookPayloadSchema.parse({ data: {} })).toThrow();
	});
});

describe('persona.event handler', () => {
	it('returns a 401 refusal for an unverified delivery', async () => {
		const result = await event.handler(
			webhookContext(SECRET),
			rawRequest(webhookEvent, 'bad-signature') as never,
		);
		expect(result).toMatchObject({ success: false, statusCode: 401 });
	});

	it('returns a 400 refusal for a body the payload schema rejects', async () => {
		const body = { data: {} };
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
		const data = (result as { data?: { type?: string } }).data;
		expect(data?.type).toBe('inquiry.approved');
	});
});
