import { createHmac, randomBytes } from 'node:crypto';
import { createCorsair } from '../core';
import { handleHubDeliveryGet } from '../hub/delivery';
import { resetDeliveryReplayGuardForTests } from '../hub/internal/delivery-replay-guard';
import { setupCorsair } from '../setup';
import { createTestDatabase } from './setup-db';

function signBrowserDeliveryToken(
	payload: Record<string, unknown>,
	signingSecret: string,
): string {
	const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString(
		'base64url',
	);
	const signature = createHmac('sha256', signingSecret)
		.update(payloadBase64)
		.digest('base64url');
	return `${payloadBase64}.${signature}`;
}

describe('hub browser delivery replay guard', () => {
	let env: ReturnType<typeof createTestDatabase>;

	beforeEach(async () => {
		resetDeliveryReplayGuardForTests();
		env = createTestDatabase();
		await setupCorsair(
			createCorsair({
				plugins: [],
				database: env.db,
				kek: 'test-kek-hub-browser-delivery-replay-tests',
				hub: {
					projectApiKey: 'ck_dev_test_key',
					signingSecret: 'signing-secret',
				},
			} as any),
			{ tenantId: 'default' },
		);
	});

	afterEach(() => env.cleanup());

	it('rejects replayed browser delivery tokens', async () => {
		const corsair = createCorsair({
			plugins: [],
			database: env.db,
			kek: 'test-kek-hub-browser-delivery-replay-tests',
			hub: {
				projectApiKey: 'ck_dev_test_key',
				signingSecret: 'signing-secret',
			},
		} as any);

		const now = Math.floor(Date.now() / 1000);
		const token = signBrowserDeliveryToken(
			{
				jti: 'browser-jti-1',
				connectJti: 'connect-jti-1',
				projectId: 'proj_test',
				plugin: 'github',
				tenantId: 'default',
				hubSuccessUrl: 'http://localhost:3000/connect/success',
				deliveryMode: 'connect.status',
				statusPlugins: ['github'],
				iat: now,
				exp: now + 60,
			},
			'signing-secret',
		);

		const url = `http://localhost:3001/api/corsair?d=${encodeURIComponent(token)}`;

		const first = await handleHubDeliveryGet(corsair, url);
		expect(first.type).toBe('redirect');

		const second = await handleHubDeliveryGet(corsair, url);
		expect(second).toEqual({
			type: 'json',
			status: 400,
			body: { error: 'Delivery request already consumed' },
		});
	});

	it('does not treat stray accessToken as managed OAuth delivery', async () => {
		const corsair = createCorsair({
			plugins: [],
			database: env.db,
			kek: 'test-kek-hub-browser-delivery-replay-tests',
			hub: {
				projectApiKey: 'ck_dev_test_key',
				signingSecret: 'signing-secret',
			},
		} as any);

		const now = Math.floor(Date.now() / 1000);
		const token = signBrowserDeliveryToken(
			{
				jti: randomBytes(16).toString('base64url'),
				connectJti: 'connect-jti-2',
				projectId: 'proj_test',
				plugin: 'github',
				tenantId: 'default',
				hubSuccessUrl: 'http://localhost:3000/connect/success',
				accessToken: 'should-not-trigger-managed',
				iat: now,
				exp: now + 60,
			},
			'signing-secret',
		);

		const result = await handleHubDeliveryGet(
			corsair,
			`http://localhost:3001/api/corsair?d=${encodeURIComponent(token)}`,
		);

		expect(result).toEqual({
			type: 'json',
			status: 400,
			body: { error: 'Invalid BYO OAuth delivery token' },
		});
	});
});
