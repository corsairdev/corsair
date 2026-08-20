/**
 * Live checks against api.api-ninjas.com.
 *
 * Skipped unless `APININJAS_API_KEY` is set, and excluded from CI by the test
 * command's `--testPathIgnorePatterns`. What it verifies is the thing mocks
 * cannot: that the routes, versions and parameter names in this package still
 * match the API, and that the output schemas still accept what it sends.
 *
 * Deliberately small. The free tier allows 3,000 calls a month, so this spends
 * about a dozen and covers one endpoint per version, both HTTP methods, a
 * premium rejection and an unknown route.
 */
import type { z } from 'zod';
import { makeApiNinjasRequest } from './client';
import { ApiNinjasEndpointOutputSchemas } from './endpoints/types';

/**
 * Parses a live response and fails with the validation issues when it does not
 * match. Asserting only on `success` reports "expected true, received false",
 * which says nothing about which field the provider changed.
 */
function expectParses(schema: z.ZodType, value: unknown, operation: string) {
	const result = schema.safeParse(value);
	if (!result.success) {
		throw new Error(
			`${operation} no longer matches its schema: ${JSON.stringify(
				result.error.issues.slice(0, 5),
				null,
				2,
			)}`,
		);
	}
	expect(result.success).toBe(true);
}

const API_KEY = process.env.APININJAS_API_KEY;
const describeLive = API_KEY ? describe : describe.skip;

describeLive('live API', () => {
	jest.setTimeout(30_000);
	const key = API_KEY as string;

	it('answers a v1 GET and returns the declared shape', async () => {
		const result = await makeApiNinjasRequest('sentiment', key, {
			query: { text: 'this integration works' },
		});

		expectParses(
			ApiNinjasEndpointOutputSchemas.textSentiment,
			result,
			'textSentiment',
		);
	});

	it('answers a v2 GET on a route that does not exist under v1', async () => {
		// `quoteoftheday` 404s on v1 - the version prefix is load-bearing.
		const result = await makeApiNinjasRequest('quoteoftheday', key, {
			version: 'v2',
		});

		expectParses(
			ApiNinjasEndpointOutputSchemas.entertainmentQuoteOfTheDay,
			result,
			'entertainmentQuoteOfTheDay',
		);
	});

	it('answers a v3 GET', async () => {
		const result = await makeApiNinjasRequest('recipe', key, {
			version: 'v3',
			query: { title: 'pasta' },
		});

		expectParses(
			ApiNinjasEndpointOutputSchemas.healthRecipes,
			result,
			'healthRecipes',
		);
	});

	it('answers a POST with a JSON body', async () => {
		const result = await makeApiNinjasRequest('textsimilarity', key, {
			method: 'POST',
			body: { text_1: 'hello there', text_2: 'hi there' },
		});

		expectParses(
			ApiNinjasEndpointOutputSchemas.textSimilarity,
			result,
			'textSimilarity',
		);
	});

	it('still masks premium fields the way the schemas expect', async () => {
		// If the provider ever stops masking, the schemas keep working; if it
		// starts masking a new field, this is where it shows up.
		const result = await makeApiNinjasRequest('stockprice', key, {
			query: { ticker: 'AAPL' },
		});

		expectParses(
			ApiNinjasEndpointOutputSchemas.marketsStockPrice,
			result,
			'marketsStockPrice',
		);
	});

	it('reports a premium-gated endpoint as a rejection, not as data', async () => {
		await expect(
			makeApiNinjasRequest('inflation', key, {
				version: 'v2',
				query: { country: 'united states' },
			}),
		).rejects.toThrow();
	});

	it('reports an unknown route rather than answering it', async () => {
		await expect(makeApiNinjasRequest('nosuchendpoint', key)).rejects.toThrow();
	});

	it('rejects a request with no credential', async () => {
		// The provider answers 400 "Missing API Key." rather than 401, which is why
		// the error handlers read the body.
		await expect(makeApiNinjasRequest('bitcoin', '')).rejects.toThrow();
	});
});
