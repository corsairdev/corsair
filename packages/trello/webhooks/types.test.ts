import * as crypto from 'node:crypto';
import type { WebhookRequest } from 'corsair/core';
import { verifyTrelloWebhookSignature } from './types';

describe('verifyTrelloWebhookSignature', () => {
	const secret = 'my-trello-secret';
	const rawBody = '{"action":{"type":"commentCard"}}';
	const callbackURL = 'https://example.com/trello/webhook';
	const payload = {
		webhook: {
			callbackURL,
		},
	};

	const sign = (key: string, content: string = rawBody + callbackURL): string =>
		crypto.createHmac('sha1', key).update(content).digest('base64');

	// WebhookRequest payload is unknown because verification only reads
	// webhook.callbackURL off the untyped Trello body
	const requestWith = (
		headers: Record<string, string | string[] | undefined>,
		overrides: Partial<WebhookRequest<unknown>> = {},
	): WebhookRequest<unknown> => ({
		payload,
		headers,
		rawBody,
		...overrides,
	});

	it('should fail closed when secret is missing', () => {
		const result = verifyTrelloWebhookSignature(
			requestWith({ 'x-trello-webhook': sign(secret) }),
			'',
		);
		expect(result).toEqual({
			valid: false,
			error: 'Missing webhook secret',
		});
	});

	it('should return invalid if the signature header is missing', () => {
		const result = verifyTrelloWebhookSignature(requestWith({}), secret);
		expect(result).toEqual({
			valid: false,
			error: 'Missing x-trello-webhook header',
		});
	});

	it('should return invalid if raw body is missing', () => {
		const result = verifyTrelloWebhookSignature(
			requestWith({ 'x-trello-webhook': sign(secret) }, { rawBody: '' }),
			secret,
		);
		expect(result).toEqual({
			valid: false,
			error: 'Missing raw body for signature verification',
		});
	});

	it('should return invalid if the signature does not match', () => {
		const result = verifyTrelloWebhookSignature(
			requestWith({ 'x-trello-webhook': sign('a-different-secret') }),
			secret,
		);
		expect(result).toEqual({
			valid: false,
			error: 'Invalid signature',
		});
	});

	it('should return invalid if the signature length does not match', () => {
		const result = verifyTrelloWebhookSignature(
			requestWith({ 'x-trello-webhook': 'wrong-signature' }),
			secret,
		);
		expect(result).toEqual({
			valid: false,
			error: 'Invalid signature',
		});
	});

	it('should return valid for a correct HMAC-SHA1 signature over rawBody + callbackURL', () => {
		const result = verifyTrelloWebhookSignature(
			requestWith({ 'x-trello-webhook': sign(secret) }),
			secret,
		);
		expect(result).toEqual({ valid: true });
	});

	it('should use the first value of a repeated signature header', () => {
		const result = verifyTrelloWebhookSignature(
			requestWith({ 'x-trello-webhook': [sign(secret), 'ignored'] }),
			secret,
		);
		expect(result).toEqual({ valid: true });
	});

	it('should sign rawBody alone when callbackURL is missing', () => {
		const result = verifyTrelloWebhookSignature(
			requestWith(
				{ 'x-trello-webhook': sign(secret, rawBody) },
				{ payload: {} },
			),
			secret,
		);
		expect(result).toEqual({ valid: true });
	});

	it('should reject a concatenated signature when callbackURL is missing', () => {
		const result = verifyTrelloWebhookSignature(
			requestWith({ 'x-trello-webhook': sign(secret) }, { payload: {} }),
			secret,
		);
		expect(result).toEqual({
			valid: false,
			error: 'Invalid signature',
		});
	});
});
