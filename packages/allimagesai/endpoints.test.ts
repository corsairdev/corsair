import {
	ApiKeys,
	Credits,
	ImageGenerations,
	Images,
	Webhooks,
} from './endpoints';
import { createContext, installFetchHarness } from './test-harness';

/**
 * One block per operation, asserting the method, path and payload the live API
 * requires, plus the entity writes each one performs. Fixtures are shaped from
 * responses observed against a real account.
 * https://api.all-images.ai/doc-json
 */
describe('All Images AI endpoints', () => {
	let harness: ReturnType<typeof installFetchHarness>;
	let warn: jest.SpyInstance;

	beforeEach(() => {
		harness = installFetchHarness();
		// logEventFromContext has no database in these doubles and warns on the
		// way past; keep the reporter readable.
		warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		harness.restore();
		warn.mockRestore();
	});

	describe('apiKeys.check', () => {
		it('GETs /v1/api-keys/check', async () => {
			harness.queue({ body: { email: 'user@example.com' } });
			const { ctx } = createContext();

			const result = await ApiKeys.check(ctx, {});

			expect(harness.requestAt(0).method).toBe('GET');
			expect(harness.requestAt(0).url).toBe(
				'https://api.all-images.ai/v1/api-keys/check',
			);
			expect(result.email).toBe('user@example.com');
		});

		// The live account returns email only; name is optional in the spec.
		it('accepts a response with no name', async () => {
			harness.queue({ body: { email: 'user@example.com' } });
			const { ctx } = createContext();

			await expect(ApiKeys.check(ctx, {})).resolves.toEqual({
				email: 'user@example.com',
			});
		});
	});

	describe('credits.get', () => {
		// Singular /credit, not /credits — the plural path does not exist.
		it('GETs /v1/credit', async () => {
			harness.queue({
				body: {
					credits: [
						{ type: 'global', credit: 100, creditTotal: 500, unlimited: false },
					],
				},
			});
			const { ctx } = createContext();

			const result = await Credits.get(ctx, {});

			expect(harness.requestAt(0).url).toBe(
				'https://api.all-images.ai/v1/credit',
			);
			expect(result.credits[0]?.credit).toBe(100);
		});

		it('accepts the empty credits array an unprovisioned account returns', async () => {
			harness.queue({ body: { credits: [] } });
			const { ctx } = createContext();

			await expect(Credits.get(ctx, {})).resolves.toEqual({ credits: [] });
		});
	});

	describe('webhooks.create', () => {
		it('POSTs to the subscribe path and caches the subscription', async () => {
			harness.queue({ status: 201, body: { webhookId: 'wh-1' } });
			const { ctx, upserts } = createContext();

			await Webhooks.create(ctx, {
				url: 'https://example.com/hook',
				events: ['print.completed'],
			});

			const request = harness.requestAt(0);
			expect(request.method).toBe('POST');
			expect(request.url).toBe(
				'https://api.all-images.ai/v1/api-keys/webhook/subscribe',
			);
			expect(request.body).toEqual({
				url: 'https://example.com/hook',
				events: ['print.completed'],
			});

			expect(upserts.webhooks?.[0]?.entityId).toBe('wh-1');
			expect(upserts.webhooks?.[0]?.data.events).toEqual(['print.completed']);
		});

		it('omits events so the provider applies its own default', async () => {
			harness.queue({ status: 201, body: { webhookId: 'wh-2' } });
			const { ctx, upserts } = createContext();

			await Webhooks.create(ctx, { url: 'https://example.com/hook' });

			expect(harness.requestAt(0).body).toEqual({
				url: 'https://example.com/hook',
			});
			// The documented default is recorded locally so it stays observable.
			expect(upserts.webhooks?.[0]?.data.events).toEqual([
				'print.failed',
				'print.completed',
			]);
		});

		it('rejects a malformed URL without calling the API', async () => {
			const { ctx } = createContext();

			await expect(
				Webhooks.create(ctx, { url: 'not-a-url' }),
			).rejects.toThrow();
			expect(harness.requests).toHaveLength(0);
		});

		it('rejects an event outside the documented enum', async () => {
			const { ctx } = createContext();

			await expect(
				Webhooks.create(ctx, {
					url: 'https://example.com/hook',
					events: ['print.exploded' as unknown as 'print.failed'],
				}),
			).rejects.toThrow();
			expect(harness.requests).toHaveLength(0);
		});
	});

	describe('webhooks.get', () => {
		it('GETs the webhook and never persists the echoed apiKeyId', async () => {
			harness.queue({
				body: {
					id: 'wh-1',
					apiKeyId: 'super-secret-key',
					url: 'https://example.com/hook',
				},
			});
			const { ctx, upserts } = createContext();

			const result = await Webhooks.get(ctx, { apiKeyWebhookId: 'wh-1' });

			expect(harness.requestAt(0).url).toBe(
				'https://api.all-images.ai/v1/api-keys/webhook/wh-1',
			);
			expect(result.apiKeyId).toBe('[REDACTED]');
			const stored = upserts.webhooks?.[0];
			expect(stored?.data.apiKeyId).toBeUndefined();
			expect(JSON.stringify(stored?.data)).not.toContain('super-secret-key');
		});

		// upsertByEntityId replaces the data blob wholesale and this response
		// carries no events, so a blind write would erase them.
		it('preserves the cached event list rather than erasing it', async () => {
			harness.queue({
				body: { id: 'wh-1', apiKeyId: 'k', url: 'https://example.com/hook' },
			});
			const { ctx, upserts } = createContext({
				seed: {
					webhooks: {
						'wh-1': {
							id: 'wh-1',
							url: 'https://example.com/hook',
							events: ['print.completed'],
						},
					},
				},
			});

			await Webhooks.get(ctx, { apiKeyWebhookId: 'wh-1' });

			expect(upserts.webhooks?.[0]?.data.events).toEqual(['print.completed']);
		});

		it('percent-encodes the webhook id into the path', async () => {
			harness.queue({ body: { id: 'a b' } });
			const { ctx } = createContext();

			await Webhooks.get(ctx, { apiKeyWebhookId: 'a b' });

			expect(harness.requestAt(0).url).toContain('/webhook/a%20b');
		});

		it('rejects a blank webhook id without calling the API', async () => {
			const { ctx } = createContext();

			await expect(
				Webhooks.get(ctx, { apiKeyWebhookId: '  ' }),
			).rejects.toThrow();
			expect(harness.requests).toHaveLength(0);
		});
	});

	describe('imageGenerations.list', () => {
		const printsBody = {
			filteredResults: 2,
			prints: [
				{
					id: 'p-1',
					name: 'Campaign hero',
					prompt: 'a red bicycle',
					status: 3,
					params: [
						{ name: 'format', value: 'landscape' },
						{ name: 'chaos', value: '20' },
					],
					processMode: 'fast',
					images: [{ id: 'i-1', url: 'https://cdn.example/i-1.jpg' }],
					nbImages: 1,
					tags: ['campaign'],
					createdAt: '2026-02-01T10:00:00.000Z',
				},
			],
		};

		it('GETs /v1/image-generations with the documented filters', async () => {
			harness.queue({ body: printsBody });
			const { ctx } = createContext();

			await ImageGenerations.list(ctx, {
				limit: 10,
				offset: 20,
				sort: 'createdAt',
				name: 'hero',
				tag: 'campaign',
			});

			const { url, method } = harness.requestAt(0);
			expect(method).toBe('GET');
			expect(url).toContain('/v1/image-generations');
			expect(url).toContain('limit=10');
			expect(url).toContain('offset=20');
			expect(url).toContain('tag=campaign');
		});

		it('flattens params to a map and image urls to a list', async () => {
			harness.queue({ body: printsBody });
			const { ctx, upserts } = createContext();

			await ImageGenerations.list(ctx, {});

			const stored = upserts.imageGenerations?.[0];
			expect(stored?.entityId).toBe('p-1');
			expect(stored?.data.params).toEqual({
				format: 'landscape',
				chaos: '20',
			});
			expect(stored?.data.image_urls).toEqual(['https://cdn.example/i-1.jpg']);
			expect(stored?.data.created_at).toEqual(
				new Date('2026-02-01T10:00:00.000Z'),
			);
		});

		// The spec types filteredResults as an object; the live API sends a number.
		it('accepts a numeric filteredResults', async () => {
			harness.queue({ body: { filteredResults: 0, prints: [] } });
			const { ctx } = createContext();

			await expect(ImageGenerations.list(ctx, {})).resolves.toEqual({
				filteredResults: 0,
				prints: [],
			});
		});

		it('skips prints with no id rather than inventing one', async () => {
			harness.queue({
				body: {
					prints: [{ name: 'x', prompt: 'y', status: 1, params: [] }],
				},
			});
			const { ctx, upserts } = createContext();

			await ImageGenerations.list(ctx, {});

			expect(upserts.imageGenerations).toHaveLength(0);
		});

		it('rejects a non-positive limit', async () => {
			const { ctx } = createContext();

			await expect(ImageGenerations.list(ctx, { limit: 0 })).rejects.toThrow();
			expect(harness.requests).toHaveLength(0);
		});

		it('still returns the response when the entity store fails', async () => {
			harness.queue({ body: printsBody });
			const { ctx } = createContext({ failingEntities: ['imageGenerations'] });

			await expect(ImageGenerations.list(ctx, {})).resolves.toBeDefined();
			expect(warn).toHaveBeenCalled();
		});
	});

	describe('imageGenerations.delete', () => {
		it('DELETEs with printIds in the body and evicts the cached rows', async () => {
			harness.queue({ empty: true });
			const { ctx, deletes } = createContext();

			const result = await ImageGenerations.delete(ctx, {
				printIds: ['p-1', 'p-2'],
			});

			const request = harness.requestAt(0);
			expect(request.method).toBe('DELETE');
			expect(request.url).toBe(
				'https://api.all-images.ai/v1/image-generations',
			);
			expect(request.body).toEqual({ printIds: ['p-1', 'p-2'] });
			expect(deletes.imageGenerations).toEqual(['p-1', 'p-2']);
			// The provider sends no body, so the endpoint reports the request.
			expect(result).toEqual({ deleted: true, printIds: ['p-1', 'p-2'] });
		});

		// The provider answers 200 for an empty array, so an empty request would
		// look like a successful deletion. Reject it before it is sent.
		it('rejects an empty printIds array', async () => {
			const { ctx } = createContext();

			await expect(
				ImageGenerations.delete(ctx, { printIds: [] }),
			).rejects.toThrow();
			expect(harness.requests).toHaveLength(0);
		});

		it('rejects a blank print id', async () => {
			const { ctx } = createContext();

			await expect(
				ImageGenerations.delete(ctx, { printIds: ['  '] }),
			).rejects.toThrow();
			expect(harness.requests).toHaveLength(0);
		});
	});

	describe('images.listDownloaded', () => {
		const downloadedBody = {
			filteredResults: 1,
			images: [
				{
					id: 'img-1',
					url: 'https://cdn.example/preview.jpg',
					urlFull: 'https://cdn.example/full.jpg',
					urlUpscaleUHD: 'https://cdn.example/uhd.jpg',
					downloadedAt: '2026-02-01T09:00:00.000Z',
				},
			],
		};

		// The provider's path is misspelled; the corrected spelling 404s.
		it('POSTs to the provider-spelled /v1/images/downladed path', async () => {
			harness.queue({ body: downloadedBody });
			const { ctx } = createContext();

			await Images.listDownloaded(ctx, {});

			const request = harness.requestAt(0);
			expect(request.method).toBe('POST');
			expect(request.url).toBe('https://api.all-images.ai/v1/images/downladed');
			expect(request.url).not.toContain('downloaded');
		});

		// Pagination travels in the body on this endpoint, not the query string.
		it('sends pagination and date filters in the request body', async () => {
			harness.queue({ body: downloadedBody });
			const { ctx } = createContext();

			await Images.listDownloaded(ctx, {
				limit: 5,
				offset: 10,
				afterCreatedAt: new Date('2026-01-01T00:00:00.000Z'),
			});

			const request = harness.requestAt(0);
			expect(request.body).toEqual({
				limit: 5,
				offset: 10,
				afterCreatedAt: '2026-01-01T00:00:00.000Z',
			});
			expect(request.url).not.toContain('limit=');
		});

		it('caches each downloaded image with its resolution links', async () => {
			harness.queue({ body: downloadedBody });
			const { ctx, upserts } = createContext();

			await Images.listDownloaded(ctx, {});

			const stored = upserts.downloadedImages?.[0];
			expect(stored?.entityId).toBe('img-1');
			expect(stored?.data.url_full).toBe('https://cdn.example/full.jpg');
			expect(stored?.data.url_upscale).toBeNull();
			expect(stored?.data.downloaded_at).toEqual(
				new Date('2026-02-01T09:00:00.000Z'),
			);
		});

		it('rejects a date range that ends before it starts', async () => {
			const { ctx } = createContext();

			await expect(
				Images.listDownloaded(ctx, {
					afterCreatedAt: '2026-02-01T00:00:00.000Z',
					beforeCreatedAt: '2026-01-01T00:00:00.000Z',
				}),
			).rejects.toThrow();
			expect(harness.requests).toHaveLength(0);
		});
	});
});
