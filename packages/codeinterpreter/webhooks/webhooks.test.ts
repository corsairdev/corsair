import { createHmac } from 'node:crypto';
import type { WebhookRequest } from 'corsair/core';
import type { CodeInterpreterWebhookPayload } from './types';
import {
	createCodeInterpreterMatch,
	verifyCodeInterpreterWebhookSignature,
} from './types';

const SECRET = 'test-webhook-secret';

function signedRequest(
	payload: CodeInterpreterWebhookPayload,
	secret = SECRET,
): WebhookRequest<CodeInterpreterWebhookPayload> {
	const rawBody = JSON.stringify(payload);
	const signature = createHmac('sha256', secret).update(rawBody).digest('hex');
	return {
		headers: { 'x-webhook-signature': signature },
		payload,
		rawBody,
	} as WebhookRequest<CodeInterpreterWebhookPayload>;
}

describe('verifyCodeInterpreterWebhookSignature', () => {
	it('accepts a valid HMAC signature', () => {
		const payload: CodeInterpreterWebhookPayload = {
			type: 'execution.completed',
			created_at: '2026-09-09T12:00:00Z',
			data: { session_id: 'sess-1', exit_code: 0 },
		};

		expect(
			verifyCodeInterpreterWebhookSignature(signedRequest(payload), SECRET),
		).toEqual({
			valid: true,
		});
	});

	it('rejects an invalid signature', () => {
		const payload: CodeInterpreterWebhookPayload = {
			type: 'execution.completed',
			created_at: '2026-09-09T12:00:00Z',
			data: { session_id: 'sess-1', exit_code: 0 },
		};
		const request = signedRequest(payload);
		request.headers = { 'x-webhook-signature': 'deadbeef' };

		expect(verifyCodeInterpreterWebhookSignature(request, SECRET).valid).toBe(
			false,
		);
	});

	it('rejects deliveries with no signature header', () => {
		const payload: CodeInterpreterWebhookPayload = {
			type: 'execution.completed',
			created_at: '2026-09-09T12:00:00Z',
			data: { session_id: 'sess-1', exit_code: 0 },
		};

		const result = verifyCodeInterpreterWebhookSignature(
			{
				headers: {},
				payload,
				rawBody: JSON.stringify(payload),
			} as WebhookRequest<CodeInterpreterWebhookPayload>,
			SECRET,
		);

		expect(result.valid).toBe(false);
		expect(result.error).toContain('signature');
	});

	it('rejects everything when no signing secret is configured', () => {
		const payload: CodeInterpreterWebhookPayload = {
			type: 'execution.completed',
			created_at: '2026-09-09T12:00:00Z',
			data: { session_id: 'sess-1', exit_code: 0 },
		};

		expect(
			verifyCodeInterpreterWebhookSignature(signedRequest(payload), '').valid,
		).toBe(false);
	});
});

describe('createCodeInterpreterMatch', () => {
	it('matches the configured event type', () => {
		const match = createCodeInterpreterMatch('execution.completed');
		expect(
			match({
				headers: {},
				body: {
					type: 'execution.completed',
					created_at: '2026-09-09T12:00:00Z',
					data: {},
				},
			}),
		).toBe(true);
		expect(
			match({
				headers: {},
				body: {
					type: 'execution.failed',
					created_at: '2026-09-09T12:00:00Z',
					data: {},
				},
			}),
		).toBe(false);
	});
});
