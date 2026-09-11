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

	it('rejects when rawBodyPreserved is missing (no provenance)', () => {
		// A valid signature against the true bytes is still rejected because the
		// caller did not prove the bytes are original. Core reconstructs rawBody
		// for object deliveries, so we fail closed instead of hashing unverified bytes.
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
		expect(result.valid).toBe(false);
		expect(result.error).toBe('Signature verification failed');
	});

	it('verifies from raw string body before parse', () => {
		// Distinct webhook-id so the replay cache (shared across the file) does
		// not treat this as a duplicate of the earlier accepted delivery.
		const rawId = 'msg_raw_1';
		const signature = sign(secret, rawId, ts, body);
		const result = verifyComposioWebhookSignatureFromRaw(
			{
				body,
				headers: {
					'webhook-id': rawId,
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

	it('rejects a replayed delivery with the same webhook-id and timestamp', () => {
		const replayId = 'msg_replay_1';
		const replayTs = String(Math.floor(Date.now() / 1000));
		const signature = sign(secret, replayId, replayTs, body);
		const request = {
			rawBody: body,
			rawBodyPreserved: true,
			headers: {
				'webhook-id': replayId,
				'webhook-timestamp': replayTs,
				'webhook-signature': signature,
			},
			payload: JSON.parse(body),
		} as never;

		// First delivery verifies and is recorded.
		expect(verifyComposioWebhookSignature(request, secret).valid).toBe(true);
		// Same id + timestamp re-sent = replay; must be rejected.
		expect(verifyComposioWebhookSignature(request, secret).valid).toBe(false);
	});

	it('accepts the same webhook-id again with a fresh timestamp (not a replay)', () => {
		const freshId = 'msg_fresh_ts';
		const ts1 = String(Math.floor(Date.now() / 1000));
		const ts2 = String(Math.floor(Date.now() / 1000) + 1);

		const first = verifyComposioWebhookSignature(
			{
				rawBody: body,
				rawBodyPreserved: true,
				headers: {
					'webhook-id': freshId,
					'webhook-timestamp': ts1,
					'webhook-signature': sign(secret, freshId, ts1, body),
				},
				payload: JSON.parse(body),
			} as never,
			secret,
		);
		expect(first.valid).toBe(true);

		// A new timestamp is a distinct, legitimate delivery.
		const second = verifyComposioWebhookSignature(
			{
				rawBody: body,
				rawBodyPreserved: true,
				headers: {
					'webhook-id': freshId,
					'webhook-timestamp': ts2,
					'webhook-signature': sign(secret, freshId, ts2, body),
				},
				payload: JSON.parse(body),
			} as never,
			secret,
		);
		expect(second.valid).toBe(true);
	});
});
