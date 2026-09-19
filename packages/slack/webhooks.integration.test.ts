import { processCorsair, processWebhook } from 'corsair';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { slack } from './index';

async function buildCorsair() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'slack');
	const corsair = createCorsair({
		plugins: [slack()], // no signingSecret, no stored webhook signature
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? 'test-kek-0123456789abcdef0123456789abcdef',
	});
	await corsair.slack.keys.issue_new_dek();
	return { corsair, testDb };
}

const challengeBody = JSON.stringify({
	type: 'url_verification',
	token: 'x',
	challenge: 'chal-123',
});

describe('slack webhook — hubVerified skips app-side verification', () => {
	it('without hubVerified: keyBuilder throws → handler reports failure', async () => {
		const { corsair, testDb } = await buildCorsair();
		const result = await processWebhook(
			corsair,
			{ 'content-type': 'application/json' },
			challengeBody,
			{},
			{ plugin: 'slack' },
		);
		expect(result.response?.success).toBe(false);
		expect(String(result.response?.error)).toContain('webhook_signature');
		testDb.cleanup();
	});

	it('with hubVerified: verification is skipped and the challenge echoes', async () => {
		const { corsair, testDb } = await buildCorsair();
		const result = await processWebhook(
			corsair,
			{ 'content-type': 'application/json' },
			challengeBody,
			{},
			{ plugin: 'slack', hubVerified: true },
		);
		expect(result.response?.success).toBe(true);
		expect((result.response as Record<string, unknown>)?.['challenge']).toBe(
			'chal-123',
		);
		testDb.cleanup();
	});
});

describe('slack webhook — unsigned tunnel must not trust hubVerified', () => {
	it('drops caller-supplied hubVerified on an unsigned tunnel delivery', async () => {
		const { corsair, testDb } = await buildCorsair();
		try {
			const envelope = JSON.stringify({
				type: 'webhook',
				payload: {
					plugin: 'slack',
					headers: { 'content-type': 'application/json' },
					body: challengeBody,
					// Attacker-controlled: an unsigned envelope claiming Hub verification.
					hubVerified: true,
				},
			});

			const ack = await processCorsair(
				corsair,
				{ headers: {}, body: envelope },
				{ allowUnsignedTunnel: true },
			);

			// The envelope is unauthenticated, so hubVerified is ignored and provider
			// signature verification still runs — the forged event fails closed.
			expect(ack.status).toBe('failed');
			expect(String(ack.error)).toContain('webhook_signature');
		} finally {
			testDb.cleanup();
		}
	});
});
