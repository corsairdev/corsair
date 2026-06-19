import { createHmac } from 'node:crypto';
import { CORSAIR_INTERNAL } from '../core';
import { processCorsair } from '../tunnel/index';

function createMockCorsair() {
	return {
		[CORSAIR_INTERNAL]: {
			plugins: [],
			kek: 'test-kek-with-at-least-32-characters!!',
		},
	};
}

function signBody(body: string, secret: string): string {
	return createHmac('sha256', secret).update(body).digest('hex');
}

describe('processCorsair', () => {
	it('rejects unsigned tunnel requests by default', async () => {
		const body = JSON.stringify({
			type: 'webhook',
			payload: { headers: {}, body: '{}' },
		});

		const ack = await processCorsair(
			createMockCorsair(),
			{ headers: {}, body },
			{},
		);

		expect(ack.status).toBe('failed');
		expect(ack.error).toBe('Tunnel signing secret is required');
	});

	it('accepts signed tunnel requests when signingSecret is provided', async () => {
		const secret = 'tunnel-signing-secret';
		const body = JSON.stringify({
			type: 'webhook',
			payload: { headers: {}, body: '{}' },
		});
		const signature = signBody(body, secret);

		const ack = await processCorsair(
			createMockCorsair(),
			{
				headers: { 'x-corsair-signature': `sha256=${signature}` },
				body,
			},
			{ signingSecret: secret },
		);

		expect(ack.error).not.toBe('Tunnel signing secret is required');
		expect(ack.error).not.toBe('Invalid tunnel signature');
	});

	it('allows unsigned requests when allowUnsignedTunnel is enabled', async () => {
		const body = JSON.stringify({
			type: 'webhook',
			payload: { headers: {}, body: '{}' },
		});

		const ack = await processCorsair(
			createMockCorsair(),
			{ headers: {}, body },
			{ allowUnsignedTunnel: true },
		);

		expect(ack.error).not.toBe('Tunnel signing secret is required');
	});
});
