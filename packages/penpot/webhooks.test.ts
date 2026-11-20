import { webhookEvent } from './test-fixtures';
import { event } from './webhooks';
import {
	matchPenpotWebhook,
	PenpotWebhookPayloadSchema,
	verifyPenpotWebhook,
} from './webhooks/types';

// unknown: the handler reads fields the webhook fixture does not carry.
function webhookContext() {
	return { key: '' } as never;
}

function rawRequest(
	// unknown: the delivery body is untyped until the payload schema parses
	// it; the fixture passes provider-shaped objects through.
	body: unknown,
) {
	const rawBody = JSON.stringify(body);
	return {
		headers: {},
		payload: body,
		body,
		rawBody,
	};
}

describe('verifyPenpotWebhook', () => {
	it('accepts a delivery with the documented event envelope', () => {
		expect(verifyPenpotWebhook(rawRequest(webhookEvent) as never)).toEqual({
			valid: true,
		});
	});

	it('accepts a delivery using the penpot.event key', () => {
		const body = { 'penpot.event': 'penpot.comment.added', payload: {} };
		expect(verifyPenpotWebhook(rawRequest(body) as never)).toEqual({
			valid: true,
		});
	});

	it('rejects a delivery without an event key', () => {
		const result = verifyPenpotWebhook(rawRequest({ payload: {} }) as never);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('event key');
	});

	it('rejects a non-object body', () => {
		const result = verifyPenpotWebhook(rawRequest('plain text') as never);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('not an object');
	});

	it('accepts a hub-verified delivery without an event key', () => {
		const request = { headers: {}, body: {}, payload: {}, hubVerified: true };
		expect(verifyPenpotWebhook(request as never)).toEqual({ valid: true });
	});
});

describe('matchPenpotWebhook', () => {
	it('matches the documented event envelope', () => {
		expect(matchPenpotWebhook(rawRequest(webhookEvent) as never)).toBe(true);
	});

	it('does not match bodies without an event string or arrays', () => {
		expect(matchPenpotWebhook(rawRequest({ payload: {} }) as never)).toBe(
			false,
		);
		expect(matchPenpotWebhook(rawRequest([webhookEvent]) as never)).toBe(false);
		expect(matchPenpotWebhook(rawRequest('plain') as never)).toBe(false);
	});
});

describe('PenpotWebhookPayloadSchema', () => {
	it('parses a delivery', () => {
		const parsed = PenpotWebhookPayloadSchema.parse(webhookEvent);
		expect(parsed.event).toBe('penpot.file.updated');
	});

	it('rejects a delivery without an event', () => {
		expect(() => PenpotWebhookPayloadSchema.parse({ payload: {} })).toThrow();
	});
});

describe('penpot.event handler', () => {
	it('returns a 400 refusal for a body without an event key', async () => {
		const result = await event.handler(
			webhookContext(),
			rawRequest({ payload: {} }) as never,
		);
		expect(result).toMatchObject({ success: false, statusCode: 400 });
	});

	it('returns a 400 refusal for a body the payload schema rejects', async () => {
		const result = await event.handler(
			webhookContext(),
			rawRequest({ event: {} }) as never,
		);
		expect(result).toMatchObject({ success: false, statusCode: 400 });
	});

	it('returns the parsed event for a well-formed delivery', async () => {
		const result = await event.handler(
			webhookContext(),
			rawRequest(webhookEvent) as never,
		);
		expect(result.success).toBe(true);
		// unknown: the handler's data field is the parsed event object.
		const data = (result as { data?: { event?: string } }).data;
		expect(data?.event).toBe('penpot.file.updated');
	});
});
