import { createHmac } from 'node:crypto';
import {
	createComposioMatch,
	verifyComposioWebhookSignature,
	verifyComposioWebhookSignatureFromRaw,
} from './webhooks/types';

function sign(secret: string, id: string, ts: string, body: string) {
	const digest = createHmac('sha256', secret)
		.update(`${id}.${ts}.${body}`)
		.digest('base64');
	return `v1,${digest}`;
}

describe('Composio webhook verification', () => {
	const secret = 'test-webhook-secret';
	const body = JSON.stringify({
		type: 'composio.trigger.message',
		metadata: { trigger_slug: 'GITHUB_COMMIT_EVENT' },
		data: { sha: 'abc' },
	});
	const id = 'msg_123';
	const ts = String(Math.floor(Date.now() / 1000));

	it('accepts a valid Standard Webhooks signature with preserved raw body', () => {
		const signature = sign(secret, id, ts, body);
		const result = verifyComposioWebhookSignature(
			{
				rawBody: body,
				rawBodyPreserved: true,
				headers: {
					'webhook-id': id,
					'webhook-timestamp': ts,
					'webhook-signature': signature,
				},
				payload: JSON.parse(body),
			} as never,
			secret,
		);
		expect(result.valid).toBe(true);
	});

	it('rejects a bad signature with a generic error', () => {
		const result = verifyComposioWebhookSignature(
			{
				rawBody: body,
				rawBodyPreserved: true,
				headers: {
					'webhook-id': id,
					'webhook-timestamp': ts,
					'webhook-signature': 'v1,not-a-real-sig',
				},
				payload: JSON.parse(body),
			} as never,
			secret,
		);
		expect(result.valid).toBe(false);
		expect(result.error).toBe('Signature verification failed');
	});

	it('rejects when rawBodyPreserved is false (reconstructed body)', () => {
		const signature = sign(secret, id, ts, body);
		const result = verifyComposioWebhookSignature(
			{
				rawBody: JSON.stringify(JSON.parse(body)),
				rawBodyPreserved: false,
				headers: {
					'webhook-id': id,
					'webhook-timestamp': ts,
					'webhook-signature': signature,
				},
				payload: JSON.parse(body),
			} as never,
			secret,
		);
		expect(result.valid).toBe(false);
		expect(result.error).toBe('Signature verification failed');
	});

	it('accepts when rawBodyPreserved is absent (older core)', () => {
		const signature = sign(secret, id, ts, body);
		const result = verifyComposioWebhookSignature(
			{
				rawBody: body,
				headers: {
					'webhook-id': id,
					'webhook-timestamp': ts,
					'webhook-signature': signature,
				},
				payload: JSON.parse(body),
			} as never,
			secret,
		);
		expect(result.valid).toBe(true);
	});

	it('verifies from raw string body before parse', () => {
		const signature = sign(secret, id, ts, body);
		const result = verifyComposioWebhookSignatureFromRaw(
			{
				body,
				headers: {
					'webhook-id': id,
					'webhook-timestamp': ts,
					'webhook-signature': signature,
				},
			},
			secret,
		);
		expect(result.valid).toBe(true);
	});

	it('matches composio.trigger.message bodies', () => {
		const match = createComposioMatch('composio.trigger.message');
		expect(
			match({
				body: JSON.parse(body),
				headers: { 'webhook-signature': 'v1,x' },
			} as never),
		).toBe(true);
		expect(
			match({
				body: { type: 'other' },
				headers: { 'webhook-signature': 'v1,x' },
			} as never),
		).toBe(false);
		expect(
			match({
				body: 'not-json{',
				headers: { 'webhook-signature': 'v1,x' },
			} as never),
		).toBe(false);
	});

	it('matches when webhook-signature header is mixed-case', () => {
		const match = createComposioMatch('composio.trigger.message');
		expect(
			match({
				body: JSON.parse(body),
				headers: { 'Webhook-Signature': 'v1,x' },
			} as never),
		).toBe(true);
	});
});
