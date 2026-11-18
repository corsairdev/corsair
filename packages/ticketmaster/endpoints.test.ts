import { logEventFromContext } from 'corsair/core';
import {
	Attractions,
	Classifications,
	Events,
	Suggest,
	Venues,
} from './endpoints';
import {
	attraction,
	attractionsSearchResponse,
	classification,
	classificationsSearchResponse,
	event,
	eventDetail,
	eventImagesResponse,
	eventsSearchResponse,
	idNotFound,
	invalidApiKey,
	invalidParameter,
	secondEvent,
	suggestResponse,
	venue,
	venuesSearchResponse,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'tm-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type, so
// the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read (ctx.key).
	return endpoint({ key: API_KEY } as never, input as never);
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
		// Arrays arrive as repeated parameters, so keep every value.
		query: Object.fromEntries(
			[...new Set(parsed.searchParams.keys())].map((key) => [
				key,
				parsed.searchParams.getAll(key).length > 1
					? parsed.searchParams.getAll(key)
					: parsed.searchParams.get(key),
			]),
		),
		method: init.method,
		headers: new Headers(init.headers),
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://app.ticketmaster.com');
	expect(sent.query.apikey).toBe(API_KEY);
	expect(sent.headers.get('authorization')).toBeNull();
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('events.search', () => {
	it('GETs discovery/v2/events.json and unwraps _embedded.events', async () => {
		respond(eventsSearchResponse);

		const result = await invoke(Events.search, {});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/discovery/v2/events.json',
		});
		expect(result).toMatchObject({
			events: [event],
			page: { size: 1, totalElements: 87958, totalPages: 87958, number: 0 },
			next_page: 1,
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'ticketmaster.events.search',
			{ page: 0, count: 1, total: 87958 },
			'completed',
		);
	});

	it('sends the documented filters under their own names', async () => {
		respond(eventsSearchResponse);

		await invoke(Events.search, {
			keyword: 'devjam',
			countryCode: 'US',
			city: ['Seattle', 'Portland'],
			classificationName: ['music'],
			startDateTime: '2026-01-01T00:00:00Z',
			includeTBA: 'no',
			sort: 'date,asc',
			size: 50,
			page: 2,
		});

		expect(lastRequest().query).toEqual({
			keyword: 'devjam',
			countryCode: 'US',
			city: ['Seattle', 'Portland'],
			// A one-element filter is still a single query parameter on the wire.
			classificationName: 'music',
			startDateTime: '2026-01-01T00:00:00Z',
			includeTBA: 'no',
			sort: 'date,asc',
			size: '50',
			page: '2',
			apikey: API_KEY,
		});
	});

	it('reports the next page while more remain', async () => {
		respond({
			...eventsSearchResponse,
			page: { size: 20, totalElements: 100, totalPages: 5, number: 1 },
		});

		await expect(invoke(Events.search, { page: 1 })).resolves.toMatchObject({
			next_page: 2,
		});
	});

	it('reports no next page on the last one', async () => {
		respond({
			...eventsSearchResponse,
			page: { size: 20, totalElements: 40, totalPages: 2, number: 1 },
		});

		await expect(invoke(Events.search, { page: 1 })).resolves.toMatchObject({
			next_page: null,
		});
	});

	it('stops at the 1,000-item deep paging limit', async () => {
		respond({
			...eventsSearchResponse,
			page: { size: 200, totalElements: 5000, totalPages: 25, number: 4 },
		});

		await expect(
			invoke(Events.search, { page: 4, size: 200 }),
		).resolves.toMatchObject({ next_page: null });
	});

	it('reads a 200 with no _embedded as an empty page', async () => {
		// The last page of a result set can come back with no `_embedded`, which
		// is what the official JS SDK hit in sdk-javascript issue #25.
		respond({
			_links: { self: { href: '/discovery/v2/events.json' } },
			page: { size: 20, totalElements: 40, totalPages: 2, number: 1 },
		});

		await expect(invoke(Events.search, { page: 1 })).resolves.toMatchObject({
			events: [],
			next_page: null,
		});
	});

	it('rejects a malformed collection instead of reporting no results', async () => {
		// A present but non-array `events` is a broken payload. Coercing it to []
		// would say "nothing matched", which is a different claim than "the
		// response was wrong", so the output schema must reject it.
		respond({
			_embedded: { events: { not: 'an array' } },
			page: { size: 20, totalElements: 0, totalPages: 0, number: 0 },
		});

		await expect(invoke(Events.search, {})).rejects.toMatchObject({
			name: 'ZodError',
		});
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('keeps the fields and statuses it does not know', async () => {
		respond({
			...eventsSearchResponse,
			_embedded: {
				events: [
					{
						...event,
						dates: { ...event.dates, status: { code: 'postponed' } },
					},
				],
			},
		});

		await expect(invoke(Events.search, {})).resolves.toMatchObject({
			events: [{ id: event.id }],
		});
	});

	it.each([
		[{ size: 0 }],
		[{ size: 201 }],
		[{ page: -1 }],
		[{ page: 1.5 }],
		[{ page: 5, size: 200 }],
		[{ includeTBA: 'true' }],
		[{ city: [] }],
		[{ source: '' }],
	])('rejects %j before calling Ticketmaster', async (input) => {
		await expect(invoke(Events.search, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('surfaces a rejected parameter', async () => {
		respond(invalidParameter, 400);

		await expect(invoke(Events.search, { keyword: 'x' })).rejects.toMatchObject(
			{
				status: 400,
				code: 'DIS1001',
			},
		);
		expect(mockLog).not.toHaveBeenCalled();
	});
});

describe('events.get', () => {
	it('GETs one event by ID', async () => {
		respond(eventDetail);

		const result = await invoke(Events.get, { id: event.id });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: `/discovery/v2/events/${event.id}.json`,
		});
		expect(result).toMatchObject({ id: event.id });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'ticketmaster.events.get',
			{ eventId: event.id },
			'completed',
		);
	});

	it('encodes the ID into one path segment', async () => {
		respond(eventDetail);

		await invoke(Events.get, { id: '../../me' });

		const [url] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
		expect(url).toContain('/discovery/v2/events/..%2F..%2Fme.json');
	});

	it('passes locale through as a query parameter', async () => {
		respond(eventDetail);

		await invoke(Events.get, { id: 'abc', locale: 'de-de' });

		expect(lastRequest().query).toEqual({ locale: 'de-de', apikey: API_KEY });
	});

	it('surfaces an unknown ID as a 404', async () => {
		respond(idNotFound, 404);

		await expect(invoke(Events.get, { id: 'abcde' })).rejects.toMatchObject({
			status: 404,
			code: 'DIS1004',
		});
	});

	it('types the public onsale window and the presales as data', async () => {
		respond(eventDetail);

		// Called directly rather than through `invoke`: the concrete signature
		// is what carries the output type into these annotations, so `tsc` fails
		// the file if `sales.public.startDateTime` is still `unknown`.
		const result = await Events.get({ key: API_KEY } as never, {
			id: event.id,
		});

		const start: string | null | undefined =
			result.sales?.public?.startDateTime;
		const presale: string | null | undefined =
			result.sales?.presales?.[0]?.name;
		expect(start).toBe('2015-10-02T11:00:00Z');
		expect(presale).toBe('American Express Presale');
	});

	it('types each classification level with its id and name', async () => {
		respond(eventDetail);

		const result = await Events.get({ key: API_KEY } as never, {
			id: event.id,
		});

		// Same idea: strings, not `unknown`, so no narrowing is needed.
		const segmentId: string | null | undefined =
			result.classifications?.[0]?.segment?.id;
		const genreName: string | null | undefined =
			result.classifications?.[0]?.genre?.name;
		expect(segmentId).toBe('KZFzniwnSyZfZ7v7nE');
		expect(genreName).toBe('Golf');
	});

	it('types the nested genre and sub-genre levels of the tree', async () => {
		respond(classificationsSearchResponse);

		const result = await Classifications.search({ key: API_KEY } as never, {});

		// Each level is a named type, so these read without a cast. The old
		// recursive schema surfaced both as `lazy` in the docs and as `unknown`
		// to a caller.
		const genreName: string | null | undefined =
			result.classifications[0]?.segment?._embedded?.genres?.[0]?.name;
		const subGenreName: string | null | undefined =
			result.classifications[0]?.segment?._embedded?.genres?.[0]?._embedded
				?.subgenres?.[0]?.name;
		expect(genreName).toBe('Magic & Illusion');
		expect(subGenreName).toBe('Magic');
	});

	it.each([[{}], [{ id: '' }]])(
		'rejects %j before calling Ticketmaster',
		async (input) => {
			await expect(invoke(Events.get, input)).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
});

describe('events.getImages', () => {
	it('GETs the images for one event', async () => {
		respond(eventImagesResponse);

		const result = await invoke(Events.getImages, {
			id: eventImagesResponse.id,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: `/discovery/v2/events/${eventImagesResponse.id}/images.json`,
		});
		expect(result).toMatchObject({
			id: eventImagesResponse.id,
			images: eventImagesResponse.images,
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'ticketmaster.events.getImages',
			{ eventId: eventImagesResponse.id, count: 2 },
			'completed',
		);
	});

	it('rejects a response with no images array', async () => {
		respond({ id: 'x' });

		await expect(invoke(Events.getImages, { id: 'x' })).rejects.toMatchObject({
			name: 'ZodError',
		});
	});
});

describe('attractions.search', () => {
	it('GETs discovery/v2/attractions.json and unwraps the collection', async () => {
		respond(attractionsSearchResponse);

		const result = await invoke(Attractions.search, { keyword: 'coachella' });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/discovery/v2/attractions.json',
		});
		expect(lastRequest().query).toMatchObject({ keyword: 'coachella' });
		expect(result).toMatchObject({
			attractions: [attraction],
			page: { totalElements: 1, totalPages: 1 },
			next_page: null,
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'ticketmaster.attractions.search',
			{ page: 0, count: 1, total: 1 },
			'completed',
		);
	});

	it('rejects a page beyond the deep paging limit', async () => {
		await expect(
			invoke(Attractions.search, { page: 10, size: 100 }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('attractions.get', () => {
	it('GETs one attraction by ID', async () => {
		respond(attraction);

		const result = await invoke(Attractions.get, { id: attraction.id });

		expectAuthenticated();
		expect(lastRequest().path).toBe(
			`/discovery/v2/attractions/${attraction.id}.json`,
		);
		expect(result).toMatchObject({ id: attraction.id, name: attraction.name });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'ticketmaster.attractions.get',
			{ attractionId: attraction.id },
			'completed',
		);
	});

	it('surfaces an unknown ID', async () => {
		respond(idNotFound, 404);

		await expect(
			invoke(Attractions.get, { id: 'abcde' }),
		).rejects.toMatchObject({ status: 404, code: 'DIS1004' });
	});
});

describe('venues.search', () => {
	it('GETs discovery/v2/venues.json and unwraps the collection', async () => {
		respond(venuesSearchResponse);

		const result = await invoke(Venues.search, { keyword: 'UCV' });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/discovery/v2/venues.json',
		});
		expect(result).toMatchObject({ venues: [venue] });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'ticketmaster.venues.search',
			{ page: 0, count: 1, total: 1 },
			'completed',
		);
	});

	it('sends the geo and paging parameters', async () => {
		respond(venuesSearchResponse);

		await invoke(Venues.search, {
			geoPoint: '9yzgerzgz',
			radius: 50,
			unit: 'miles',
			countryCode: 'US',
			sort: 'distance,asc',
		});

		expect(lastRequest().query).toMatchObject({
			geoPoint: '9yzgerzgz',
			radius: '50',
			unit: 'miles',
			countryCode: 'US',
			sort: 'distance,asc',
		});
	});
});

describe('venues.get', () => {
	it('GETs one venue by ID', async () => {
		respond(venue);

		const result = await invoke(Venues.get, { id: venue.id });

		expectAuthenticated();
		expect(lastRequest().path).toBe(`/discovery/v2/venues/${venue.id}.json`);
		expect(result).toMatchObject({ id: venue.id, name: venue.name });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'ticketmaster.venues.get',
			{ venueId: venue.id },
			'completed',
		);
	});

	it('keeps the venue blocks it does not pin', async () => {
		respond({
			...venue,
			boxOfficeInfo: { phoneNumberDetail: '+1 212-465-6000' },
			parkingDetail: 'Garage on 33rd Street.',
		});

		await expect(invoke(Venues.get, { id: venue.id })).resolves.toMatchObject({
			boxOfficeInfo: { phoneNumberDetail: '+1 212-465-6000' },
			parkingDetail: 'Garage on 33rd Street.',
		});
	});
});

describe('classifications.search', () => {
	it('GETs discovery/v2/classifications.json and unwraps the collection', async () => {
		respond(classificationsSearchResponse);

		const result = await invoke(Classifications.search, { size: 2 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/discovery/v2/classifications.json',
		});
		expect(result).toMatchObject({
			page: { size: 2, totalElements: 6, totalPages: 3, number: 0 },
			next_page: 1,
		});
		expect(
			(result as { classifications: unknown[] }).classifications,
		).toHaveLength(1);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'ticketmaster.classifications.search',
			{ page: 0, count: 1, total: 6 },
			'completed',
		);
	});

	it('keeps the nested genre and subgenre levels', async () => {
		respond(classificationsSearchResponse);

		const result = (await invoke(Classifications.search, {})) as {
			classifications: {
				segment?: {
					name?: string;
					_embedded?: { genres?: { name?: string }[] };
				};
			}[];
		};

		expect(result.classifications[0]?.segment?.name).toBe('Arts & Theatre');
		expect(
			result.classifications[0]?.segment?._embedded?.genres?.[0]?.name,
		).toBe('Magic & Illusion');
	});
});

describe('classifications.get', () => {
	it('GETs one classification by ID', async () => {
		respond(classification);

		const result = await invoke(Classifications.get, {
			id: 'KZFzniwnSyZfZ7v7nE',
		});

		expectAuthenticated();
		expect(lastRequest().path).toBe(
			'/discovery/v2/classifications/KZFzniwnSyZfZ7v7nE.json',
		);
		expect(result).toMatchObject({ primary: true });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'ticketmaster.classifications.get',
			{ classificationId: 'KZFzniwnSyZfZ7v7nE' },
			'completed',
		);
	});
});

describe('suggest.get', () => {
	it('GETs discovery/v2/suggest.json and unwraps the embedded collections', async () => {
		respond(suggestResponse);

		const result = await invoke(Suggest.get, { keyword: 'coach' });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/discovery/v2/suggest.json',
		});
		expect(lastRequest().query).toMatchObject({ keyword: 'coach' });
		expect(result).toMatchObject({
			attractions: [attraction],
			events: [event],
			venues: [venue],
			products: [{ id: 'p1', name: 'Parking', type: 'product' }],
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'ticketmaster.suggest.get',
			{ attractions: 1, events: 1, venues: 1, products: 1 },
			'completed',
		);
	});

	it('sends the resource list as repeated parameters', async () => {
		respond(suggestResponse);

		await invoke(Suggest.get, {
			keyword: 'coach',
			resource: ['attractions', 'venues'],
			size: 3,
		});

		expect(lastRequest().query).toMatchObject({
			resource: ['attractions', 'venues'],
			size: '3',
		});
	});

	it('reads an absent collection as empty', async () => {
		respond({
			_links: { self: { href: '/discovery/v2/suggest.json' } },
			_embedded: { venues: [venue] },
		});

		await expect(
			invoke(Suggest.get, { keyword: 'coach' }),
		).resolves.toMatchObject({
			attractions: [],
			events: [],
			venues: [venue],
			products: [],
		});
	});

	it('reads a response with no _embedded as all empty', async () => {
		respond({ _links: { self: { href: '/discovery/v2/suggest.json' } } });

		await expect(
			invoke(Suggest.get, { keyword: 'zzzznotarealterm' }),
		).resolves.toEqual({
			attractions: [],
			events: [],
			venues: [],
			products: [],
		});
	});

	it.each([
		[{ resource: ['concerts'] }],
		[{ resource: [] }],
		[{ size: 0 }],
		[{ size: 201 }],
	])('rejects %j before calling Ticketmaster', async (input) => {
		await expect(invoke(Suggest.get, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('surfaces a rejected key', async () => {
		respond(invalidApiKey, 401);

		await expect(invoke(Suggest.get, { keyword: 'x' })).rejects.toMatchObject({
			status: 401,
			code: 'oauth.v2.InvalidApiKey',
		});
	});
});

describe('what reaches the event log', () => {
	it('logs a count, never the search term or a guest list of results', async () => {
		respond({
			_embedded: { events: [event, secondEvent] },
			page: { size: 20, totalElements: 2, totalPages: 1, number: 0 },
		});

		await invoke(Events.search, { keyword: 'private-secret-query' });

		// The logged payload is the third argument; the first is the context.
		const payload = JSON.stringify(mockLog.mock.calls.map((call) => call[2]));
		expect(payload).not.toContain('private-secret-query');
		expect(payload).not.toContain(event.id);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'ticketmaster.events.search',
			{ page: 0, count: 2, total: 2 },
			'completed',
		);
	});
});
