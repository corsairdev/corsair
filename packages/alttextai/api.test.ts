import 'dotenv/config';
import { makeAltTextAiRequest } from './client';
import { toCsvUploadFile, toImageDbRecord } from './endpoints/shared';
import type {
	BulkCreateResponse,
	CreateImageResponse,
	GetAccountResponse,
	ListImagesResponse,
	PageScrapeResponse,
	SearchImagesResponse,
	UpdateAccountResponse,
} from './endpoints/types';
import { AltTextAiEndpointOutputSchemas } from './endpoints/types';

const TEST_API_KEY = process.env.ALTTEXT_AI_API_KEY;

/** Public sample image for alt text generation tests. */
const SAMPLE_IMAGE_URL =
	'https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png';

const skipWithoutKey = !TEST_API_KEY
	? () => {
			console.warn('Skipping: ALTTEXT_AI_API_KEY not set');
		}
	: null;

describe('alttextai helpers', () => {
	it('toCsvUploadFile adds a .csv filename for bare Blobs', () => {
		const blob = new Blob(['url\nhttps://example.com/a.png\n'], {
			type: 'text/csv',
		});
		const file = toCsvUploadFile(blob);
		expect(file).toBeInstanceOf(File);
		expect(file.name).toBe('bulk.csv');
		expect(file.type).toBe('text/csv');
	});

	it('toCsvUploadFile keeps an existing File name', () => {
		const file = new File(['url\n'], 'urls.csv', { type: 'text/csv' });
		expect(toCsvUploadFile(file).name).toBe('urls.csv');
	});

	it('toImageDbRecord maps snake_case API fields to DB record', () => {
		const record = toImageDbRecord({
			asset_id: 'asset-1',
			url: SAMPLE_IMAGE_URL,
			alt_text: 'dice',
			alt_texts: { en: 'dice' },
			tags: ['game'],
			metadata: { source: 'test' },
			created_at: 1_700_000_000,
			credits_used: 1,
		});
		expect(record).toEqual({
			assetId: 'asset-1',
			url: SAMPLE_IMAGE_URL,
			altText: 'dice',
			altTexts: { en: 'dice' },
			tags: ['game'],
			metadata: { source: 'test' },
			createdAt: new Date(1_700_000_000 * 1000),
			creditsUsed: 1,
		});
	});
});

