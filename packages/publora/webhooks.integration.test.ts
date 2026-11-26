import { createHmac } from 'node:crypto';
import { processWebhook } from 'corsair';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { publora } from './index';
import { PUBLORA_SIGNATURE_HEADER } from './webhooks/types';

const SECRET = 'publora-integration-secret';
const KEK = process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef';

const published = {
	version: '1',
	event: 'post.published',
	timestamp: '2026-11-25T14:30:00.000Z',
	data: {
		postId: '507f1f77bcf86cd799439012',
		postGroupId: '507f1f77bcf86cd799439011',
		platform: 'mastodon',
		platformId: '109876543210',
		postedId: '115123456789012345',
		permalink: null,
		publishedAt: '2026-11-25T14:30:00.000Z',
	},
};

function signedHeaders(body: string, secret = SECRET) {
	return {
		'content-type': 'application/json',
		'x-publora-event': 'post.published',
		[PUBLORA_SIGNATURE_HEADER]: createHmac('sha256', secret)
			.update(body)
			.digest('hex'),
	};
}

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'publora', 'default');
	const corsair = createCorsair({
		plugins: [publora({ key: 'sk_test.publora', webhookSecret: SECRET })],
		database: testDb.db,
		kek: KEK,
	});
	return { corsair, testDb };
}

jest.spyOn(console, 'error').mockImplementation(() => undefined);

/**
 * These run the real `processWebhook`, so plugin matching, routing and the
 * signature check are exercised the way a deployed Corsair app receives a
 * Publora delivery.
 */
describe('Publora post webhooks through processWebhook', () => {
	it('routes a correctly signed delivery to posts.published', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const body = JSON.stringify(published);

			const result = await processWebhook(corsair, signedHeaders(body), body);

			expect(result.plugin).toBe('publora');
			expect(result.action).toBe('posts.published');
			expect(result.response).toEqual(
				expect.objectContaining({ success: true }),
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('reports a delivery signed with the wrong secret as a failure', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const body = JSON.stringify(published);

			const result = await processWebhook(
				corsair,
				signedHeaders(body, 'not-the-secret'),
				body,
			);

			expect(result.plugin).toBe('publora');
			expect(result.response).toEqual(
				expect.objectContaining({ success: false }),
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('leaves an unsigned request to other plugins', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const body = JSON.stringify(published);

			const result = await processWebhook(
				corsair,
				{ 'content-type': 'application/json' },
				body,
			);

			expect(result.plugin).not.toBe('publora');
		} finally {
			testDb.cleanup();
		}
	});
});
