jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import { FoursquareAPIError } from './client';
import { errorHandlers } from './error-handlers';
import {
	autocompleteResponse,
	creditsExhaustedBody,
	matchResponse,
	notFoundBody,
	photosResponse,
	placeDetail,
	searchResponse,
	serverErrorBody,
	tipsResponse,
} from './test-fixtures';
import {
	endpoints,
	installFetchMock,
	jsonResponse,
	makeCtx,
	mockFetch,
	restoreFetchMock,
} from './test-helpers';

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

const PLACE_ID = '4af4398ff964a520b4f021e3';

describe('Foursquare output parsing', () => {
	it('parses a search page with its context', async () => {
		mockFetch(jsonResponse(searchResponse));

		const result = await endpoints.places.search(makeCtx(), {
			near: 'Chicago, IL',
		});

		expect(result.results).toHaveLength(1);
		// The docs' schema omits `context`; the live response carries it.
		expect(result.context).toBeDefined();
	});

	it('parses the nested location and categories', async () => {
		mockFetch(jsonResponse(searchResponse));

		const result = await endpoints.places.search(makeCtx(), {
			near: 'Chicago, IL',
		});
		const place = result.results[0]!;

		expect(place.name).toBe('Cafe Jumping Bean');
		expect(place.location?.locality).toBe('Chicago');
		expect(place.categories?.[0]?.name).toBe('Coffee Shop');
		expect(place.categories?.[0]?.icon?.prefix).toContain('4sqi.net');
	});

	it('keeps distance and coordinates numeric', async () => {
		mockFetch(jsonResponse(searchResponse));

		const result = await endpoints.places.search(makeCtx(), {
			near: 'Chicago, IL',
		});
		const place = result.results[0]!;

		expect(typeof place.distance).toBe('number');
		expect(typeof place.latitude).toBe('number');
		expect(typeof place.longitude).toBe('number');
	});

	it('parses extended_location, which the docs schema omits', async () => {
		mockFetch(jsonResponse(placeDetail));

		const result = await endpoints.places.get(makeCtx(), {
			fsq_place_id: PLACE_ID,
		});

		expect(result.extended_location?.dma).toBe('Chicago');
	});

	it('parses related_places as an empty object', async () => {
		// The live response sends `{}` here, not null, so the schema must accept it.
		mockFetch(jsonResponse(placeDetail));

		const result = await endpoints.places.get(makeCtx(), {
			fsq_place_id: PLACE_ID,
		});

		expect(result.related_places).toEqual({});
	});

	it('parses autocomplete text as an object and nests the place', async () => {
		mockFetch(jsonResponse(autocompleteResponse));

		const result = await endpoints.places.autocomplete(makeCtx(), {
			query: 'sta',
		});

		expect(result.results.length).toBeGreaterThan(0);
		const first = result.results[0]!;
		expect(first.type).toBe('place');
		// Verified live: `text` is `{ primary, secondary, highlight[] }`, not a string.
		expect(typeof first.text?.primary).toBe('string');
		expect(Array.isArray(first.text?.highlight)).toBe(true);
		expect(first.place?.fsq_place_id).toBeDefined();
	});

	it('wraps a bare tips array', async () => {
		mockFetch(jsonResponse(tipsResponse));

		const result = await endpoints.places.tips(makeCtx(), {
			fsq_place_id: PLACE_ID,
		});

		expect(result.tips[0]?.fsq_tip_id).toBe('5a1b2c3d4e5f6a7b8c9d0e1f');
		expect(result.tips[0]?.agree_count).toBe(12);
	});

	it('wraps a bare photos array', async () => {
		mockFetch(jsonResponse(photosResponse));

		const result = await endpoints.places.photos(makeCtx(), {
			fsq_place_id: PLACE_ID,
		});

		// Assemble an image URL from prefix + size + suffix, as the docs describe.
		const photo = result.photos[0]!;
		expect(`${photo.prefix}512${photo.suffix}`).toContain('.jpg');
	});

	it('parses a match with its score', async () => {
		mockFetch(jsonResponse(matchResponse));

		const result = await endpoints.places.match(makeCtx(), {
			name: 'Wrigley Field',
			address: '1060 W Addison St',
			city: 'Chicago',
			cc: 'US',
		});

		expect(result.match_score).toBe(0.98);
		expect(result.place?.fsq_place_id).toBe(PLACE_ID);
	});
});