describe('AltText.ai API Type Tests', () => {
	describe('account', () => {
		it('getAccount returns correct type', async () => {
			if (skipWithoutKey) return skipWithoutKey();

			const response = await makeAltTextAiRequest<GetAccountResponse>(
				'/account',
				{ apiKey: TEST_API_KEY },
			);

			AltTextAiEndpointOutputSchemas.getAccount.parse(response);
			expect(response.usage).toBeDefined();
			expect(response.usage_limit).toBeDefined();
		});

		it('updateAccount returns correct type', async () => {
			if (skipWithoutKey) return skipWithoutKey();

			const current = await makeAltTextAiRequest<GetAccountResponse>(
				'/account',
				{ apiKey: TEST_API_KEY },
			);
			const name = current.name ?? 'My Account';

			const response = await makeAltTextAiRequest<UpdateAccountResponse>(
				'/account',
				{
					apiKey: TEST_API_KEY,
					method: 'PUT',
					body: { account: { name } },
				},
			);

			AltTextAiEndpointOutputSchemas.updateAccount.parse(response);
			expect(response.name).toBe(name);
		});
	});

	describe('images', () => {
		let assetId = '';

		it('list returns correct type', async () => {
			if (skipWithoutKey) return skipWithoutKey();

			const response = await makeAltTextAiRequest<ListImagesResponse>(
				'/images',
				{
					apiKey: TEST_API_KEY,
					query: { limit: 1 },
				},
			);

			AltTextAiEndpointOutputSchemas.list.parse(response);
			expect(Array.isArray(response.images)).toBe(true);
		});

		it('create generates alt text from image URL', async () => {
			if (skipWithoutKey) return skipWithoutKey();

			const response = await makeAltTextAiRequest<CreateImageResponse>(
				'/images',
				{
					apiKey: TEST_API_KEY,
					method: 'POST',
					body: {
						image: {
							url: SAMPLE_IMAGE_URL,
							asset_id: `corsair-test-${Date.now()}`,
						},
					},
				},
			);

			AltTextAiEndpointOutputSchemas.create.parse(response);
			expect(response.asset_id).toBeTruthy();
			expect(response.alt_text?.length).toBeGreaterThan(0);
			assetId = response.asset_id!;
		});

		it('get returns correct type', async () => {
			if (skipWithoutKey) return skipWithoutKey();
			expect(assetId).toBeTruthy();

			const response = await makeAltTextAiRequest<CreateImageResponse>(
				`/images/${encodeURIComponent(assetId)}`,
				{ apiKey: TEST_API_KEY },
			);

			AltTextAiEndpointOutputSchemas.get.parse(response);
			expect(response.asset_id).toBe(assetId);
		});

		it('update returns correct type', async () => {
			if (skipWithoutKey) return skipWithoutKey();
			expect(assetId).toBeTruthy();

			const response = await makeAltTextAiRequest<CreateImageResponse>(
				`/images/${encodeURIComponent(assetId)}`,
				{
					apiKey: TEST_API_KEY,
					method: 'PUT',
					query: { overwrite: true },
					body: {
						image: {
							alt_text: 'Updated alt text from corsair live test',
							metadata: { source: 'alttextai-api.test' },
						},
					},
				},
			);

			AltTextAiEndpointOutputSchemas.update.parse(response);
			expect(response.alt_text).toBe('Updated alt text from corsair live test');
		});

		it('search returns correct type', async () => {
			if (skipWithoutKey) return skipWithoutKey();

			const response = await makeAltTextAiRequest<SearchImagesResponse>(
				'/images/search',
				{
					apiKey: TEST_API_KEY,
					query: { q: 'alt', limit: 5 },
				},
			);

			AltTextAiEndpointOutputSchemas.search.parse(response);
			expect(Array.isArray(response.images)).toBe(true);
		});

		it('bulkCreate accepts a Blob via File coercion', async () => {
			if (skipWithoutKey) return skipWithoutKey();

			const csv = new Blob([`url\n${SAMPLE_IMAGE_URL}\n`], {
				type: 'text/csv',
			});
			const response = await makeAltTextAiRequest<BulkCreateResponse>(
				'/images/bulk_create',
				{
					apiKey: TEST_API_KEY,
					method: 'POST',
					formData: {
						file: toCsvUploadFile(csv),
					},
				},
			);

			AltTextAiEndpointOutputSchemas.bulkCreate.parse(response);
			expect(response.success).toBe(true);
			expect(response.rows).toBeGreaterThan(0);
		});

		it('pageScrape returns correct type', async () => {
			if (skipWithoutKey) return skipWithoutKey();

			const response = await makeAltTextAiRequest<PageScrapeResponse>(
				'/images/page_scrape',
				{
					apiKey: TEST_API_KEY,
					method: 'POST',
					body: {
						page_scrape: {
							html: '<html><body><img src="https://example.com/logo.png" alt="" /></body></html>',
						},
					},
				},
			);

			AltTextAiEndpointOutputSchemas.pageScrape.parse(response);
			expect(response.scraped_images).toBeDefined();
			expect(response.total_processed).toBeGreaterThan(0);
		});

		it('delete removes the image', async () => {
			if (skipWithoutKey) return skipWithoutKey();
			expect(assetId).toBeTruthy();

			const response = await makeAltTextAiRequest<CreateImageResponse>(
				`/images/${encodeURIComponent(assetId)}`,
				{
					apiKey: TEST_API_KEY,
					method: 'DELETE',
				},
			);

			AltTextAiEndpointOutputSchemas.delete.parse(response);
			expect(response.asset_id).toBe(assetId);

			await expect(
				makeAltTextAiRequest(`/images/${encodeURIComponent(assetId)}`, {
					apiKey: TEST_API_KEY,
				}),
			).rejects.toMatchObject({ status: 404 });
		});
	});
});
