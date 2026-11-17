import { createHmac } from 'node:crypto';
import type { JsonObject } from './json';
import { document, WEBHOOK_ID } from './test-fixtures';
import {
	expectedSignature,
	matchSignwellEvents,
	SIGNWELL_EVENT_TYPES,
	SignwellWebhookPayloadSchema,
	verifySignwellWebhook,
} from './webhooks/events';

const TIME = 1689332249;

/** Builds a delivery the way SignWell would, signed with `webhookId`. */
function delivery(type: string, webhookId = WEBHOOK_ID) {
	return {
		event: {
			hash: createHmac('sha256', webhookId)
				.update(`${type}@${TIME}`)
				.digest('hex'),
			time: TIME,
			type,
			// unknown: the fixture keeps the real shape, which is an object here.
			related_signer: { email: 'jane@example.com', name: 'Jane Doe' },
		},
		data: { object: document },
	};
}

function request(payload: JsonObject, extra: { hubVerified?: boolean } = {}) {
	return { payload, headers: {}, ...extra };
}

describe('expectedSignature', () => {
	it('is HMAC-SHA256 over `type@time` keyed with the webhook id', () => {
		const expected = createHmac('sha256', WEBHOOK_ID)
			.update(`document_signed@${TIME}`)
			.digest('hex');

		expect(expectedSignature(WEBHOOK_ID, 'document_signed', TIME)).toBe(
			expected,
		);
	});

	it('changes when the webhook id changes', () => {
		expect(expectedSignature(WEBHOOK_ID, 'document_signed', TIME)).not.toBe(
			expectedSignature('another-id', 'document_signed', TIME),
		);
	});

	it('changes when the event type changes', () => {
		expect(expectedSignature(WEBHOOK_ID, 'document_signed', TIME)).not.toBe(
			expectedSignature(WEBHOOK_ID, 'document_viewed', TIME),
		);
	});
});

describe('verifySignwellWebhook', () => {
	it('accepts a delivery signed with the configured id', () => {
		expect(
			verifySignwellWebhook(request(delivery('document_signed')), WEBHOOK_ID),
		).toEqual({ valid: true });
	});

	it('rejects a delivery signed with a different id', () => {
		const result = verifySignwellWebhook(
			request(delivery('document_signed', 'other-id')),
			WEBHOOK_ID,
		);

		expect(result.valid).toBe(false);
		expect(result.error).toMatch(/does not match/);
	});

	it('rejects every delivery when no id is configured', () => {
		const result = verifySignwellWebhook(
			request(delivery('document_signed')),
			undefined,
		);

		expect(result.valid).toBe(false);
		expect(result.error).toMatch(/No SignWell webhook id/);
	});

	it('rejects a payload with no hash', () => {
		const payload = delivery('document_signed');
		const result = verifySignwellWebhook(
			request({ event: { type: payload.event.type, time: TIME } }),
			WEBHOOK_ID,
		);

		expect(result.valid).toBe(false);
		expect(result.error).toMatch(/no event hash/);
	});

	it('skips verification when the hub already verified the delivery', () => {
		expect(
			verifySignwellWebhook(
				request(delivery('document_signed', 'other-id'), {
					hubVerified: true,
				}),
				WEBHOOK_ID,
			),
		).toEqual({ valid: true });
	});
});

describe('matchSignwellEvents', () => {
	const match = matchSignwellEvents(['document_signed']);

	it('matches on event.type from a parsed body', () => {
		expect(match({ headers: {}, body: delivery('document_signed') })).toBe(
			true,
		);
	});

	it('matches on event.type from a raw JSON body', () => {
		expect(
			match({ headers: {}, body: JSON.stringify(delivery('document_signed')) }),
		).toBe(true);
	});

	it('does not match a different event type', () => {
		expect(match({ headers: {}, body: delivery('document_completed') })).toBe(
			false,
		);
	});

	it('does not match a body that is not JSON', () => {
		expect(match({ headers: {}, body: '<html>' })).toBe(false);
	});

	it('does not match a body with no event', () => {
		expect(match({ headers: {}, body: { data: {} } })).toBe(false);
	});
});

describe('SignwellWebhookPayloadSchema', () => {
	it('parses a signed delivery and keeps the document', () => {
		const parsed = SignwellWebhookPayloadSchema.parse(
			delivery('document_completed'),
		);

		expect(parsed.event.type).toBe('document_completed');
		expect(parsed.event.time).toBe(TIME);
		expect(parsed.data.object.id).toBe(document.id);
	});

	it('rejects a delivery with no event block', () => {
		expect(
			SignwellWebhookPayloadSchema.safeParse({ data: { object: {} } }).success,
		).toBe(false);
	});

	it('treats related_signer as optional', () => {
		expect(
			SignwellWebhookPayloadSchema.safeParse({
				event: {
					hash: 'x',
					time: TIME,
					type: 'document_sent',
				},
				data: { object: document },
			}).success,
		).toBe(true);
	});
});

describe('SIGNWELL_EVENT_TYPES', () => {
	it('lists every documented event', () => {
		expect([...SIGNWELL_EVENT_TYPES]).toEqual([
			'document_created',
			'document_sent',
			'document_viewed',
			'document_in_progress',
			'document_recipients_updated',
			'document_signed',
			'document_completed',
			'document_expired',
			'document_declined',
			'document_canceled',
		]);
	});
});
