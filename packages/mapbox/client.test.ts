import { inspect } from 'node:util';
import {
	describeMapboxError,
	formatCoordinate,
	formatCoordinates,
	formatNumber,
	MapboxAPIError,
	makeMapboxRequest,
	segment,
} from './client';
import {
	directionsRoute,
	errorBodies,
	tilequeryBuildings,
} from './test-fixtures';
import type { FetchMock } from './test-harness';
import {
	API_KEY,
	captureError,
	GEO_JSON,
	installFetchMock,
	lastRequest,
	respond,
} from './test-harness';

let fetchMock: FetchMock;

beforeEach(() => {
	fetchMock = installFetchMock();
});

afterEach(() => {
	jest.restoreAllMocks();
});

// unknown: makeMapboxRequest resolves with the raw, unvalidated JSON body.
async function failure(promise: Promise<unknown>): Promise<MapboxAPIError> {
	const error = await captureError(promise);
	expect(error).toBeInstanceOf(MapboxAPIError);
	if (!(error instanceof MapboxAPIError)) throw error;
	return error;
}

/** The token must not survive in any rendering of the error. */
function expectTokenAbsent(error: MapboxAPIError) {
	expect(error.message).not.toContain(API_KEY);
	expect(inspect(error, { depth: 6, showHidden: true })).not.toContain(API_KEY);
	expect(JSON.stringify(error)).not.toContain(API_KEY);
	expect(error.cause).toBeUndefined();
}

describe('makeMapboxRequest', () => {
	it('sends the token as the access_token query parameter and no auth header', async () => {
		respond(fetchMock, tilequeryBuildings);

		const result = await makeMapboxRequest(API_KEY, {
			path: '/v4/mapbox.mapbox-streets-v8/tilequery/2.3522,48.8566.json',
			query: { limit: 2, radius: undefined },
		});

		expect(result).toEqual(tilequeryBuildings);
		const { url, init, query, headers } = lastRequest(fetchMock);
		expect(init.method).toBe('GET');
		expect(url.startsWith('https://api.mapbox.com/v4/')).toBe(true);
		expect(Object.fromEntries(query)).toEqual({
			limit: '2',
			access_token: API_KEY,
		});
		expect(headers.get('authorization')).toBeNull();
		expect(headers.get('accept')).toBe('application/json');
	});

	it('lets the token override a caller-supplied access_token', async () => {
		respond(fetchMock, tilequeryBuildings);

		await makeMapboxRequest(API_KEY, {
			path: '/v4/x.y/tilequery/0,0.json',
			query: { access_token: 'sk.other' },
		});

		expect(lastRequest(fetchMock).query.getAll('access_token')).toEqual([
			API_KEY,
		]);
	});

	it('parses a geocoding body served as vnd.geo+json, which arrives as text', async () => {
		respond(fetchMock, { type: 'FeatureCollection', features: [] }, 200, {
			contentType: GEO_JSON,
		});

		const result = await makeMapboxRequest(API_KEY, {
			path: '/search/geocode/v6/forward',
			query: { q: 'x' },
		});

		expect(result).toEqual({ type: 'FeatureCollection', features: [] });
	});

	it('throws on a 200 body that is not JSON', async () => {
		respond(fetchMock, '<html>oops</html>', 200, { contentType: GEO_JSON });

		const error = await failure(
			makeMapboxRequest(API_KEY, { path: '/search/geocode/v6/forward' }),
		);

		expect(error.message).toMatch(/not JSON/);
		expectTokenAbsent(error);
	});

	it('throws on an empty 200 rather than returning undefined', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

		const error = await failure(
			makeMapboxRequest(API_KEY, { path: '/search/geocode/v6/forward' }),
		);

		expect(error.message).toMatch(/empty body/);
	});

	it('removes the token from a response body that echoes it', async () => {
		respond(fetchMock, {
			code: 'Ok',
			link: `https://x?access_token=${API_KEY}`,
		});

		const result = await makeMapboxRequest(API_KEY, { path: '/x' });

		expect(JSON.stringify(result)).not.toContain(API_KEY);
	});
});

