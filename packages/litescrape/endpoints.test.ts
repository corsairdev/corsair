import { AuthMissingError, logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	AppleAppStore,
	AppleMaps,
	Bing,
	Duckduckgo,
	Google,
	GoogleMaps,
	GooglePlay,
	Keys,
	Tripadvisor,
	Web,
	Yelp,
} from './endpoints';
import type { LitescrapeContext, LitescrapePluginOptions } from './index';
import { litescrape, litescrapeEndpointSchemas } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeLitescrapeRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeLitescrapeRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

type Ctx = Parameters<typeof Google.search>[0];

function buildCtx(): Ctx {
	const ctx: LitescrapeContext = {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-api-key',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-api-key'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
	return ctx;
}

const ctx = buildCtx();

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLogEvent.mockReset();
});

// Fixtures below mirror the request parameter groups and response groups
// published at https://litescrape.com/docs/reference and each endpoint page
// linked from https://litescrape.com/docs.

describe('google.search', () => {
	const response = {
		search_metadata: { id: 'm1', status: 'Success' },
		organic_results: [
			{ position: 1, title: 'Coffee A', link: 'https://a.example' },
			{ position: 2, title: 'Coffee B', link: 'https://b.example' },
		],
	};

	it('sends the query and returns the parsed response', async () => {
		mockedRequest.mockResolvedValue(response);

		const result = await Google.search(ctx, { q: 'coffee' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/google/search',
			'test-api-key',
			{ method: 'GET', query: { q: 'coffee' } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.google.search',
			{ resultCount: 2 },
			'completed',
		);
	});

	it('never logs the raw query', async () => {
		mockedRequest.mockResolvedValue(response);

		await Google.search(ctx, { q: 'sensitive search term' });

		const payload = mockedLogEvent.mock.calls[0]?.[2];
		expect(JSON.stringify(payload)).not.toContain('sensitive search term');
	});

	it('rejects a request with no query, ludocid or kgmid', async () => {
		await expect(Google.search(ctx, {})).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
		expect(mockedLogEvent).not.toHaveBeenCalled();
	});
});

describe('google.aiOverview', () => {
	it('returns the AI Overview text blocks', async () => {
		const response = {
			ai_overview: {
				text_blocks: [{ type: 'paragraph', text: 'x' }],
				references: [{ title: 'r', link: 'https://r.example' }],
			},
		};
		mockedRequest.mockResolvedValue(response);

		const result = await Google.aiOverview(ctx, { q: 'coffee' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/google/ai-overview',
			'test-api-key',
			{ method: 'GET', query: { q: 'coffee' } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.google.aiOverview',
			{ hasOverview: true },
			'completed',
		);
	});

	it('rejects a request without a query', async () => {
		await expect(Google.aiOverview(ctx, {})).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('google.aiMode', () => {
	it('returns the AI Mode text blocks', async () => {
		const response = {
			text_blocks: [{ type: 'paragraph', text: 'x' }],
			references: [{ title: 'r', link: 'https://r.example' }],
		};
		mockedRequest.mockResolvedValue(response);

		const result = await Google.aiMode(ctx, { q: 'what is coffee' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/google/ai-mode',
			'test-api-key',
			{ method: 'GET', query: { q: 'what is coffee' } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.google.aiMode',
			{ textBlockCount: 1 },
			'completed',
		);
	});

	it('rejects an empty question', async () => {
		await expect(Google.aiMode(ctx, { q: '' })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('google.ads', () => {
	it('sends the query and named location', async () => {
		const response = {
			ads: [{ position: 1, title: 'Ad', link: 'https://ad.example' }],
		};
		mockedRequest.mockResolvedValue(response);

		const result = await Google.ads(ctx, { q: 'coffee', location: 'London' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/google/ads',
			'test-api-key',
			{
				method: 'GET',
				query: { q: 'coffee', location: 'London' },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.google.ads',
			{ adCount: 1 },
			'completed',
		);
	});

	it('rejects an empty named location', async () => {
		await expect(
			Google.ads(ctx, { q: 'coffee', location: '' }),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('google.local', () => {
	it('returns local results', async () => {
		const response = {
			local_results: [{ position: 1, title: 'Cafe', place_id: 'p1' }],
		};
		mockedRequest.mockResolvedValue(response);

		const result = await Google.local(ctx, { q: 'coffee' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/google/local',
			'test-api-key',
			{ method: 'GET', query: { q: 'coffee' } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.google.local',
			{ resultCount: 1 },
			'completed',
		);
	});

	it('rejects an empty query', async () => {
		await expect(Google.local(ctx, { q: '' })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('google.shopping', () => {
	it('returns shopping results', async () => {
		const response = {
			shopping_results: [{ position: 1, title: 'Mug', price: '$9' }],
		};
		mockedRequest.mockResolvedValue(response);

		const result = await Google.shopping(ctx, { q: 'coffee' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/google/shopping',
			'test-api-key',
			{ method: 'GET', query: { q: 'coffee' } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.google.shopping',
			{ resultCount: 1 },
			'completed',
		);
	});

	it('rejects an out-of-range page size', async () => {
		await expect(Google.shopping(ctx, { num: 0 })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('google.shoppingProduct', () => {
	it('returns the product offers', async () => {
		const response = {
			offers: [{ title: 'Offer 1' }],
			product_reviews: [{ rating: 5, text: 'good' }],
		};
		mockedRequest.mockResolvedValue(response);

		const result = await Google.shoppingProduct(ctx, {
			q: 'coffee',
			gpcid: 'g1',
		});

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/google/shopping/product',
			'test-api-key',
			{ method: 'GET', query: { q: 'coffee', gpcid: 'g1' } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.google.shoppingProduct',
			{ offerCount: 1 },
			'completed',
		);
	});

	it('rejects an empty query', async () => {
		await expect(Google.shoppingProduct(ctx, { q: '' })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('googleMaps.search', () => {
	it('returns maps places', async () => {
		const response = {
			local_results: [
				{ position: 1, title: 'A' },
				{ position: 2, title: 'B' },
			],
		};
		mockedRequest.mockResolvedValue(response);

		const result = await GoogleMaps.search(ctx, { q: 'coffee' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/google/maps',
			'test-api-key',
			{ method: 'GET', query: { q: 'coffee' } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.googleMaps.search',
			{ resultCount: 2, hasPlace: false },
			'completed',
		);
	});

	it('rejects a request without a place locator', async () => {
		await expect(GoogleMaps.search(ctx, {})).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('googleMaps.reviews', () => {
	it('returns place reviews', async () => {
		const response = {
			place_info: { title: 'A' },
			reviews: [{ rating: 5, text: 'great' }],
		};
		mockedRequest.mockResolvedValue(response);

		const result = await GoogleMaps.reviews(ctx, { place_id: 'p1' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/google/reviews',
			'test-api-key',
			{ method: 'GET', query: { place_id: 'p1' } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.googleMaps.reviews',
			{ reviewCount: 1 },
			'completed',
		);
	});

	it('rejects an out-of-range review count', async () => {
		await expect(
			GoogleMaps.reviews(ctx, { place_id: 'p1', num: 0 }),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('googleMaps.contributorReviews', () => {
	it('returns contributor reviews', async () => {
		const response = {
			contributor: { name: 'Guide' },
			reviews: [{ rating: 4 }],
		};
		mockedRequest.mockResolvedValue(response);

		const result = await GoogleMaps.contributorReviews(ctx, {
			contributor_id: '1234567890',
		});

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/google/contributor-reviews',
			'test-api-key',
			{ method: 'GET', query: { contributor_id: '1234567890' } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.googleMaps.contributorReviews',
			{ reviewCount: 1 },
			'completed',
		);
	});

	it('rejects an empty contributor id', async () => {
		await expect(
			GoogleMaps.contributorReviews(ctx, { contributor_id: '' }),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('googleMaps.popularTimes', () => {
	it('returns the popular times payload', async () => {
		const response = { popular_times: { busy: [] } };
		mockedRequest.mockResolvedValue(response);

		const result = await GoogleMaps.popularTimes(ctx, { place_id: 'p1' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/google/maps/popular-times',
			'test-api-key',
			{ method: 'GET', query: { place_id: 'p1' } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.googleMaps.popularTimes',
			{ hasPopularTimes: true },
			'completed',
		);
	});

	it('rejects an empty place id', async () => {
		await expect(
			GoogleMaps.popularTimes(ctx, { place_id: '' }),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('googleMaps.posts', () => {
	it('returns business posts', async () => {
		const response = { posts: [{ data_id: '0x1' }] };
		mockedRequest.mockResolvedValue(response);

		const result = await GoogleMaps.posts(ctx, { data_id: '0x1' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/google/maps/posts',
			'test-api-key',
			{ method: 'GET', query: { data_id: '0x1' } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.googleMaps.posts',
			{ postCount: 1 },
			'completed',
		);
	});

	it('rejects an empty data id', async () => {
		await expect(GoogleMaps.posts(ctx, { data_id: '' })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('googleMaps.photoMeta', () => {
	it('returns photo metadata', async () => {
		const response = {
			photo: { id: 'p1' },
			place_info: { title: 'A' },
		};
		mockedRequest.mockResolvedValue(response);

		const result = await GoogleMaps.photoMeta(ctx, { data_id: '0x1' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/google/maps/photo-meta',
			'test-api-key',
			{ method: 'GET', query: { data_id: '0x1' } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.googleMaps.photoMeta',
			{ hasPhoto: true },
			'completed',
		);
	});

	it('rejects an empty data id', async () => {
		await expect(GoogleMaps.photoMeta(ctx, { data_id: '' })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('bing.search', () => {
	it('returns Bing organic results', async () => {
		const response = {
			organic_results: [
				{ position: 1, title: 'Bing', link: 'https://b.example' },
			],
		};
		mockedRequest.mockResolvedValue(response);

		const result = await Bing.search(ctx, { q: 'coffee' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/bing/search',
			'test-api-key',
			{
				method: 'GET',
				query: { q: 'coffee' },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.bing.search',
			{ resultCount: 1 },
			'completed',
		);
	});

	it('rejects an empty query', async () => {
		await expect(Bing.search(ctx, { q: '' })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('bing.maps', () => {
	it('returns Bing Maps listings', async () => {
		const response = { local_results: [{ position: 1, title: 'A' }] };
		mockedRequest.mockResolvedValue(response);

		const result = await Bing.maps(ctx, { q: 'coffee' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/bing/maps',
			'test-api-key',
			{
				method: 'GET',
				query: { q: 'coffee' },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.bing.maps',
			{ resultCount: 1, hasPlace: false },
			'completed',
		);
	});

	it('rejects a request without a query or place id', async () => {
		await expect(Bing.maps(ctx, {})).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('duckduckgo.search', () => {
	it('returns DuckDuckGo organic results', async () => {
		const response = { organic_results: [{ position: 1, title: 'DDG' }] };
		mockedRequest.mockResolvedValue(response);

		const result = await Duckduckgo.search(ctx, { q: 'coffee' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/duckduckgo/search',
			'test-api-key',
			{ method: 'GET', query: { q: 'coffee' } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.duckduckgo.search',
			{ resultCount: 1 },
			'completed',
		);
	});

	it('rejects an empty query', async () => {
		await expect(Duckduckgo.search(ctx, { q: '' })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('duckduckgo.maps', () => {
	it('returns DuckDuckGo Maps places', async () => {
		const response = { local_results: [{ position: 1, title: 'A' }] };
		mockedRequest.mockResolvedValue(response);

		const result = await Duckduckgo.maps(ctx, { q: 'coffee' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/duckduckgo/maps',
			'test-api-key',
			{ method: 'GET', query: { q: 'coffee' } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.duckduckgo.maps',
			{ resultCount: 1 },
			'completed',
		);
	});

	it('rejects an empty query', async () => {
		await expect(Duckduckgo.maps(ctx, { q: '' })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('yelp.search', () => {
	it('returns Yelp businesses', async () => {
		const response = { organic_results: [{ position: 1, title: 'Biz' }] };
		mockedRequest.mockResolvedValue(response);

		const result = await Yelp.search(ctx, { find_loc: 'London' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/yelp/search',
			'test-api-key',
			{
				method: 'GET',
				query: { find_loc: 'London' },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.yelp.search',
			{ resultCount: 1 },
			'completed',
		);
	});

	it('rejects an empty location', async () => {
		await expect(Yelp.search(ctx, { find_loc: '' })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('yelp.reviews', () => {
	it('returns Yelp reviews', async () => {
		const response = { reviews: [{ rating: 5, text: 'nice' }] };
		mockedRequest.mockResolvedValue(response);

		const result = await Yelp.reviews(ctx, { place_id: 'biz1' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/yelp/reviews',
			'test-api-key',
			{ method: 'GET', query: { place_id: 'biz1' } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.yelp.reviews',
			{ reviewCount: 1 },
			'completed',
		);
	});

	it('rejects an empty business id', async () => {
		await expect(Yelp.reviews(ctx, { place_id: '' })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('tripadvisor.search', () => {
	it('returns Tripadvisor search results', async () => {
		const response = {
			search_results: [{ place_id: 1, title: 'Hotel' }],
		};
		mockedRequest.mockResolvedValue(response);

		const result = await Tripadvisor.search(ctx, { q: 'hotels' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/tripadvisor/search',
			'test-api-key',
			{ method: 'GET', query: { q: 'hotels' } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.tripadvisor.search',
			{ resultCount: 1 },
			'completed',
		);
	});

	it('rejects an empty query', async () => {
		await expect(Tripadvisor.search(ctx, { q: '' })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('tripadvisor.place', () => {
	it('returns place details', async () => {
		const response = { place_results: { title: 'Hotel' } };
		mockedRequest.mockResolvedValue(response);

		const result = await Tripadvisor.place(ctx, { place_id: 12345 });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/tripadvisor/place',
			'test-api-key',
			{ method: 'GET', query: { place_id: 12345 } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.tripadvisor.place',
			{ hasPlace: true },
			'completed',
		);
	});

	it('rejects a non-positive place id', async () => {
		await expect(Tripadvisor.place(ctx, { place_id: 0 })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('tripadvisor.reviews', () => {
	it('returns place reviews', async () => {
		const response = { reviews: [{ rating: 5, title: 'Great' }] };
		mockedRequest.mockResolvedValue(response);

		const result = await Tripadvisor.reviews(ctx, { place_id: 12345 });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/tripadvisor/reviews',
			'test-api-key',
			{ method: 'GET', query: { place_id: 12345 } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.tripadvisor.reviews',
			{ reviewCount: 1 },
			'completed',
		);
	});

	it('rejects a non-positive place id', async () => {
		await expect(Tripadvisor.reviews(ctx, { place_id: 0 })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('appleMaps.places', () => {
	it('returns Apple Maps places', async () => {
		const response = {
			place_results: [{ title: 'Cafe', place_id: 'p1' }],
		};
		mockedRequest.mockResolvedValue(response);

		const result = await AppleMaps.places(ctx, { muid: '123' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/apple/maps/places',
			'test-api-key',
			{ method: 'GET', query: { muid: '123' } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.appleMaps.places',
			{ placeCount: 1 },
			'completed',
		);
	});

	it('rejects an empty muid', async () => {
		await expect(AppleMaps.places(ctx, { muid: '' })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('appleMaps.reviews', () => {
	it('returns Apple Maps reviews', async () => {
		const response = { reviews: [{ rating: 5, text: 'good' }] };
		mockedRequest.mockResolvedValue(response);

		const result = await AppleMaps.reviews(ctx, { muid: '123' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/apple/maps/reviews',
			'test-api-key',
			{ method: 'GET', query: { muid: '123' } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.appleMaps.reviews',
			{ reviewCount: 1 },
			'completed',
		);
	});

	it('rejects an empty muid', async () => {
		await expect(AppleMaps.reviews(ctx, { muid: '' })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('googlePlay.apps', () => {
	it('returns Google Play app results', async () => {
		const response = { organic_results: [{ position: 1, title: 'App' }] };
		mockedRequest.mockResolvedValue(response);

		const result = await GooglePlay.apps(ctx, { q: 'notes' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/google/play/apps',
			'test-api-key',
			{ method: 'GET', query: { q: 'notes' } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.googlePlay.apps',
			{ resultCount: 1 },
			'completed',
		);
	});

	it('rejects an empty query', async () => {
		await expect(GooglePlay.apps(ctx, { q: '' })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('googlePlay.games', () => {
	it('returns Google Play game results', async () => {
		const response = { organic_results: [{ position: 1, title: 'Game' }] };
		mockedRequest.mockResolvedValue(response);

		const result = await GooglePlay.games(ctx, { q: 'puzzle' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/google/play/games',
			'test-api-key',
			{ method: 'GET', query: { q: 'puzzle' } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.googlePlay.games',
			{ resultCount: 1 },
			'completed',
		);
	});

	it('rejects an empty query', async () => {
		await expect(GooglePlay.games(ctx, { q: '' })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('googlePlay.books', () => {
	it('returns Google Play book results', async () => {
		const response = {
			organic_results: [{ position: 1, title: 'Book', price: '$5' }],
		};
		mockedRequest.mockResolvedValue(response);

		const result = await GooglePlay.books(ctx, { q: 'novel' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/google/play/books',
			'test-api-key',
			{ method: 'GET', query: { q: 'novel' } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.googlePlay.books',
			{ resultCount: 1 },
			'completed',
		);
	});

	it('rejects an empty query', async () => {
		await expect(GooglePlay.books(ctx, { q: '' })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('googlePlay.movies', () => {
	it('returns Google Play movie results', async () => {
		const response = {
			organic_results: [{ position: 1, title: 'Movie', price: '$3' }],
		};
		mockedRequest.mockResolvedValue(response);

		const result = await GooglePlay.movies(ctx, { q: 'film' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/google/play/movies',
			'test-api-key',
			{ method: 'GET', query: { q: 'film' } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.googlePlay.movies',
			{ resultCount: 1 },
			'completed',
		);
	});

	it('rejects an empty query', async () => {
		await expect(GooglePlay.movies(ctx, { q: '' })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('googlePlay.product', () => {
	it('returns the product page payload', async () => {
		const response = {
			product_info: { title: 'App' },
			reviews: [{ rating: 5 }],
		};
		mockedRequest.mockResolvedValue(response);

		const result = await GooglePlay.product(ctx, {
			product_id: 'com.example',
		});

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/google/play/product',
			'test-api-key',
			{ method: 'GET', query: { product_id: 'com.example' } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.googlePlay.product',
			{ reviewCount: 1 },
			'completed',
		);
	});

	it('rejects an empty product id', async () => {
		await expect(GooglePlay.product(ctx, { product_id: '' })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('googlePlay.reviews', () => {
	it('returns Google Play reviews', async () => {
		const response = { reviews: [{ rating: 5, text: 'ok' }] };
		mockedRequest.mockResolvedValue(response);

		const result = await GooglePlay.reviews(ctx, {
			product_id: 'com.example',
		});

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/google/play/reviews',
			'test-api-key',
			{ method: 'GET', query: { product_id: 'com.example' } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.googlePlay.reviews',
			{ reviewCount: 1 },
			'completed',
		);
	});

	it('rejects an empty product id', async () => {
		await expect(GooglePlay.reviews(ctx, { product_id: '' })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('appleAppStore.search', () => {
	it('returns App Store search results', async () => {
		const response = { organic_results: [{ trackName: 'App' }] };
		mockedRequest.mockResolvedValue(response);

		const result = await AppleAppStore.search(ctx, { term: 'notes' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/apple/app-store/search',
			'test-api-key',
			{ method: 'GET', query: { term: 'notes' } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.appleAppStore.search',
			{ resultCount: 1 },
			'completed',
		);
	});

	it('rejects an empty search term', async () => {
		await expect(AppleAppStore.search(ctx, { term: '' })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('appleAppStore.product', () => {
	it('returns the App Store product page payload', async () => {
		const response = { version_history: [{ version: '1.0' }] };
		mockedRequest.mockResolvedValue(response);

		const result = await AppleAppStore.product(ctx, { product_id: '123' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/apple/app-store/product',
			'test-api-key',
			{ method: 'GET', query: { product_id: '123' } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.appleAppStore.product',
			{ versionCount: 1 },
			'completed',
		);
	});

	it('rejects an empty product id', async () => {
		await expect(
			AppleAppStore.product(ctx, { product_id: '' }),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('appleAppStore.reviews', () => {
	it('returns App Store reviews', async () => {
		const response = { reviews: [{ rating: 5, title: 'Nice' }] };
		mockedRequest.mockResolvedValue(response);

		const result = await AppleAppStore.reviews(ctx, { product_id: '123' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/apple/app-store/reviews',
			'test-api-key',
			{ method: 'GET', query: { product_id: '123' } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.appleAppStore.reviews',
			{ reviewCount: 1 },
			'completed',
		);
	});

	it('rejects an empty product id', async () => {
		await expect(
			AppleAppStore.reviews(ctx, { product_id: '' }),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('web.fetch', () => {
	it('returns the rendered document', async () => {
		const response = { url: 'https://example.com', content: 'hello' };
		mockedRequest.mockResolvedValue(response);

		const result = await Web.fetch(ctx, { url: 'https://example.com' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/web/fetch',
			'test-api-key',
			{
				method: 'GET',
				query: { url: 'https://example.com' },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.web.fetch',
			{ contentLength: 5 },
			'completed',
		);
	});

	it('rejects an empty url', async () => {
		await expect(Web.fetch(ctx, { url: '' })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('web.screenshot', () => {
	it('returns the screenshot download url', async () => {
		const response = { screenshot_url: 'https://cdn.example.com/1.png' };
		mockedRequest.mockResolvedValue(response);

		const result = await Web.screenshot(ctx, { url: 'https://example.com' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/web/screenshot',
			'test-api-key',
			{ method: 'GET', query: { url: 'https://example.com' } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.web.screenshot',
			{ hasScreenshot: true },
			'completed',
		);
	});

	it('rejects an empty url', async () => {
		await expect(Web.screenshot(ctx, { url: '' })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('keys.status', () => {
	it('returns the key accounting payload without a query string', async () => {
		const response = {
			remaining_calls: 100,
			concurrency_limit: 5,
			status: 'active',
		};
		mockedRequest.mockResolvedValue(response);

		const result = await Keys.status(ctx, {});

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/keys/status',
			'test-api-key',
			{ method: 'GET' },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.keys.status',
			{},
			'completed',
		);
	});

	it('rejects a response missing the accounting fields', async () => {
		mockedRequest.mockResolvedValue({});

		await expect(Keys.status(ctx, {})).rejects.toThrow();

		expect(mockedLogEvent).not.toHaveBeenCalled();
	});
});

describe('litescrape plugin shape', () => {
	it('exposes every documented endpoint group and operation', () => {
		const plugin = litescrape({});

		expect(plugin.endpoints?.google.search).toBeDefined();
		expect(plugin.endpoints?.googleMaps.search).toBeDefined();
		expect(plugin.endpoints?.bing.search).toBeDefined();
		expect(plugin.endpoints?.duckduckgo.search).toBeDefined();
		expect(plugin.endpoints?.yelp.search).toBeDefined();
		expect(plugin.endpoints?.tripadvisor.search).toBeDefined();
		expect(plugin.endpoints?.appleMaps.places).toBeDefined();
		expect(plugin.endpoints?.googlePlay.apps).toBeDefined();
		expect(plugin.endpoints?.appleAppStore.search).toBeDefined();
		expect(plugin.endpoints?.web.fetch).toBeDefined();
		expect(plugin.endpoints?.keys.status).toBeDefined();
	});

	it('uses api_key auth and declares no webhooks', () => {
		const plugin = litescrape({ authType: 'api_key' });

		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({ api_key: {} });
		expect(plugin.webhooks).toEqual({});
	});

	it('wires zod input and output schemas for every endpoint', () => {
		const entries = Object.values(litescrapeEndpointSchemas);
		expect(entries).toHaveLength(36);

		for (const entry of entries) {
			expect(entry.input).toBeDefined();
			expect(entry.output).toBeDefined();
		}
	});
});

function keyManager(getApiKey: () => Promise<string | null>) {
	return {
		get_dek: () => Promise.resolve('test-dek'),
		issue_new_dek: () => Promise.resolve('test-dek'),
		get_api_key: getApiKey,
		set_api_key: () => Promise.resolve(),
		get_webhook_signature: () => Promise.resolve(null),
		set_webhook_signature: () => Promise.resolve(),
	};
}

describe('litescrape keyBuilder', () => {
	const plugin = litescrape({ authType: 'api_key' });
	type KeyCtx = Parameters<NonNullable<typeof plugin.keyBuilder>>[0];

	function keyCtx(getApiKey: () => Promise<string | null>): KeyCtx {
		return {
			authType: 'api_key',
			tenantId: 'default',
			options: { authType: 'api_key' },
			keys: keyManager(getApiKey),
		};
	}

	it('returns the stored key from the key manager', async () => {
		const result = plugin.keyBuilder?.(
			keyCtx(() => Promise.resolve('ls_live_stored')),
			'endpoint',
		);

		await expect(Promise.resolve(result)).resolves.toBe('ls_live_stored');
	});

	it('throws AuthMissingError when no key is stored', async () => {
		const result = plugin.keyBuilder?.(
			keyCtx(() => Promise.resolve(null)),
			'endpoint',
		);

		await expect(Promise.resolve(result)).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('prefers the configured option key over the key manager', async () => {
		const withOptionKey = litescrape({
			authType: 'api_key',
			key: 'ls_live_option',
		});
		const ctx2: Parameters<NonNullable<typeof withOptionKey.keyBuilder>>[0] = {
			authType: 'api_key',
			tenantId: 'default',
			options: { authType: 'api_key', key: 'ls_live_option' },
			keys: keyManager(() => Promise.resolve('ls_live_stored')),
		};

		const result = withOptionKey.keyBuilder?.(ctx2, 'endpoint');

		await expect(Promise.resolve(result)).resolves.toBe('ls_live_option');
	});

	it('throws AuthMissingError for an empty stored key instead of returning it', async () => {
		const result = plugin.keyBuilder?.(
			keyCtx(() => Promise.resolve('')),
			'endpoint',
		);

		await expect(Promise.resolve(result)).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});
});

describe('litescrape custom error handlers', () => {
	it('evaluates caller-provided handlers before the catch-all DEFAULT', () => {
		const plugin = litescrape<LitescrapePluginOptions>({
			authType: 'api_key',
			errorHandlers: {
				CUSTOM_ERROR: {
					match: () => true,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});

		const names = Object.keys(plugin.errorHandlers ?? {});
		expect(names).toContain('CUSTOM_ERROR');
		// Core selects the first handler whose matcher accepts the error and
		// DEFAULT matches everything, so a custom handler is only reachable
		// when DEFAULT is evaluated last.
		expect(names[names.length - 1]).toBe('DEFAULT');
		expect(names.indexOf('CUSTOM_ERROR')).toBeLessThan(
			names.indexOf('DEFAULT'),
		);
	});

	it('keeps a caller override of DEFAULT in the last position', () => {
		const override = {
			match: () => true,
			handler: async () => ({ maxRetries: 7 }),
		};
		const plugin = litescrape<LitescrapePluginOptions>({
			authType: 'api_key',
			errorHandlers: { DEFAULT: override },
		});

		expect(plugin.errorHandlers?.DEFAULT).toBe(override);
		const names = Object.keys(plugin.errorHandlers ?? {});
		expect(names[names.length - 1]).toBe('DEFAULT');
	});
});
