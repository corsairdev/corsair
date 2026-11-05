import type { WebhookRequest } from 'corsair/core';
import crypto from 'crypto';

import type { TypeformWebhookPayload } from './types';
import { verifyTypeformWebhookSignature } from './types';

describe('verifyTypeformWebhookSignature', () => {
	const secret = 'my-typeform-signing-secret';
	const payload: TypeformWebhookPayload = {
		event_id: 'EVT_1',
		event_type: 'form_response',
		form_response: {
			form_id: 'frm1',
			token: 'tok1',
			submitted_at: '2026-01-01T00:00:00.000Z',
			landed_at: '2026-01-01T00:00:00.000Z',
		},
	};
	const rawBody = JSON.stringify(payload);

	const sign = (body: string) =>
		crypto.createHmac('sha256', secret).update(body).digest('base64');

	const requestWith = (
		headers: Record<string, string | string[]>,
		body: string = rawBody,
	): WebhookRequest<TypeformWebhookPayload> => ({
		payload,
		headers,
		rawBody: body,
	});

	it('returns invalid when secret is missing', () => {
		const result = verifyTypeformWebhookSignature(
			requestWith({ 'typeform-signature': `sha256=${sign(rawBody)}` }),
			'',
		);
		expect(result).toEqual({
			valid: false,
			error: 'Missing webhook secret',
		});
	});

	it('returns invalid when the signature header is missing', () => {
		const result = verifyTypeformWebhookSignature(requestWith({}), secret);
		expect(result).toEqual({
			valid: false,
			error: 'Missing Typeform-Signature header',
		});
	});

	it('returns invalid for a malformed signature header', () => {
		const result = verifyTypeformWebhookSignature(
			requestWith({ 'typeform-signature': 'deadbeef' }),
			secret,
		);
		expect(result).toEqual({
			valid: false,
			error: 'Invalid signature format',
		});
	});

	it('returns invalid when the signature does not match', () => {
		const result = verifyTypeformWebhookSignature(
			requestWith({ 'typeform-signature': 'sha256=not-a-valid-hmac' }),
			secret,
		);
		expect(result).toEqual({
			valid: false,
			error: 'Invalid signature',
		});
	});

	it('returns valid when the HMAC matches the compact body', () => {
		const result = verifyTypeformWebhookSignature(
			requestWith({ 'typeform-signature': `sha256=${sign(rawBody)}` }),
			secret,
		);
		expect(result).toEqual({ valid: true });
	});

	it('returns valid when the HMAC only matches with a trailing newline', () => {
		const result = verifyTypeformWebhookSignature(
			requestWith({
				'typeform-signature': `sha256=${sign(rawBody + '\n')}`,
			}),
			secret,
		);
		expect(result).toEqual({ valid: true });
	});
});
