import {
	HistoricalSearchVolumeInputSchema,
	HistoricalSearchVolumeResponseSchema,
	KeywordsByAsinInputSchema,
	KeywordsByAsinResponseSchema,
	KeywordsByKeywordInputSchema,
	KeywordsByKeywordResponseSchema,
	ProductDatabaseQueryInputSchema,
	ProductDatabaseQueryResponseSchema,
	SalesEstimatesQueryInputSchema,
	SalesEstimatesQueryResponseSchema,
	ShareOfVoiceInputSchema,
	ShareOfVoiceResponseSchema,
} from './endpoints/types';
import { JungleScoutSchema } from './schema';
import { junglescoutEntities } from './schema/database';

describe('JungleScout schema', () => {
	it('declares a semver version', () => {
		expect(JungleScoutSchema.version).toBeDefined();
		expect(JungleScoutSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map', () => {
		expect(JungleScoutSchema.entities).toBe(junglescoutEntities);
		expect(JungleScoutSchema.entities).toEqual({});
	});
});

describe('JungleScout endpoint schemas', () => {
	describe('keywords.byAsin schemas', () => {
		it('validates keywords by ASIN input', () => {
			expect(
				KeywordsByAsinInputSchema.safeParse({
					marketplace: 'us',
					asins: ['B08RT1NF23'],
				}).success,
			).toBe(true);

			// Rejects empty asins array
			expect(
				KeywordsByAsinInputSchema.safeParse({
					marketplace: 'us',
					asins: [],
				}).success,
			).toBe(false);

			// Rejects more than 10 asins
			expect(
				KeywordsByAsinInputSchema.safeParse({
					marketplace: 'us',
					asins: Array.from({ length: 11 }, (_, i) => `B00000000${i}`),
				}).success,
			).toBe(false);

			// Rejects invalid marketplace
			expect(
				KeywordsByAsinInputSchema.safeParse({
					marketplace: 'invalid',
					asins: ['B08RT1NF23'],
				}).success,
			).toBe(false);
		});

		it('validates keywords by ASIN output', () => {
			const validOutput = {
				data: [
					{
						id: 'us/batteries',
						type: 'keywords_by_asin_result',
						attributes: {
							country: 'us',
							name: 'batteries',
							primary_asin: 'B08RT1NF23',
							monthly_search_volume_exact: 50000,
						},
					},
				],
			};
			expect(KeywordsByAsinResponseSchema.safeParse(validOutput).success).toBe(
				true,
			);

			// Responses are read leniently: missing fields and non-integer counts
			// still parse instead of failing the whole call.
			expect(
				KeywordsByAsinResponseSchema.safeParse({
					data: [
						{
							id: 'us/batteries',
							type: 'keywords_by_asin_result',
							attributes: {
								// missing country and name
								monthly_search_volume_exact: 50000,
							},
						},
					],
				}).success,
			).toBe(true);

			expect(
				KeywordsByAsinResponseSchema.safeParse({
					data: [
						{
							id: 'us/batteries',
							type: 'keyword_by_asin_result',
							attributes: {
								country: 'us',
								name: 'batteries',
								monthly_search_volume_exact: 1.5,
							},
						},
					],
				}).success,
			).toBe(true);
		});
	});

	describe('keywords.byKeyword schemas', () => {
		it('validates keywords by keyword input', () => {
			expect(
				KeywordsByKeywordInputSchema.safeParse({
					marketplace: 'us',
					search_terms: ['yoga mat'],
				}).success,
			).toBe(true);

			expect(
				KeywordsByKeywordInputSchema.safeParse({
					marketplace: 'us',
					search_terms: [],
				}).success,
			).toBe(false);

			expect(
				KeywordsByKeywordInputSchema.safeParse({
					marketplace: 'us',
					search_terms: 'yoga mat',
				}).success,
			).toBe(false);

			expect(
				KeywordsByKeywordInputSchema.safeParse({
					marketplace: 'us',
					search_terms: ['yoga mat'],
					callback_url: 'https://callback.invalid/path',
				}).success,
			).toBe(false);
		});

		it('validates keywords by keyword output', () => {
			const validOutput = {
				data: [
					{
						id: 'us/yoga',
						type: 'keywords_by_keyword_result',
						attributes: {
							country: 'us',
							name: 'yoga',
							monthly_search_volume_exact: 80000,
						},
					},
				],
			};
			expect(
				KeywordsByKeywordResponseSchema.safeParse(validOutput).success,
			).toBe(true);
		});
	});

	describe('keywords.historicalSearchVolume schemas', () => {
		it('validates historical search volume input', () => {
			expect(
				HistoricalSearchVolumeInputSchema.safeParse({
					marketplace: 'us',
					keyword: 'sushi',
					start_date: '2025-01-01',
					end_date: '2025-01-31',
				}).success,
			).toBe(true);

			// Rejects invalid date format
			expect(
				HistoricalSearchVolumeInputSchema.safeParse({
					marketplace: 'us',
					keyword: 'sushi',
					start_date: '2025/01/01',
					end_date: '2025-01-31',
				}).success,
			).toBe(false);
		});

		it('rejects invalid calendar dates and reversed ranges', () => {
			expect(
				HistoricalSearchVolumeInputSchema.safeParse({
					marketplace: 'us',
					keyword: 'sushi',
					start_date: '2025-02-01',
					end_date: '2025-02-30',
				}).success,
			).toBe(false);

			expect(
				HistoricalSearchVolumeInputSchema.safeParse({
					marketplace: 'us',
					keyword: 'sushi',
					start_date: '2025-02-01',
					end_date: '2025-01-31',
				}).success,
			).toBe(false);
		});

		it('validates historical search volume output', () => {
			const validOutput = {
				data: [
					{
						id: 'us/sushi/2025-01-05/2025-01-11',
						type: 'historical_keyword_search_volume',
						attributes: {
							estimate_start_date: '2025-01-05',
							estimate_end_date: '2025-01-11',
							estimated_exact_search_volume: 38735,
						},
					},
				],
			};
			expect(
				HistoricalSearchVolumeResponseSchema.safeParse(validOutput).success,
			).toBe(true);
		});
	});

	describe('productDatabase.query schemas', () => {
		it('validates product database query input', () => {
			expect(
				ProductDatabaseQueryInputSchema.safeParse({
					marketplace: 'us',
					min_price: 10,
					max_price: 50,
					min_rating: 4,
					max_rating: 5,
					product_tiers: ['standard'],
					seller_types: ['fba', 'amz'],
				}).success,
			).toBe(true);

			// Rejects rating out of 1-5 range
			expect(
				ProductDatabaseQueryInputSchema.safeParse({
					marketplace: 'us',
					min_rating: 0.5,
				}).success,
			).toBe(false);

			expect(
				ProductDatabaseQueryInputSchema.safeParse({
					marketplace: 'us',
					max_rating: 5.5,
				}).success,
			).toBe(false);
		});

		it('validates product database query output', () => {
			const validOutput = {
				data: [
					{
						id: 'us/B07ZZJLZT2',
						type: 'product_database_result',
						attributes: {
							title: 'Sample Product',
							price: 29.99,
							reviews: 500,
							rating: 4.6,
							brand: 'TestBrand',
						},
					},
				],
			};
			expect(
				ProductDatabaseQueryResponseSchema.safeParse(validOutput).success,
			).toBe(true);
		});
	});

	describe('salesEstimates.query schemas', () => {
		it('validates sales estimates query input', () => {
			expect(
				SalesEstimatesQueryInputSchema.safeParse({
					marketplace: 'us',
					asin: 'B08JYQLKXZ',
					start_date: '2024-01-01',
					end_date: '2024-01-15',
				}).success,
			).toBe(true);

			expect(
				SalesEstimatesQueryInputSchema.safeParse({
					marketplace: 'us',
					asin: '',
					start_date: '2024-01-01',
					end_date: '2024-01-15',
				}).success,
			).toBe(false);

			expect(
				SalesEstimatesQueryInputSchema.safeParse({
					marketplace: 'us',
					asin: 'B08JYQLKXZ',
					start_date: '2024-01-01',
					end_date: new Date().toISOString().slice(0, 10),
				}).success,
			).toBe(false);
		});

		it('validates sales estimates query output', () => {
			const validOutput = {
				data: [
					{
						id: 'us/B08JYQLKXZ',
						type: 'sales_estimate_result',
						attributes: {
							asin: 'B08JYQLKXZ',
							is_parent: false,
							is_variant: true,
							is_standalone: false,
							parent_asin: 'B09RWP4NXB',
							variants: [],
							data: [
								{
									date: '2026-04-22',
									estimated_units_sold: 45,
									last_known_price: 29.99,
								},
							],
						},
					},
				],
			};
			expect(
				SalesEstimatesQueryResponseSchema.safeParse(validOutput).success,
			).toBe(true);
		});
	});

	describe('shareOfVoice.get schemas', () => {
		it('validates share of voice input', () => {
			expect(
				ShareOfVoiceInputSchema.safeParse({
					marketplace: 'us',
					keyword: 'coffee maker',
				}).success,
			).toBe(true);

			expect(
				ShareOfVoiceInputSchema.safeParse({
					marketplace: 'us',
					keyword: '',
				}).success,
			).toBe(false);
		});

		it('validates share of voice output', () => {
			const validOutput = {
				data: {
					id: 'us/coffee',
					type: 'share_of_voice',
					attributes: {
						estimated_30_day_search_volume: 100000,
						exact_suggested_bid_median: 1.5,
						product_count: 50,
						updated_at: '2025-04-01T15:21:29Z',
						brands: [
							{
								brand: 'BrandA',
								combined_products: 5,
								combined_weighted_sov: 0.3,
								combined_basic_sov: 0.1,
								combined_average_position: 10,
								combined_average_price: 49.99,
								organic_products: 4,
								organic_weighted_sov: 0.25,
								organic_basic_sov: 0.08,
								organic_average_position: 8,
								organic_average_price: 45.99,
								sponsored_products: 1,
								sponsored_weighted_sov: 0.05,
								sponsored_basic_sov: 0.02,
								sponsored_average_position: 12,
								sponsored_average_price: 55.99,
							},
						],
					},
				},
			};
			expect(ShareOfVoiceResponseSchema.safeParse(validOutput).success).toBe(
				true,
			);

			expect(
				ShareOfVoiceResponseSchema.safeParse({
					data: {
						...validOutput.data,
						attributes: {
							...validOutput.data.attributes,
							estimated_30_day_search_volume: 1.5,
						},
					},
				}).success,
			).toBe(true);
		});
	});
});

describe('responses from the OpenAPI examples (developer.junglescout.com v1)', () => {
	it('accepts share of voice brands with null sponsored metrics', () => {
		const brand = {
			brand: 'Callaway',
			combined_products: 9,
			combined_weighted_sov: 0.2826,
			combined_basic_sov: 0.0818,
			combined_average_position: 41.33,
			combined_average_price: 220.41,
			organic_products: 9,
			organic_weighted_sov: 0.315,
			organic_basic_sov: 0.0938,
			organic_average_position: 41.33,
			organic_average_price: 220.41,
			sponsored_products: 0,
			sponsored_weighted_sov: 0,
			sponsored_basic_sov: 0,
			sponsored_average_position: null,
			sponsored_average_price: null,
		};
		expect(
			ShareOfVoiceResponseSchema.safeParse({
				data: {
					id: 'us/golf clubs',
					type: 'share_of_voice',
					attributes: {
						estimated_30_day_search_volume: 1000,
						exact_suggested_bid_median: 1.5,
						product_count: 50,
						updated_at: '2026-04-22T00:00:00.000Z',
						brands: [brand],
						top_asins: [],
					},
				},
			}).success,
		).toBe(true);
	});

	it('accepts a sales estimate without attributes.asin (not in the schema)', () => {
		expect(
			SalesEstimatesQueryResponseSchema.safeParse({
				data: [
					{
						id: 'us/B08JYQLKXZ',
						type: 'sales_estimate_result',
						attributes: {
							is_parent: false,
							is_variant: true,
							is_standalone: false,
							parent_asin: 'B09RWP4NXB',
							variants: [],
							data: [
								{
									date: '2026-04-22',
									estimated_units_sold: 1563,
									last_known_price: 30.8,
								},
							],
						},
					},
				],
			}).success,
		).toBe(true);
	});
});

describe('plugin wiring', () => {
	it('hands caller hooks to core, which reads plugin.hooks', async () => {
		const { junglescout } = await import('./index');
		const hooks = {
			shareOfVoice: {
				get: { before: async (ctx: never, args: never) => ({ ctx, args }) },
			},
		};
		// `unknown` cast: a minimal hook object stands in for the full typed tree.
		const plugin = junglescout({ hooks: hooks as unknown as never });
		expect(plugin.hooks).toBe(hooks);
	});
});
