import type { WebhookRequest } from 'corsair/core';
import crypto from 'crypto';
import type { IntercomWebhookPayload } from './types';
import { verifyIntercomWebhookSignature } from './types';

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

function sign(key: string, body: string = rawBody): string {
	return `sha1=${crypto.createHmac('sha1', key).update(body).digest('hex')}`;
}

function requestWith(
	headers: Record<string, string | string[] | undefined>,
	body: string = rawBody,
): WebhookRequest<unknown> {
	return {
		payload,
		headers,
		rawBody: body,
	};
}

describe('verifyIntercomWebhookSignature', () => {
	it('returns an error when the secret is an empty string', () => {
		const result = verifyIntercomWebhookSignature(
			requestWith({ 'x-hub-signature': sign(secret) }),
			'',
		);
		expect(result).toEqual({
			valid: false,
			error: 'Missing webhook secret',
		});
	});

	it('returns an error when the secret is missing (undefined)', () => {
		const result = verifyIntercomWebhookSignature(
			requestWith({ 'x-hub-signature': sign(secret) }),
			undefined as unknown as string,
		);
		expect(result).toEqual({
			valid: false,
			error: 'Missing webhook secret',
		});
	});

	it('returns an error when the secret is only whitespace', () => {
		const result = verifyIntercomWebhookSignature(
			requestWith({ 'x-hub-signature': sign(secret) }),
			'   ',
		);
		expect(result).toEqual({
			valid: false,
			error: 'Missing webhook secret',
		});
	});

	it('returns an error when both secret and signature header are missing', () => {
		const result = verifyIntercomWebhookSignature(requestWith({}), '');
		expect(result).toEqual({
			valid: false,
			error: 'Missing webhook secret',
		});
	});

	it('returns an error when the x-hub-signature header is missing', () => {
		const result = verifyIntercomWebhookSignature(requestWith({}), secret);
		expect(result).toEqual({
			valid: false,
			error: 'Missing x-hub-signature header',
		});
	});

	it('returns valid for a correctly signed request', () => {
		const result = verifyIntercomWebhookSignature(
			requestWith({ 'x-hub-signature': sign(secret) }),
			secret,
		);
		expect(result).toEqual({ valid: true, error: undefined });
	});

	it('accepts the signature header when provided as an array', () => {
		const result = verifyIntercomWebhookSignature(
			requestWith({ 'x-hub-signature': [sign(secret)] }),
			secret,
		);
		expect(result).toEqual({ valid: true, error: undefined });
	});

	it('returns invalid for a signature that does not match', () => {
		const result = verifyIntercomWebhookSignature(
			requestWith({ 'x-hub-signature': sign('a-different-secret') }),
			secret,
		);
		expect(result).toEqual({
			valid: false,
			error: 'Invalid signature',
		});
	});

	it('returns invalid when the signature length does not match', () => {
		const result = verifyIntercomWebhookSignature(
			requestWith({ 'x-hub-signature': 'sha1=too-short' }),
			secret,
		);
		expect(result.valid).toBe(false);
	});
});
