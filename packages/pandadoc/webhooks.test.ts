import { createHmac } from 'node:crypto';
import { webhookDelivery } from './test-fixtures';
import { event } from './webhooks';
import {
	matchPandadocWebhook,
	PANDADOC_EVENT_ID_HEADER,
	PANDADOC_SIGNATURE_QUERY,
	PandadocWebhookPayloadSchema,
	verifyPandadocWebhook,
} from './webhooks/types';

const SHARED_KEY = 'whsec_test_shared_key';

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
		query:
			signature === undefined
				? undefined
				: { [PANDADOC_SIGNATURE_QUERY]: signature },
	};
}

// unknown: the handler reads fields the webhook fixture does not carry.
function webhookContext(sharedKey: string | undefined) {
	return { key: sharedKey } as never;
}

describe('verifyPandadocWebhook', () => {
	it('accepts a delivery signed with the shared key', () => {
		const body = webhookDelivery;
		const raw = rawRequest(body, sign(JSON.stringify(body), SHARED_KEY));
		expect(verifyPandadocWebhook(raw as never, SHARED_KEY)).toEqual({
			valid: true,
		});
	});

	it('rejects a signature from another key', () => {
		const body = webhookDelivery;
		const raw = rawRequest(body, sign(JSON.stringify(body), 'whsec_other'));
		const result = verifyPandadocWebhook(raw as never, SHARED_KEY);
		expect(result.valid).toBe(false);
		expect(result.error).toBe('Invalid webhook signature');
	});

	it('rejects a delivery without the signature query parameter', () => {
		const result = verifyPandadocWebhook(
			rawRequest(webhookDelivery) as never,
			SHARED_KEY,
		);
		expect(result.valid).toBe(false);
		expect(result.error).toContain(PANDADOC_SIGNATURE_QUERY);
	});

	it('rejects when no shared key is configured', () => {
		const body = webhookDelivery;
		const raw = rawRequest(body, sign(JSON.stringify(body), SHARED_KEY));
		const result = verifyPandadocWebhook(raw as never, undefined);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('keys.set_webhook_signature');
	});

	it('rejects when the raw body was not captured', () => {
		const request = {
			headers: {},
			body: webhookDelivery,
			rawBody: undefined,
			query: { [PANDADOC_SIGNATURE_QUERY]: sign('other', SHARED_KEY) },
		};
		const result = verifyPandadocWebhook(request as never, SHARED_KEY);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('not captured');
	});

	it('accepts a hub-verified delivery without a signature', () => {
		const request = { headers: {}, body: webhookDelivery, hubVerified: true };
		expect(verifyPandadocWebhook(request as never, undefined)).toEqual({
			valid: true,
		});
	});
});

describe('matchPandadocWebhook', () => {
	it('matches the documented array-of-events body', () => {
		expect(matchPandadocWebhook(rawRequest(webhookDelivery) as never)).toBe(
			true,
		);
	});

	it('does not match a single object, a non-array or an empty array', () => {
		expect(
			matchPandadocWebhook(rawRequest({ event: 'x', data: {} }) as never),
		).toBe(false);
		expect(matchPandadocWebhook(rawRequest({ foo: 'bar' }) as never)).toBe(
			false,
		);
		expect(matchPandadocWebhook(rawRequest([]) as never)).toBe(false);
		expect(matchPandadocWebhook(rawRequest('plain') as never)).toBe(false);
	});

	it('does not match an array whose items lack an event string', () => {
		expect(matchPandadocWebhook(rawRequest([{ data: {} }]) as never)).toBe(
			false,
		);
	});
});

describe('PandadocWebhookPayloadSchema', () => {
	it('parses a delivery of several events', () => {
		const parsed = PandadocWebhookPayloadSchema.parse(webhookDelivery);
		expect(parsed).toHaveLength(2);
		expect(parsed[0]?.event).toBe('document_state_changed');
	});

	it('rejects an empty delivery and items without events', () => {
		expect(() => PandadocWebhookPayloadSchema.parse([])).toThrow();
		expect(() => PandadocWebhookPayloadSchema.parse([{ data: {} }])).toThrow();
	});
});

describe('pandadoc.event handler', () => {
	it('returns a 401 refusal for an unverified delivery', async () => {
		const result = await event.handler(
			webhookContext(SHARED_KEY),
			rawRequest(webhookDelivery, 'bad-signature') as never,
		);
		expect(result).toMatchObject({ success: false, statusCode: 401 });
	});

	it('returns a 401 refusal when no shared key is configured', async () => {
		const body = webhookDelivery;
		const result = await event.handler(
			webhookContext(undefined),
			rawRequest(body, sign(JSON.stringify(body), SHARED_KEY)) as never,
		);
		expect(result).toMatchObject({ success: false, statusCode: 401 });
	});

	it('returns a 400 refusal for a body the payload schema rejects', async () => {
		const body = [{ no_event_here: true }];
		const result = await event.handler(
			webhookContext(SHARED_KEY),
			rawRequest(body, sign(JSON.stringify(body), SHARED_KEY)) as never,
		);
		expect(result).toMatchObject({ success: false, statusCode: 400 });
	});

	it('returns the parsed events for a verified delivery', async () => {
		const body = webhookDelivery;
		const result = await event.handler(
			webhookContext(SHARED_KEY),
			rawRequest(body, sign(JSON.stringify(body), SHARED_KEY), {
				[PANDADOC_EVENT_ID_HEADER]: 'event-id-1',
			}) as never,
		);
		expect(result.success).toBe(true);
		// unknown: the handler's data field is the parsed payload array.
		const data = (result as { data?: unknown }).data as Array<{
			event: string;
		}>;
		expect(data.map((item) => item.event)).toEqual([
			'document_state_changed',
			'recipient_completed',
		]);
	});
});
