import 'dotenv/config';
import { makeAltTextAiRequest } from './client';
import {
	AltTextAiEndpointOutputSchemas,
	type CreateImageResponse,
	type GetAccountResponse,
	type ListImagesResponse,
	type PageScrapeResponse,
	type SearchImagesResponse,
} from './endpoints/types';

const TEST_API_KEY = process.env.ALTTEXT_AI_API_KEY;

/** Public sample image for alt text generation tests. */
const SAMPLE_IMAGE_URL =
	'https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png';

describe('AltText.ai API Type Tests', () => {
	describe('account', () => {
		it('getAccount returns correct type', async () => {
			if (!TEST_API_KEY) {
				console.warn('Skipping: ALTTEXT_AI_API_KEY not set');
				return;
			}

			const response = await makeAltTextAiRequest<GetAccountResponse>('/account', {
				apiKey: TEST_API_KEY,
			});

			AltTextAiEndpointOutputSchemas.getAccount.parse(response);
			expect(response.usage).toBeDefined();
		});
	});

	describe('images', () => {
		it('list returns correct type', async () => {
			if (!TEST_API_KEY) return;

			const response = await makeAltTextAiRequest<ListImagesResponse>('/images', {
				apiKey: TEST_API_KEY,
				query: { limit: 1 },
			});

			AltTextAiEndpointOutputSchemas.list.parse(response);
			expect(Array.isArray(response.images)).toBe(true);
		});

		it('create generates alt text from image URL', async () => {
			if (!TEST_API_KEY) return;

			const response = await makeAltTextAiRequest<CreateImageResponse>('/images', {
				apiKey: TEST_API_KEY,
				method: 'POST',
				body: {
					image: { url: SAMPLE_IMAGE_URL },
				},
			});

			AltTextAiEndpointOutputSchemas.create.parse(response);
			expect(response.asset_id).toBeTruthy();
			expect(response.alt_text?.length).toBeGreaterThan(0);
		});

		it('get returns correct type', async () => {
			if (!TEST_API_KEY) return;

			const created = await makeAltTextAiRequest<CreateImageResponse>('/images', {
				apiKey: TEST_API_KEY,
				method: 'POST',
				body: {
					image: { url: SAMPLE_IMAGE_URL },
				},
			});

			const response = await makeAltTextAiRequest<CreateImageResponse>(
				`/images/${encodeURIComponent(created.asset_id!)}`,
				{ apiKey: TEST_API_KEY },
			);

			AltTextAiEndpointOutputSchemas.get.parse(response);
			expect(response.asset_id).toBe(created.asset_id);
		});

		it('search returns correct type', async () => {
			if (!TEST_API_KEY) return;

			const response = await makeAltTextAiRequest<SearchImagesResponse>(
				'/images/search',
				{
					apiKey: TEST_API_KEY,
					query: { q: 'png', limit: 5 },
				},
			);

			AltTextAiEndpointOutputSchemas.search.parse(response);
			expect(Array.isArray(response.images)).toBe(true);
		});

		it('pageScrape returns correct type', async () => {
			if (!TEST_API_KEY) return;

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
		});
	});
});
