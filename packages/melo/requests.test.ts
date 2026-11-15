import { MELO_API_BASE } from './client';
import type { SearchesCreateInput } from './endpoints/types';
import { melo } from './index';
import {
	citiesResponse,
	locationAutocompleteLive,
	pointsOfInterestResponse,
	pricePerMeterResponse,
	propertiesListResponse,
	propertyResponse,
	searchCreatedResponse,
	searchesListResponse,
	searchResponse,
	searchUpdatedResponse,
	similarPropertiesResponse,
} from './test-fixtures';
import {
	API_KEY,
	lastCall,
	makeContext,
	respondEmpty,
	respondLd,
	withView,
} from './test-helpers';
import {
	PRICE_PER_METER_INPUT,
	PRICE_PER_METER_SPEC_PARAMS,
	PRICE_PER_METER_WIRE,
	PROPERTIES_LIST_INPUT,
	PROPERTIES_LIST_SPEC_PARAMS,
	PROPERTIES_LIST_WIRE,
} from './test-wire';

const PROPERTY_ID = '3f2b8c1e-6d4a-4f7e-9a21-5c0d8e7b1a42';
const SEARCH_ID = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
	jest.restoreAllMocks();
});

const plugin = melo({ key: API_KEY });
// `CorsairPlugin.endpoints` is optional on the type; this plugin always sets it.
const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints>;
const ctx = makeContext();

/** Maps a wire key back to the spec parameter it carries. */
function specNameOf(wireKey: string): string {
	return wireKey.replace(/\[\d+\].*$/, '').replace(/\[\]$/, '');
}

function expectAuth(call: ReturnType<typeof lastCall>) {
	expect(call.headers.get('x-api-key')).toBe(API_KEY);
	expect(call.headers.get('accept')).toBe('application/ld+json');
	expect(call.headers.get('authorization')).toBeNull();
	expect(call.url).not.toContain(API_KEY);
}

describe('properties requests', () => {
	it('properties.list GETs /documents/properties with every filter, order and paging field', async () => {
		respondLd(
			fetchMock,
			withView(propertiesListResponse, '/documents/properties'),
		);

		const result = await endpoints.properties.list(ctx, PROPERTIES_LIST_INPUT);

		const call = lastCall(fetchMock);
		expect(call.method).toBe('GET');
		expect(call.parsed.origin).toBe(MELO_API_BASE);
		expect(call.parsed.pathname).toBe('/documents/properties');
		expectAuth(call);
		expect(call.query).toEqual(PROPERTIES_LIST_WIRE);
		// Every parameter the spec lists is sent, none is dropped or invented.
		expect(
			[...new Set(Object.keys(call.query).map(specNameOf))].sort(),
		).toEqual([...PROPERTIES_LIST_SPEC_PARAMS].sort());
		expect(call.body).toBeUndefined();
		expect(result['hydra:member'].length).toBeGreaterThan(0);
	});

	it('properties.list sends nothing the caller did not ask for', async () => {
		respondLd(
			fetchMock,
			withView(propertiesListResponse, '/documents/properties'),
		);

		await endpoints.properties.list(ctx, {});

		expect(lastCall(fetchMock).parsed.search).toBe('');
	});

	it('properties.list sends withCoherentPrice: null as an empty value, which disables the filter', async () => {
		respondLd(
			fetchMock,
			withView(propertiesListResponse, '/documents/properties'),
		);

		await endpoints.properties.list(ctx, { withCoherentPrice: null });

		expect(lastCall(fetchMock).query).toEqual({ withCoherentPrice: [''] });
	});

	it('properties.list sends withCoherentPrice: false as "false"', async () => {
		respondLd(
			fetchMock,
			withView(propertiesListResponse, '/documents/properties'),
		);

		await endpoints.properties.list(ctx, { withCoherentPrice: false });

		expect(lastCall(fetchMock).query).toEqual({ withCoherentPrice: ['false'] });
	});

	it('properties.get GETs /documents/properties/{id}', async () => {
		respondLd(fetchMock, propertyResponse);

		const result = await endpoints.properties.get(ctx, { id: PROPERTY_ID });

		const call = lastCall(fetchMock);
		expect(call.method).toBe('GET');
		expect(call.parsed.pathname).toBe(`/documents/properties/${PROPERTY_ID}`);
		expect(call.parsed.search).toBe('');
		expectAuth(call);
		expect(result['@type']).toBe('PropertyDocument');
	});

	it('properties.listSimilar GETs /similar-properties with fromDate, every order key and paging', async () => {
		respondLd(
			fetchMock,
			withView(
				similarPropertiesResponse,
				'/documents/properties/x/similar-properties',
			),
		);

		await endpoints.properties.listSimilar(ctx, {
			id: PROPERTY_ID,
			fromDate: '2020-01-10',
			order: {
				createdAt: 'asc',
				updatedAt: 'desc',
				pricePerMeter: 'asc',
				price: 'desc',
				surface: 'asc',
			},
			page: 3,
			itemsPerPage: 20,
		});

		const call = lastCall(fetchMock);
		expect(call.method).toBe('GET');
		expect(call.parsed.pathname).toBe(
			`/documents/properties/${PROPERTY_ID}/similar-properties`,
		);
		expectAuth(call);
		expect(call.query).toEqual({
			fromDate: ['2020-01-10'],
			'order[createdAt]': ['asc'],
			'order[updatedAt]': ['desc'],
			'order[pricePerMeter]': ['asc'],
			'order[price]': ['desc'],
			'order[surface]': ['asc'],
			page: ['3'],
			itemsPerPage: ['20'],
		});
		// The id travels in the path only.
		expect(call.query.id).toBeUndefined();
	});
});

