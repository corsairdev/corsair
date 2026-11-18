// Live Jungle Scout API smoke tests. Excluded from default runs by
// `testPathIgnorePatterns` in `jest.config.cjs`; run explicitly with:
//
//   JUNGLESCOUT_API_KEY=KEY_NAME:API_KEY pnpm test:live
//
import { makeJungleScoutRequest } from './client';
import {
	HistoricalSearchVolumeResponseSchema,
	KeywordsByAsinResponseSchema,
	KeywordsByKeywordResponseSchema,
	ProductDatabaseQueryResponseSchema,
	SalesEstimatesQueryResponseSchema,
	ShareOfVoiceResponseSchema,
} from './endpoints/types';

const LIVE_KEY = process.env.JUNGLESCOUT_API_KEY ?? '';
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

if (!LIVE_KEY) {
	console.warn(
		'Skipping Jungle Scout live API smoke tests: JUNGLESCOUT_API_KEY environment variable is not set.',
	);
}

describeLive('junglescout live API smoke tests (env-gated)', () => {
	it('POST /api/keywords/keywords_by_asin_query returns keyword metrics for ASIN', async () => {
		const res = await makeJungleScoutRequest(
			'/api/keywords/keywords_by_asin_query',
			LIVE_KEY,
			{
				method: 'POST',
				query: { marketplace: 'us', 'page[size]': 2 },
				body: {
					data: {
						type: 'keywords_by_asin_query',
						attributes: {
							asins: ['B08RT1NF23'],
						},
					},
				},
			},
		);

		const parsed = KeywordsByAsinResponseSchema.parse(res);
		expect(Array.isArray(parsed.data)).toBe(true);
	});

	it('POST /api/keywords/keywords_by_keyword_query returns keyword search suggestions', async () => {
		const res = await makeJungleScoutRequest(
			'/api/keywords/keywords_by_keyword_query',
			LIVE_KEY,
			{
				method: 'POST',
				query: { marketplace: 'us', 'page[size]': 2 },
				body: {
					data: {
						type: 'keywords_by_keyword_query',
						attributes: {
							search_terms: ['yoga'],
						},
					},
				},
			},
		);

		const parsed = KeywordsByKeywordResponseSchema.parse(res);
		expect(Array.isArray(parsed.data)).toBe(true);
	});

	it('GET /api/keywords/historical_search_volume returns search volume time series', async () => {
		const res = await makeJungleScoutRequest(
			'/api/keywords/historical_search_volume',
			LIVE_KEY,
			{
				method: 'GET',
				query: {
					marketplace: 'us',
					keyword: 'coffee',
					start_date: '2024-01-01',
					end_date: '2024-02-01',
				},
			},
		);

		const parsed = HistoricalSearchVolumeResponseSchema.parse(res);
		expect(Array.isArray(parsed.data)).toBe(true);
	});

	it('POST /api/product_database_query searches products', async () => {
		const res = await makeJungleScoutRequest(
			'/api/product_database_query',
			LIVE_KEY,
			{
				method: 'POST',
				query: { marketplace: 'us', 'page[size]': 2 },
				body: {
					data: {
						type: 'product_database_query',
						attributes: {
							include_keywords: ['water bottle'],
						},
					},
				},
			},
		);

		const parsed = ProductDatabaseQueryResponseSchema.parse(res);
		expect(Array.isArray(parsed.data)).toBe(true);
	});

	it('GET /api/sales_estimates_query returns sales history', async () => {
		const res = await makeJungleScoutRequest(
			'/api/sales_estimates_query',
			LIVE_KEY,
			{
				method: 'GET',
				query: {
					marketplace: 'us',
					asin: 'B08JYQLKXZ',
					start_date: '2024-01-01',
					end_date: '2024-01-10',
				},
			},
		);

		const parsed = SalesEstimatesQueryResponseSchema.parse(res);
		expect(Array.isArray(parsed.data)).toBe(true);
	});

	it('GET /api/share_of_voice returns brand market share', async () => {
		const res = await makeJungleScoutRequest('/api/share_of_voice', LIVE_KEY, {
			method: 'GET',
			query: {
				marketplace: 'us',
				keyword: 'golf balls',
			},
		});

		const parsed = ShareOfVoiceResponseSchema.parse(res);
		expect(parsed.data.id).toBeDefined();
		expect(typeof parsed.data.attributes.estimated_30_day_search_volume).toBe(
			'number',
		);
	});
});
