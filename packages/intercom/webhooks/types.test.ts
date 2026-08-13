import type { WebhookRequest } from 'corsair/core';
import crypto from 'crypto';

import type { IntercomWebhookPayload } from './types';
import { verifyIntercomWebhookSignature } from './types';

describe('verifyIntercomWebhookSignature', () => {
	const secret = 'my-intercom-client-secret';
	const payload: IntercomWebhookPayload = {
		type: 'notification_event',
		topic: 'ping',
		id: null,
		app_id: 'app123',
		created_at: 1700000000,
		first_sent_at: 1700000000,
		data: {
			type: 'notification_event_data',
			item: { type: 'ping', message: 'hello' },
		},
	};
	const rawBody = JSON.stringify(payload);

	const sign = (body: string) =>
		`sha1=${crypto.createHmac('sha1', secret).update(body).digest('hex')}`;

	const requestWith = (
		headers: Record<string, string | string[]>,
		body: string = rawBody,
	): WebhookRequest<unknown> => ({
		payload,
		headers,
		rawBody: body,
	});

	it('returns invalid when the secret is missing', () => {
		const result = verifyIntercomWebhookSignature(
			requestWith({ 'x-hub-signature': sign(rawBody) }),
			'',
		);
		expect(result).toEqual({
			valid: false,
			error: 'Missing webhook secret',
		});
	});

	it('returns invalid when the x-hub-signature header is missing', () => {
		const result = verifyIntercomWebhookSignature(requestWith({}), secret);
		expect(result).toEqual({
			valid: false,
			error: 'Missing x-hub-signature header',
		});
	});

	it('returns valid for a correctly signed request', () => {
		const result = verifyIntercomWebhookSignature(
			requestWith({ 'x-hub-signature': sign(rawBody) }),
			secret,
		);
		expect(result).toEqual({ valid: true, error: undefined });
	});

	it('returns invalid for a signature that does not match', () => {
		const result = verifyIntercomWebhookSignature(
			requestWith({ 'x-hub-signature': 'sha1=deadbeef' }),
			secret,
		);
		expect(result.valid).toBe(false);
	});
});
