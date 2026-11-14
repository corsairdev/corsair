import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { GeoapifyAPIError, geoapifyErrorInfo } from './client';
import {
	autocomplete,
	boundaries,
	elevation,
	forwardGeocode,
	ipGeolocation,
	isoline,
	placeDetails,
	placesSearch,
	postcodeList,
	postcodeSearch,
	reverseGeocode,
	routeMatrix,
	routing,
	timezone,
} from './endpoints';
import { GeoapifyEndpointOutputSchemas } from './endpoints/types';
import {
	badRequest,
	berlin,
	boundaries as boundariesFixture,
	elevation as elevationFixture,
	ipInfo,
	isoline as isolineFixture,
	isolinePending,
	matrix,
	places,
	postcodes,
	quotaExceeded,
	reverseResult,
	route,
	serverError,
	timezone as timezoneFixture,
	unauthorized,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'geoapify-api-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type, so
// the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context carries what the endpoints read: the key the key builder
	// resolved. The option and stored keys differ, so a test can tell which one
	// was sent.
	const ctx = {
		key: API_KEY,
		options: { key: 'option-key-not-sent' },
		keys: { get_api_key: jest.fn().mockResolvedValue('stored-key-not-sent') },
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
		url,
		headers: new Headers(init.headers),
		origin: parsed.origin,
		path: parsed.pathname,
		// Repeated keys such as `waypoints` are kept as a list.
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
async function thrown(run: Promise<unknown>): Promise<Error> {
	try {
		await run;
	} catch (error) {
		return error as Error;
	}
	throw new Error('expected the call to fail, but it resolved');
}

/**
 * Runs a call that must fail and returns the Geoapify fields of what it threw:
 * the gateway envelope of core's ApiError, or the transport error.
 */
// unknown: the rejection value is untyped by definition.
async function failure(
	run: Promise<unknown>,
): Promise<GeoapifyAPIError & Error> {
	const error = await thrown(run);
	return (geoapifyErrorInfo(error) ?? error) as GeoapifyAPIError & Error;
}

beforeEach(() => {
	jest.clearAllMocks();
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('Geoapify client', () => {
	it('sends the resolved key in the X-Api-Key header, never in the URL', async () => {
		respond(berlin);
		await invoke(forwardGeocode, { text: 'Berlin' });

		const sent = lastRequest();
		expect(sent.origin).toBe('https://api.geoapify.com');
		expect(sent.headers.get('X-Api-Key')).toBe(API_KEY);
		expect(sent.query.apiKey).toBeUndefined();
		expect(sent.url).not.toContain(API_KEY);
	});

	it('sends the key on a POST too, with no query string', async () => {
		respond(elevationFixture);
		await invoke(elevation, { locations: [{ lat: 52.5163, lon: 13.3777 }] });

		const sent = lastRequest();
		expect(sent.headers.get('X-Api-Key')).toBe(API_KEY);
		expect(sent.url).not.toContain('?');
	});

	it('puts v1 operations on /v1 and v2 operations on /v2', async () => {
		respond(berlin);
		await invoke(forwardGeocode, { text: 'Berlin' });
		expect(lastRequest().path).toBe('/v1/geocode/search');

		respond(places);
		await invoke(placesSearch, { categories: ['catering.restaurant'] });
		expect(lastRequest().path).toBe('/v2/places');
	});

	it('sends an EU request to the EU host when asked', async () => {
		respond(berlin);
		await invoke(forwardGeocode, { text: 'Berlin', region: 'eu' });

		expect(lastRequest().origin).toBe('https://api-eu.geoapify.com');
		expect(lastRequest().path).toBe('/v1/geocode/search');
	});

	it('defaults to the global host', async () => {
		respond(berlin);
		await invoke(forwardGeocode, { text: 'Berlin' });

		expect(lastRequest().origin).toBe('https://api.geoapify.com');
	});

	it('passes core ApiError through without the address or coordinates sent', async () => {
		respond(unauthorized, 401);
		const error = await thrown(
			invoke(forwardGeocode, { text: '221B Baker Street, London' }),
		);

		expect(error).toBeInstanceOf(ApiError);
		if (error instanceof ApiError) {
			expect(error.status).toBe(401);
			expect(JSON.stringify(error.request)).not.toContain('Baker');
			expect(error.url).not.toContain('Baker');
			expect(error.message).not.toContain('Baker');
			expect(error.body).toMatchObject({ error: 'Unauthorized' });
		}
	});

	it('reads the gateway fields of a 401', async () => {
		respond(unauthorized, 401);
		const error = await failure(invoke(forwardGeocode, { text: 'Berlin' }));

		expect(error).toBeInstanceOf(GeoapifyAPIError);
		expect(error.status).toBe(401);
		expect(error.reason).toBe('Unauthorized');
		expect(error.isAuthError).toBe(true);
		expect(error.message).toContain('Invalid apiKey');
	});

	it('reads the gateway message on a 400', async () => {
		respond(badRequest, 400);
		const error = await failure(invoke(forwardGeocode, { text: 'Berlin' }));

		expect(error.isValidationError).toBe(true);
		expect(error.message).toContain('must be less than or equal to 100');
	});

	it('reads Retry-After off a 429', async () => {
		respond(quotaExceeded, 429, { 'Retry-After': '60' });
		const error = await failure(invoke(forwardGeocode, { text: 'Berlin' }));

		expect(error.isRateLimit).toBe(true);
		expect(error.retryAfter).toBe(60_000);
	});

	it('marks a dropped connection as a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
		const error = await failure(invoke(forwardGeocode, { text: 'Berlin' }));

		expect(error.transport).toBe(true);
		expect(error.status).toBeUndefined();
	});
});

describe('geoapify.geocode.forward', () => {
	it('asks for json and returns the results array', async () => {
		respond(berlin);
		const result = (await invoke(forwardGeocode, {
			text: 'Berlin',
			countrycodes: ['de'],
		})) as typeof berlin;

		expect(lastRequest().query.format).toBe('json');
		expect(result.results).toHaveLength(2);
		expect(result.results[0]?.lat).toBe(52.51704);
	});

	it('repeats countrycodes so a list is not joined', async () => {
		respond(berlin);
		await invoke(forwardGeocode, {
			text: 'Berlin',
			countrycodes: ['de', 'at'],
		});

		expect(lastRequest().params('countrycodes')).toEqual(['de', 'at']);
	});

	it('reads the json bbox, which is an object of two corners', async () => {
		respond(berlin);
		const result = (await invoke(forwardGeocode, {
			text: 'Berlin',
		})) as typeof berlin;

		expect(result.results[0]?.bbox).toEqual({
			lon1: 13.228,
			lat1: 52.437,
			lon2: 13.548,
			lat2: 52.597,
		});
	});

	it('always asks for json: geojson has no results array to parse', async () => {
		respond(berlin);
		await invoke(forwardGeocode, { text: 'Berlin', format: 'geojson' });

		expect(lastRequest().query.format).toBe('json');
	});

	it('sends the spatial filter and bias as repeated parameters', async () => {
		respond(berlin);
		await invoke(forwardGeocode, {
			text: 'Berlin',
			filter: ['rect:13.3,52.4,13.5,52.6'],
			bias: ['proximity:13.4,52.5'],
		});

		expect(lastRequest().params('filter')).toEqual([
			'rect:13.3,52.4,13.5,52.6',
		]);
		expect(lastRequest().params('bias')).toEqual(['proximity:13.4,52.5']);
	});

	it('rejects an empty text before making a request', async () => {
		const error = await failure(invoke(forwardGeocode, { text: '' }));

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a limit above the documented maximum of 100', async () => {
		const error = await failure(
			invoke(forwardGeocode, { text: 'Berlin', limit: 101 }),
		);

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('logs the counts and confidence, never the address', async () => {
		respond(berlin);
		await invoke(forwardGeocode, { text: 'Berlin' });

		const payload = mockLog.mock.calls.at(-1)?.[2];
		expect(payload).toMatchObject({
			count: 2,
			top_country: 'de',
			top_result_type: 'city',
			confidence: 0.9876,
		});
		expect(JSON.stringify(payload)).not.toContain('Berlin');
	});
});

describe('geoapify.geocode.reverse', () => {
	it('sends the point and returns the address', async () => {
		respond(reverseResult);
		const result = (await invoke(reverseGeocode, {
			lat: 52.517,
			lon: 13.3893,
		})) as typeof reverseResult;

		expect(lastRequest().query.lat).toBe('52.517');
		expect(lastRequest().query.lon).toBe('13.3893');
		expect(result.results[0]?.housenumber).toBe('1');
	});

	it('rejects a latitude out of range', async () => {
		const error = await failure(invoke(reverseGeocode, { lat: 91, lon: 13 }));

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a longitude out of range', async () => {
		const error = await failure(invoke(reverseGeocode, { lat: 52, lon: 181 }));

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('logs the result type but not the point, which is as precise as an address', async () => {
		respond(reverseResult);
		await invoke(reverseGeocode, { lat: 52.517, lon: 13.3893 });

		const payload = mockLog.mock.calls.at(-1)?.[2];
		expect(payload).toMatchObject({ top_result_type: 'building' });
		expect(payload).not.toHaveProperty('lat');
		expect(payload).not.toHaveProperty('lon');
	});

	it('accepts building as a result type, as the reverse API documents', async () => {
		respond(reverseResult);
		await invoke(reverseGeocode, {
			lat: 52.517,
			lon: 13.3893,
			type: 'building',
		});

		expect(lastRequest().query.type).toBe('building');
	});
});

describe('geoapify.geocode.autocomplete', () => {
	it('uses the autocomplete route and returns suggestions', async () => {
		respond(berlin);
		const result = (await invoke(autocomplete, {
			text: '10 Downing',
		})) as typeof berlin;

		expect(lastRequest().path).toBe('/v1/geocode/autocomplete');
		expect(result.results).toHaveLength(2);
	});

	it('rejects an empty prefix before making a request', async () => {
		const error = await failure(invoke(autocomplete, { text: '' }));

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('geoapify.places.search', () => {
	it('reads the v2 feature collection', async () => {
		respond(places);
		const result = (await invoke(placesSearch, {
			categories: ['catering.cafe'],
			filter: 'circle:13.4,52.5,1000',
		})) as typeof places;

		expect(lastRequest().path).toBe('/v2/places');
		expect(result.features).toHaveLength(1);
		expect(result.features[0]?.properties.category).toBe('catering.cafe');
	});

	it('repeats categories, since a place can be searched for several', async () => {
		respond(places);
		await invoke(placesSearch, {
			categories: ['catering.cafe', 'catering.restaurant'],
		});

		expect(lastRequest().params('categories')).toEqual([
			'catering.cafe',
			'catering.restaurant',
		]);
	});

	it('rejects an empty category list before making a request', async () => {
		const error = await failure(invoke(placesSearch, { categories: [] }));

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a limit above 500, which is the places maximum', async () => {
		const error = await failure(
			invoke(placesSearch, { categories: ['catering.cafe'], limit: 501 }),
		);

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('logs the count and the top category', async () => {
		respond(places);
		await invoke(placesSearch, { categories: ['catering.cafe'] });

		expect(mockLog.mock.calls.at(-1)?.[2]).toMatchObject({
			count: 1,
			categories: 1,
			// The most specific of the place's categories; there is no `category`.
			top_category: 'catering',
		});
	});
});

describe('geoapify.places.details', () => {
	it('asks for one place by ID', async () => {
		respond(places);
		await invoke(placeDetails, { id: 'ab12cd34ef56ab78cd90ef12ab34cd56' });

		expect(lastRequest().path).toBe('/v2/place-details');
		expect(lastRequest().query.id).toBe('ab12cd34ef56ab78cd90ef12ab34cd56');
	});

	it('rejects an empty ID before making a request', async () => {
		const error = await failure(invoke(placeDetails, { id: '' }));

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('logs the place ID and the match count', async () => {
		respond(places);
		await invoke(placeDetails, { id: 'ab12' });

		expect(mockLog.mock.calls.at(-1)?.[2]).toMatchObject({
			place_id: 'ab12',
			found: 1,
		});
	});
});

describe('geoapify.routing.route', () => {
	it('repeats the waypoints and returns the distance and time', async () => {
		respond(route);
		const result = (await invoke(routing, {
			waypoints: ['52.5163,13.3777', '52.52,13.405'],
			mode: 'drive',
		})) as typeof route;

		expect(lastRequest().params('waypoints')).toEqual([
			'52.5163,13.3777',
			'52.52,13.405',
		]);
		expect(result.results?.[0]?.distance).toBe(1921);
		expect(result.results?.[0]?.time).toBe(165.261);
	});

	it('parses the live json shape: point geometry and object instructions', async () => {
		respond(route);
		const result = await invoke(routing, {
			waypoints: ['52.5163,13.3777', '52.52,13.405'],
			mode: 'drive',
			details: ['instruction_details'],
		});

		const first = (result as typeof route).results[0];
		expect(first?.geometry[0]?.[0]).toEqual({ lon: 13.378236, lat: 52.51634 });
		expect(first?.legs[0]?.steps[0]?.instruction.text).toBe(
			'Drive south on Pariser Platz.',
		);
		expect(lastRequest().params('details')).toEqual(['instruction_details']);
	});

	it('accepts approximated_transit and the truck classes Geoapify documents', async () => {
		for (const mode of ['approximated_transit', 'heavy_truck'] as const) {
			respond(route);
			await invoke(routing, { waypoints: ['a', 'b'], mode });
			expect(lastRequest().query.mode).toBe(mode);
		}
	});

	it('rejects approx_transit, which Geoapify does not accept', async () => {
		const error = await failure(
			invoke(routing, { waypoints: ['a', 'b'], mode: 'approx_transit' }),
		);

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('requires at least a start and an end', async () => {
		const error = await failure(
			invoke(routing, { waypoints: ['52.5,13.4'], mode: 'drive' }),
		);

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a mode Geoapify does not document', async () => {
		const error = await failure(
			invoke(routing, { waypoints: ['a', 'b'], mode: 'hovercraft' }),
		);

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('defaults the format to json, not the documented geojson', async () => {
		respond(route);
		await invoke(routing, { waypoints: ['a', 'b'], mode: 'drive' });

		expect(lastRequest().query.format).toBe('json');
	});

	it('logs the distance and time without the waypoints', async () => {
		respond(route);
		await invoke(routing, {
			waypoints: ['52.5163,13.3777', '52.52,13.405'],
			mode: 'drive',
		});

		const payload = mockLog.mock.calls.at(-1)?.[2];
		expect(payload).toMatchObject({
			mode: 'drive',
			distance: 1921,
			time: 165.261,
		});
		expect(JSON.stringify(payload)).not.toContain('52.5163');
	});
});

describe('geoapify.routing.isoline', () => {
	it('repeats the ranges and returns one polygon per range', async () => {
		respond(isolineFixture);
		const result = (await invoke(isoline, {
			lat: 52.5,
			lon: 13.4,
			type: 'time',
			range: [300, 600],
		})) as typeof isolineFixture;

		expect(lastRequest().params('range')).toEqual(['300', '600']);
		expect(result.features).toHaveLength(2);
	});

	it('requires at least one range', async () => {
		const error = await failure(
			invoke(isoline, { lat: 52.5, lon: 13.4, type: 'time', range: [] }),
		);

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('requires a center, type and range unless an id is given', async () => {
		const error = await failure(invoke(isoline, { lat: 52.5, lon: 13.4 }));

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('logs a 202 answer with no areas as pending, with the id to read it', async () => {
		respond(isolinePending, 202);
		const result = (await invoke(isoline, {
			lat: 52.5,
			lon: 13.4,
			type: 'time',
			range: [3600],
		})) as typeof isolinePending;

		expect(result.properties.id).toBe(isolinePending.properties.id);
		expect(mockLog.mock.calls.at(-1)?.[2]).toMatchObject({
			areas: 0,
			pending: true,
			id: isolinePending.properties.id,
		});
		expect(mockLog.mock.calls.at(-1)?.[3]).toBe('pending');
	});

	it('reads an earlier isoline by id alone', async () => {
		respond(isolineFixture);
		await invoke(isoline, { id: 'abc123' });

		expect(lastRequest().query).toEqual({ id: 'abc123' });
		expect(mockLog.mock.calls.at(-1)?.[3]).toBe('completed');
	});

	it('logs the area and range counts', async () => {
		respond(isolineFixture);
		await invoke(isoline, {
			lat: 52.5,
			lon: 13.4,
			type: 'time',
			range: [300, 600],
		});

		expect(mockLog.mock.calls.at(-1)?.[2]).toMatchObject({
			areas: 2,
			type: 'time',
			ranges: 2,
			mode: 'drive',
			pending: false,
		});
	});
});

describe('geoapify.routing.matrix', () => {
	it('posts each point as { location: [lon, lat] }, the shape Geoapify takes', async () => {
		respond(matrix);
		await invoke(routeMatrix, {
			mode: 'drive',
			sources: [{ lat: 52.5163, lon: 13.3777 }],
			targets: [{ lat: 52.52, lon: 13.405 }],
			avoid: ['tolls'],
		});

		const sent = lastRequest();
		expect(sent.path).toBe('/v1/routematrix');
		expect(sent.method).toBe('POST');
		expect(sent.body).toMatchObject({
			mode: 'drive',
			sources: [{ location: [13.3777, 52.5163] }],
			targets: [{ location: [13.405, 52.52] }],
			avoid: [{ type: 'tolls' }],
		});
	});

	it('rejects a lat,lon string, which Geoapify answers with 400', async () => {
		const error = await failure(
			invoke(routeMatrix, {
				mode: 'drive',
				sources: ['52.5163,13.3777'],
				targets: ['52.52,13.405'],
			}),
		);

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('keeps a pair with no route as a null cell rather than throwing', async () => {
		respond(matrix);
		const result = (await invoke(routeMatrix, {
			mode: 'drive',
			sources: [{ lat: 52.5163, lon: 13.3777 }],
			targets: [
				{ lat: 52.52, lon: 13.405 },
				{ lat: 40.7, lon: -74 },
			],
		})) as typeof matrix;

		expect(result.sources_to_targets[0]?.[1]?.distance).toBeNull();
		expect(result.sources_to_targets[0]?.[0]?.distance).toBe(1921);
	});

	it('sends an EU matrix to the EU host', async () => {
		respond(matrix);
		await invoke(routeMatrix, {
			mode: 'drive',
			sources: [{ lat: 52.5163, lon: 13.3777 }],
			targets: [{ lat: 52.52, lon: 13.405 }],
			region: 'eu',
		});

		expect(lastRequest().origin).toBe('https://api-eu.geoapify.com');
	});

	it('requires at least one source and one target', async () => {
		const error = await failure(
			invoke(routeMatrix, {
				mode: 'drive',
				sources: [],
				targets: [{ lat: 1, lon: 2 }],
			}),
		);

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('counts the unreachable pairs in the log', async () => {
		respond(matrix);
		await invoke(routeMatrix, {
			mode: 'drive',
			sources: [{ lat: 52.5163, lon: 13.3777 }],
			targets: [
				{ lat: 52.52, lon: 13.405 },
				{ lat: 40.7, lon: -74 },
			],
		});

		expect(mockLog.mock.calls.at(-1)?.[2]).toMatchObject({
			sources: 1,
			targets: 2,
			unreachable: 1,
		});
	});
});

describe('geoapify.geo.ip', () => {
	it('uses the ipinfo route', async () => {
		respond(ipInfo);
		await invoke(ipGeolocation, { ip: '54.201.16.177' });

		expect(lastRequest().path).toBe('/v1/ipinfo');
		expect(lastRequest().query.ip).toBe('54.201.16.177');
	});

	it('works without an IP, which locates the caller', async () => {
		respond(ipInfo);
		await invoke(ipGeolocation, {});

		expect(lastRequest().query.ip).toBeUndefined();
	});

	it('logs the country and city but never the IP', async () => {
		respond(ipInfo);
		await invoke(ipGeolocation, { ip: '54.201.16.177' });

		const payload = mockLog.mock.calls.at(-1)?.[2];
		expect(payload).toMatchObject({ country: 'US', city: 'Portland' });
		expect(JSON.stringify(payload)).not.toContain('54.201.16.177');
	});
});

describe('geoapify.geo.timezone', () => {
	it('returns the zone at the point', async () => {
		respond(timezoneFixture);
		const result = (await invoke(timezone, {
			lat: 52.5,
			lon: 13.4,
		})) as typeof timezoneFixture;

		expect(result.timezones[0]?.name).toBe('Europe/Berlin');
		// The live fields: these were dropped by the old schema.
		expect(result.timezones[0]?.utc_offset).toBe('+02:00');
		expect(result.timezones[0]?.offset_seconds).toBe(7200);
		expect(result.timezones[0]?.local_time).toBe(
			'2026-07-01T14:00:00.000+02:00',
		);
		expect(result.timezones[0]?.next_transition?.kind).toBe('daylight-end');
	});

	it('passes the moment through, which decides daylight saving', async () => {
		respond(timezoneFixture);
		await invoke(timezone, {
			lat: 52.5,
			lon: 13.4,
			at: '2026-07-01T12:00:00Z',
		});

		expect(lastRequest().query.at).toBe('2026-07-01T12:00:00Z');
	});

	it('logs the primary zone', async () => {
		respond(timezoneFixture);
		await invoke(timezone, { lat: 52.5, lon: 13.4 });

		expect(mockLog.mock.calls.at(-1)?.[2]).toMatchObject({
			zones: 1,
			primary: 'Europe/Berlin',
			utc_offset: '+02:00',
		});
	});
});

describe('geoapify.geo.postcodeSearch', () => {
	it('always asks for json, since the default is geojson', async () => {
		respond(postcodes);
		await invoke(postcodeSearch, { postcode: '10115', countrycode: 'de' });

		expect(lastRequest().path).toBe('/v1/postcode/search');
		expect(lastRequest().query.format).toBe('json');
	});

	it('finds the postcode at a point when no postcode is given', async () => {
		respond(postcodes);
		await invoke(postcodeSearch, { lat: 52.5163, lon: 13.3777 });

		expect(lastRequest().query).toMatchObject({
			lat: '52.5163',
			lon: '13.3777',
		});
		expect(lastRequest().query.postcode).toBeUndefined();
	});

	it('rejects a postcode together with a point, which the API keeps apart', async () => {
		const error = await failure(
			invoke(postcodeSearch, { postcode: '10117', lat: 52.5, lon: 13.4 }),
		);

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('returns the places the postcode covers', async () => {
		respond(postcodes);
		const result = (await invoke(postcodeSearch, {
			postcode: '10115',
		})) as typeof postcodes;

		expect(result.results[0]?.city).toBe('Berlin');
	});
});

describe('geoapify.geo.postcodeList', () => {
	it('searches postcodes by prefix', async () => {
		respond(postcodes);
		await invoke(postcodeList, { text: '1011' });

		expect(lastRequest().path).toBe('/v1/postcode/list');
		expect(lastRequest().query.format).toBe('json');
	});

	it('lists postcodes by a spatial filter alone', async () => {
		respond(postcodes);
		await invoke(postcodeList, { filter: ['circle:13.3777,52.5163,1000'] });

		expect(lastRequest().params('filter')).toEqual([
			'circle:13.3777,52.5163,1000',
		]);
		expect(lastRequest().query.text).toBeUndefined();
	});

	it('rejects a limit above 500, the documented maximum', async () => {
		const error = await failure(
			invoke(postcodeList, { text: '1011', limit: 501 }),
		);

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('geoapify.geo.boundaries', () => {
	it('returns the enclosing boundary levels', async () => {
		respond(boundariesFixture);
		const result = (await invoke(boundaries, {
			lat: 52.5,
			lon: 13.4,
		})) as typeof boundariesFixture;

		expect(result.features).toHaveLength(2);
	});

	it('repeats the boundary levels', async () => {
		respond(boundariesFixture);
		await invoke(boundaries, {
			lat: 52.5,
			lon: 13.4,
			boundaries: ['city', 'country'],
		});

		expect(lastRequest().params('boundaries')).toEqual(['city', 'country']);
	});

	it('sends the lowercase osm_type Geoapify documents', async () => {
		respond(boundariesFixture);
		await invoke(boundaries, { osm_id: 62422, osm_type: 'r' });

		expect(lastRequest().query).toMatchObject({
			osm_id: '62422',
			osm_type: 'r',
		});
	});

	it('rejects an uppercase or unknown osm_type', async () => {
		for (const osmType of ['R', 'X']) {
			const error = await failure(
				invoke(boundaries, { osm_id: 1, osm_type: osmType }),
			);
			expect(error.name).toBe('ZodError');
		}
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a call that names no place', async () => {
		const error = await failure(invoke(boundaries, { lat: 52.5 }));

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('logs the number of levels', async () => {
		respond(boundariesFixture);
		await invoke(boundaries, { lat: 52.5, lon: 13.4 });

		expect(mockLog.mock.calls.at(-1)?.[2]).toMatchObject({ levels: 2 });
	});
});

describe('geoapify.geo.elevation', () => {
	it('posts the locations and returns the samples in order', async () => {
		respond(elevationFixture);
		const result = (await invoke(elevation, {
			locations: [
				{ lat: 52.5, lon: 13.4 },
				{ lat: 52.6, lon: 13.5 },
			],
		})) as typeof elevationFixture;

		expect(lastRequest().path).toBe('/v1/geodata/elevation');
		expect(lastRequest().method).toBe('POST');
		expect(result.results).toHaveLength(3);
		expect(result.results[0]?.elevation).toBe(38);
		// A point with no terrain value is null, not a failed response.
		expect(result.results[2]?.elevation).toBeNull();
	});

	it('requires at least one location', async () => {
		const error = await failure(invoke(elevation, { locations: [] }));

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('logs the highest and lowest sample', async () => {
		respond(elevationFixture);
		await invoke(elevation, {
			locations: [
				{ lat: 52.5, lon: 13.4 },
				{ lat: 52.6, lon: 13.5 },
			],
		});

		expect(mockLog.mock.calls.at(-1)?.[2]).toMatchObject({
			points: 3,
			units: 'm',
			highest: 8731,
			lowest: 38,
			missing: 1,
		});
	});
});

describe('geoapify failures', () => {
	it('surfaces a 500 as a server error', async () => {
		respond(serverError, 500);
		const error = await failure(invoke(forwardGeocode, { text: 'Berlin' }));

		expect(error.status).toBe(500);
		expect(error.isValidationError).toBe(false);
	});
});

describe('geoapify event names', () => {
	// The event name must be the path a caller writes, so telemetry and the
	// catalog cannot drift apart. A flat name here was invisible to every
	// other test because none of them asserted this argument.
	it.each([
		[
			'geoapify.geocode.forward',
			forwardGeocode,
			{ text: 'Berlin' },
			berlin,
		] as const,
		[
			'geoapify.geocode.reverse',
			reverseGeocode,
			{ lat: 52.5, lon: 13.4 },
			reverseResult,
		] as const,
		[
			'geoapify.geocode.autocomplete',
			autocomplete,
			{ text: 'Ber' },
			berlin,
		] as const,
		[
			'geoapify.places.search',
			placesSearch,
			{ categories: ['catering.cafe'] },
			places,
		] as const,
		['geoapify.places.details', placeDetails, { id: 'abc' }, places] as const,
		[
			'geoapify.routing.route',
			routing,
			{ waypoints: ['a', 'b'], mode: 'drive' },
			route,
		] as const,
		[
			'geoapify.routing.isoline',
			isoline,
			{ lat: 1, lon: 2, type: 'time', range: [60] },
			isolineFixture,
		] as const,
		[
			'geoapify.routing.matrix',
			routeMatrix,
			{
				mode: 'drive',
				sources: [{ lat: 1, lon: 2 }],
				targets: [{ lat: 3, lon: 4 }],
			},
			matrix,
		] as const,
		['geoapify.geo.ip', ipGeolocation, {}, ipInfo] as const,
		[
			'geoapify.geo.timezone',
			timezone,
			{ lat: 1, lon: 2 },
			timezoneFixture,
		] as const,
		[
			'geoapify.geo.postcodeSearch',
			postcodeSearch,
			{ postcode: '10115' },
			postcodes,
		] as const,
		[
			'geoapify.geo.postcodeList',
			postcodeList,
			{ text: '1011' },
			postcodes,
		] as const,
		[
			'geoapify.geo.boundaries',
			boundaries,
			{ lat: 1, lon: 2 },
			boundariesFixture,
		] as const,
		[
			'geoapify.geo.elevation',
			elevation,
			{ locations: [{ lat: 1, lon: 2 }] },
			elevationFixture,
		] as const,
	])('emits %s', async (expected, endpoint, args, fixture) => {
		respond(fixture);
		await invoke(endpoint as never, args as never);
		expect(mockLog.mock.calls.at(-1)?.[1]).toBe(expected);
	});
});

describe('Geoapify response schemas', () => {
	it('keeps the contact object of a place', () => {
		const feature = places.features[0];
		const parsed = GeoapifyEndpointOutputSchemas.placeDetails.parse({
			...places,
			features: [
				{
					...feature,
					properties: {
						...feature?.properties,
						contact: { phone: '+49 30 1234567', email: 'info@example.com' },
					},
				},
			],
		});
		expect(parsed.features[0]?.properties.contact).toEqual({
			phone: '+49 30 1234567',
			email: 'info@example.com',
		});
	});

	it('keeps the elevation and route details a route asked for', () => {
		const result = route.results[0];
		const leg = result?.legs[0];
		const parsed = GeoapifyEndpointOutputSchemas.routing.parse({
			...route,
			results: [
				{
					...result,
					legs: [
						{
							...leg,
							elevation: [34, 35, 37],
							elevation_range: [
								[0, 34],
								[12, 35],
							],
							country_code: ['de'],
						},
					],
				},
			],
		});
		const parsedLeg = parsed.results?.[0]?.legs?.[0];
		expect(parsedLeg?.elevation).toEqual([34, 35, 37]);
		expect(parsedLeg?.elevation_range).toEqual([
			[0, 34],
			[12, 35],
		]);
		expect(parsedLeg).toMatchObject({ country_code: ['de'] });
	});

	it('accepts a null next_transition when no change is known', () => {
		const zone = timezoneFixture.timezones[0];
		const parsed = GeoapifyEndpointOutputSchemas.timezone.parse({
			...timezoneFixture,
			timezones: [{ ...zone, next_transition: null }],
		});
		expect(parsed.timezones[0]?.next_transition).toBeNull();
	});
});
