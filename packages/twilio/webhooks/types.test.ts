import crypto from 'crypto';
import { verifyTwilioWebhookSignature } from './types';

describe('verifyTwilioWebhookSignature', () => {
	const url = 'https://example.com/api/twilio/webhook';
	const authToken = 'auth_token_secret_123';
	const params = {
		AccountSid: 'AC123456789',
		From: '+15005550006',
		Body: 'Test Message',
	};

	function generateSignature(
		endpointUrl: string,
		payloadParams: Record<string, string>,
		token: string,
	): string {
		const sortedKeys = Object.keys(payloadParams).sort();
		let data = endpointUrl;
		for (const key of sortedKeys) {
			data += key + payloadParams[key];
		}
		return crypto.createHmac('sha1', token).update(data).digest('base64');
	}

	it('should return error when X-Twilio-Signature header is missing', () => {
		const result = verifyTwilioWebhookSignature(url, params, '', authToken);

		expect(result).toEqual({
			valid: false,
			error: 'Missing X-Twilio-Signature header',
		});
	});

	it('should return error when auth token is missing but signature header is provided', () => {
		// Must supply signature so header check passes and reaches the auth token check
		const signature = generateSignature(url, params, authToken);

		const result = verifyTwilioWebhookSignature(url, params, signature, '');

		expect(result).toEqual({
			valid: false,
			error: 'Missing auth token for verification',
		});
	});

	it('should return failure when signature is incorrect', () => {
		const invalidSignature = 'invalidBase64Signature=';

		const result = verifyTwilioWebhookSignature(
			url,
			params,
			invalidSignature,
			authToken,
		);

		expect(result).toEqual({
			valid: false,
			error: 'Signature verification failed',
		});
	});

	it('should return valid when signature matches HMAC-SHA1 over url and sorted params', () => {
		const validSignature = generateSignature(url, params, authToken);

		const result = verifyTwilioWebhookSignature(
			url,
			params,
			validSignature,
			authToken,
		);

		expect(result).toEqual({ valid: true });
	});
});
