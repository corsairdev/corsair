import { z } from 'zod';
import { nextPageOf } from './endpoints/pagination';
import type { SearchesCreateInput } from './endpoints/types';
import { MeloEndpointInputSchemas as Inputs } from './endpoints/types';
import { melo } from './index';
import {
	citiesResponse,
	locationAutocompleteLive,
	locationsDocsResponse,
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
	captureError,
	makeContext,
	respondEmpty,
	respondLd,
	withView,
} from './test-helpers';

const PROPERTY_ID = '38cb65b9-2965-4bd0-bc9b-2b8a8be7c457';
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

function without<T extends object, K extends keyof T>(
	source: T,
	key: K,
): Omit<T, K> {
	const { [key]: _removed, ...rest } = source;
	return rest;
}

const VALID_SEARCH: SearchesCreateInput = {
	title: 'mySearch',
	transactionType: 0,
	propertyTypes: [0, 1],
};

describe('output parsing', () => {
	it('properties.list parses the docs example and reports the next page', async () => {
		respondLd(
			fetchMock,
			withView(propertiesListResponse, '/documents/properties', 2),
		);

		const result = await endpoints.properties.list(ctx, {});

		expect(result['hydra:totalItems']).toBe(1);
		expect(result['hydra:member']).toHaveLength(1);
		expect(result['hydra:member'][0]?.uuid).toBe(PROPERTY_ID);
		expect(result.nextPage).toBe(2);
	});

	it('properties.list answers a null nextPage on the last page', async () => {
		respondLd(
			fetchMock,
			withView(propertiesListResponse, '/documents/properties'),
		);

		const result = await endpoints.properties.list(ctx, {});

		expect(result.nextPage).toBeNull();
	});

	it('properties.list answers a null nextPage when the response has no hydra:view', async () => {
		const { 'hydra:view': _view, ...withoutView } = propertiesListResponse;
		respondLd(fetchMock, withoutView);

		const result = await endpoints.properties.list(ctx, {});

		expect(result.nextPage).toBeNull();
	});

	it('properties.list keeps the raw hydra fields beside nextPage', async () => {
		respondLd(
			fetchMock,
			withView(propertiesListResponse, '/documents/properties', 4),
		);

		const result = await endpoints.properties.list(ctx, { page: 3 });

		expect(result['hydra:view']?.['hydra:next']).toBe(
			'/documents/properties?page=4',
		);
		expect(result['hydra:view']?.['hydra:last']).toBe(
			'/documents/properties?page=9',
		);
	});

	it('properties.list fails loudly on the docs placeholder hydra:next instead of ending the listing', async () => {
		// The docs example carries `"hydra:next": "string"`, which is not a link.
		respondLd(fetchMock, propertiesListResponse);

		const error = await captureError(endpoints.properties.list(ctx, {}));

		expect(error).toBeInstanceOf(Error);
		expect(String(error)).toContain('hydra:next without a usable page number');
	});

	it('properties.get parses the docs example, nested adverts and city included', async () => {
		respondLd(fetchMock, propertyResponse);

		const result = await endpoints.properties.get(ctx, { id: PROPERTY_ID });

		expect(result.uuid).toBe(PROPERTY_ID);
		expect(result.propertyType).toBe(0);
		expect(result.transactionType).toBe(1);
		expect(result.price).toBe(950);
		expect(result.adverts?.[0]?.events?.[0]?.fieldNewValue).toBe('950');
	});

	it('properties.listSimilar parses the docs example', async () => {
		respondLd(
			fetchMock,
			withView(
				similarPropertiesResponse,
				'/documents/properties/x/similar-properties',
				2,
			),
		);

		const result = await endpoints.properties.listSimilar(ctx, {
			id: PROPERTY_ID,
		});

		expect(result['hydra:member']).toHaveLength(1);
		expect(result.nextPage).toBe(2);
	});

	it('parses an advert event whose old and new values are booleans, as on an expiry', async () => {
		// Real event from a live similar-properties answer (11-11): an advert
		// going from not expired to expired carries booleans, not strings.
		const expiredEvent = {
			createdAt: '2026-11-05T07:03:37+01:00',
			fieldName: 'expired',
			fieldNewValue: true,
			fieldOldValue: false,
			percentVariation: null,
		};
		const [advert] = propertyResponse.adverts;
		respondLd(fetchMock, {
			...propertyResponse,
			adverts: [{ ...advert, events: [expiredEvent] }],
		});

		const result = await endpoints.properties.get(ctx, { id: PROPERTY_ID });

		expect(result.adverts?.[0]?.events?.[0]).toMatchObject({
			fieldName: 'expired',
			fieldNewValue: true,
			fieldOldValue: false,
		});
	});

	it('indicators.pricePerMeter parses average, median and the series', async () => {
		respondLd(
			fetchMock,
			withView(pricePerMeterResponse, '/indicators/price_per_meter'),
		);

		const result = await endpoints.indicators.pricePerMeter(ctx, {});

		const indicator = result['hydra:member'][0];
		expect(indicator?.average).toBe(7532.48);
		expect(indicator?.median).toBe(7601.5);
		expect(indicator?.series).toMatchObject({ '2023-01': 7450.6 });
	});

	it('indicators.pricePerMeter accepts a series PHP sent as an empty array', async () => {
		respondLd(fetchMock, {
			'hydra:member': [{ average: 0, median: 0, series: [] }],
			'hydra:totalItems': 1,
		});

		const result = await endpoints.indicators.pricePerMeter(ctx, {});

		expect(result['hydra:member'][0]?.series).toEqual([]);
	});

	it('indicators.pointsOfInterest parses named, unnamed and attribute-less points', async () => {
		respondLd(fetchMock, pointsOfInterestResponse);

		const result = await endpoints.indicators.pointsOfInterest(ctx, {
			facilities: ['school'],
			lat: 48.8803424,
			lon: 2.333215,
			radius: 0.5,
		});

		expect(result['hydra:totalItems']).toBe(21);
		expect(result['hydra:member'][0]?.attributes).toEqual({
			schoolType: 'maternelle',
			operatorType: 'public',
		});
		// Real examples carry `name: null` and `attributes: []` (an empty PHP array).
		expect(result['hydra:member'][20]?.name).toBeNull();
		expect(result['hydra:member'][20]?.attributes).toEqual([]);
	});

	it('indicators.locations parses a real answer, with integer ids and a null department location', async () => {
		respondLd(fetchMock, locationAutocompleteLive);

		const result = await endpoints.indicators.locations(ctx, {
			query: 'paris',
		});

		const [department, city] = result['hydra:member'];
		expect(department?.['@type']).toBe('Department');
		expect(department?.id).toBe(77);
		expect(department?.location).toBeNull();
		expect(city?.['@id']).toBe('/cities/37008');
		expect(city?.location?.lat).toBeCloseTo(48.856918);
		expect(result['hydra:totalItems']).toBe(32);
	});

	it('indicators.locations parses the docs example, whose id is a string', async () => {
		respondLd(fetchMock, locationsDocsResponse);

		const result = await endpoints.indicators.locations(ctx, {
			query: 'lille',
		});

		expect(result['hydra:member'][0]?.id).toBe('37087');
		expect(result['hydra:member'][0]?.groupedCityNames).toContain('Euralille');
	});

	it('indicators.locations carries no nextPage, because the route does not page', async () => {
		respondLd(fetchMock, locationAutocompleteLive);

		const result = await endpoints.indicators.locations(ctx, {
			query: 'paris',
		});

		expect('nextPage' in result).toBe(false);
	});

	it('indicators.cities parses null names inside the parent city', async () => {
		respondLd(fetchMock, citiesResponse);

		const result = await endpoints.indicators.cities(ctx, {});

		expect(result['hydra:member']).toHaveLength(2);
		expect(result['hydra:member'][0]?.insee).toBe('01004');
		expect(result['hydra:member'][0]?.cityParent).toMatchObject({ name: null });
		expect(result.nextPage).toBeNull();
	});

	it('searches.list parses the docs example and its nextPage', async () => {
		respondLd(fetchMock, withView(searchesListResponse, '/searches', 2));

		const result = await endpoints.searches.list(ctx, {});

		expect(result['hydra:member']).toHaveLength(1);
		expect(result.nextPage).toBe(2);
	});

	it('searches.get parses the docs example', async () => {
		respondLd(fetchMock, searchResponse);

		const result = await endpoints.searches.get(ctx, { id: SEARCH_ID });

		expect(result.endpointRecipient).toBe(
			'https://www.mycompany.com/webhook_match',
		);
		expect(result.subscribedEvents).toBeDefined();
	});

	it('searches.create parses the created search, nulls and empty arrays included', async () => {
		respondLd(fetchMock, searchCreatedResponse, 201);

		const result = await endpoints.searches.create(ctx, VALID_SEARCH);

		expect(result['@id']).toBe('/searches/xyz');
		expect(result.title).toBe('mySearch');
		expect(result.roomMin).toBeNull();
		expect(result.lastAlertAt).toBeNull();
		expect(result.propertyTypes).toEqual([0, 1]);
		expect(result.includedCities).toEqual([]);
	});

	it('searches.update parses the updated search', async () => {
		respondLd(fetchMock, searchUpdatedResponse);

		const result = await endpoints.searches.update(ctx, {
			id: SEARCH_ID,
			...VALID_SEARCH,
		});

		expect(result.endpointRecipient).toBe(
			'https://www.mycompany.com/webhook_match',
		);
		expect(result.furnished).toBe(true);
	});

	it('searches.delete reports the deleted id from a bodyless 204', async () => {
		respondEmpty(fetchMock, 204);

		const result = await endpoints.searches.delete(ctx, { id: SEARCH_ID });

		expect(result).toEqual({ id: SEARCH_ID, deleted: true });
	});

	it('webhooks.simulate reports what was simulated from a bodyless 200', async () => {
		respondEmpty(fetchMock, 200);

		const result = await endpoints.webhooks.simulate(ctx, {
			endpoint: 'https://example.com/webhook',
			eventType: 'property.ad.create',
		});

		expect(result).toEqual({
			sent: true,
			endpoint: 'https://example.com/webhook',
			simulated: 'property.ad.create',
		});
	});
});