describe('indicators requests', () => {
	it('indicators.pricePerMeter GETs /indicators/price_per_meter with every filter, interval, order and paging field', async () => {
		respondLd(
			fetchMock,
			withView(pricePerMeterResponse, '/indicators/price_per_meter'),
		);

		const result = await endpoints.indicators.pricePerMeter(
			ctx,
			PRICE_PER_METER_INPUT,
		);

		const call = lastCall(fetchMock);
		expect(call.method).toBe('GET');
		expect(call.parsed.pathname).toBe('/indicators/price_per_meter');
		expectAuth(call);
		expect(call.query).toEqual(PRICE_PER_METER_WIRE);
		expect(call.query.aggregationInterval).toEqual(['year']);
		expect(
			[...new Set(Object.keys(call.query).map(specNameOf))].sort(),
		).toEqual([...PRICE_PER_METER_SPEC_PARAMS].sort());
		expect(result['hydra:member'][0]?.median).toBe(7601.5);
	});

	it('indicators.pointsOfInterest GETs /indicators/points_of_interest with facilities[], lat, lon and radius', async () => {
		respondLd(fetchMock, pointsOfInterestResponse);

		const result = await endpoints.indicators.pointsOfInterest(ctx, {
			facilities: ['school', 'hospital'],
			lat: 48.864716,
			lon: 2.349014,
			radius: 0.5,
		});

		const call = lastCall(fetchMock);
		expect(call.method).toBe('GET');
		expect(call.parsed.pathname).toBe('/indicators/points_of_interest');
		expectAuth(call);
		expect(call.query).toEqual({
			'facilities[]': ['school', 'hospital'],
			lat: ['48.864716'],
			lon: ['2.349014'],
			radius: ['0.5'],
		});
		expect(result['hydra:member'].length).toBeGreaterThan(0);
	});

	it('indicators.locations GETs /public/location-autocomplete with query and both exclusion lists', async () => {
		respondLd(fetchMock, locationAutocompleteLive);

		const result = await endpoints.indicators.locations(ctx, {
			query: 'paris',
			excludedCitiesIds: ['/cities/37008', '/cities/30946'],
			excludedDepartmentsIds: ['/departments/77'],
		});

		const call = lastCall(fetchMock);
		expect(call.method).toBe('GET');
		expect(call.parsed.pathname).toBe('/public/location-autocomplete');
		// The API serves this route without a key, but corsair resolves a key
		// before any endpoint runs, so the header is always sent.
		expectAuth(call);
		expect(call.query).toEqual({
			query: ['paris'],
			'excludedCitiesIds[]': ['/cities/37008', '/cities/30946'],
			'excludedDepartmentsIds[]': ['/departments/77'],
		});
		expect(result['hydra:member'][0]?.['@id']).toBe('/departments/77');
	});

	it('indicators.cities GETs /cities with every filter, polygon points, order and page', async () => {
		respondLd(fetchMock, citiesResponse);

		await endpoints.indicators.cities(ctx, {
			excludeGroupedCities: true,
			insee: ['01004', '01005'],
			polygon: [
				{ lat: 43.12, lon: 5.93 },
				{ lat: 43.12, lon: 6.01 },
				{ lat: 43.07, lon: 6.01 },
			],
			libelle: 'AMBERIEU EN BUGEY',
			name: 'Ambérieu-en-Bugey',
			order: { name: 'desc' },
			page: 2,
			slug: 'amberieu-en-bugey',
			zipcode: ['01500', '01330'],
		});

		const call = lastCall(fetchMock);
		expect(call.method).toBe('GET');
		expect(call.parsed.pathname).toBe('/cities');
		expectAuth(call);
		expect(call.query).toEqual({
			excludeGroupedCities: ['true'],
			'insee[]': ['01004', '01005'],
			'polygon[0][lat]': ['43.12'],
			'polygon[0][lon]': ['5.93'],
			'polygon[1][lat]': ['43.12'],
			'polygon[1][lon]': ['6.01'],
			'polygon[2][lat]': ['43.07'],
			'polygon[2][lon]': ['6.01'],
			libelle: ['AMBERIEU EN BUGEY'],
			name: ['Ambérieu-en-Bugey'],
			'order[name]': ['desc'],
			page: ['2'],
			slug: ['amberieu-en-bugey'],
			'zipcode[]': ['01500', '01330'],
		});
	});

	it('indicators.cities sends a single insee and zipcode as plain parameters', async () => {
		respondLd(fetchMock, citiesResponse);

		await endpoints.indicators.cities(ctx, {
			insee: '01004',
			zipcode: '01500',
		});

		expect(lastCall(fetchMock).query).toEqual({
			insee: ['01004'],
			zipcode: ['01500'],
		});
	});
});

