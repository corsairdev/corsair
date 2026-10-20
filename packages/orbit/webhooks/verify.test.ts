import { createHmac } from 'node:crypto';
import { verifyOrbitSignature } from './verify';

describe('orbit webhook signatures', () => {
	it('accepts a fresh signature and rejects a stale timestamp', () => {
		const secret = 'whsec_test';
		const rawBody = '{"id":"evt_1","type":"profile.updated"}';
		const timestamp = String(Math.floor(Date.now() / 1000));
		const signature = `sha256=${createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex')}`;
		expect(
			verifyOrbitSignature(
				secret,
				{
					'x-orbit-webhook-timestamp': timestamp,
					'x-orbit-webhook-signature': signature,
				},
				rawBody,
			),
		).toBe(true);
		expect(
			verifyOrbitSignature(
				secret,
				{
					'x-orbit-webhook-timestamp': '1',
					'x-orbit-webhook-signature': signature,
				},
				rawBody,
			),
		).toBe(false);
	});
});
