/**
 * Live checks against newsapi.org.
 *
 * Skipped unless `NEWSAPI_API_KEY` is set, and excluded from CI by the test
 * command's `--testPathIgnorePatterns`. What it verifies is the thing mocks
 * cannot: that the routes and parameter names in this package still match
 * the provider, and that the output schemas still accept what it sends.
 */
import 'dotenv/config';
import { makeNewsApiRequest } from './client';
import type {
	GetEverythingResponse,
	GetTopHeadlinesResponse,
	SourcesGetResponse,
} from './endpoints/types';
import { NewsApiEndpointOutputSchemas } from './endpoints/types';

const TEST_API_KEY = process.env.NEWSAPI_API_KEY;
const describeLive = TEST_API_KEY ? describe : describe.skip;

describeLive('News API live checks', () => {
	jest.setTimeout(30_000);
	const key = TEST_API_KEY as string;

	it('articlesGetEverything returns the declared shape', async () => {
		const response = await makeNewsApiRequest<GetEverythingResponse>(
			'v2/everything',
			key,
			{ query: { q: 'technology', pageSize: 5 } },
		);

		expect(
			NewsApiEndpointOutputSchemas.articlesGetEverything.safeParse(response)
				.success,
		).toBe(true);
	});

	it('headlinesGetTop returns the declared shape', async () => {
		const response = await makeNewsApiRequest<GetTopHeadlinesResponse>(
			'v2/top-headlines',
			key,
			{ query: { country: 'us', pageSize: 5 } },
		);

		expect(
			NewsApiEndpointOutputSchemas.headlinesGetTop.safeParse(response).success,
		).toBe(true);
	});

	it('sourcesGet returns the declared shape', async () => {
		const response = await makeNewsApiRequest<SourcesGetResponse>(
			'v2/top-headlines/sources',
			key,
			{ query: { language: 'en' } },
		);

		expect(
			NewsApiEndpointOutputSchemas.sourcesGet.safeParse(response).success,
		).toBe(true);
	});
});
