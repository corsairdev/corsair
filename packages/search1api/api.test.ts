import { makeSearch1APIRequest } from './client';
import {
	HealthResponseSchema,
	TrendingResponseSchema,
	UsageResponseSchema,
} from './endpoints/types';

const TEST_API_KEY = process.env.SEARCH1API_API_KEY ?? '';
const describeIfApiKey = TEST_API_KEY ? describe : describe.skip;

describeIfApiKey('Search1API live API', () => {
	jest.setTimeout(180_000);

	it('reports account usage for the api key', async () => {
		const usage = UsageResponseSchema.parse(
			await makeSearch1APIRequest('/usage', TEST_API_KEY, {
				query: { period: 'day' },
			}),
		);
		expect(usage.credential_type).toBe('api_key');
	});

	it('returns trending repositories for github', async () => {
		const trending = TrendingResponseSchema.parse(
			await makeSearch1APIRequest('/trending', TEST_API_KEY, {
				method: 'POST',
				body: { search_service: 'github', max_results: 3 },
			}),
		);
		expect(trending.trendingParameters.search_service).toBe('github');
		expect(trending.results.length).toBeGreaterThan(0);
		expect(trending.results.length).toBeLessThanOrEqual(3);
		const first = trending.results[0];
		if (!first) return;
		expect(first.url).toMatch(/^https?:\/\//);
	});

	it('answers the health check', async () => {
		const health = HealthResponseSchema.parse(
			await makeSearch1APIRequest('/health', TEST_API_KEY),
		);
		expect(health.status.length).toBeGreaterThan(0);
	});
});
