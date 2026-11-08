import { createHmac } from 'node:crypto';
import { processWebhook } from 'corsair';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { fluxguard } from './index';
import { changeEvent } from './test-fixtures';
import { FLUXGUARD_SIGNATURE_HEADER } from './webhooks/types';

const SECRET = 'whsec-fluxguard-integration-secret';
const KEK = process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef';

function signedHeaders(
	body: string,
	secret = SECRET,
	timestamp = Math.floor(Date.now() / 1000),
) {
	const signature = createHmac('sha256', secret)
		.update(`${timestamp}.${body}`)
		.digest('hex');
	return { [FLUXGUARD_SIGNATURE_HEADER]: `t=${timestamp},v1=${signature}` };
}

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'fluxguard', 'default');
	const corsair = createCorsair({
		plugins: [fluxguard({ key: 'fg-test-key', webhookSecret: SECRET })],
		database: testDb.db,
		kek: KEK,
	});
	return { corsair, testDb };
}

jest.spyOn(console, 'error').mockImplementation(() => undefined);

/**
 * These run the real `processWebhook`, because the failure path is what the
 * docs example depends on: core answers `{ success: true }` for a returned
 * `success: false` and keeps only a thrown error, so only an end-to-end check
 * proves a forged delivery is reported as failed.
 */
describe('Fluxguard change webhook through processWebhook', () => {
	it('routes a correctly signed delivery to change.detected', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const body = JSON.stringify(changeEvent);

			const result = await processWebhook(corsair, signedHeaders(body), body);

			expect(result.plugin).toBe('fluxguard');
			expect(result.action).toBe('change.detected');
			expect(result.response).toEqual({ success: true });
		} finally {
			testDb.cleanup();
		}
	});

	it('reports a delivery signed with the wrong secret as a failure', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const body = JSON.stringify(changeEvent);

			const result = await processWebhook(
				corsair,
				signedHeaders(body, 'whsec-wrong-secret'),
				body,
			);

			// The plugin still claims the route (the header is present), but the
			// handler throws, so the route can answer non-2xx instead of 200.
			expect(result.response).toMatchObject({
				success: false,
				error: 'Invalid webhook signature',
			});
		} finally {
			testDb.cleanup();
		}
	});

	it('reports a tampered body as a failure', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const signedBody = JSON.stringify(changeEvent);
			const tamperedBody = JSON.stringify({
				...changeEvent,
				url: 'https://attacker.test/',
			});

			const result = await processWebhook(
				corsair,
				signedHeaders(signedBody),
				tamperedBody,
			);

			expect(result.response).toMatchObject({
				success: false,
				error: 'Invalid webhook signature',
			});
		} finally {
			testDb.cleanup();
		}
	});

	it('reports a correctly signed but malformed payload as a failure', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const body = JSON.stringify({ url: 42, capturedAt: 'not-a-date' });

			const result = await processWebhook(corsair, signedHeaders(body), body);

			expect(result.response).toMatchObject({
				success: false,
				error: 'Invalid Fluxguard change payload',
			});
		} finally {
			testDb.cleanup();
		}
	});
});