const FULL_SEARCH: SearchesCreateInput = {
	bedroomMin: 1,
	bedroomMax: 4,
	budgetMax: 1500000,
	budgetMin: 100000,
	endpointRecipient: 'https://hook.example.com/match',
	eventEndpoint: 'https://hook.example.com/event',
	excludedCities: ['/cities/1'],
	excludedSites: ['site-a.example'],
	excludedSiteCategories: ['category-a'],
	expressions: [
		[{ word: 'travaux', options: { includes: true, strict: false } }],
	],
	furnished: true,
	geoAccuracy: 2,
	geoShapes: [
		[
			[6.063201, 44.549092],
			[6.063201, 44.543009],
			[6.073453, 44.543293],
		],
	],
	hidePropertyContact: true,
	includedCities: ['/cities/30953'],
	includedDepartments: ['/departments/77'],
	includedSiteCategories: ['category-b'],
	includedSites: ['site-b.example'],
	includedZipcodes: ['75017'],
	includedZipcodesInsee: ['75117'],
	landSurfaceMax: 500,
	landSurfaceMin: 50,
	lat: 48.864716,
	lon: 2.349014,
	notificationEnabled: true,
	notificationRecipient: 'foo@bar.com',
	pricePerMeterMax: 12000,
	pricePerMeterMin: 3000,
	propertyTypes: [0, 1],
	publisherTypes: [0, 1],
	radius: 20,
	roomMin: 2,
	roomMax: 6,
	subscribedEvents: ['ad.update.price', 'property.ad.create'],
	surfaceMax: 200,
	surfaceMin: 20,
	title: 'mySearch',
	transactionType: 0,
	withCoherentPrice: true,
	withVirtualTour: true,
};

