import 'dotenv/config';
import { makeFirecrawlRequest } from './client';
import type {
	AgentCancelResponse,
	AgentGetResponse,
	AgentStartResponse,
	CrawlCancelResponse,
	CrawlGetResponse,
	CrawlStartResponse,
	MapRunResponse,
	ScrapeRunResponse,
	SearchRunResponse,
} from './endpoints/types';
import { FirecrawlEndpointOutputSchemas } from './endpoints/types';

const TEST_API_KEY = process.env.FIRECRAWL_API_KEY!;

describe('Firecrawl API Type Tests', () => {
	describe('scrape', () => {
		it('scrapeRun returns correct type', async () => {
			const response = await makeFirecrawlRequest<ScrapeRunResponse>(
				'v2/scrape',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						url: 'https://firecrawl.dev',
						formats: ['markdown'],
					},
				},
			);

			FirecrawlEndpointOutputSchemas.scrapeRun.parse(response);
			expect(response.success).toBe(true);
		});

		it('scrapeRun with multiple formats returns correct type', async () => {
			const response = await makeFirecrawlRequest<ScrapeRunResponse>(
				'v2/scrape',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						url: 'https://docs.firecrawl.dev',
						formats: ['markdown', 'links'],
						onlyMainContent: true,
					},
				},
			);

			FirecrawlEndpointOutputSchemas.scrapeRun.parse(response);
		});

		it('scrapeRun with html formats returns correct type', async () => {
			const response = await makeFirecrawlRequest<ScrapeRunResponse>(
				'v2/scrape',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						url: 'https://firecrawl.dev',
						formats: ['html', 'rawHtml'],
					},
				},
			);

			FirecrawlEndpointOutputSchemas.scrapeRun.parse(response);
		});
	});

	describe('map', () => {
		it('mapRun returns correct type', async () => {
			const response = await makeFirecrawlRequest<MapRunResponse>(
				'v2/map',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						url: 'https://firecrawl.dev',
						limit: 10,
					},
				},
			);

			FirecrawlEndpointOutputSchemas.mapRun.parse(response);
			expect(response.success).toBe(true);
		});

		it('mapRun with search filter returns correct type', async () => {
			const response = await makeFirecrawlRequest<MapRunResponse>(
				'v2/map',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						url: 'https://docs.firecrawl.dev',
						search: 'api',
						limit: 10,
					},
				},
			);

			FirecrawlEndpointOutputSchemas.mapRun.parse(response);
		});

		it('mapRun with subdomain inclusion returns correct type', async () => {
			const response = await makeFirecrawlRequest<MapRunResponse>(
				'v2/map',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						url: 'https://firecrawl.dev',
						includeSubdomains: true,
						limit: 20,
					},
				},
			);

			FirecrawlEndpointOutputSchemas.mapRun.parse(response);
		});
	});

	describe('search', () => {
		it('searchRun returns correct type', async () => {
			const response = await makeFirecrawlRequest<SearchRunResponse>(
				'v2/search',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						query: 'web scraping best practices',
						limit: 5,
					},
				},
			);

			FirecrawlEndpointOutputSchemas.searchRun.parse(response);
			expect(response.success).toBe(true);
		});

		it('searchRun with scrapeOptions returns correct type', async () => {
			const response = await makeFirecrawlRequest<SearchRunResponse>(
				'v2/search',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						query: 'firecrawl documentation',
						limit: 3,
						scrapeOptions: {
							formats: ['markdown'],
							onlyMainContent: true,
						},
					},
				},
			);

			FirecrawlEndpointOutputSchemas.searchRun.parse(response);
		});

		it('searchRun with news source returns correct type', async () => {
			const response = await makeFirecrawlRequest<SearchRunResponse>(
				'v2/search',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						query: 'AI news',
						limit: 5,
						sources: [{ type: 'news' }],
					},
				},
			);

			FirecrawlEndpointOutputSchemas.searchRun.parse(response);
		});
	});

	describe('crawl', () => {
		let testCrawlId: string | undefined;

		it('crawlStart returns correct type', async () => {
			const response = await makeFirecrawlRequest<CrawlStartResponse>(
				'v2/crawl',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						url: 'https://firecrawl.dev',
						limit: 3,
						maxDiscoveryDepth: 1,
					},
				},
			);

			FirecrawlEndpointOutputSchemas.crawlStart.parse(response);
			expect(response.success).toBe(true);

			if (response.id) {
				testCrawlId = response.id;
			}
		});

		it('crawlGet returns correct type', async () => {
			if (!testCrawlId) {
				const startResponse = await makeFirecrawlRequest<CrawlStartResponse>(
					'v2/crawl',
					TEST_API_KEY,
					{
						method: 'POST',
						body: {
							url: 'https://firecrawl.dev',
							limit: 3,
							maxDiscoveryDepth: 1,
						},
					},
				);
				if (!startResponse.id) {
					throw new Error('Failed to start crawl job');
				}
				testCrawlId = startResponse.id;
			}

			const response = await makeFirecrawlRequest<CrawlGetResponse>(
				`v2/crawl/${testCrawlId}`,
				TEST_API_KEY,
				{ method: 'GET' },
			);

			FirecrawlEndpointOutputSchemas.crawlGet.parse(response);
			expect(response.success).toBe(true);
		});

		it('crawlCancel returns correct type', async () => {
			const startResponse = await makeFirecrawlRequest<CrawlStartResponse>(
				'v2/crawl',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						url: 'https://firecrawl.dev',
						limit: 10,
						maxDiscoveryDepth: 2,
					},
				},
			);
			if (!startResponse.id) {
				throw new Error('Failed to start crawl job for cancel test');
			}

			const response = await makeFirecrawlRequest<CrawlCancelResponse>(
				`v2/crawl/${startResponse.id}`,
				TEST_API_KEY,
				{ method: 'DELETE' },
			);

			FirecrawlEndpointOutputSchemas.crawlCancel.parse(response);
		});
	});

	describe('agent', () => {
		let testAgentId: string | undefined;

		it('agentStart returns correct type', async () => {
			const response = await makeFirecrawlRequest<AgentStartResponse>(
				'v2/agent',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						prompt: 'Find the main features listed on the firecrawl homepage',
						urls: ['https://firecrawl.dev'],
					},
				},
			);

			FirecrawlEndpointOutputSchemas.agentStart.parse(response);
			expect(response.success).toBe(true);

			if (response.id) {
				testAgentId = response.id;
			}
		});

		it('agentGet returns correct type', async () => {
			if (!testAgentId) {
				const startResponse = await makeFirecrawlRequest<AgentStartResponse>(
					'v2/agent',
					TEST_API_KEY,
					{
						method: 'POST',
						body: {
							prompt: 'Find the pricing information on the firecrawl website',
							urls: ['https://firecrawl.dev'],
						},
					},
				);
				if (!startResponse.id) {
					throw new Error('Failed to start agent job');
				}
				testAgentId = startResponse.id;
			}

			const response = await makeFirecrawlRequest<AgentGetResponse>(
				`v2/agent/${testAgentId}`,
				TEST_API_KEY,
				{ method: 'GET' },
			);

			FirecrawlEndpointOutputSchemas.agentGet.parse(response);
			expect(response.success).toBe(true);
		});

		it('agentCancel returns correct type', async () => {
			const startResponse = await makeFirecrawlRequest<AgentStartResponse>(
				'v2/agent',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						prompt: 'Scrape all the blog posts from the firecrawl website',
						urls: ['https://firecrawl.dev'],
					},
				},
			);
			if (!startResponse.id) {
				throw new Error('Failed to start agent job for cancel test');
			}

			const response = await makeFirecrawlRequest<AgentCancelResponse>(
				`v2/agent/${startResponse.id}`,
				TEST_API_KEY,
				{ method: 'DELETE' },
			);

			FirecrawlEndpointOutputSchemas.agentCancel.parse(response);
			expect(response.success).toBe(true);
		});
	});
});
