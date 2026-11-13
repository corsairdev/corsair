import { logEventFromContext } from 'corsair/core';
import { GeocodioAPIError } from './client';
import {
	batchGeocode,
	batchReverse,
	distance,
	distanceMatrix,
	forwardGeocode,
	jobDelete,
	jobGet,
	jobsList,
	listDelete,
	listGet,
	listsAll,
	parse,
	reverseGeocode,
} from './endpoints';
import {
	approximateResponse,
	distanceResponse,
	emptyResponse,
	geocodeResponse,
	invalidKey,
	job,
	jobList,
	listItem,
	listsResponse,
	matrixResponse,
	oldVersionWarning,
	parseResponse,
	unprocessableAddress,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'geocodio-api-key';

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
function respond(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		// Repeated keys such as `destinations[]` are kept as a list.
		params: parsed.searchParams.getAll.bind(parsed.searchParams),
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

/**
 * Runs a call that must fail and returns what it threw.
 */
// unknown: the rejection value is untyped by definition.
async function failure(
	run: Promise<unknown>,
): Promise<GeocodioAPIError & Error> {
	try {
		await run;
	} catch (error) {
		return error as GeocodioAPIError & Error;
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

describe('Geocodio client', () => {
	it('targets v2.1 and sends the key as api_key', async () => {
		respond(geocodeResponse);
		await invoke(forwardGeocode, { q: '1109 N Highland St' });

		const sent = lastRequest();
		expect(sent.origin).toBe('https://api.geocod.io');
		expect(sent.path).toBe('/v2.1/geocode');
		expect(sent.query.api_key).toBe(API_KEY);
	});

	it('uses the enterprise host when asked', async () => {
		respond(geocodeResponse);
		await invoke(forwardGeocode, { q: '1109 N Highland St', enterprise: true });

		expect(lastRequest().origin).toBe('https://api.enterprise.geocod.io');
		expect(lastRequest().path).toBe('/v2.1/geocode');
	});

	it('wraps a 403 as an auth error, since v2.1 does not answer 401', async () => {
		respond(invalidKey, 403);
		const error = await failure(
			invoke(forwardGeocode, { q: '1109 N Highland St' }),
		);

		expect(error).toBeInstanceOf(GeocodioAPIError);
		expect(error.status).toBe(403);
		expect(error.isAuthError).toBe(true);
		expect(error.reason).toBe('Invalid API key');
		expect(error.reference).toBe(
			'https://www.geocod.io/geocodio-403-forbidden-error/',
		);
		expect(error.message).toContain('Geocodio 403: Invalid API key');
	});

	it('keeps a version warning, which is not a failure', async () => {
		respond({ ...invalidKey, _warnings: oldVersionWarning }, 403);
		const error = await failure(
			invoke(forwardGeocode, { q: '1109 N Highland St' }),
		);

		expect(error.warnings).toEqual(oldVersionWarning);
	});

	it('reads Retry-After off a 429', async () => {
		respond({ error: 'Rate limit exceeded' }, 429, { 'Retry-After': '30' });
		const error = await failure(
			invoke(forwardGeocode, { q: '1109 N Highland St' }),
		);

		expect(error.isRateLimit).toBe(true);
		expect(error.retryAfter).toBe(30_000);
	});

	it('marks a dropped connection as a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
		const error = await failure(
			invoke(forwardGeocode, { q: '1109 N Highland St' }),
		);

		expect(error.transport).toBe(true);
		expect(error.status).toBeUndefined();
	});
});

describe('geocodio.geocode.forward', () => {
	it('returns the coordinates, the parsed components and the accuracy', async () => {
		respond(geocodeResponse);
		const result = (await invoke(forwardGeocode, {
			q: '1109 N Highland St, Arlington, VA 22201',
		})) as typeof geocodeResponse;

		expect(result.results[0]?.location).toEqual({
			lat: 38.886665,
			lng: -77.094733,
		});
		expect(result.results[0]?.address_components.postal_code).toBe('22201');
		expect(result.results[0]?.accuracy).toBe(1);
		expect(result.results[0]?.accuracy_type).toBe('rooftop');
	});

	it('sends the components form when `q` is not used', async () => {
		respond(geocodeResponse);
		await invoke(forwardGeocode, {
			street: '1109 N Highland St',
			city: 'Arlington',
			state_province: 'VA',
			postal_code: '22201',
		});

		const sent = lastRequest();
		expect(sent.query.q).toBeUndefined();
		expect(sent.query.street).toBe('1109 N Highland St');
		expect(sent.query.state_province).toBe('VA');
	});

	it('repeats the field list so several appends can be asked for', async () => {
		respond(geocodeResponse);
		await invoke(forwardGeocode, {
			q: '1109 N Highland St',
			fields: ['timezone', 'congressional_district'],
		});

		expect(lastRequest().params('fields')).toEqual([
			'timezone',
			'congressional_district',
		]);
	});

	it('keeps the appended data under fields', async () => {
		respond(geocodeResponse);
		const result = (await invoke(forwardGeocode, {
			q: '1109 N Highland St',
			fields: ['timezone'],
		})) as typeof geocodeResponse;

		expect(result.results[0]?.fields?.timezone).toMatchObject({
			name: 'America/New_York',
		});
	});

	it('returns an empty result list rather than throwing when nothing matches', async () => {
		respond(emptyResponse);
		const result = (await invoke(forwardGeocode, {
			q: 'nowhere at all',
		})) as typeof emptyResponse;

		expect(result.results).toEqual([]);
	});

	it('keeps the warnings on a weak match', async () => {
		respond(approximateResponse);
		const result = (await invoke(forwardGeocode, {
			q: 'Highland St',
		})) as typeof approximateResponse;

		expect(result._warnings).toEqual(['No exact match found']);
		expect(result.results[0]?.match_type).toBe('non_exact');
	});

	it('rejects a limit above 100', async () => {
		const error = await failure(invoke(forwardGeocode, { q: 'x', limit: 101 }));

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('logs the accuracy and never the address', async () => {
		respond(geocodeResponse);
		await invoke(forwardGeocode, { q: '1109 N Highland St, Arlington' });

		const payload = mockLog.mock.calls.at(-1)?.[2];
		expect(payload).toMatchObject({
			count: 1,
			accuracy: 1,
			accuracy_type: 'rooftop',
			match_type: 'exact',
			fields: 0,
		});
		expect(JSON.stringify(payload)).not.toContain('Highland');
	});
});

describe('geocodio.geocode.reverse', () => {
	it('sends the coordinate pair and returns the address', async () => {
		respond(geocodeResponse);
		const result = (await invoke(reverseGeocode, {
			q: '38.886665,-77.094733',
		})) as typeof geocodeResponse;

		expect(lastRequest().path).toBe('/v2.1/reverse');
		expect(lastRequest().query.q).toBe('38.886665,-77.094733');
		expect(result.results[0]?.formatted_address).toContain('Highland');
	});

	it('rejects a missing coordinate pair', async () => {
		const error = await failure(invoke(reverseGeocode, { q: '' }));

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('geocodio.geocode.batch', () => {
	it('posts the addresses as a bare array, which is the documented body', async () => {
		respond(geocodeResponse);
		await invoke(batchGeocode, {
			addresses: ['1109 N Highland St', '1600 Pennsylvania Ave NW'],
		});

		expect(lastRequest().path).toBe('/v2.1/geocode');
		expect(lastRequest().method).toBe('POST');
		expect(lastRequest().body).toEqual([
			'1109 N Highland St',
			'1600 Pennsylvania Ave NW',
		]);
	});

	it('sends the fields and country as query parameters, not in the body', async () => {
		respond(geocodeResponse);
		await invoke(batchGeocode, {
			addresses: ['x'],
			fields: ['timezone'],
			country: 'US',
		});

		expect(lastRequest().params('fields')).toEqual(['timezone']);
		expect(lastRequest().query.country).toBe('US');
		expect(lastRequest().body).toEqual(['x']);
	});

	it('rejects an empty batch before making a request', async () => {
		const error = await failure(invoke(batchGeocode, { addresses: [] }));

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('logs how many were sent against how many came back', async () => {
		respond(geocodeResponse);
		await invoke(batchGeocode, { addresses: ['a', 'b', 'c'] });

		expect(mockLog.mock.calls.at(-1)?.[2]).toMatchObject({
			sent: 3,
			results: 1,
		});
	});
});

describe('geocodio.geocode.batchReverse', () => {
	it('posts the coordinate pairs', async () => {
		respond(geocodeResponse);
		await invoke(batchReverse, {
			coordinates: ['38.886665,-77.094733'],
		});

		expect(lastRequest().path).toBe('/v2.1/reverse');
		expect(lastRequest().body).toEqual(['38.886665,-77.094733']);
	});

	it('rejects an empty list before making a request', async () => {
		const error = await failure(invoke(batchReverse, { coordinates: [] }));

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('geocodio.geocode.parse', () => {
	it('returns the components without geocoding', async () => {
		respond(parseResponse);
		const result = (await invoke(parse, {
			q: '1109 N Highland St, Arlington, VA 22201',
		})) as typeof parseResponse;

		expect(lastRequest().path).toBe('/v2.1/parse');
		expect(result.address_components.street).toBe('Highland');
		expect(result.address_components.nation).toBe('US');
	});

	it('requires an address', async () => {
		const error = await failure(invoke(parse, { q: '' }));

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('logs whether the useful components were found', async () => {
		respond(parseResponse);
		await invoke(parse, { q: '1109 N Highland St' });

		expect(mockLog.mock.calls.at(-1)?.[2]).toMatchObject({
			has_city: true,
			has_postal_code: true,
		});
	});
});

describe('geocodio.distance.fromOrigin', () => {
	it('repeats destinations[] so several can be measured at once', async () => {
		respond(distanceResponse);
		await invoke(distance, {
			origin: '1109 N Highland St',
			destinations: ['1600 Pennsylvania Ave NW', '1 Infinite Loop'],
		});

		expect(lastRequest().params('destinations[]')).toEqual([
			'1600 Pennsylvania Ave NW',
			'1 Infinite Loop',
		]);
		expect(lastRequest().query.destinations).toBeUndefined();
	});

	it('returns the distance and duration for the driving mode', async () => {
		respond(distanceResponse);
		const result = (await invoke(distance, {
			origin: '1109 N Highland St',
			destinations: ['1600 Pennsylvania Ave NW'],
			mode: 'driving',
		})) as typeof distanceResponse;

		expect(result.destinations[0]?.distance_km).toBe(8.72);
		expect(result.destinations[0]?.duration_seconds).toBe(1080);
	});

	it('accepts haversine, which the geocode route does not', async () => {
		respond(distanceResponse);
		await invoke(distance, {
			origin: 'a',
			destinations: ['b'],
			mode: 'haversine',
		});

		expect(lastRequest().query.mode).toBe('haversine');
	});

	it('rejects a mode only the geocode route accepts', async () => {
		const error = await failure(
			invoke(distance, { origin: 'a', destinations: ['b'], mode: 'transit' }),
		);

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a missing destination list', async () => {
		const error = await failure(
			invoke(distance, { origin: 'a', destinations: [] }),
		);

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('logs the nearest destination', async () => {
		respond(distanceResponse);
		await invoke(distance, {
			origin: 'a',
			destinations: ['b'],
			mode: 'driving',
		});

		expect(mockLog.mock.calls.at(-1)?.[2]).toMatchObject({
			mode: 'driving',
			returned: 1,
			nearest_km: 8.72,
		});
	});
});

describe('geocodio.distance.matrix', () => {
	it('posts the origins and destinations', async () => {
		respond(matrixResponse);
		await invoke(distanceMatrix, {
			origins: ['38.886665,-77.094733'],
			destinations: ['38.8977,-77.0365'],
		});

		expect(lastRequest().path).toBe('/v2.1/distance-matrix');
		expect(lastRequest().method).toBe('POST');
		expect(lastRequest().body).toMatchObject({
			origins: ['38.886665,-77.094733'],
			destinations: ['38.8977,-77.0365'],
		});
	});

	it('returns one row per origin', async () => {
		respond(matrixResponse);
		const result = (await invoke(distanceMatrix, {
			origins: ['a'],
			destinations: ['b'],
		})) as typeof matrixResponse;

		expect(result.results).toHaveLength(1);
		expect(result.results[0]?.destinations[0]?.distance_miles).toBe(5.42);
	});

	it('accepts the one-to-one calculation type', async () => {
		respond(matrixResponse);
		await invoke(distanceMatrix, {
			origins: ['a'],
			destinations: ['b'],
			calculation_type: 'one-to-one',
		});

		expect(lastRequest().body).toMatchObject({
			calculation_type: 'one-to-one',
		});
	});

	it('rejects an empty origin list', async () => {
		const error = await failure(
			invoke(distanceMatrix, { origins: [], destinations: ['b'] }),
		);

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('logs the row count', async () => {
		respond(matrixResponse);
		await invoke(distanceMatrix, { origins: ['a'], destinations: ['b'] });

		expect(mockLog.mock.calls.at(-1)?.[2]).toMatchObject({
			origins: 1,
			destinations: 1,
			rows: 1,
		});
	});
});

describe('geocodio.jobs', () => {
	it('lists the jobs', async () => {
		respond(jobList);
		const result = (await invoke(jobsList, {})) as typeof jobList;

		expect(lastRequest().path).toBe('/v2.1/distance-jobs');
		expect(result.data).toHaveLength(1);
	});

	it('reads one job by identifier', async () => {
		respond(job);
		const result = (await invoke(jobGet, {
			identifier: 'abc123',
		})) as typeof job;

		expect(lastRequest().path).toBe('/v2.1/distance-jobs/abc123');
		expect(result.status).toBe('completed');
	});

	it('encodes an identifier that needs it', async () => {
		respond(job);
		await invoke(jobGet, { identifier: 'a/b' });

		expect(lastRequest().path).toBe('/v2.1/distance-jobs/a%2Fb');
	});

	it('deletes a job with DELETE', async () => {
		respond(job);
		await invoke(jobDelete, { identifier: 'abc123' });

		expect(lastRequest().method).toBe('DELETE');
		expect(lastRequest().path).toBe('/v2.1/distance-jobs/abc123');
	});

	it('requires an identifier', async () => {
		const error = await failure(invoke(jobGet, { identifier: '' }));

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('geocodio.lists', () => {
	it('lists the uploaded spreadsheets', async () => {
		respond(listsResponse);
		const result = (await invoke(listsAll, {})) as typeof listsResponse;

		expect(lastRequest().path).toBe('/v2.1/lists');
		expect(result.data).toHaveLength(1);
		expect(result.data[0]?.status).toBe('completed');
	});

	it('reads one list by ID', async () => {
		respond(listItem);
		const result = (await invoke(listGet, {
			id: 'list-abc123',
		})) as typeof listItem;

		expect(lastRequest().path).toBe('/v2.1/lists/list-abc123');
		expect(result.download_url).toBeDefined();
	});

	it('deletes a list with DELETE', async () => {
		respond(listItem);
		await invoke(listDelete, { id: 'list-abc123' });

		expect(lastRequest().method).toBe('DELETE');
		expect(lastRequest().path).toBe('/v2.1/lists/list-abc123');
	});

	it('requires an ID', async () => {
		const error = await failure(invoke(listGet, { id: '' }));

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('geocodio failures', () => {
	it('surfaces an unparseable address as a validation error', async () => {
		respond(unprocessableAddress, 422);
		const error = await failure(invoke(forwardGeocode, { q: '!!!' }));

		expect(error.isValidationError).toBe(true);
		expect(error.status).toBe(422);
	});

	it('surfaces a missing list as not found', async () => {
		respond({ error: 'Not found' }, 404);
		const error = await failure(invoke(listGet, { id: 'nope' }));

		expect(error.isNotFound).toBe(true);
	});
});

describe('geocodio event names', () => {
	// The event name must be the path a caller writes, so telemetry and the
	// catalog cannot drift apart. A flat name here was invisible to every
	// other test because none of them asserted this argument.
	it.each([
		[
			'geocodio.geocode.forward',
			forwardGeocode,
			{ q: 'a' },
			geocodeResponse,
		] as const,
		[
			'geocodio.geocode.reverse',
			reverseGeocode,
			{ q: '1,2' },
			geocodeResponse,
		] as const,
		[
			'geocodio.geocode.batch',
			batchGeocode,
			{ addresses: ['a'] },
			geocodeResponse,
		] as const,
		[
			'geocodio.geocode.batchReverse',
			batchReverse,
			{ coordinates: ['1,2'] },
			geocodeResponse,
		] as const,
		['geocodio.geocode.parse', parse, { q: 'a' }, parseResponse] as const,
		[
			'geocodio.distance.fromOrigin',
			distance,
			{ origin: 'a', destinations: ['b'] },
			distanceResponse,
		] as const,
		[
			'geocodio.distance.matrix',
			distanceMatrix,
			{ origins: ['a'], destinations: ['b'] },
			matrixResponse,
		] as const,
		['geocodio.jobs.list', jobsList, {}, jobList] as const,
		['geocodio.jobs.get', jobGet, { identifier: 'x' }, job] as const,
		['geocodio.jobs.delete', jobDelete, { identifier: 'x' }, job] as const,
		['geocodio.lists.all', listsAll, {}, listsResponse] as const,
		['geocodio.lists.get', listGet, { id: 'x' }, listItem] as const,
		['geocodio.lists.delete', listDelete, { id: 'x' }, listItem] as const,
	])('emits %s', async (expected, endpoint, args, fixture) => {
		respond(fixture);
		await invoke(endpoint as never, args as never);
		expect(mockLog.mock.calls.at(-1)?.[1]).toBe(expected);
	});
});