describe('output rejections', () => {
	it('rejects the bare array Melo sends for Accept: application/json, which has no hydra:member', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify(locationAutocompleteLive['hydra:member']), {
				status: 200,
				headers: { 'Content-Type': 'application/json; charset=utf-8' },
			}),
		);

		const error = await captureError(
			endpoints.indicators.locations(ctx, { query: 'paris' }),
		);

		expect(error).toBeInstanceOf(z.ZodError);
	});

	it('rejects a wrong-shaped payload: an object where hydra:member should be an array', async () => {
		respondLd(fetchMock, {
			'hydra:member': { uuid: 'x' },
			'hydra:totalItems': 1,
		});

		const error = await captureError(endpoints.properties.list(ctx, {}));

		expect(error).toBeInstanceOf(z.ZodError);
	});

	it('accepts a propertyType, publisher type or fees value Melo adds after 0 to 6', async () => {
		const [advert] = propertyResponse.adverts;
		respondLd(fetchMock, {
			...propertyResponse,
			propertyType: 9,
			publisherTypes: [0, 2],
			transactionType: 2,
			adverts: [
				{
					...advert,
					feesResponsibility: 2,
					publisher: { ...advert?.publisher, type: 2 },
				},
			],
		});

		const result = await endpoints.properties.get(ctx, { id: PROPERTY_ID });

		expect(result.propertyType).toBe(9);
		expect(result.publisherTypes).toEqual([0, 2]);
		expect(result.transactionType).toBe(2);
		expect(result.adverts?.[0]?.feesResponsibility).toBe(2);
		expect(result.adverts?.[0]?.publisher?.type).toBe(2);
	});

	it('still rejects a propertyType that is not a number', async () => {
		respondLd(fetchMock, { ...propertyResponse, propertyType: 'house' });

		const error = await captureError(
			endpoints.properties.get(ctx, { id: PROPERTY_ID }),
		);

		expect(error).toBeInstanceOf(z.ZodError);
	});

	it('rejects a malformed known field: a price sent as a string', async () => {
		respondLd(fetchMock, { ...propertyResponse, price: '950' });

		const error = await captureError(
			endpoints.properties.get(ctx, { id: PROPERTY_ID }),
		);

		expect(error).toBeInstanceOf(z.ZodError);
	});

	it('returns a created search whose enums carry values Melo added later', async () => {
		respondLd(fetchMock, {
			...searchCreatedResponse,
			transactionType: 5,
			propertyTypes: [0, 7],
			publisherTypes: [2],
			subscribedEvents: ['ad.update.price', 'ad.deleted'],
		});

		const result = await endpoints.searches.create(ctx, VALID_SEARCH);

		expect(result['@id']).toBe(searchCreatedResponse['@id']);
		expect(result.transactionType).toBe(5);
		expect(result.propertyTypes).toEqual([0, 7]);
		expect(result.publisherTypes).toEqual([2]);
		expect(result.subscribedEvents).toEqual(['ad.update.price', 'ad.deleted']);
	});

	it('still rejects a subscribedEvents entry that is not a string', async () => {
		respondLd(fetchMock, {
			...searchCreatedResponse,
			subscribedEvents: [42],
		});

		const error = await captureError(
			endpoints.searches.create(ctx, VALID_SEARCH),
		);

		expect(error).toBeInstanceOf(z.ZodError);
	});

	it('rejects a 2xx whose body is not JSON, on an operation that returns data', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response('<html>maintenance</html>', {
				status: 200,
				headers: { 'Content-Type': 'text/html' },
			}),
		);

		const error = await captureError(
			endpoints.properties.get(ctx, { id: PROPERTY_ID }),
		);

		expect(error).toBeInstanceOf(Error);
		expect(String(error)).toContain('not JSON');
	});

	it('rejects a collection page whose hydra:next has no page number', async () => {
		respondLd(fetchMock, {
			...citiesResponse,
			'hydra:view': { 'hydra:next': '/cities?cursor=abc' },
		});

		const error = await captureError(endpoints.indicators.cities(ctx, {}));

		expect(String(error)).toContain('without a usable page number');
	});
});

