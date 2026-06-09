import crypto from 'node:crypto';
import { zohomail } from './index';
import {
	createZohoMailMatch,
	resolveZohoId,
	verifyZohoWebhookSignature,
} from './webhooks/types';

const SECRET = 'test-hook-secret';

function sign(body: string, secret = SECRET): string {
	return crypto.createHmac('sha256', secret).update(body).digest('base64');
}

describe('zoho webhook signature verification', () => {
	it('accepts a correctly signed body', () => {
		const body = JSON.stringify({ messageId: '123', subject: 'hi' });
		expect(verifyZohoWebhookSignature(body, SECRET, sign(body))).toBe(true);
	});

	it('rejects a tampered body', () => {
		const body = JSON.stringify({ messageId: '123' });
		const sig = sign(body);
		const tampered = JSON.stringify({ messageId: '999' });
		expect(verifyZohoWebhookSignature(tampered, SECRET, sig)).toBe(false);
	});

	it('rejects a wrong secret', () => {
		const body = JSON.stringify({ messageId: '123' });
		expect(verifyZohoWebhookSignature(body, 'wrong', sign(body))).toBe(false);
	});

	it('rejects when secret or signature missing', () => {
		const body = JSON.stringify({ messageId: '123' });
		expect(verifyZohoWebhookSignature(body, '', sign(body))).toBe(false);
		expect(verifyZohoWebhookSignature(body, SECRET, '')).toBe(false);
	});
});

describe('zoho webhook matcher', () => {
	const match = createZohoMailMatch();

	it('matches a signed Zoho delivery (signature header + email body)', () => {
		expect(
			match({
				headers: { 'x-hook-signature': 'abc' },
				body: { messageId: '123', subject: 'hi' },
			} as never),
		).toBe(true);
	});

	it('ignores the handshake request (x-hook-secret without signature)', () => {
		expect(
			match({
				headers: { 'x-hook-secret': 'sek' },
				body: { summary: 'new mail' },
			} as never),
		).toBe(false);
	});

	it('ignores requests without Zoho hook headers', () => {
		expect(
			match({
				headers: { 'content-type': 'application/json' },
				body: { messageId: '123' },
			} as never),
		).toBe(false);
	});

	it('ignores Zoho signature without an email body', () => {
		expect(
			match({
				headers: { 'x-hook-signature': 'abc' },
				body: { foo: 'bar' },
			} as never),
		).toBe(false);
	});
});

describe('resolveZohoId', () => {
	it('preserves large numeric IDs from raw JSON', () => {
		const rawBody =
			'{"messageId":1560840837125110000,"folderId":3881227000000013000}';
		expect(resolveZohoId(rawBody, 'messageId', undefined)).toBe(
			'1560840837125110000',
		);
		expect(resolveZohoId(rawBody, 'folderId', undefined)).toBe(
			'3881227000000013000',
		);
	});

	it('falls back to the parsed value when raw body is unavailable', () => {
		expect(resolveZohoId(undefined, 'messageId', '12345')).toBe('12345');
		expect(resolveZohoId(undefined, 'messageId', 67890)).toBe('67890');
	});
});

describe('zohomail plugin webhook wiring', () => {
	it('registers handshake and messageReceived webhooks and matcher', () => {
		const plugin = zohomail({ webhookSecret: SECRET });
		expect(plugin.webhooks?.challenge.handshake).toBeDefined();
		expect(plugin.webhooks?.messages.received).toBeDefined();

		const matched = plugin.pluginWebhookMatcher?.({
			headers: { 'x-hook-signature': 'abc' },
			body: { messageId: '1' },
		} as never);
		expect(matched).toBe(true);
	});
});
