import { makeScrapegraphAiRequest, ScrapegraphAiAPIError } from './client';
import {
	ScrapegraphAiCredits,
	ScrapegraphAiMarkdownify,
	ScrapegraphAiSearchScraper,
	ScrapegraphAiSmartScraper,
} from './schema';

const LIVE_KEY = process.env.SGAI_API_KEY;
const describeIfKey = LIVE_KEY ? describe : describe.skip;

describeIfKey('ScrapeGraphAI live v1 (authenticated)', () => {
	it('rejects an invalid API key on GET /v1/credits', async () => {
		const err = await makeScrapegraphAiRequest(
			'v1/credits',
			'sgai-invalid-live-check',
		).catch((error: unknown) => error);
		expect(err).toBeInstanceOf(ScrapegraphAiAPIError);
		expect([401, 403]).toContain((err as ScrapegraphAiAPIError).status);
	});

	it('returns CreditsResponse from GET /v1/credits', async () => {
		const raw = await makeScrapegraphAiRequest(
			'v1/credits',
			LIVE_KEY as string,
		);
		const credits = ScrapegraphAiCredits.parse(raw);
		expect(typeof credits.remaining_credits).toBe('number');
		expect(typeof credits.total_credits_used).toBe('number');
	});

	it('accepts the key on GET /v1/validate', async () => {
		const raw = await makeScrapegraphAiRequest(
			'v1/validate',
			LIVE_KEY as string,
		);
		expect(raw).toBeTruthy();
	});

	it('starts mock SmartScraper via POST /v1/smartscraper', async () => {
		const raw = await makeScrapegraphAiRequest(
			'v1/smartscraper',
			LIVE_KEY as string,
			{
				method: 'POST',
				body: {
					user_prompt: 'Extract the page title',
					website_url: 'https://example.com',
					mock: true,
				},
			},
		);
		const job = ScrapegraphAiSmartScraper.parse(raw);
		expect(job.request_id.length).toBeGreaterThan(0);
	});

	it('starts mock SearchScraper via POST /v1/searchscraper', async () => {
		const raw = await makeScrapegraphAiRequest(
			'v1/searchscraper',
			LIVE_KEY as string,
			{
				method: 'POST',
				body: {
					user_prompt: 'What is the capital of France?',
					mock: true,
				},
			},
		);
		const job = ScrapegraphAiSearchScraper.parse(raw);
		expect(job.request_id.length).toBeGreaterThan(0);
	});

	it('starts mock Markdownify via POST /v1/markdownify', async () => {
		const raw = await makeScrapegraphAiRequest(
			'v1/markdownify',
			LIVE_KEY as string,
			{
				method: 'POST',
				body: {
					website_url: 'https://example.com',
					mock: true,
				},
			},
		);
		const job = ScrapegraphAiMarkdownify.parse(raw);
		expect(job.request_id.length).toBeGreaterThan(0);
	});

	it('lists history endpoints without throwing', async () => {
		const paths = [
			'v1/history/smartscraper',
			'v1/history/searchscraper',
			'v1/history/markdownify',
			'v1/history/crawl',
			'v1/history/scrape',
			'v1/history/sitemap',
			'v1/history/agentic-scraper',
			'v1/scheduled-jobs',
			'v1/usage/timeline',
		];
		for (const path of paths) {
			const raw = await makeScrapegraphAiRequest(path, LIVE_KEY as string);
			expect(raw).toBeDefined();
		}
	});

	it('converts JSON via POST /v1/toonify', async () => {
		const raw = await makeScrapegraphAiRequest(
			'v1/toonify',
			LIVE_KEY as string,
			{
				method: 'POST',
				body: { hello: 'world' },
			},
		);
		expect(raw === null || raw === undefined).toBe(false);
	});
});
