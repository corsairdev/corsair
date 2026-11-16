import {
	RoutingEndpoints,
	SearchEndpoints,
	TrafficEndpoints,
} from './endpoints';
import {
	emptySearch,
	geocodeEnvelope,
	incidentDetails,
	reverseGeocodeEnvelope,
	routeEnvelope,
	searchEnvelope,
	trafficFlow,
} from './test-fixtures';
import { captureError, invoke } from './test-helpers';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON; each test passes its own.
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
		params: Object.fromEntries(parsed.searchParams),
		method: init.method,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.tomtom.com');
	expect(sent.params.key).toBe('tt-test-key');
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('search', () => {
	it('search.fuzzy GETs search/2/search/{query}.json', async () => {
		respond(searchEnvelope);

		const result = (await invoke(SearchEndpoints.fuzzy, {
			query: 'pizza',
			limit: 5,
		})) as { results: unknown[]; summary?: { numResults?: number | null } };

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/search/2/search/pizza.json',
			method: 'GET',
		});
		expect(lastRequest().params).toEqual({ limit: '5', key: 'tt-test-key' });
		expect(result.results).toHaveLength(1);
		expect(result.summary?.numResults).toBe(1);
	});

	it('search.fuzzy URL-encodes a query with a space', async () => {
		respond(searchEnvelope);

		await invoke(SearchEndpoints.fuzzy, { query: '123 main st' });

		expect(lastRequest().path).toBe('/search/2/search/123%20main%20st.json');
	});

	it('search.fuzzy sends the geo bias, radius and country filter', async () => {
		respond(searchEnvelope);

		await invoke(SearchEndpoints.fuzzy, {
			query: 'pizza',
			lat: 52.37,
			lon: 4.89,
			radius: 5000,
			country_set: 'NL,BE',
			typeahead: true,
		});

		expect(lastRequest().params).toEqual({
			lat: '52.37',
			lon: '4.89',
			radius: '5000',
			countrySet: 'NL,BE',
			typeahead: 'true',
			key: 'tt-test-key',
		});
	});

	it('search.fuzzy rejects a radius without a point', async () => {
		const error = await captureError(
			invoke(SearchEndpoints.fuzzy, { query: 'pizza', radius: 500 }),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('search.fuzzy rejects a limit above the documented 100', async () => {
		const error = await captureError(
			invoke(SearchEndpoints.fuzzy, { query: 'pizza', limit: 101 }),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('search.fuzzy parses an empty result set', async () => {
		respond(emptySearch);

		const result = (await invoke(SearchEndpoints.fuzzy, {
			query: 'zzzzzz',
		})) as { results: unknown[] };

		expect(result.results).toEqual([]);
	});

	it('search.geocode GETs search/2/geocode/{query}.json', async () => {
		respond(geocodeEnvelope);

		const result = (await invoke(SearchEndpoints.geocode, {
			query: 'Amsterdam',
			country_set: 'NL',
		})) as { results?: unknown[] };

		expectAuthenticated();
		expect(lastRequest().path).toBe('/search/2/geocode/Amsterdam.json');
		expect(lastRequest().params).toEqual({
			countrySet: 'NL',
			key: 'tt-test-key',
		});
		expect(result.results).toHaveLength(1);
	});

	it('search.reverseGeocode GETs the point in lat,lon order', async () => {
		respond(reverseGeocodeEnvelope);

		const result = (await invoke(SearchEndpoints.reverseGeocode, {
			latitude: 52.378,
			longitude: 4.9,
			radius: 100,
		})) as { addresses: unknown[] };

		expectAuthenticated();
		expect(lastRequest().path).toBe('/search/2/reverseGeocode/52.378,4.9.json');
		expect(lastRequest().params).toEqual({
			radius: '100',
			key: 'tt-test-key',
		});
		expect(result.addresses).toHaveLength(1);
	});

	it('search.reverseGeocode rejects a radius above the documented 1000', async () => {
		const error = await captureError(
			invoke(SearchEndpoints.reverseGeocode, {
				latitude: 1,
				longitude: 2,
				radius: 1001,
			}),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('search.reverseGeocode rejects a latitude outside the globe', async () => {
		const error = await captureError(
			invoke(SearchEndpoints.reverseGeocode, { latitude: 91, longitude: 2 }),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('routing', () => {
	it('routing.calculate GETs the origins:destinations path', async () => {
		respond(routeEnvelope);

		const result = (await invoke(RoutingEndpoints.calculate, {
			origins: [{ latitude: 52.37, longitude: 4.89 }],
			destinations: [{ latitude: 52.09, longitude: 5.12 }],
			travel_mode: 'car',
			traffic: true,
		})) as { routes: { summary?: { lengthInMeters?: number | null } }[] };

		expectAuthenticated();
		expect(decodeURIComponent(lastRequest().path)).toBe(
			'/routing/1/calculateRoute/52.37,4.89:52.09,5.12/json',
		);
		expect(lastRequest().params).toEqual({
			travelMode: 'car',
			traffic: 'true',
			key: 'tt-test-key',
		});
		expect(result.routes[0]?.summary?.lengthInMeters).toBe(1200);
	});

	it('routing.calculate joins several waypoints with colons', async () => {
		respond(routeEnvelope);

		await invoke(RoutingEndpoints.calculate, {
			origins: [
				{ latitude: 1, longitude: 2 },
				{ latitude: 3, longitude: 4 },
			],
			destinations: [
				{ latitude: 5, longitude: 6 },
				{ latitude: 7, longitude: 8 },
			],
		});

		expect(decodeURIComponent(lastRequest().path)).toBe(
			'/routing/1/calculateRoute/1,2:3,4:5,6:7,8/json',
		);
	});

	it('routing.calculate repeats avoid once per value', async () => {
		respond(routeEnvelope);

		await invoke(RoutingEndpoints.calculate, {
			origins: [{ latitude: 1, longitude: 2 }],
			destinations: [{ latitude: 3, longitude: 4 }],
			avoid: ['tollRoads', 'ferries'],
		});

		const [url] = fetchMock.mock.calls.at(-1) as [string];
		expect(new URL(url).searchParams.getAll('avoid')).toEqual([
			'tollRoads',
			'ferries',
		]);
	});

	it('routing.calculate rejects an empty origins list', async () => {
		const error = await captureError(
			invoke(RoutingEndpoints.calculate, {
				origins: [],
				destinations: [{ latitude: 1, longitude: 2 }],
			}),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('traffic', () => {
	it('traffic.incidents GETs incidentDetails with the bounding box', async () => {
		respond(incidentDetails);

		const result = (await invoke(TrafficEndpoints.incidents, {
			bbox: '4.88,52.36,4.92,52.39',
		})) as { incidents: unknown[] };

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/traffic/services/5/incidentDetails',
			method: 'GET',
		});
		expect(lastRequest().params).toEqual({
			bbox: '4.88,52.36,4.92,52.39',
			fields: expect.stringContaining('magnitudeOfDelay'),
			key: 'tt-test-key',
		});
		// Without fields, v5 sends only type, geometry and iconCategory.
		expect(lastRequest().params.fields).toContain('roadNumbers');
		expect(lastRequest().params.fields).toContain('delay');
		expect(result.incidents).toHaveLength(1);
	});

	it('traffic.incidents sends categories and time filters as lists', async () => {
		respond(incidentDetails);

		await invoke(TrafficEndpoints.incidents, {
			bbox: '4.88,52.36,4.92,52.39',
			category_filter: [1, 6],
			time_validity_filter: ['present', 'future'],
		});

		expect(lastRequest().params).toMatchObject({
			categoryFilter: '1,6',
			timeValidityFilter: 'present,future',
		});
	});

	it('traffic.incidents rejects a malformed bounding box', async () => {
		const error = await captureError(
			invoke(TrafficEndpoints.incidents, { bbox: '1,2,3' }),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('traffic.incidents rejects an inverted bounding box', async () => {
		const error = await captureError(
			invoke(TrafficEndpoints.incidents, { bbox: '10,52,4,52' }),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('traffic.flow GETs the segment at a point', async () => {
		respond(trafficFlow);

		const result = (await invoke(TrafficEndpoints.flow, {
			latitude: 52.37,
			longitude: 4.89,
			zoom: 12,
			unit: 'kmph',
		})) as { flowSegmentData?: { currentSpeed?: number | null } };

		expectAuthenticated();
		expect(lastRequest().path).toBe(
			'/traffic/services/4/flowSegmentData/absolute/12/json',
		);
		expect(lastRequest().params).toEqual({
			point: '52.37,4.89',
			unit: 'kmph',
			key: 'tt-test-key',
		});
		expect(result.flowSegmentData?.currentSpeed).toBe(45);
	});

	it('traffic.flow defaults the zoom to 10', async () => {
		respond(trafficFlow);

		await invoke(TrafficEndpoints.flow, { latitude: 1, longitude: 2 });

		expect(lastRequest().path).toContain('/absolute/10/json');
	});

	// The PNG signature: the 0x89 byte does not survive decoding as text.
	const PNG = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

	function respondPng() {
		fetchMock.mockResolvedValueOnce(
			new Response(PNG, {
				status: 200,
				headers: { 'Content-Type': 'image/png' },
			}),
		);
	}

	it('traffic.tile builds the flow path and returns the bytes as base64', async () => {
		respondPng();

		const result = (await invoke(TrafficEndpoints.tile, {
			zoom: 12,
			x: 2100,
			y: 1350,
			style: 'relative-delay',
		})) as { content_type: string; base64: string };

		expectAuthenticated();
		expect(lastRequest().path).toBe(
			'/traffic/map/4/tile/flow/relative-delay/12/2100/1350.png',
		);
		expect(result.content_type).toBe('image/png');
		expect(Buffer.from(result.base64, 'base64')).toEqual(Buffer.from(PNG));
	});

	it('traffic.tile puts the incident style in the incidents path', async () => {
		respondPng();

		await invoke(TrafficEndpoints.tile, {
			layer: 'incidents',
			zoom: 12,
			x: 2100,
			y: 1350,
		});

		expect(lastRequest().path).toBe(
			'/traffic/map/4/tile/incidents/s3/12/2100/1350.png',
		);
	});

	it('traffic.tile retries a 429 on Retry-After, as core would', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response('{}', {
				status: 429,
				headers: { 'Content-Type': 'application/json', 'Retry-After': '1' },
			}),
		);
		respondPng();

		const result = (await invoke(TrafficEndpoints.tile, {
			zoom: 12,
			x: 1,
			y: 1,
		})) as { base64: string };

		expect(fetchMock).toHaveBeenCalledTimes(2);
		expect(Buffer.from(result.base64, 'base64')).toEqual(Buffer.from(PNG));
	});

	it('traffic.tile sets a deadline on the request', async () => {
		respondPng();

		await invoke(TrafficEndpoints.tile, { zoom: 12, x: 1, y: 1 });

		const [, init] = fetchMock.mock.calls.at(-1) as [URL, RequestInit];
		expect(init.signal).toBeInstanceOf(AbortSignal);
	});

	it('traffic.tile throws core ApiError on a failure, key redacted', async () => {
		respond({ detailedError: { code: 'Forbidden', message: 'no' } }, 403);

		const error = await captureError(
			invoke(TrafficEndpoints.tile, { zoom: 12, x: 1, y: 1 }),
		);

		expect((error as { status?: number }).status).toBe(403);
		expect((error as Error).name).toBe('ApiError');
		expect(JSON.stringify(error)).not.toContain('tt-test-key');
	});

	it('traffic.tile rejects a zoom above 22', async () => {
		const error = await captureError(
			invoke(TrafficEndpoints.tile, { zoom: 23, x: 1, y: 1 }),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
