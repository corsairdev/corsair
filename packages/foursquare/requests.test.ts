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

	it('passes a cursor through to continue a search', async () => {
		mockFetch(jsonResponse(searchResponse));

		await endpoints.places.search(makeCtx(), {
			near: 'Chicago, IL',
			cursor: 'c3I6Mw',
		});

		expect(queryParam('cursor')).toBe('c3I6Mw');
	});

	it('returns nextCursor from the link response header', async () => {
		mockFetch(
			jsonResponse(searchResponse, {
				headers: {
					'Content-Type': 'application/json',
					link: '<https://places-api.foursquare.com/places/search?limit=3&near=Chicago%2CIL&cursor=c3I6Mw>; rel="next"',
				},
			}),
		);

		const result = await endpoints.places.search(makeCtx(), {
			near: 'Chicago, IL',
			limit: 3,
		});

		expect(result.nextCursor).toBe('c3I6Mw');
	});

	it('returns no nextCursor on the last page', async () => {
		mockFetch(jsonResponse(searchResponse));

		const result = await endpoints.places.search(makeCtx(), {
			near: 'Chicago, IL',
		});

		expect(result.nextCursor).toBeUndefined();
	});

	it('omits the cursor on a first page', async () => {
		mockFetch(jsonResponse(searchResponse));

		await endpoints.places.search(makeCtx(), { near: 'Chicago, IL' });

		expect(queryParam('cursor')).toBeNull();
	});

	it('adds the place id to a fields selection', async () => {
		mockFetch(jsonResponse(searchResponse));

		await endpoints.places.search(makeCtx(), {
			near: 'Chicago, IL',
			fields: ['name'],
		});

		// Verified live: `fields=name` alone answers `{"results":[{"name":...}]}`
		// with no fsq_place_id, which the output schema requires.
		expect(queryParam('fields')).toBe('name,fsq_place_id');
	});

	it('does not duplicate an id the caller already asked for', async () => {
		mockFetch(jsonResponse(placeDetail));

		await endpoints.places.get(makeCtx(), {
			fsq_place_id: PLACE_ID,
			fields: ['fsq_place_id', 'name'],
		});

		expect(queryParam('fields')).toBe('fsq_place_id,name');
	});

	it('sends no fields parameter when the caller sets none', async () => {
		mockFetch(jsonResponse(placeDetail));

		await endpoints.places.get(makeCtx(), { fsq_place_id: PLACE_ID });

		// Omitting it is what asks Foursquare for every Pro field.
		expect(queryParam('fields')).toBeNull();
	});

	it('adds the tip id to a tips fields selection', async () => {
		mockFetch(jsonResponse(tipsResponse));

		await endpoints.places.tips(makeCtx(), {
			fsq_place_id: PLACE_ID,
			fields: ['text'],
		});

		expect(queryParam('fields')).toBe('text,fsq_tip_id');
	});

	it('rejects a country code that is not two characters', async () => {
		// Foursquare requires a 2-letter code; `USA` reaches the API and fails.
		const match = FoursquareEndpointInputSchemas.placesMatch;
		const base = {
			name: 'Wrigley Field',
			address: '1060 W Addison St',
			city: 'Chicago',
		};
		expect(match.safeParse({ ...base, cc: 'US' }).success).toBe(true);
		expect(match.safeParse({ ...base, cc: '' }).success).toBe(false);
		expect(match.safeParse({ ...base, cc: 'USA' }).success).toBe(false);
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
