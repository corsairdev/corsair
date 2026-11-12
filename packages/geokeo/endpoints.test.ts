import { logEventFromContext } from 'corsair/core';
import { GeokeoAPIError } from './client';
import { forwardGeocode, reverseGeocode } from './endpoints';
import {
	accessDenied,
	brokenCoordinate,
	distanceWithoutUnit,
	empireState,
	invalidRequest,
	overQueryLimit,
	reverseResult,
	zeroResults,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'geokeo-api-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type, so
// the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context carries what the endpoints read: the option key, and the
	// stored key behind it.
	const ctx = {
		key: API_KEY,
		options: {},
		keys: { get_api_key: jest.fn().mockResolvedValue(API_KEY) },
	};
	return endpoint(ctx as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
	};
}

/**
 * Runs a call that must fail and returns what it threw.
 */
// unknown: the rejection value is untyped by definition.
async function failure(run: Promise<unknown>): Promise<GeokeoAPIError & Error> {
	try {
		await run;
	} catch (error) {
		return error as GeokeoAPIError & Error;
	}
	throw new Error('expected the call to fail, but it resolved');
}

beforeEach(() => {
	jest.clearAllMocks();
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('Geokeo client', () => {
	it('sends the key as the api query parameter, not api_key', async () => {
		respond(empireState);
		await invoke(forwardGeocode, { q: 'empire state building' });

		const sent = lastRequest();
		expect(sent.origin).toBe('https://geokeo.com');
		expect(sent.path).toBe('/geocode/v1/search.php');
		expect(sent.query.api).toBe(API_KEY);
		expect(sent.query.api_key).toBeUndefined();
	});

	it('throws on ACCESS_DENIED even though the status was 200', async () => {
		respond(accessDenied);
		const error = await failure(invoke(forwardGeocode, { q: 'x' }));

		expect(error).toBeInstanceOf(GeokeoAPIError);
		expect(error.code).toBe('ACCESS_DENIED');
		expect(error.isAuthError).toBe(true);
		expect(error.status).toBeUndefined();
		expect(error.message).toContain('ACCESS_DENIED');
	});

	it('throws on INVALID_REQUEST, which a missing key also produces', async () => {
		respond(invalidRequest);
		const error = await failure(invoke(forwardGeocode, { q: 'x' }));

		expect(error.isValidationError).toBe(true);
		expect(error.isAuthError).toBe(false);
	});

	it('throws on OVER_QUERY_LIMIT', async () => {
		respond(overQueryLimit);
		const error = await failure(invoke(forwardGeocode, { q: 'x' }));

		expect(error.isQuotaError).toBe(true);
	});

	it('returns ZERO_RESULTS rather than throwing, since it is not charged', async () => {
		respond(zeroResults);
		const result = (await invoke(forwardGeocode, {
			q: 'xyzzyplugh',
		})) as typeof zeroResults;

		expect(result.status).toBe('ZERO_RESULTS');
		expect(result.results).toEqual([]);
	});

	it('marks a dropped connection as a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
		const error = await failure(invoke(forwardGeocode, { q: 'x' }));

		expect(error.transport).toBe(true);
	});
});

describe('geokeo.geocode.forward', () => {
	it('returns the coordinates, the components and the OSM class', async () => {
		respond(empireState);
		const result = (await invoke(forwardGeocode, {
			q: 'empire state building',
		})) as typeof empireState;

		expect(result.results[0]?.class).toBe('tourism');
		expect(result.results[0]?.type).toBe('attraction');
		expect(result.results[0]?.address_components.postcode).toBe('10018');
	});

	it('keeps the coordinates as the strings Geokeo sends, and adds numbers', async () => {
		respond(empireState);
		const result = (await invoke(forwardGeocode, {
			q: 'empire state building',
		})) as {
			results: Array<{
				geometry: { location: { lat: string } };
				lat?: number | null;
				lng?: number | null;
			}>;
		};

		// The raw field is untouched, because it is what the API actually said.
		expect(result.results[0]?.geometry.location.lat).toBe('40.74843124430164');
		expect(result.results[0]?.lat).toBeCloseTo(40.7484, 4);
		expect(result.results[0]?.lng).toBeCloseTo(-73.9857, 4);
	});

	it('turns a coordinate that is not a number into null rather than NaN', async () => {
		respond(brokenCoordinate);
		const result = (await invoke(forwardGeocode, { q: 'x' })) as {
			results: Array<{ lat?: number | null; lng?: number | null }>;
		};

		expect(result.results[0]?.lat).toBeNull();
		expect(result.results[0]?.lng).toBeCloseTo(-73.9, 4);
	});

	it('sends the country and format when asked', async () => {
		respond(empireState);
		await invoke(forwardGeocode, {
			q: 'empire state building',
			country: 'us',
			format: 'json',
		});

		expect(lastRequest().query.country).toBe('us');
		expect(lastRequest().query.format).toBe('json');
	});

	it('rejects an empty query before making a request', async () => {
		const error = await failure(invoke(forwardGeocode, { q: '' }));

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a query over the documented 50 character cap', async () => {
		const error = await failure(invoke(forwardGeocode, { q: 'a'.repeat(51) }));

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a country that is not two letters', async () => {
		const error = await failure(
			invoke(forwardGeocode, { q: 'x', country: 'USA' }),
		);

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects xml, which would not parse into these schemas', async () => {
		const error = await failure(
			invoke(forwardGeocode, { q: 'x', format: 'yaml' }),
		);

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('logs the score, not the address', async () => {
		respond(empireState);
		await invoke(forwardGeocode, { q: 'empire state building' });

		const payload = mockLog.mock.calls.at(-1)?.[2];
		expect(payload).toMatchObject({
			count: 1,
			class: 'tourism',
			type: 'attraction',
			country: 'United States Of America',
		});
		expect(JSON.stringify(payload)).not.toContain('Empire');
	});
});

describe('geokeo.geocode.reverse', () => {
	it('sends lat and lng to the reverse route', async () => {
		respond(reverseResult);
		await invoke(reverseGeocode, { lat: 40.74842, lng: -73.9856 });

		const sent = lastRequest();
		expect(sent.path).toBe('/geocode/v1/reverse.php');
		expect(sent.query.lat).toBe('40.74842');
		expect(sent.query.lng).toBe('-73.9856');
	});

	it('keeps the distance string and adds it parsed in kilometres', async () => {
		respond(reverseResult);
		const result = (await invoke(reverseGeocode, {
			lat: 40.74842,
			lng: -73.9856,
		})) as {
			results: Array<{ distance?: string; distance_km?: number | null }>;
		};

		expect(result.results[0]?.distance).toBe('0.0010302984507433km');
		expect(result.results[0]?.distance_km).toBeCloseTo(0.00103, 6);
	});

	it('parses a distance that has no unit suffix', async () => {
		respond(distanceWithoutUnit);
		const result = (await invoke(reverseGeocode, {
			lat: 52.5,
			lng: 13.4,
		})) as { results: Array<{ distance_km?: number | null }> };

		expect(result.results[0]?.distance_km).toBe(1.5);
	});

	it('returns an empty list on ZERO_RESULTS rather than throwing', async () => {
		respond(zeroResults);
		const result = (await invoke(reverseGeocode, {
			lat: 0,
			lng: 0,
		})) as typeof zeroResults;

		expect(result.results).toEqual([]);
	});

	it('rejects a latitude out of range', async () => {
		const error = await failure(invoke(reverseGeocode, { lat: 91, lng: 0 }));

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a longitude out of range', async () => {
		const error = await failure(invoke(reverseGeocode, { lat: 0, lng: 181 }));

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('logs the query coordinates and the nearest distance', async () => {
		respond(reverseResult);
		await invoke(reverseGeocode, { lat: 40.74842, lng: -73.9856 });

		expect(mockLog.mock.calls.at(-1)?.[2]).toMatchObject({
			lat: 40.74842,
			lng: -73.9856,
			count: 1,
			nearest_km: 0.0010302984507433,
		});
	});
});

describe('geokeo event names', () => {
	// The event name must be the path a caller writes, so telemetry and the
	// catalog cannot drift apart. A flat name here was invisible to every
	// other test because none of them asserted this argument.
	it.each([
		[
			'geokeo.geocode.forward',
			forwardGeocode,
			{ q: 'a' },
			empireState,
		] as const,
		[
			'geokeo.geocode.reverse',
			reverseGeocode,
			{ lat: 1, lng: 2 },
			reverseResult,
		] as const,
	])('emits %s', async (expected, endpoint, args, fixture) => {
		respond(fixture);
		await invoke(endpoint as never, args as never);
		expect(mockLog.mock.calls.at(-1)?.[1]).toBe(expected);
	});
});