describe('the navigation envelope', () => {
	it('returns a body whose code is Ok', async () => {
		respond(fetchMock, directionsRoute);

		await expect(
			makeMapboxRequest(API_KEY, { path: '/d', envelope: 'navigation' }),
		).resolves.toEqual(directionsRoute);
	});

	it('throws a 200 NoSegment with its code, and no cause', async () => {
		respond(fetchMock, errorBodies.noSegment);

		const error = await failure(
			makeMapboxRequest(API_KEY, { path: '/d', envelope: 'navigation' }),
		);

		expect(error.code).toBe('NoSegment');
		expect(error.status).toBe(200);
		expect(error.message).toBe(
			'Mapbox NoSegment: Could not find a matching segment for input coordinates',
		);
		expectTokenAbsent(error);
	});

	it('throws a 200 NotImplemented', async () => {
		respond(fetchMock, errorBodies.notImplemented);

		const error = await failure(
			makeMapboxRequest(API_KEY, { path: '/t', envelope: 'navigation' }),
		);

		expect(error.code).toBe('NotImplemented');
	});

	it('does not apply to endpoints without the envelope', async () => {
		respond(fetchMock, { code: 'NoSegment' });

		await expect(makeMapboxRequest(API_KEY, { path: '/i' })).resolves.toEqual({
			code: 'NoSegment',
		});
	});
});

describe('error mapping', () => {
	it('reads geocoding { message, error_code } from a 401', async () => {
		respond(fetchMock, errorBodies.invalidToken, 401);

		const error = await failure(
			makeMapboxRequest(API_KEY, { path: '/search/geocode/v6/forward' }),
		);

		expect(error.status).toBe(401);
		expect(error.code).toBe('INVALID_TOKEN');
		expect(error.method).toBe('GET');
		expect(error.transport).toBe(false);
		expect(error.message).toBe(
			'Mapbox 401 INVALID_TOKEN: Not Authorized - Invalid Token',
		);
	});

	it('appends error_detail when the body has one', async () => {
		respond(fetchMock, errorBodies.invalidTokenPrefix, 401);

		const error = await failure(makeMapboxRequest(API_KEY, { path: '/d' }));

		expect(error.message).toBe(
			'Mapbox 401: Not Authorized - Invalid Token (No valid token prefix found in access_token parameter)',
		);
	});

	it('reads navigation { message, code } from a 422', async () => {
		respond(fetchMock, errorBodies.navigationValidation, 422);

		const error = await failure(makeMapboxRequest(API_KEY, { path: '/d' }));

		expect(error.status).toBe(422);
		expect(error.code).toBe('InvalidInput');
	});

	it('reads a bare { message } 404 from tilequery', async () => {
		respond(fetchMock, errorBodies.tilequeryNotFound, 404);

		const error = await failure(makeMapboxRequest(API_KEY, { path: '/v4/x' }));

		expect(error.status).toBe(404);
		expect(error.code).toBeUndefined();
		expect(error.message).toContain('does not exist');
	});

	it('reads { code, message } from a 403 forbidden', async () => {
		respond(fetchMock, errorBodies.forbidden, 403);

		const error = await failure(makeMapboxRequest(API_KEY, { path: '/o' }));

		expect(error.status).toBe(403);
		expect(error.code).toBe('forbidden');
	});

	it('does not echo an HTML or empty error body', async () => {
		respond(fetchMock, '<HTML>403 ERROR</HTML>', 403, {
			contentType: 'text/html',
		});
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 404 }));

		const html = await failure(makeMapboxRequest(API_KEY, { path: '/p' }));
		const empty = await failure(makeMapboxRequest(API_KEY, { path: '/p' }));

		expect(html.message).toBe('Mapbox 403: request failed');
		expect(empty.message).toBe('Mapbox 404: request failed');
		expect(html.code).toBeUndefined();
	});

	it('never carries the token on an error with the token in its request', async () => {
		respond(fetchMock, errorBodies.invalidToken, 401);

		const error = await failure(
			makeMapboxRequest(API_KEY, { path: '/search/geocode/v6/forward' }),
		);

		expectTokenAbsent(error);
		// The fields a handler needs are copied, nothing else is.
		expect(Object.keys(error).sort()).toEqual(
			['code', 'method', 'name', 'retryAfter', 'status', 'transport'].sort(),
		);
	});

	it('scrubs a token that a message echoes', () => {
		const described = describeMapboxError(
			401,
			{ message: `Bad token ${API_KEY}`, code: 'X' },
			API_KEY,
		);

		expect(described.message).toBe('Mapbox 401 X: Bad token [REDACTED]');
	});

	it('copies Retry-After on a 429 as milliseconds', async () => {
		respond(fetchMock, errorBodies.rateLimited, 429, {
			headers: { 'Retry-After': '7' },
		});

		const error = await failure(makeMapboxRequest(API_KEY, { path: '/m' }));

		expect(error.status).toBe(429);
		expect(error.isRateLimit).toBe(true);
		expect(error.retryAfter).toBe(7000);
	});

	it('derives the wait from x-rate-limit-reset, a Unix timestamp in seconds', async () => {
		jest.spyOn(Date, 'now').mockReturnValue(1_800_000_000_000);
		respond(fetchMock, errorBodies.rateLimited, 429, {
			headers: { 'x-rate-limit-reset': '1800000012' },
		});

		const error = await failure(makeMapboxRequest(API_KEY, { path: '/m' }));

		expect(error.retryAfter).toBe(12_000);
	});

	it('leaves retryAfter unset when a 429 has no timing header', async () => {
		respond(fetchMock, errorBodies.rateLimited, 429);

		const error = await failure(makeMapboxRequest(API_KEY, { path: '/m' }));

		expect(error.isRateLimit).toBe(true);
		expect(error.retryAfter).toBeUndefined();
	});

	it('flags a dropped connection as transport and keeps the token out of it', async () => {
		fetchMock.mockRejectedValueOnce(
			Object.assign(new TypeError(`fetch failed for ${API_KEY}`), {
				cause: { code: 'ECONNRESET' },
			}),
		);

		const error = await failure(makeMapboxRequest(API_KEY, { path: '/m' }));

		expect(error.transport).toBe(true);
		expect(error.status).toBeUndefined();
		expect(error.method).toBe('GET');
		expect(error.message).toBe(
			'Mapbox request failed: fetch failed for [REDACTED] (ECONNRESET)',
		);
		expectTokenAbsent(error);
	});

	it('flags a timeout as transport', async () => {
		fetchMock.mockRejectedValueOnce(
			new DOMException('The operation timed out', 'TimeoutError'),
		);

		const error = await failure(makeMapboxRequest(API_KEY, { path: '/m' }));

		expect(error.transport).toBe(true);
	});
});

