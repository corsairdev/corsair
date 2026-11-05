import * as crypto from 'crypto';

import {
	verifyHmacSha256Signature,
	verifyHmacSignature,
	verifyHmacSignatureWithPrefix,
	verifySlackSignature,
} from '../async-core/webhook-utils';

function hmacHex(
	algorithm: 'sha256' | 'sha1',
	secret: string,
	payload: string,
): string {
	return crypto.createHmac(algorithm, secret).update(payload).digest('hex');
}

/** Flip the first hex digit to get an equal-length but non-matching signature. */
function corruptEqualLength(hex: string): string {
	return (hex[0] === '0' ? '1' : '0') + hex.slice(1);
}

function sign(payload: string, secret: string, timestamp: string): string {
	const signatureBase = `v0:${timestamp}:${payload}`;
	return `v0=${crypto
		.createHmac('sha256', secret)
		.update(signatureBase)
		.digest('hex')}`;
}

describe('verifyHmacSha256Signature', () => {
	const payload = '{"event":"test"}';
	const timestamp = Math.floor(Date.now() / 1000).toString();

	it('rejects a signature when the secret is empty', () => {
		const signature = sign(payload, '', timestamp);

		expect(verifyHmacSha256Signature(payload, '', timestamp, signature)).toBe(
			false,
		);
	});

	it('accepts a signature generated with the configured secret', () => {
		const secret = 'signing-secret';
		const signature = sign(payload, secret, timestamp);

		expect(
			verifyHmacSha256Signature(payload, secret, timestamp, signature),
		).toBe(true);
	});

	it('makes the Slack signature alias fail closed on an empty secret', () => {
		const signature = sign(payload, '', timestamp);

		expect(verifySlackSignature(payload, '', timestamp, signature)).toBe(false);
	});
});

describe('verifyHmacSignature', () => {
	const payload = '{"event":"test"}';
	const secret = 'signing-secret';

	it('fails closed when the secret is empty', () => {
		expect(
			verifyHmacSignature(payload, '', hmacHex('sha256', secret, payload)),
		).toBe(false);
	});

	it('fails closed when the signature is empty', () => {
		expect(verifyHmacSignature(payload, secret, '')).toBe(false);
	});

	it('accepts a matching sha256 signature', () => {
		expect(
			verifyHmacSignature(payload, secret, hmacHex('sha256', secret, payload)),
		).toBe(true);
	});

	it('rejects an equal-length but non-matching signature', () => {
		const wrong = corruptEqualLength(hmacHex('sha256', secret, payload));
		expect(verifyHmacSignature(payload, secret, wrong)).toBe(false);
	});

	it('rejects a length-mismatched signature (timingSafeEqual throws → caught)', () => {
		expect(verifyHmacSignature(payload, secret, 'deadbeef')).toBe(false);
	});

	it('supports the sha1 algorithm', () => {
		expect(
			verifyHmacSignature(
				payload,
				secret,
				hmacHex('sha1', secret, payload),
				'sha1',
			),
		).toBe(true);
	});

	it('rejects a sha256 signature when the algorithm is sha1', () => {
		expect(
			verifyHmacSignature(
				payload,
				secret,
				hmacHex('sha256', secret, payload),
				'sha1',
			),
		).toBe(false);
	});
});

describe('verifyHmacSignatureWithPrefix', () => {
	const payload = '{"event":"test"}';
	const secret = 'signing-secret';
	const prefix = 'sha256=';
	const signed = prefix + hmacHex('sha256', secret, payload);

	it('fails closed when the secret is empty', () => {
		expect(verifyHmacSignatureWithPrefix(payload, '', signed, prefix)).toBe(
			false,
		);
	});

	it('fails closed when the signature is empty', () => {
		expect(verifyHmacSignatureWithPrefix(payload, secret, '', prefix)).toBe(
			false,
		);
	});

	it('rejects a signature missing the expected prefix', () => {
		const unprefixed = hmacHex('sha256', secret, payload);
		expect(
			verifyHmacSignatureWithPrefix(payload, secret, unprefixed, prefix),
		).toBe(false);
	});

	it('rejects a signature with the wrong prefix', () => {
		const wrongPrefix = `sha1=${hmacHex('sha256', secret, payload)}`;
		expect(
			verifyHmacSignatureWithPrefix(payload, secret, wrongPrefix, prefix),
		).toBe(false);
	});

	it('accepts a matching prefixed signature', () => {
		expect(verifyHmacSignatureWithPrefix(payload, secret, signed, prefix)).toBe(
			true,
		);
	});

	it('rejects an equal-length but non-matching signature after the prefix', () => {
		const wrong =
			prefix + corruptEqualLength(hmacHex('sha256', secret, payload));
		expect(verifyHmacSignatureWithPrefix(payload, secret, wrong, prefix)).toBe(
			false,
		);
	});

	it('rejects a length-mismatched signature after the prefix (timingSafeEqual throws → caught)', () => {
		expect(
			verifyHmacSignatureWithPrefix(
				payload,
				secret,
				`${prefix}deadbeef`,
				prefix,
			),
		).toBe(false);
	});
});
