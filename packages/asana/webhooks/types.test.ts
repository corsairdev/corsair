import crypto from 'crypto';
import { verifyAsanaWebhookSignature } from './types';

describe('verifyAsanaWebhookSignature', () => {
	const secret = 'asana-test-secret';
	const payload = {
		events: [
			{
				action: 'changed',
				resource: { gid: '12345', resource_type: 'task' },
			},
		],
	};
	const rawBody = JSON.stringify(payload);

	const sign = (key: string, body: string = rawBody) =>
		crypto.createHmac('sha256', key).update(body).digest('hex');

	it('returns error when secret is an empty string', () => {
		const result = verifyAsanaWebhookSignature(
			{ payload, headers: { 'x-hook-signature': sign(secret) } },
			'',
		);
		expect(result).toEqual({
			valid: false,
			error: 'Missing webhook secret',
		});
	});

	it('returns error when secret is undefined', () => {
		const result = verifyAsanaWebhookSignature(
			{ payload, headers: { 'x-hook-signature': sign(secret) } },
			undefined,
		);
		expect(result).toEqual({
			valid: false,
			error: 'Missing webhook secret',
		});
	});

	it('returns error when secret is whitespace-only', () => {
		const result = verifyAsanaWebhookSignature(
			{ payload, headers: { 'x-hook-signature': sign(secret) } },
			'   ',
		);
		expect(result).toEqual({
			valid: false,
			error: 'Missing webhook secret',
		});
	});

	it('returns error when x-hook-signature header is missing', () => {
		const result = verifyAsanaWebhookSignature(
			{ payload, headers: {} },
			secret,
		);
		expect(result).toEqual({
			valid: false,
			error: 'Missing x-hook-signature header',
		});
	});

	it('returns valid for a correctly signed request', () => {
		const result = verifyAsanaWebhookSignature(
			{ payload, headers: { 'x-hook-signature': sign(secret) } },
			secret,
		);
		expect(result).toEqual({ valid: true });
	});

	it('returns invalid for a signature that does not match', () => {
		const result = verifyAsanaWebhookSignature(
			{ payload, headers: { 'x-hook-signature': sign('wrong-secret') } },
			secret,
		);
		expect(result).toEqual({
			valid: false,
			error: 'Invalid signature',
		});
	});

	it('returns error when signature comparison fails due to length mismatch', () => {
		const result = verifyAsanaWebhookSignature(
			{ payload, headers: { 'x-hook-signature': 'too-short' } },
			secret,
		);
		expect(result).toEqual({
			valid: false,
			error: 'Signature comparison failed',
		});
	});
});