describe('nextPageOf', () => {
	it('reads the page from a relative link, with other parameters before and after it', () => {
		expect(
			nextPageOf({
				'hydra:view': {
					'hydra:next':
						'/documents/properties?propertyTypes%5B%5D=1&page=7&itemsPerPage=30',
				},
			}),
		).toBe(7);
	});

	it('reads the page from an absolute link', () => {
		expect(
			nextPageOf({
				'hydra:view': {
					'hydra:next': 'https://api.stream.estate/cities?page=2',
				},
			}),
		).toBe(2);
	});

	it.each([
		['no view', {}],
		['a view with no next link', { 'hydra:view': { '@id': '/x' } }],
		['a null next link', { 'hydra:view': { 'hydra:next': null } }],
	])('answers null for %s', (_name, body) => {
		expect(nextPageOf(body)).toBeNull();
	});

	it.each([
		['page=0', '/x?page=0'],
		['page=abc', '/x?page=abc'],
		['page=1.5', '/x?page=1.5'],
		['an empty page', '/x?page='],
		['no page', '/x?itemsPerPage=5'],
	])('throws for a link with %s', (_name, next) => {
		expect(() => nextPageOf({ 'hydra:view': { 'hydra:next': next } })).toThrow(
			'usable page number',
		);
	});

	it('throws when the next link is not a string', () => {
		expect(() => nextPageOf({ 'hydra:view': { 'hydra:next': 4 } })).toThrow(
			'not a string',
		);
	});
});

