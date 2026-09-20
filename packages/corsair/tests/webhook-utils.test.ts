import * as crypto from 'crypto';

import {
	verifyHmacSha256Signature,
	verifySlackSignature,
} from '../async-core/webhook-utils';

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
