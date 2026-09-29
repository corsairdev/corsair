import {
	ScrapegraphAiCredits,
	ScrapegraphAiMarkdownify,
	ScrapegraphAiSchema,
	ScrapegraphAiSearchScraper,
	ScrapegraphAiSmartScraper,
} from './schema';

describe('ScrapegraphAi schema', () => {
	it('declares a semver version', () => {
		expect(ScrapegraphAiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares official OpenAPI v1 entities', () => {
		expect(Object.keys(ScrapegraphAiSchema.entities).sort()).toEqual([
			'crawls',
			'credits',
			'generatedSchemas',
			'jobs',
			'markdownifies',
			'scheduledJobs',
			'searchScrapers',
			'smartScrapers',
		]);
	});

	it('parses CreditsResponse', () => {
		expect(
			ScrapegraphAiCredits.parse({
				remaining_credits: 500,
				total_credits_used: 12,
			}).remaining_credits,
		).toBe(500);
	});

	it('parses CompletedSmartscraperResponse', () => {
		expect(
			ScrapegraphAiSmartScraper.parse({
				request_id: 'req-1',
				status: 'completed',
				user_prompt: 'Extract the title',
				website_url: 'https://example.com',
				result: { title: 'Example' },
			}).status,
		).toBe('completed');
	});

	it('parses CompletedSearchScraperResponse', () => {
		expect(
			ScrapegraphAiSearchScraper.parse({
				request_id: 'req-2',
				status: 'queued',
				user_prompt: 'What is Python?',
				result: null,
				reference_urls: null,
			}).request_id,
		).toBe('req-2');
	});

	it('parses a top-level array SearchScraper result', () => {
		expect(
			ScrapegraphAiSearchScraper.parse({
				request_id: 'req-2a',
				status: 'completed',
				user_prompt: 'list items',
				result: [{ name: 'a' }],
			}).result,
		).toEqual([{ name: 'a' }]);
	});

	it('parses CompletedMarkdownifyResponse', () => {
		expect(
			ScrapegraphAiMarkdownify.parse({
				request_id: 'req-3',
				status: 'completed',
				website_url: 'https://example.com',
				result: '# Example',
			}).website_url,
		).toBe('https://example.com');
	});
});