describe('Foursquare shape rejections', () => {
	it('rejects a search body with no results array', async () => {
		mockFetch(jsonResponse({ context: {} }));

		await expect(
			endpoints.places.search(makeCtx(), { near: 'Chicago, IL' }),
		).rejects.toThrow();
	});

	it('rejects a place with a stringified latitude', async () => {
		mockFetch(jsonResponse({ ...placeDetail, latitude: '41.857846248228036' }));

		await expect(
			endpoints.places.get(makeCtx(), { fsq_place_id: PLACE_ID }),
		).rejects.toThrow();
	});

	it('rejects an autocomplete text that is a bare string', async () => {
		// The pre-probe schema allowed this; the real shape is an object.
		mockFetch(
			jsonResponse({
				results: [{ type: 'place', text: 'Star Planet', place: null }],
			}),
		);

		await expect(
			endpoints.places.autocomplete(makeCtx(), { query: 'sta' }),
		).rejects.toThrow();
	});

	it('rejects a tips answer that is not an array', async () => {
		mockFetch(jsonResponse({ tips: [] }));

		await expect(
			endpoints.places.tips(makeCtx(), { fsq_place_id: PLACE_ID }),
		).rejects.toThrow(/unexpected tips body/);
	});

	it('rejects a photos answer that is not an array', async () => {
		mockFetch(jsonResponse({ photos: [] }));

		await expect(
			endpoints.places.photos(makeCtx(), { fsq_place_id: PLACE_ID }),
		).rejects.toThrow(/unexpected photos body/);
	});
});

describe('Foursquare error surfaces', () => {
	it('surfaces a 404 with the endpoint name', async () => {
		mockFetch(jsonResponse(notFoundBody, { status: 404 }));

		await expect(
			endpoints.places.get(makeCtx(), { fsq_place_id: 'doesnotexist' }),
		).rejects.toThrow(/not found/);
	});

	it('surfaces a 500 whose body uses errors, not message', async () => {
		mockFetch(jsonResponse(serverErrorBody, { status: 500 }));

		await expect(
			endpoints.places.match(makeCtx(), {
				name: 'Wrigley Field',
				address: '1060 W Addison St',
				city: 'Chicago',
				cc: 'US',
			}),
		).rejects.toThrow(/internal server error/);
	});

	it('surfaces exhausted credits from the 429 body', async () => {
		mockFetch(jsonResponse(creditsExhaustedBody, { status: 429 }));

		await expect(
			endpoints.places.tips(makeCtx(), { fsq_place_id: PLACE_ID }),
		).rejects.toThrow(/no API credits/);
	});

	it('keeps the status of a search error whose body cannot be read', async () => {
		// A connection that drops after the headers arrive: the status is known,
		// the body is not.
		mockFetch({
			ok: false,
			status: 503,
			statusText: 'Service Unavailable',
			headers: new Headers({ 'retry-after': '2' }),
			text: () => Promise.reject(new TypeError('terminated')),
		} as unknown as Response);

		const error = await endpoints.places
			.search(makeCtx(), { near: 'Chicago, IL' })
			.catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(FoursquareAPIError);
		expect((error as FoursquareAPIError).status).toBe(503);
		expect((error as FoursquareAPIError).retryAfter).toBe(2000);
		// The handler that replays a 5xx has to recognise it.
		expect(errorHandlers.SERVER_ERROR.match(error as Error)).toBe(true);
	});

	it('normalises a search body that fails to read on a 200', async () => {
		mockFetch({
			ok: true,
			status: 200,
			statusText: 'OK',
			headers: new Headers(),
			text: () => Promise.reject(new TypeError('terminated')),
		} as unknown as Response);

		const error = await endpoints.places
			.search(makeCtx(), { near: 'Chicago, IL' })
			.catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(FoursquareAPIError);
		expect((error as FoursquareAPIError).message).toMatch(/terminated/);
	});

	it('surfaces the version error when the header is rejected', async () => {
		mockFetch(
			jsonResponse(
				{ message: 'Please provide a valid version.' },
				{ status: 400 },
			),
		);

		await expect(
			endpoints.places.search(makeCtx(), { near: 'Chicago, IL' }),
		).rejects.toThrow(/valid version/);
	});
});