describe('input constraints from the spec', () => {
	const accepts = (schema: z.ZodType, input: object) =>
		schema.safeParse(input).success;

	it('pins itemsPerPage at its documented maximum of 30, and allows 0 for a count-only call', () => {
		const cases: [z.ZodType, object][] = [
			[Inputs.propertiesList, {}],
			[Inputs.propertiesListSimilar, { id: PROPERTY_ID }],
			[Inputs.indicatorsPricePerMeter, {}],
		];
		for (const [schema, base] of cases) {
			expect(accepts(schema, { ...base, itemsPerPage: 30 })).toBe(true);
			expect(accepts(schema, { ...base, itemsPerPage: 0 })).toBe(true);
			expect(accepts(schema, { ...base, itemsPerPage: 31 })).toBe(false);
			expect(accepts(schema, { ...base, itemsPerPage: -1 })).toBe(false);
			expect(accepts(schema, { ...base, itemsPerPage: 2.5 })).toBe(false);
		}
	});

	it('requires page to be a positive integer', () => {
		for (const schema of [
			Inputs.propertiesList,
			Inputs.indicatorsCities,
			Inputs.searchesList,
		]) {
			expect(accepts(schema, { page: 1 })).toBe(true);
			expect(accepts(schema, { page: 0 })).toBe(false);
			expect(accepts(schema, { page: 1.5 })).toBe(false);
		}
	});

	it('does not send a request for itemsPerPage above the maximum', async () => {
		const error = await captureError(
			endpoints.properties.list(ctx, { itemsPerPage: 31 }),
		);

		expect(error).toBeInstanceOf(z.ZodError);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('constrains the documented enums on properties.list', () => {
		const schema = Inputs.propertiesList;
		expect(accepts(schema, { energyCategories: ['A', 'G'] })).toBe(true);
		expect(accepts(schema, { energyCategories: ['H'] })).toBe(false);
		expect(accepts(schema, { greenHouseGasCategories: ['a'] })).toBe(false);
		expect(accepts(schema, { propertyTypes: [0, 6] })).toBe(true);
		expect(accepts(schema, { propertyTypes: [7] })).toBe(false);
		expect(accepts(schema, { publisherTypes: [1] })).toBe(true);
		expect(accepts(schema, { publisherTypes: [2] })).toBe(false);
		expect(accepts(schema, { transactionType: 1 })).toBe(true);
		expect(accepts(schema, { transactionType: 2 })).toBe(false);
		expect(accepts(schema, { feesResponsibility: 1 })).toBe(true);
		expect(accepts(schema, { feesResponsibility: 2 })).toBe(false);
		expect(accepts(schema, { geoAccuracy: [1, 2] })).toBe(true);
		expect(accepts(schema, { geoAccuracy: [3] })).toBe(false);
		expect(accepts(schema, { sortMode: 'advert' })).toBe(true);
		expect(accepts(schema, { sortMode: 'price' })).toBe(false);
		expect(accepts(schema, { order: { price: 'asc' } })).toBe(true);
		expect(accepts(schema, { order: { price: 'up' } })).toBe(false);
		expect(accepts(schema, { order: { name: 'asc' } })).toBe(false);
	});

	it('does not offer the properties-only filters on price_per_meter', () => {
		expect(accepts(Inputs.indicatorsPricePerMeter, { landSurfaceMin: 1 })).toBe(
			false,
		);
		expect(
			accepts(Inputs.indicatorsPricePerMeter, { order: { price: 'asc' } }),
		).toBe(false);
		expect(accepts(Inputs.propertiesList, { landSurfaceMin: 1 })).toBe(true);
	});

	it('rejects a misspelled filter instead of silently returning unfiltered data', () => {
		expect(accepts(Inputs.propertiesList, { budgetMaxx: 100 })).toBe(false);
		expect(accepts(Inputs.searchesList, { notifications: true })).toBe(false);
	});

	it('constrains aggregationInterval to month and year', () => {
		expect(
			accepts(Inputs.indicatorsPricePerMeter, { aggregationInterval: 'year' }),
		).toBe(true);
		expect(
			accepts(Inputs.indicatorsPricePerMeter, { aggregationInterval: 'week' }),
		).toBe(false);
	});

	it('requires ids to be UUIDs', () => {
		for (const schema of [
			Inputs.propertiesGet,
			Inputs.propertiesListSimilar,
			Inputs.searchesGet,
			Inputs.searchesDelete,
		]) {
			expect(accepts(schema, { id: PROPERTY_ID })).toBe(true);
			expect(accepts(schema, { id: 'xyz' })).toBe(false);
			expect(accepts(schema, { id: '../searches' })).toBe(false);
			expect(accepts(schema, {})).toBe(false);
		}
	});

	it('requires facilities, lat, lon and radius on pointsOfInterest, and limits the categories', () => {
		const valid = { facilities: ['school'], lat: 1, lon: 2, radius: 0.5 };
		const schema = Inputs.indicatorsPointsOfInterest;
		expect(accepts(schema, valid)).toBe(true);
		expect(accepts(schema, { ...valid, facilities: [] })).toBe(false);
		expect(accepts(schema, { ...valid, facilities: ['museum'] })).toBe(false);
		expect(accepts(schema, without(valid, 'facilities'))).toBe(false);
		expect(accepts(schema, without(valid, 'lat'))).toBe(false);
		expect(accepts(schema, without(valid, 'lon'))).toBe(false);
		expect(accepts(schema, without(valid, 'radius'))).toBe(false);
		expect(
			accepts(schema, {
				facilities: [
					'kindergarten',
					'school',
					'restaurant',
					'hospital',
					'parking',
				],
				lat: 1,
				lon: 2,
				radius: 1,
			}),
		).toBe(true);
	});

	it('requires title, transactionType and propertyTypes to create or update a search', () => {
		const cases: [z.ZodType, object][] = [
			[Inputs.searchesCreate, {}],
			[Inputs.searchesUpdate, { id: SEARCH_ID }],
		];
		for (const [schema, base] of cases) {
			expect(accepts(schema, { ...base, ...VALID_SEARCH })).toBe(true);
			expect(
				accepts(schema, { ...base, ...without(VALID_SEARCH, 'title') }),
			).toBe(false);
			expect(
				accepts(schema, {
					...base,
					...without(VALID_SEARCH, 'transactionType'),
				}),
			).toBe(false);
			expect(
				accepts(schema, { ...base, ...without(VALID_SEARCH, 'propertyTypes') }),
			).toBe(false);
		}
		expect(accepts(Inputs.searchesUpdate, VALID_SEARCH)).toBe(false);
	});

	it('constrains search enums, subscribedEvents and the notification email', () => {
		const schema = Inputs.searchesCreate;
		expect(accepts(schema, { ...VALID_SEARCH, transactionType: 2 })).toBe(
			false,
		);
		expect(accepts(schema, { ...VALID_SEARCH, propertyTypes: [7] })).toBe(
			false,
		);
		expect(accepts(schema, { ...VALID_SEARCH, publisherTypes: [2] })).toBe(
			false,
		);
		expect(accepts(schema, { ...VALID_SEARCH, geoAccuracy: 1 })).toBe(true);
		expect(accepts(schema, { ...VALID_SEARCH, geoAccuracy: 3 })).toBe(false);
		expect(
			accepts(schema, {
				...VALID_SEARCH,
				subscribedEvents: ['ad.update.price'],
			}),
		).toBe(true);
		expect(
			accepts(schema, {
				...VALID_SEARCH,
				subscribedEvents: ['ad.update.nothing'],
			}),
		).toBe(false);
		expect(
			accepts(schema, {
				...VALID_SEARCH,
				notificationRecipient: 'not-an-email',
			}),
		).toBe(false);
		expect(accepts(schema, { ...VALID_SEARCH, bedroomMin: 1.5 })).toBe(false);
		expect(accepts(schema, { ...VALID_SEARCH, withCoherentPrice: null })).toBe(
			true,
		);
	});

	it('requires webhook endpoints on a search to be HTTPS URLs', () => {
		const enabled = {
			...VALID_SEARCH,
			notificationEnabled: true,
			subscribedEvents: ['ad.update.price'],
		};
		expect(
			accepts(Inputs.searchesCreate, {
				...enabled,
				endpointRecipient: 'https://hook.example.com/a',
				eventEndpoint: 'https://hook.example.com/b',
			}),
		).toBe(true);
		expect(
			accepts(Inputs.searchesCreate, {
				...enabled,
				endpointRecipient: 'http://hook.example.com/a',
			}),
		).toBe(false);
		expect(
			accepts(Inputs.searchesCreate, {
				...enabled,
				eventEndpoint: 'not a url',
			}),
		).toBe(false);
	});

	it("enforces the spec's prose rules about notifications", () => {
		const schema = Inputs.searchesCreate;
		// endpointRecipient and eventEndpoint require notificationEnabled: true.
		expect(
			accepts(schema, {
				...VALID_SEARCH,
				endpointRecipient: 'https://h.example/a',
			}),
		).toBe(false);
		expect(
			accepts(schema, {
				...VALID_SEARCH,
				notificationEnabled: false,
				endpointRecipient: 'https://h.example/a',
			}),
		).toBe(false);
		expect(
			accepts(schema, {
				...VALID_SEARCH,
				notificationEnabled: true,
				endpointRecipient: 'https://h.example/a',
			}),
		).toBe(true);
		// eventEndpoint also needs at least one subscribed event.
		expect(
			accepts(schema, {
				...VALID_SEARCH,
				notificationEnabled: true,
				eventEndpoint: 'https://h.example/e',
			}),
		).toBe(false);
		expect(
			accepts(schema, {
				...VALID_SEARCH,
				notificationEnabled: true,
				eventEndpoint: 'https://h.example/e',
				subscribedEvents: [],
			}),
		).toBe(false);
		expect(
			accepts(schema, {
				...VALID_SEARCH,
				notificationEnabled: true,
				eventEndpoint: 'https://h.example/e',
				subscribedEvents: ['property.ad.update'],
			}),
		).toBe(true);
		// An email recipient needs no webhook.
		expect(
			accepts(schema, {
				...VALID_SEARCH,
				notificationEnabled: true,
				notificationRecipient: 'foo@bar.com',
			}),
		).toBe(true);
	});

	it('requires lat and lon to be provided together on a search', () => {
		expect(accepts(Inputs.searchesCreate, { ...VALID_SEARCH, lat: 1 })).toBe(
			false,
		);
		expect(accepts(Inputs.searchesCreate, { ...VALID_SEARCH, lon: 1 })).toBe(
			false,
		);
		expect(
			accepts(Inputs.searchesCreate, {
				...VALID_SEARCH,
				lat: 1,
				lon: 2,
				radius: 5,
			}),
		).toBe(true);
		expect(
			accepts(Inputs.searchesUpdate, {
				id: SEARCH_ID,
				...VALID_SEARCH,
				lat: 1,
			}),
		).toBe(false);
	});

	it('does not send a create request that breaks a spec rule', async () => {
		const error = await captureError(
			endpoints.searches.create(ctx, {
				...VALID_SEARCH,
				endpointRecipient: 'https://hook.example.com/match',
			}),
		);

		expect(error).toBeInstanceOf(z.ZodError);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('requires an http(s) endpoint and a documented eventType on webhooks.simulate', () => {
		const schema = Inputs.webhooksSimulate;
		expect(accepts(schema, { endpoint: 'https://example.com/webhook' })).toBe(
			true,
		);
		expect(accepts(schema, { endpoint: 'http://example.com/webhook' })).toBe(
			true,
		);
		expect(accepts(schema, {})).toBe(false);
		expect(accepts(schema, { endpoint: 'not a url' })).toBe(false);
		expect(accepts(schema, { endpoint: 'file:///etc/passwd' })).toBe(false);
		expect(accepts(schema, { endpoint: 'javascript:alert(1)' })).toBe(false);
		for (const eventType of [
			'ad.update.price',
			'ad.update.surface',
			'ad.update.pictures',
			'ad.update.expired',
			'property.ad.create',
			'property.ad.update',
		]) {
			expect(
				accepts(schema, { endpoint: 'https://e.example', eventType }),
			).toBe(true);
		}
		expect(
			accepts(schema, { endpoint: 'https://e.example', eventType: 'match' }),
		).toBe(false);
	});

	it('constrains the search expressions and polygons to the documented shapes', () => {
		expect(
			accepts(Inputs.propertiesList, {
				expressions: [
					[{ word: 'travaux', options: { includes: true, strict: false } }],
				],
				geoShapes: [
					[
						[6.06, 44.54],
						[6.07, 44.55],
					],
				],
			}),
		).toBe(true);
		expect(
			accepts(Inputs.propertiesList, { expressions: [[{ word: '' }]] }),
		).toBe(false);
		expect(accepts(Inputs.propertiesList, { expressions: ['travaux'] })).toBe(
			false,
		);
		expect(accepts(Inputs.propertiesList, { geoShapes: [[[6.06]]] })).toBe(
			false,
		);

		expect(accepts(Inputs.indicatorsCities, { polygon: [{ lat: 1 }] })).toBe(
			false,
		);
	});

	it('rejects a mistyped expression field instead of dropping it', () => {
		// `strcit` used to parse to `{ options: {} }`: the filter vanished and the
		// request went out matching everything, which is worse than an error.
		expect(
			accepts(Inputs.propertiesList, {
				expressions: [[{ word: 'travaux', options: { strcit: true } }]],
			}),
		).toBe(false);
		expect(
			accepts(Inputs.propertiesList, {
				expressions: [[{ word: 'travaux', optoins: { strict: true } }]],
			}),
		).toBe(false);
		expect(
			accepts(Inputs.propertiesList, {
				expressions: [[{ word: 'travaux', extra: 'x' }]],
			}),
		).toBe(false);
		// The documented spelling still parses.
		expect(
			accepts(Inputs.propertiesList, {
				expressions: [[{ word: 'travaux', options: { strict: true } }]],
			}),
		).toBe(true);
	});
});
