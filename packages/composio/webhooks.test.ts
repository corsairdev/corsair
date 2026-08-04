import { createHmac } from 'node:crypto';
import {
	createComposioMatch,
	verifyComposioWebhookSignature,
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

	it('accepts a valid Standard Webhooks signature', () => {
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

	it('rejects a bad signature', () => {
		const result = verifyComposioWebhookSignature(
			{
				rawBody: body,
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
	});

	it('matches composio.trigger.message bodies', () => {
		const match = createComposioMatch('composio.trigger.message');
		expect(
			match({
				body,
				headers: { 'webhook-signature': 'v1,x' },
			} as never),
		).toBe(true);
		expect(
			match({
				body: JSON.stringify({ type: 'other' }),
				headers: { 'webhook-signature': 'v1,x' },
			} as never),
		).toBe(false);
	});
});
