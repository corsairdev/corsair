import 'dotenv/config';
import { makeYoucomSearchRequest } from './client';
import type { YouSearchResponse } from './endpoints/types';
import {
	YoucomEndpointInputSchemas,
	YoucomEndpointOutputSchemas,
} from './endpoints/types';

const TEST_API_KEY =
	process.env.YOUCOM_API_KEY ?? process.env.YDC_API_KEY ?? '';

const describeWithKey = TEST_API_KEY ? describe : describe.skip;

describeWithKey('You.com API Type Tests', () => {
	describe('yousearch.youSearch', () => {
		it('returns web and news results for a basic query', async () => {
			const response = await makeYoucomSearchRequest<YouSearchResponse>(
				TEST_API_KEY,
				{
					query: 'latest AI research developments',
					count: 5,
				},
			);

			YoucomEndpointOutputSchemas.youSearch.parse(response);
			expect(response.metadata.query).toBe('latest AI research developments');
			expect(response.metadata.search_uuid).toEqual(expect.any(String));
			expect(response.metadata.latency).toBeGreaterThan(0);
			expect(
				(response.results.web?.length ?? 0) +
					(response.results.news?.length ?? 0),
			).toBeGreaterThan(0);
		});

		it('supports freshness filtering', async () => {
			const response = await makeYoucomSearchRequest<YouSearchResponse>(
				TEST_API_KEY,
				{
					query: 'technology news',
					count: 3,
					freshness: 'week',
				},
			);

			YoucomEndpointOutputSchemas.youSearch.parse(response);
			expect(response.results).toBeDefined();
		});

		it('supports country and language parameters', async () => {
			const response = await makeYoucomSearchRequest<YouSearchResponse>(
				TEST_API_KEY,
				{
					query: 'local news headlines',
					count: 3,
					country: 'US',
					language: 'EN',
				},
			);

			YoucomEndpointOutputSchemas.youSearch.parse(response);
			expect(response.metadata.query).toBe('local news headlines');
		});

		it('supports safesearch and pagination offset', async () => {
			const response = await makeYoucomSearchRequest<YouSearchResponse>(
				TEST_API_KEY,
				{
					query: 'open source software releases',
					count: 2,
					offset: 0,
					safesearch: 'moderate',
				},
			);

			YoucomEndpointOutputSchemas.youSearch.parse(response);
			expect(response.results.web?.length ?? 0).toBeLessThanOrEqual(2);
		});

		it('supports exclude_domains via POST', async () => {
			const response = await makeYoucomSearchRequest<YouSearchResponse>(
				TEST_API_KEY,
				{
					query: 'machine learning tutorials',
					count: 3,
					exclude_domains: ['reddit.com', 'quora.com'],
				},
			);

			YoucomEndpointOutputSchemas.youSearch.parse(response);
			const urls = [
				...(response.results.web ?? []).map((r) => r.url),
				...(response.results.news ?? []).map((r) => r.url),
			];
			for (const url of urls) {
				expect(url).not.toMatch(/reddit\.com/i);
				expect(url).not.toMatch(/quora\.com/i);
			}
		});

		it('supports boost_domains via POST', async () => {
			const response = await makeYoucomSearchRequest<YouSearchResponse>(
				TEST_API_KEY,
				{
					query: 'TypeScript best practices',
					count: 3,
					boost_domains: ['typescriptlang.org', 'github.com'],
				},
			);

			YoucomEndpointOutputSchemas.youSearch.parse(response);
			expect(response.results.web?.length ?? 0).toBeGreaterThan(0);
		});

		it('supports include_domains via POST', async () => {
			const response = await makeYoucomSearchRequest<YouSearchResponse>(
				TEST_API_KEY,
				{
					query: 'software engineering',
					count: 3,
					include_domains: ['github.com', 'stackoverflow.com'],
				},
			);

			YoucomEndpointOutputSchemas.youSearch.parse(response);
			const urls = [
				...(response.results.web ?? []).map((r) => r.url),
				...(response.results.news ?? []).map((r) => r.url),
			];
			for (const url of urls) {
				expect(url).toMatch(/github\.com|stackoverflow\.com/i);
			}
		});

		it('returns structured web result fields', async () => {
			const response = await makeYoucomSearchRequest<YouSearchResponse>(
				TEST_API_KEY,
				{
					query: 'retrieval augmented generation',
					count: 2,
				},
			);

			YoucomEndpointOutputSchemas.youSearch.parse(response);
			const firstWeb = response.results.web?.[0];
			expect(firstWeb).toBeDefined();
			expect(firstWeb?.url).toEqual(expect.any(String));
			expect(firstWeb?.title).toEqual(expect.any(String));
		});
	});
});

describe('You.com schema validation', () => {
	it('parses a representative search response', () => {
		const sample = {
			results: {
				web: [
					{
						url: 'https://example.com/article',
						title: 'Example Article',
						description: 'A brief description',
						snippets: ['Relevant excerpt from the page'],
						thumbnail_url: 'https://example.com/image.jpg',
						page_age: '2025-11-15T10:30:00',
						favicon_url: 'https://you.com/favicon?domain=example.com&size=128',
					},
				],
				news: [
					{
						title: 'Breaking News',
						description: 'News summary',
						url: 'https://news.example.com/story',
						page_age: '2025-11-15T14:00:00',
					},
				],
			},
			metadata: {
				search_uuid: '942ccbdd-7705-4d9c-9d37-4ef386658e90',
				query: 'test query',
				latency: 0.342,
			},
		};

		const parsed = YoucomEndpointOutputSchemas.youSearch.parse(sample);
		expect(parsed.results.web?.[0]?.snippets?.[0]).toBe(
			'Relevant excerpt from the page',
		);
		expect(parsed.metadata.latency).toBe(0.342);
	});

	it('validates request input schema', () => {
		const parsed = YoucomEndpointInputSchemas.youSearch.parse({
			query: 'test',
			count: 10,
			freshness: 'day',
			country: 'US',
			language: 'EN',
			safesearch: 'strict',
			offset: 1,
		});
		expect(parsed.query).toBe('test');
		expect(parsed.count).toBe(10);
	});
});
