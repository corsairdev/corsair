/**
 * Live All-Images.ai API coverage.
 *
 * CI excludes this file by filename (`--testPathIgnorePatterns="api\.test\.ts"`),
 * so it only runs when a real key is supplied:
 *
 *   ALLIMAGESAI_API_KEY=… npx jest api.test.ts
 *
 * Without the key every block is skipped rather than failed, so the suite stays
 * green for contributors with no account. Nothing here is mocked.
 *
 * The webhook block creates a subscription and removes it again in `afterAll`,
 * so a completed run leaves no residue on the account. Deletion of image
 * generations is exercised only against a synthetic id that cannot exist.
 */
import { makeAllimagesaiRequest, REDACTED_API_KEY } from './client';
import { AllimagesaiEndpointOutputSchemas as Schemas } from './endpoints/types';

const API_KEY = process.env.ALLIMAGESAI_API_KEY;
const describeLive = API_KEY ? describe : describe.skip;

describeLive('All Images AI live API', () => {
	const key = API_KEY as string;

	it('api-keys/check returns the owning account', async () => {
		const result = await makeAllimagesaiRequest('api-keys/check', key, {
			schema: Schemas.apiKeysCheck,
		});

		expect(typeof result.email).toBe('string');
		expect(result.email).toContain('@');
	});

	it('credit returns the quota buckets', async () => {
		const result = await makeAllimagesaiRequest('credit', key, {
			schema: Schemas.creditsGet,
		});

		expect(Array.isArray(result.credits)).toBe(true);
	});

	it('image-generations lists prints and paginates', async () => {
		const result = await makeAllimagesaiRequest('image-generations', key, {
			query: { limit: 2, offset: 0 },
			schema: Schemas.imageGenerationsList,
		});

		expect(Array.isArray(result.prints)).toBe(true);
		// The spec types this as an object; the running API sends a number.
		expect(typeof result.filteredResults).toBe('number');
	});

	it('images/downladed lists downloads via the provider-spelled path', async () => {
		const result = await makeAllimagesaiRequest('images/downladed', key, {
			method: 'POST',
			body: { limit: 2, offset: 0 },
			schema: Schemas.imagesListDownloaded,
		});

		expect(Array.isArray(result.images)).toBe(true);
	});

	it('rejects the correctly spelled downloaded path with a 404', async () => {
		await expect(
			makeAllimagesaiRequest('images/downloaded', key, {
				method: 'POST',
				body: { limit: 1 },
			}),
		).rejects.toMatchObject({ status: 404 });
	});

	it('rejects a delete with no printIds', async () => {
		await expect(
			makeAllimagesaiRequest('image-generations', key, {
				method: 'DELETE',
				body: {},
				expectEmptyBody: true,
			}),
		).rejects.toMatchObject({ status: 400 });
	});

	describe('webhook lifecycle', () => {
		let webhookId: string | undefined;

		afterAll(async () => {
			if (!webhookId) return;
			await makeAllimagesaiRequest(
				`api-keys/webhook/unsubscribe/${encodeURIComponent(webhookId)}`,
				key,
				{ method: 'DELETE', expectEmptyBody: true },
			);
		});

		it('subscribes, reads back, and never leaks the API key', async () => {
			const created = await makeAllimagesaiRequest(
				'api-keys/webhook/subscribe',
				key,
				{
					method: 'POST',
					body: {
						url: 'https://example.com/corsair-allimagesai-live-test',
						events: ['print.completed', 'print.failed'],
					},
					schema: Schemas.webhooksCreate,
				},
			);

			expect(typeof created.webhookId).toBe('string');
			webhookId = created.webhookId;

			const fetched = await makeAllimagesaiRequest(
				`api-keys/webhook/${encodeURIComponent(created.webhookId)}`,
				key,
				{ schema: Schemas.webhooksGet },
			);

			expect(fetched.id).toBe(created.webhookId);
			expect(fetched.url).toBe(
				'https://example.com/corsair-allimagesai-live-test',
			);
			// The provider returns the API key itself as apiKeyId. The client must
			// have replaced it before the value reached this assertion.
			expect(fetched.apiKeyId).toBe(REDACTED_API_KEY);
			expect(JSON.stringify(fetched)).not.toContain(key);
		});
	});
});