describe('searches requests', () => {
	it('searches.list GETs /searches with notificationEnabled, order[title], page and title', async () => {
		respondLd(fetchMock, withView(searchesListResponse, '/searches'));

		await endpoints.searches.list(ctx, {
			notificationEnabled: true,
			order: { title: 'asc' },
			page: 2,
			title: 'mySearch',
		});

		const call = lastCall(fetchMock);
		expect(call.method).toBe('GET');
		expect(call.parsed.pathname).toBe('/searches');
		expectAuth(call);
		expect(call.query).toEqual({
			notificationEnabled: ['true'],
			'order[title]': ['asc'],
			page: ['2'],
			title: ['mySearch'],
		});
	});

	it('searches.get GETs /searches/{id}', async () => {
		respondLd(fetchMock, searchResponse);

		await endpoints.searches.get(ctx, { id: SEARCH_ID });

		const call = lastCall(fetchMock);
		expect(call.method).toBe('GET');
		expect(call.parsed.pathname).toBe(`/searches/${SEARCH_ID}`);
		expect(call.parsed.search).toBe('');
		expectAuth(call);
	});

	it('searches.create POSTs every field as a JSON body to /searches', async () => {
		respondLd(fetchMock, searchCreatedResponse, 201);

		const result = await endpoints.searches.create(ctx, FULL_SEARCH);

		const call = lastCall(fetchMock);
		expect(call.method).toBe('POST');
		expect(call.parsed.pathname).toBe('/searches');
		expect(call.parsed.search).toBe('');
		expectAuth(call);
		expect(call.headers.get('content-type')).toBe('application/json');
		expect(call.body).toEqual(FULL_SEARCH);
		expect(result.title).toBe('mySearch');
	});

	it('searches.create sends withCoherentPrice: null in the body, which disables the filter', async () => {
		respondLd(fetchMock, searchCreatedResponse, 201);

		await endpoints.searches.create(ctx, {
			title: 'mySearch',
			transactionType: 0,
			propertyTypes: [0],
			withCoherentPrice: null,
		});

		expect(lastCall(fetchMock).body).toEqual({
			title: 'mySearch',
			transactionType: 0,
			propertyTypes: [0],
			withCoherentPrice: null,
		});
	});

	it('searches.update PUTs every field except the id as a JSON body to /searches/{id}', async () => {
		respondLd(fetchMock, searchUpdatedResponse);

		await endpoints.searches.update(ctx, { id: SEARCH_ID, ...FULL_SEARCH });

		const call = lastCall(fetchMock);
		expect(call.method).toBe('PUT');
		expect(call.parsed.pathname).toBe(`/searches/${SEARCH_ID}`);
		expect(call.parsed.search).toBe('');
		expectAuth(call);
		expect(call.headers.get('content-type')).toBe('application/json');
		expect(call.body).toEqual(FULL_SEARCH);
		expect(call.body?.id).toBeUndefined();
	});

	it('searches.delete DELETEs /searches/{id} with no body and reports the 204 as deleted', async () => {
		respondEmpty(fetchMock, 204);

		const result = await endpoints.searches.delete(ctx, { id: SEARCH_ID });

		const call = lastCall(fetchMock);
		expect(call.method).toBe('DELETE');
		expect(call.parsed.pathname).toBe(`/searches/${SEARCH_ID}`);
		expect(call.parsed.search).toBe('');
		expectAuth(call);
		expect(call.body).toBeUndefined();
		expect(result).toEqual({ id: SEARCH_ID, deleted: true });
	});
});

describe('webhooks requests', () => {
	it('webhooks.simulate GETs /webhook-tester with endpoint and eventType', async () => {
		respondEmpty(fetchMock, 200);

		const result = await endpoints.webhooks.simulate(ctx, {
			endpoint: 'https://example.com/webhook?token=a&b=c',
			eventType: 'ad.update.price',
		});

		const call = lastCall(fetchMock);
		expect(call.method).toBe('GET');
		expect(call.parsed.pathname).toBe('/webhook-tester');
		expectAuth(call);
		// The endpoint's own query string is encoded, not merged into ours.
		expect(call.query).toEqual({
			endpoint: ['https://example.com/webhook?token=a&b=c'],
			eventType: ['ad.update.price'],
		});
		expect(result).toEqual({
			sent: true,
			endpoint: 'https://example.com/webhook?token=a&b=c',
			simulated: 'ad.update.price',
		});
	});

	it('webhooks.simulate omits eventType to simulate a match', async () => {
		respondEmpty(fetchMock, 200);

		const result = await endpoints.webhooks.simulate(ctx, {
			endpoint: 'https://example.com/webhook',
		});

		expect(lastCall(fetchMock).query).toEqual({
			endpoint: ['https://example.com/webhook'],
		});
		expect(result.simulated).toBe('match');
	});

	it('webhooks.simulate still reports sent when a 200 carries a text body', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response('OK', {
				status: 200,
				headers: { 'Content-Type': 'text/plain' },
			}),
		);

		const result = await endpoints.webhooks.simulate(ctx, {
			endpoint: 'https://example.com/webhook',
		});

		expect(result.sent).toBe(true);
	});
});
