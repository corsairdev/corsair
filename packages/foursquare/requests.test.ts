jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import { FoursquareEndpointInputSchemas } from './endpoints/types';
import {
	autocompleteResponse,
	matchResponse,
	photosResponse,
	placeDetail,
	searchResponse,
	tipsResponse,
} from './test-fixtures';
import {
	BASE,
	endpoints,
	installFetchMock,
	jsonResponse,
	lastCall,
	makeCtx,
	mockFetch,
	queryParam,
	restoreFetchMock,
	sentHeader,
} from './test-helpers';

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

const PLACE_ID = '4af4398ff964a520b4f021e3';

describe('Foursquare request shapes', () => {
	it('sends both mandatory headers', async () => {
		mockFetch(jsonResponse(searchResponse));

		await endpoints.places.search(makeCtx(), { near: 'Chicago, IL' });

		// The key as a Bearer token.
		expect(sentHeader('Authorization')).toBe('Bearer test-key');
		// Without this the API answers 400 "Please provide a valid version." even
		// with a valid key, so it is load-bearing on every request.
		expect(sentHeader('X-Places-Api-Version')).toBe('2025-06-17');
	});

	it('hits places-api.foursquare.com, not api.foursquare.com', async () => {
		mockFetch(jsonResponse(searchResponse));

		await endpoints.places.search(makeCtx(), { near: 'Chicago, IL' });

		expect(lastCall().url.startsWith(`${BASE}/places/search`)).toBe(true);
		// A naive `not.toContain('api.foursquare.com')` passes for the wrong
		// reason here: `places-api.foursquare.com` contains it as a substring.
		expect(new URL(lastCall().url).host).toBe('places-api.foursquare.com');
	});

	it('searches with a text query and a location', async () => {
		mockFetch(jsonResponse(searchResponse));

		await endpoints.places.search(makeCtx(), {
			query: 'coffee',
			near: 'Chicago, IL',
			limit: 10,
		});

		expect(lastCall().init.method).toBe('GET');
		expect(queryParam('query')).toBe('coffee');
		expect(queryParam('near')).toBe('Chicago, IL');
		expect(queryParam('limit')).toBe('10');
	});

	it('comma-joins the array filters', async () => {
		mockFetch(jsonResponse(searchResponse));

		await endpoints.places.search(makeCtx(), {
			ll: '41.8781,-87.6298',
			fsq_category_ids: [
				'4bf58dd8d48988d1e0931735',
				'4bf58dd8d48988d16d941735',
			],
			fields: ['fsq_place_id', 'name', 'location'],
		});

		// Foursquare documents a comma-separated string, not repeated params.
		expect(queryParam('fsq_category_ids')).toBe(
			'4bf58dd8d48988d1e0931735,4bf58dd8d48988d16d941735',
		);
		expect(queryParam('fields')).toBe('fsq_place_id,name,location');
	});

	it('omits unset filters rather than sending empty values', async () => {
		mockFetch(jsonResponse(searchResponse));

		await endpoints.places.search(makeCtx(), { near: 'Chicago, IL' });

		expect(queryParam('query')).toBeNull();
		expect(queryParam('fields')).toBeNull();
		expect(queryParam('fsq_category_ids')).toBeNull();
		expect(queryParam('open_now')).toBeNull();
	});

	it('sends open_now and the price bounds when set', async () => {
		mockFetch(jsonResponse(searchResponse));

		await endpoints.places.search(makeCtx(), {
			near: 'Chicago, IL',
			open_now: true,
			min_price: 1,
			max_price: 3,
			sort: 'DISTANCE',
		});

		expect(queryParam('open_now')).toBe('true');
		expect(queryParam('min_price')).toBe('1');
		expect(queryParam('max_price')).toBe('3');
		expect(queryParam('sort')).toBe('DISTANCE');
	});

	it('reads one place by id in the path', async () => {
		mockFetch(jsonResponse(placeDetail));

		await endpoints.places.get(makeCtx(), { fsq_place_id: PLACE_ID });

		expect(lastCall().url).toBe(`${BASE}/places/${PLACE_ID}`);
	});

	it('encodes a place id used in the path', async () => {
		mockFetch(jsonResponse(placeDetail));

		await endpoints.places.get(makeCtx(), { fsq_place_id: 'a/b c' });

		expect(lastCall().url).toBe(`${BASE}/places/a%2Fb%20c`);
	});

	it('autocompletes with a query and location', async () => {
		mockFetch(jsonResponse(autocompleteResponse));

		await endpoints.places.autocomplete(makeCtx(), {
			query: 'sta',
			ll: '41.8781,-87.6298',
		});

		expect(queryParam('query')).toBe('sta');
		// Autocomplete has no `near` parameter; only `ll` biases a location.
		expect(queryParam('ll')).toBe('41.8781,-87.6298');
	});

	it('rejects an autocomplete query under 3 characters before sending', async () => {
		await expect(
			endpoints.places.autocomplete(makeCtx(), { query: 'st' }),
		).rejects.toThrow();
	});

	it('lists tips', async () => {
		mockFetch(jsonResponse(tipsResponse));

		const result = await endpoints.places.tips(makeCtx(), {
			fsq_place_id: PLACE_ID,
			sort: 'POPULAR',
		});

		expect(lastCall().url.startsWith(`${BASE}/places/${PLACE_ID}/tips`)).toBe(
			true,
		);
		expect(queryParam('sort')).toBe('POPULAR');
		expect(result.tips).toHaveLength(1);
	});

	it('lists photos', async () => {
		mockFetch(jsonResponse(photosResponse));

		const result = await endpoints.places.photos(makeCtx(), {
			fsq_place_id: PLACE_ID,
		});

		expect(lastCall().url.startsWith(`${BASE}/places/${PLACE_ID}/photos`)).toBe(
			true,
		);
		expect(result.photos).toHaveLength(1);
	});

	it('matches a place with the four required fields', async () => {
		mockFetch(jsonResponse(matchResponse));

		await endpoints.places.match(makeCtx(), {
			name: 'Wrigley Field',
			address: '1060 W Addison St',
			city: 'Chicago',
			cc: 'US',
		});

		expect(lastCall().url.startsWith(`${BASE}/places/match`)).toBe(true);
		expect(queryParam('name')).toBe('Wrigley Field');
		expect(queryParam('address')).toBe('1060 W Addison St');
		expect(queryParam('city')).toBe('Chicago');
		expect(queryParam('cc')).toBe('US');
	});

	it('rejects a match missing the country code, before sending', async () => {
		// `cc` is required by the API and only English (US) is supported, so a
		// request without it costs a call and fails. The type system already
		// forbids it, and the input schema rejects it at runtime for a JS caller.
		const match = {
			name: 'Wrigley Field',
			address: '1060 W Addison St',
			city: 'Chicago',
		};
		const parsed = FoursquareEndpointInputSchemas.placesMatch.safeParse(match);

		expect(parsed.success).toBe(false);
	});
});