describe('describeMapboxError', () => {
	it('falls back when the body is not an object', () => {
		expect(describeMapboxError(500, undefined, API_KEY)).toEqual({
			message: 'Mapbox 500: request failed',
			code: undefined,
		});
		expect(describeMapboxError(500, 'text', API_KEY).message).toBe(
			'Mapbox 500: request failed',
		);
	});
});

describe('coordinate formatting', () => {
	it('puts longitude first', () => {
		expect(formatCoordinate({ longitude: 2.35, latitude: 48.85 })).toBe(
			'2.35,48.85',
		);
		expect(formatCoordinate({ longitude: -122.4, latitude: 37.8 })).toBe(
			'-122.4,37.8',
		);
	});

	it('joins pairs with a semicolon in the order given', () => {
		expect(
			formatCoordinates([
				{ longitude: 1, latitude: 2 },
				{ longitude: 3, latitude: 4 },
			]),
		).toBe('1,2;3,4');
	});

	it('avoids exponent notation for tiny values', () => {
		expect(formatNumber(1e-7)).toBe('0.0000001');
		expect(formatNumber(-2.5e-8)).toBe('-0.000000025');
		expect(formatNumber(0.000001)).toBe('0.000001');
		expect(formatNumber(48.8566)).toBe('48.8566');
		expect(formatNumber(0)).toBe('0');
	});

	it('percent-encodes a path segment', () => {
		expect(segment('a b/c')).toBe('a%20b%2Fc');
	});
});
