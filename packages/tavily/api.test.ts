import 'dotenv/config';
import { makeTavilyRequest } from './client';
import type {
	TavilyCrawlResponse,
	TavilyExtractResponse,
	TavilyMapResponse,
	TavilySearchResponse,
} from './endpoints/types';
import { TavilyEndpointOutputSchemas } from './endpoints/types';

const TEST_API_KEY = process.env.TAVILY_API_KEY!;

describe('Tavily API Type Tests', () => {
	describe('search', () => {
		it('search returns correct type', async () => {
			const response = await makeTavilyRequest<TavilySearchResponse>(
				'search',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						query: 'latest AI research papers',
						max_results: 5,
					},
				},
			);

			TavilyEndpointOutputSchemas.search.parse(response);
		});

		it('search with advanced depth and answer returns correct type', async () => {
			const response = await makeTavilyRequest<TavilySearchResponse>(
				'search',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						query: 'what is retrieval augmented generation',
						search_depth: 'advanced',
						include_answer: 'advanced',
						max_results: 3,
					},
				},
			);

			TavilyEndpointOutputSchemas.search.parse(response);
			expect(response.answer).toEqual(expect.any(String));
		});

		it('search with domain filters returns correct type', async () => {
			const response = await makeTavilyRequest<TavilySearchResponse>(
				'search',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						query: 'machine learning tutorials',
						max_results: 5,
						include_domains: ['arxiv.org', 'github.com'],
					},
				},
			);

			TavilyEndpointOutputSchemas.search.parse(response);
		});

		it('search with images returns correct type', async () => {
			const response = await makeTavilyRequest<TavilySearchResponse>(
				'search',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						query: 'northern lights photography',
						max_results: 3,
						include_images: true,
						include_image_descriptions: true,
					},
				},
			);

			TavilyEndpointOutputSchemas.search.parse(response);
		});

		it('search with news topic and time range returns correct type', async () => {
			const response = await makeTavilyRequest<TavilySearchResponse>(
				'search',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						query: 'AI industry news',
						topic: 'news',
						time_range: 'week',
						max_results: 5,
					},
				},
			);

			TavilyEndpointOutputSchemas.search.parse(response);
		});

		it('search with raw content and usage returns correct type', async () => {
			const response = await makeTavilyRequest<TavilySearchResponse>(
				'search',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						query: 'TypeScript best practices',
						max_results: 2,
						include_raw_content: 'markdown',
						include_usage: true,
					},
				},
			);

			TavilyEndpointOutputSchemas.search.parse(response);
			expect(response.usage?.credits).toBeGreaterThan(0);
		});

		it('search with finance topic returns correct type', async () => {
			const response = await makeTavilyRequest<TavilySearchResponse>(
				'search',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						query: 'S&P 500 performance',
						topic: 'finance',
						max_results: 5,
					},
				},
			);

			TavilyEndpointOutputSchemas.search.parse(response);
		});

		it('search with start_date and end_date returns correct type', async () => {
			const response = await makeTavilyRequest<TavilySearchResponse>(
				'search',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						query: 'OpenAI announcements',
						start_date: '2024-01-01',
						end_date: '2024-06-30',
						max_results: 5,
					},
				},
			);

			TavilyEndpointOutputSchemas.search.parse(response);
		});

		it('search with include_favicon returns correct type', async () => {
			const response = await makeTavilyRequest<TavilySearchResponse>(
				'search',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						query: 'developer tools 2024',
						max_results: 3,
						include_favicon: true,
					},
				},
			);

			TavilyEndpointOutputSchemas.search.parse(response);
		});

		it('search with exclude_domains returns correct type', async () => {
			const response = await makeTavilyRequest<TavilySearchResponse>(
				'search',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						query: 'machine learning frameworks',
						max_results: 5,
						exclude_domains: ['medium.com', 'reddit.com'],
					},
				},
			);

			TavilyEndpointOutputSchemas.search.parse(response);
		});

		it('search with chunks_per_source returns correct type', async () => {
			const response = await makeTavilyRequest<TavilySearchResponse>(
				'search',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						query: 'transformer architecture explained',
						search_depth: 'advanced',
						chunks_per_source: 2,
						max_results: 3,
					},
				},
			);

			TavilyEndpointOutputSchemas.search.parse(response);
		});
	});

	describe('extract', () => {
		it('extract with a single URL returns correct type', async () => {
			const response = await makeTavilyRequest<TavilyExtractResponse>(
				'extract',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						urls: 'https://en.wikipedia.org/wiki/Large_language_model',
					},
				},
			);

			TavilyEndpointOutputSchemas.extract.parse(response);
			expect(response.results.length).toBeGreaterThan(0);
		});

		it('extract with multiple URLs returns correct type', async () => {
			const response = await makeTavilyRequest<TavilyExtractResponse>(
				'extract',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						urls: [
							'https://en.wikipedia.org/wiki/Artificial_intelligence',
							'https://en.wikipedia.org/wiki/Machine_learning',
						],
					},
				},
			);

			TavilyEndpointOutputSchemas.extract.parse(response);
		});

		it('extract with advanced depth and images returns correct type', async () => {
			const response = await makeTavilyRequest<TavilyExtractResponse>(
				'extract',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						urls: ['https://en.wikipedia.org/wiki/Neural_network'],
						extract_depth: 'advanced',
						include_images: true,
						format: 'markdown',
					},
				},
			);

			TavilyEndpointOutputSchemas.extract.parse(response);
		});

		it('extract with text format returns correct type', async () => {
			const response = await makeTavilyRequest<TavilyExtractResponse>(
				'extract',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						urls: ['https://en.wikipedia.org/wiki/TypeScript'],
						format: 'text',
					},
				},
			);

			TavilyEndpointOutputSchemas.extract.parse(response);
		});

		it('extract with include_favicon returns correct type', async () => {
			const response = await makeTavilyRequest<TavilyExtractResponse>(
				'extract',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						urls: [
							'https://en.wikipedia.org/wiki/Python_(programming_language)',
						],
						include_favicon: true,
					},
				},
			);

			TavilyEndpointOutputSchemas.extract.parse(response);
		});

		it('extract surfaces failed_results for unreachable URLs', async () => {
			const response = await makeTavilyRequest<TavilyExtractResponse>(
				'extract',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						urls: [
							'https://en.wikipedia.org/wiki/TypeScript',
							'https://this-domain-definitely-does-not-exist-123456.invalid/page',
						],
					},
				},
			);

			TavilyEndpointOutputSchemas.extract.parse(response);
			expect(
				response.results.length + response.failed_results.length,
			).toBeGreaterThanOrEqual(1);
		});
	});

	describe('crawl', () => {
		it('crawl returns correct type', async () => {
			const response = await makeTavilyRequest<TavilyCrawlResponse>(
				'crawl',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						url: 'https://docs.tavily.com',
						max_depth: 1,
						limit: 5,
					},
				},
			);

			TavilyEndpointOutputSchemas.crawl.parse(response);
			expect(response.base_url).toBeTruthy();
		});

		it('crawl with instructions returns correct type', async () => {
			const response = await makeTavilyRequest<TavilyCrawlResponse>(
				'crawl',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						url: 'https://docs.tavily.com',
						instructions: 'Find pages about the search API',
						max_depth: 1,
						limit: 5,
					},
				},
			);

			TavilyEndpointOutputSchemas.crawl.parse(response);
		});

		it('crawl with path filters returns correct type', async () => {
			const response = await makeTavilyRequest<TavilyCrawlResponse>(
				'crawl',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						url: 'https://docs.tavily.com',
						select_paths: ['/docs/.*'],
						exclude_paths: ['/blog/.*'],
						max_depth: 1,
						limit: 5,
					},
				},
			);

			TavilyEndpointOutputSchemas.crawl.parse(response);
		});

		it('crawl with category filter returns correct type', async () => {
			const response = await makeTavilyRequest<TavilyCrawlResponse>(
				'crawl',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						url: 'https://docs.tavily.com',
						categories: ['Documentation'],
						max_depth: 1,
						limit: 5,
					},
				},
			);

			TavilyEndpointOutputSchemas.crawl.parse(response);
		});

		it('crawl with advanced extract_depth returns correct type', async () => {
			const response = await makeTavilyRequest<TavilyCrawlResponse>(
				'crawl',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						url: 'https://docs.tavily.com',
						extract_depth: 'advanced',
						max_depth: 1,
						limit: 3,
					},
				},
			);

			TavilyEndpointOutputSchemas.crawl.parse(response);
		});

		it('crawl with include_images returns correct type', async () => {
			const response = await makeTavilyRequest<TavilyCrawlResponse>(
				'crawl',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						url: 'https://docs.tavily.com',
						include_images: true,
						max_depth: 1,
						limit: 3,
					},
				},
			);

			TavilyEndpointOutputSchemas.crawl.parse(response);
		});

		it('crawl with text format returns correct type', async () => {
			const response = await makeTavilyRequest<TavilyCrawlResponse>(
				'crawl',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						url: 'https://docs.tavily.com',
						format: 'text',
						max_depth: 1,
						limit: 3,
					},
				},
			);

			TavilyEndpointOutputSchemas.crawl.parse(response);
		});
	});

	describe('map', () => {
		it('map returns correct type', async () => {
			const response = await makeTavilyRequest<TavilyMapResponse>(
				'map',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						url: 'https://docs.tavily.com',
						max_depth: 1,
						limit: 10,
					},
				},
			);

			TavilyEndpointOutputSchemas.map.parse(response);
			expect(Array.isArray(response.results)).toBe(true);
		});

		it('map with instructions returns correct type', async () => {
			const response = await makeTavilyRequest<TavilyMapResponse>(
				'map',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						url: 'https://docs.tavily.com',
						instructions: 'Find all API reference pages',
						max_depth: 1,
						limit: 10,
					},
				},
			);

			TavilyEndpointOutputSchemas.map.parse(response);
		});

		it('map with domain restrictions returns correct type', async () => {
			const response = await makeTavilyRequest<TavilyMapResponse>(
				'map',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						url: 'https://docs.tavily.com',
						select_domains: ['docs.tavily.com'],
						allow_external: false,
						max_depth: 1,
						limit: 10,
					},
				},
			);

			TavilyEndpointOutputSchemas.map.parse(response);
		});

		it('map with categories filter returns correct type', async () => {
			const response = await makeTavilyRequest<TavilyMapResponse>(
				'map',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						url: 'https://docs.tavily.com',
						categories: ['Documentation'],
						max_depth: 1,
						limit: 10,
					},
				},
			);

			TavilyEndpointOutputSchemas.map.parse(response);
		});

		it('map with exclude_paths returns correct type', async () => {
			const response = await makeTavilyRequest<TavilyMapResponse>(
				'map',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						url: 'https://docs.tavily.com',
						exclude_paths: ['/blog/.*'],
						max_depth: 1,
						limit: 10,
					},
				},
			);

			TavilyEndpointOutputSchemas.map.parse(response);
		});

		it('map with allow_external returns correct type', async () => {
			const response = await makeTavilyRequest<TavilyMapResponse>(
				'map',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						url: 'https://docs.tavily.com',
						allow_external: true,
						max_depth: 1,
						limit: 10,
					},
				},
			);

			TavilyEndpointOutputSchemas.map.parse(response);
		});
	});
});
