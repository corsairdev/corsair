import type { WebhookRequest } from 'corsair/core';
import * as crypto from 'crypto';
import { verifyTrelloWebhookSignature } from './types';

const secret = 'my-trello-secret';
const rawBody = '{"action":{"type":"commentCard"}}';
const callbackURL = 'https://example.com/trello/webhook';

const payload = {
	webhook: {
		callbackURL,
	},
};

function requestWith(
	headers: Record<string, string | string[] | undefined>,
): WebhookRequest<unknown> {
	return {
		payload,
		headers,
		rawBody,
	};
}

function signatureFor(secretValue: string): string {
	return crypto
		.createHmac('sha1', secretValue)
		.update(rawBody + callbackURL)
		.digest('base64');
}

describe('verifyTrelloWebhookSignature', () => {
	it('returns an error when the secret is missing', () => {
		const result = verifyTrelloWebhookSignature(
			requestWith({
				'x-trello-webhook': signatureFor(secret),
			}),
			'',
		);

		expect(result).toEqual({
			valid: false,
			error: 'Missing webhook secret',
		});
	});

	it('returns an error when the signature header is missing', () => {
		const result = verifyTrelloWebhookSignature(requestWith({}), secret);

		expect(result).toEqual({
			valid: false,
			error: 'Missing x-trello-webhook header',
		});
	});

	it('returns invalid for a wrong signature', () => {
		const result = verifyTrelloWebhookSignature(
			requestWith({
				'x-trello-webhook': 'wrong-signature',
			}),
			secret,
		);

		expect(result).toEqual({
			valid: false,
			error: 'Invalid signature',
		});
	});

	it('returns valid for the correct HMAC-SHA1 signature', () => {
		const result = verifyTrelloWebhookSignature(
			requestWith({
				'x-trello-webhook': signatureFor(secret),
			}),
			secret,
		);

		expect(result).toEqual({ valid: true });
	});
});
