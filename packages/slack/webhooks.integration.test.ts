import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { processWebhook } from 'corsair/webhooks';
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
		// ponytail: cast needed — returnToSender fields are merged at runtime but not in WebhookResponse type
		expect((result.response as Record<string, unknown>)?.['challenge']).toBe(
			'chal-123',
		);
		testDb.cleanup();
	});
});
