import crypto from 'crypto';
import { verifyVercelWebhookSignature } from './types';

function hmacSha1(secret: string, body: string) {
	return crypto.createHmac('sha1', secret).update(body).digest('hex');
}

describe('verifyVercelWebhookSignature', () => {
	it('returns false when secret is empty', () => {
		const result = verifyVercelWebhookSignature(
			{
				rawBody: '{"a":1}',
				headers: { 'x-vercel-signature': hmacSha1('', '{"a":1}') },
			},
			'',
		);
		expect(result).toBe(false);
	});

	it('returns true for a matching signature with a real secret', () => {
		const body = '{"type":"deployment.created"}';
		const secret = 's3cret';
		const result = verifyVercelWebhookSignature(
			{
				rawBody: body,
				headers: { 'x-vercel-signature': hmacSha1(secret, body) },
			},
			secret,
		);
		expect(result).toBe(true);
	});

	it('returns false for a mismatched signature with a real secret', () => {
		const body = '{"type":"deployment.created"}';
		const secret = 's3cret';
		const result = verifyVercelWebhookSignature(
			{
				rawBody: body,
				headers: { 'x-vercel-signature': hmacSha1(secret, 'tampered') },
			},
			secret,
		);
		expect(result).toBe(false);
	});

	it('returns false when the signature header is missing', () => {
		const result = verifyVercelWebhookSignature(
			{
				rawBody: '{"type":"deployment.created"}',
				headers: {},
			},
			's3cret',
		);
		expect(result).toBe(false);
	});

	it('returns false when the signature header is not a string', () => {
		const result = verifyVercelWebhookSignature(
			{
				rawBody: '{"type":"deployment.created"}',
				headers: { 'x-vercel-signature': ['abc'] },
			},
			's3cret',
		);
		expect(result).toBe(false);
	});

	it('returns false when the signature length differs from the digest', () => {
		const result = verifyVercelWebhookSignature(
			{
				rawBody: '{"type":"deployment.created"}',
				headers: { 'x-vercel-signature': 'deadbeef' },
			},
			's3cret',
		);
		expect(result).toBe(false);
	});

	it('returns false when secret is whitespace only', () => {
		const body = '{"type":"deployment.created"}';
		const secret = '   ';
		const result = verifyVercelWebhookSignature(
			{
				rawBody: body,
				headers: { 'x-vercel-signature': hmacSha1(secret, body) },
			},
			secret,
		);
		expect(result).toBe(false);
	});

	it('returns true for a matching signature when rawBody is a Buffer', () => {
		const body = '{"type":"deployment.created"}';
		const secret = 's3cret';
		const result = verifyVercelWebhookSignature(
			{
				rawBody: Buffer.from(body),
				headers: { 'x-vercel-signature': hmacSha1(secret, body) },
			},
			secret,
		);
		expect(result).toBe(true);
	});
});
