import { AuthMissingError, logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	Keywords,
	ProductDatabase,
	SalesEstimates,
	ShareOfVoice,
} from './endpoints';
import type { JungleScoutContext } from './index';
import { junglescout, junglescoutEndpointSchemas } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeJungleScoutRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeJungleScoutRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

function buildCtx(): JungleScoutContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-key-name:test-api-key',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-key-name:test-api-key'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
}

const ctx = buildCtx();

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLogEvent.mockReset();
});

describe('junglescout endpoints', () => {
	describe('registry sync', () => {
		it('registers all endpoints in the plugin factory', () => {
			const plugin = junglescout({ key: 'test-key' });
			const schemaKeys = Object.keys(plugin.endpointSchemas ?? {}).sort();
			const metaKeys = Object.keys(plugin.endpointMeta ?? {}).sort();
			const expectedKeys = [
				'keywords.byAsin',
				'keywords.byKeyword',
				'keywords.historicalSearchVolume',
				'productDatabase.query',
				'salesEstimates.query',
				'shareOfVoice.get',
			].sort();

			expect(schemaKeys).toEqual(expectedKeys);
			expect(metaKeys).toEqual(expectedKeys);
			expect(Object.keys(junglescoutEndpointSchemas).sort()).toEqual(
				expectedKeys,
			);
		});

		it('resolves the full API credential and rejects missing credentials', async () => {
			const configuredPlugin = junglescout({
				authType: 'api_key',
				key: 'test-key-name:test-api-key',
			});
			const configuredKeyBuilder = configuredPlugin.keyBuilder;
			if (!configuredKeyBuilder) throw new Error('Expected keyBuilder');
			const configuredContext: Parameters<typeof configuredKeyBuilder>[0] = {
				authType: 'api_key',
				options: {
					authType: 'api_key',
					key: 'test-key-name:test-api-key',
				},
				keys: buildCtx().keys,
				tenantId: 'test-account',
			};
			await expect(
				configuredKeyBuilder(configuredContext, 'endpoint'),
			).resolves.toBe('test-key-name:test-api-key');

			const plugin = junglescout({ authType: 'api_key' });
			const keyBuilder = plugin.keyBuilder;
			if (!keyBuilder) throw new Error('Expected keyBuilder');
			const missingKeyContext: Parameters<typeof keyBuilder>[0] = {
				authType: 'api_key',
				options: { authType: 'api_key' },
				keys: {
					...buildCtx().keys,
					get_api_key: () => Promise.resolve(null),
				},
				tenantId: 'test-account',
			};
			await expect(keyBuilder(missingKeyContext, 'endpoint')).rejects.toThrow(
				AuthMissingError,
			);
		});
	});

	describe('keywords.byAsin', () => {
		const mockResponse = {
			data: [
				{
					id: 'us/aaa batteries 24 pack',
					type: 'keywords_by_asin_result',
					attributes: {
						country: 'us',
						name: 'aaa batteries 24 pack',
						primary_asin: 'B08RT1NF23',
						monthly_trend: 13.5,
						monthly_search_volume_exact: 74882,
						quarterly_trend: -44.22,
						monthly_search_volume_broad: 84866,
						dominant_category: 'Health & Household',
						recommended_promotions: 1022,
						sp_brand_ad_bid: null,
						ppc_bid_broad: 2.2,
						ppc_bid_exact: 6.67,
						ease_of_ranking_score: 90,
						relevancy_score: 70,
						organic_product_count: 10000,
						sponsored_product_count: 28,
						updated_at: '2025-04-02T15:37:11.000000Z',
						organic_rank: 0,
						sponsored_rank: null,
						overall_rank: null,
						organic_ranking_asins_count: 2,
						sponsored_ranking_asins_count: 1,
						avg_competitor_organic_rank: 4,
						avg_competitor_sponsored_rank: 2,
						relative_organic_position: 3,
						relative_sponsored_position: 2,
						variation_lowest_organic_rank: null,
						variation_lowest_sponsored_rank: null,
						competitor_organic_rank: [
							{ asin: 'B002UXRXE6', organic_rank: 2 },
							{ asin: 'B09RTVN5GN', organic_rank: 6 },
						],
						competitor_sponsored_rank: [
							{ asin: 'B002UXRXE6', sponsored_rank: 0 },
							{ asin: 'B09RTVN5GN', sponsored_rank: 1 },
						],
					},
				},
			],
			meta: { total_items: 2191 },
			links: {
				self: 'https://developer.junglescout.com/api/keywords/keywords_by_asin_query?marketplace=us&page%5Bsize%5D=3',
				next: 'https://developer.junglescout.com/api/keywords/keywords_by_asin_query?marketplace=us&page%5Bcursor%5D=cursor123&page%5Bsize%5D=3',
			},
		};

		it('formats POST request with JSON:API envelope and query parameters', async () => {
			mockedRequest.mockResolvedValue(mockResponse);

			const result = await Keywords.byAsin(ctx, {
				marketplace: 'us',
				asins: ['B08RT1NF23', 'B002UXRXE6'],
				sort: '-monthly_search_volume_exact',
				page_size: 50,
				page_cursor: 'cursor123',
				include_variants: true,
				min_monthly_search_volume_exact: 100,
			});

			expect(result).toEqual(mockResponse);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/keywords/keywords_by_asin_query',
				'test-key-name:test-api-key',
				{
					method: 'POST',
					query: {
						marketplace: 'us',
						sort: '-monthly_search_volume_exact',
						'page[size]': 50,
						'page[cursor]': 'cursor123',
					},
					body: {
						data: {
							type: 'keywords_by_asin_query',
							attributes: {
								asins: ['B08RT1NF23', 'B002UXRXE6'],
								include_variants: true,
								min_monthly_search_volume_exact: 100,
							},
						},
					},
					apiType: undefined,
				},
			);
			expect(mockedLogEvent).toHaveBeenCalledWith(
				ctx,
				'junglescout.keywords.byAsin',
				{ asinCount: 2, marketplace: 'us' },
				'completed',
			);
		});

		it('rejects invalid inputs before network call', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const errEmpty = await Keywords.byAsin(ctx, {
				marketplace: 'us',
				asins: [],
			}).catch((e: unknown) => e);
			expect(errEmpty).toBeDefined();
			expect(mockedRequest).not.toHaveBeenCalled();

			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const errTooMany = await Keywords.byAsin(ctx, {
				marketplace: 'us',
				asins: Array.from({ length: 11 }, (_, i) => `B00000000${i}`),
			}).catch((e: unknown) => e);
			expect(errTooMany).toBeDefined();
			expect(mockedRequest).not.toHaveBeenCalled();
		});
	});

	describe('keywords.byKeyword', () => {
		const mockResponse = {
			data: [
				{
					id: 'us/alo yoga women',
					type: 'keywords_by_keyword_result',
					attributes: {
						country: 'us',
						name: 'alo yoga women',
						monthly_trend: 14.73,
						monthly_search_volume_exact: 83255,
						quarterly_trend: 8.99,
						monthly_search_volume_broad: 89382,
						dominant_category: 'Clothing, Shoes & Jewelry',
						recommended_promotions: 300,
						updated_at: '2025-04-02T15:37:11.000000Z',
						sp_brand_ad_bid: null,
						ppc_bid_broad: 1.5,
						ppc_bid_exact: 3.2,
						ease_of_ranking_score: 85,
						relevancy_score: 95,
						organic_product_count: 5000,
						sponsored_product_count: 45,
					},
				},
			],
			meta: { total_items: 980 },
			links: {
				self: 'https://developer.junglescout.com/api/keywords/keywords_by_keyword_query?marketplace=us',
			},
		};

		it('formats POST request and logs safe parameters', async () => {
			mockedRequest.mockResolvedValue(mockResponse);

			const result = await Keywords.byKeyword(ctx, {
				marketplace: 'us',
				search_terms: ['yoga mat'],
				categories: ['Sports & Outdoors'],
				sort: 'monthly_search_volume_exact',
			});

			expect(result).toEqual(mockResponse);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/keywords/keywords_by_keyword_query',
				'test-key-name:test-api-key',
				{
					method: 'POST',
					query: {
						marketplace: 'us',
						sort: 'monthly_search_volume_exact',
						'page[size]': undefined,
						'page[cursor]': undefined,
					},
					body: {
						data: {
							type: 'keywords_by_keyword_query',
							attributes: {
								search_terms: ['yoga mat'],
								categories: ['Sports & Outdoors'],
							},
						},
					},
					apiType: undefined,
				},
			);
			expect(mockedLogEvent).toHaveBeenCalledWith(
				ctx,
				'junglescout.keywords.byKeyword',
				{ marketplace: 'us' },
				'completed',
			);
		});

		it('rejects empty search terms before network call', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const error = await Keywords.byKeyword(ctx, {
				marketplace: 'us',
				search_terms: [],
			}).catch((e: unknown) => e);
			expect(error).toBeDefined();
			expect(mockedRequest).not.toHaveBeenCalled();
		});
	});

	describe('keywords.historicalSearchVolume', () => {
		const mockResponse = {
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

		it('formats GET request with query parameters', async () => {
			mockedRequest.mockResolvedValue(mockResponse);

			const result = await Keywords.historicalSearchVolume(ctx, {
				marketplace: 'us',
				keyword: 'sushi',
				start_date: '2025-01-01',
				end_date: '2025-01-31',
			});

			expect(result).toEqual(mockResponse);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/keywords/historical_search_volume',
				'test-key-name:test-api-key',
				{
					method: 'GET',
					query: {
						marketplace: 'us',
						keyword: 'sushi',
						start_date: '2025-01-01',
						end_date: '2025-01-31',
					},
					apiType: undefined,
				},
			);
			expect(mockedLogEvent).toHaveBeenCalledWith(
				ctx,
				'junglescout.keywords.historicalSearchVolume',
				{
					marketplace: 'us',
					startDate: '2025-01-01',
					endDate: '2025-01-31',
				},
				'completed',
			);
		});

		it('rejects invalid date formats', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const error = await Keywords.historicalSearchVolume(ctx, {
				marketplace: 'us',
				keyword: 'sushi',
				start_date: '01-01-2025',
				end_date: '2025-01-31',
			}).catch((e: unknown) => e);
			expect(error).toBeDefined();
			expect(mockedRequest).not.toHaveBeenCalled();
		});
	});

	describe('productDatabase.query', () => {
		const mockResponse = {
			data: [
				{
					id: 'us/B07ZZJLZT2',
					type: 'product_database_result',
					attributes: {
						title: 'Charging Dock for Apple Watch & iPhone',
						price: 39.99,
						reviews: 1162,
						category: 'Cell Phones & Accessories',
						rating: 4.5,
						image_url: 'https://m.media-amazon.com/images/I/sample.jpg',
						parent_asin: null,
						is_variant: false,
						seller_type: 'fba',
						variants: [],
						breadcrumb_path: 'Electronics',
						is_standalone: true,
						is_parent: false,
						is_available: true,
						brand: 'SampleBrand',
						product_rank: 1500,
						weight_value: 1.2,
						weight_unit: 'lbs',
						length_value: 8.5,
						width_value: 4.2,
						height_value: 3.1,
						dimensions_unit: 'inches',
						listing_quality_score: 8.5,
						number_of_sellers: 1,
						buy_box_owner: 'Sample Seller',
						buy_box_owner_seller_id: 'A1234567890',
						date_first_available: '2020-09-28',
						date_first_available_is_estimated: false,
						approximate_30_day_revenue: 45000,
						approximate_30_day_units_sold: 1125,
						subcategory_ranks: [
							{
								subcategory: 'Charging Stations',
								rank: 12,
								id: '12345',
							},
						],
						fee_breakdown: {
							fba_fee: 5.4,
							referral_fee: 6.0,
							variable_closing_fee: 0,
							total_fees: 11.4,
						},
						ean_list: null,
						isbn_list: null,
						upc_list: ['123456789012'],
						gtin_list: null,
						variant_reviews: null,
						updated_at: '2025-04-01T12:00:00Z',
					},
				},
			],
			meta: { total_items: 1 },
			links: {
				self: 'https://developer.junglescout.com/api/product_database_query?marketplace=us',
			},
		};

		it('formats POST request with product database filters', async () => {
			mockedRequest.mockResolvedValue(mockResponse);

			const result = await ProductDatabase.query(ctx, {
				marketplace: 'us',
				include_keywords: ['charging dock'],
				product_tiers: ['standard'],
				seller_types: ['fba', 'amz'],
				min_price: 20,
				max_price: 100,
				min_rating: 4,
			});

			expect(result).toEqual(mockResponse);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/product_database_query',
				'test-key-name:test-api-key',
				{
					method: 'POST',
					query: {
						marketplace: 'us',
						sort: undefined,
						'page[size]': undefined,
						'page[cursor]': undefined,
					},
					body: {
						data: {
							type: 'product_database_query',
							attributes: {
								include_keywords: ['charging dock'],
								product_tiers: ['standard'],
								seller_types: ['fba', 'amz'],
								min_price: 20,
								max_price: 100,
								min_rating: 4,
							},
						},
					},
					apiType: undefined,
				},
			);
			expect(mockedLogEvent).toHaveBeenCalledWith(
				ctx,
				'junglescout.productDatabase.query',
				{ marketplace: 'us' },
				'completed',
			);
		});

		it('rejects out of bounds ratings', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const error = await ProductDatabase.query(ctx, {
				marketplace: 'us',
				min_rating: 6,
			}).catch((e: unknown) => e);
			expect(error).toBeDefined();
			expect(mockedRequest).not.toHaveBeenCalled();
		});
	});

	describe('salesEstimates.query', () => {
		const mockResponse = {
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

		it('formats GET request for historical sales estimates', async () => {
			mockedRequest.mockResolvedValue(mockResponse);

			const result = await SalesEstimates.query(ctx, {
				marketplace: 'us',
				asin: 'B08JYQLKXZ',
				start_date: '2024-01-01',
				end_date: '2024-01-15',
			});

			expect(result).toEqual(mockResponse);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/sales_estimates_query',
				'test-key-name:test-api-key',
				{
					method: 'GET',
					query: {
						marketplace: 'us',
						asin: 'B08JYQLKXZ',
						start_date: '2024-01-01',
						end_date: '2024-01-15',
					},
					apiType: undefined,
				},
			);
			expect(mockedLogEvent).toHaveBeenCalledWith(
				ctx,
				'junglescout.salesEstimates.query',
				{ marketplace: 'us' },
				'completed',
			);
		});

		it('rejects empty ASIN before network call', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const error = await SalesEstimates.query(ctx, {
				marketplace: 'us',
				asin: '',
				start_date: '2024-01-01',
				end_date: '2024-01-15',
			}).catch((e: unknown) => e);
			expect(error).toBeDefined();
			expect(mockedRequest).not.toHaveBeenCalled();
		});

		it('rejects an end date that is not before today before network call', async () => {
			const today = new Date().toISOString().slice(0, 10);
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const error = await SalesEstimates.query(ctx, {
				marketplace: 'us',
				asin: 'B08JYQLKXZ',
				start_date: '2024-01-01',
				end_date: today,
			}).catch((caught: unknown) => caught);
			expect(error).toBeDefined();
			expect(mockedRequest).not.toHaveBeenCalled();
		});
	});

	describe('shareOfVoice.get', () => {
		const mockResponse = {
			data: {
				id: 'us/golf',
				type: 'share_of_voice',
				attributes: {
					estimated_30_day_search_volume: 333206,
					exact_suggested_bid_median: 1.19,
					product_count: 110,
					updated_at: '2025-04-01T15:21:29Z',
					top_asins_model_start_date: '2025-03-01',
					top_asins_model_end_date: '2025-03-31',
					brands: [
						{
							brand: 'Callaway',
							combined_products: 9,
							combined_weighted_sov: 0.2826,
							combined_basic_sov: 0.0818,
							combined_average_position: 14.5,
							combined_average_price: 199.99,
							organic_products: 7,
							organic_weighted_sov: 0.25,
							organic_basic_sov: 0.07,
							organic_average_position: 12.3,
							organic_average_price: 189.99,
							sponsored_products: 2,
							sponsored_weighted_sov: 0.0326,
							sponsored_basic_sov: 0.0118,
							sponsored_average_position: 18.2,
							sponsored_average_price: 229.99,
						},
					],
					top_asins: [
						{
							asin: 'B07XXXXXXX',
							name: 'Callaway Golf Balls',
							brand: 'Callaway',
							clicks: 1500,
							conversions: 300,
							conversion_rate: 0.2,
						},
					],
				},
			},
		};

		it('formats GET request for share of voice analytics', async () => {
			mockedRequest.mockResolvedValue(mockResponse);

			const result = await ShareOfVoice.get(ctx, {
				marketplace: 'us',
				keyword: 'golf',
			});

			expect(result).toEqual(mockResponse);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/share_of_voice',
				'test-key-name:test-api-key',
				{
					method: 'GET',
					query: {
						marketplace: 'us',
						keyword: 'golf',
					},
					apiType: undefined,
				},
			);
			expect(mockedLogEvent).toHaveBeenCalledWith(
				ctx,
				'junglescout.shareOfVoice.get',
				{ marketplace: 'us' },
				'completed',
			);
		});

		it('rejects empty keyword before network call', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const error = await ShareOfVoice.get(ctx, {
				marketplace: 'us',
				keyword: '',
			}).catch((e: unknown) => e);
			expect(error).toBeDefined();
			expect(mockedRequest).not.toHaveBeenCalled();
		});
	});
});
