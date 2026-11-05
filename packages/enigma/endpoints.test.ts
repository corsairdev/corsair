import { logEventFromContext } from 'corsair/core';
import { EnigmaAPIError } from './client';
import { Brands, LegalEntities, Locations } from './endpoints';
import {
	badKeyResponse,
	brand,
	brandDetail,
	brandLegalEntity,
	brandLocation,
	graphQLErrorResponse,
	legalEntityDetail,
	locationDetail,
	noMatchResponse,
	nullMatchResponse,
	searchResponse,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'eg-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return is unknown.
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
	const headers = new Headers(init.headers);
	// unknown: the request body is whatever the endpoint serialized.
	const body = JSON.parse(String(init.body)) as {
		query: string;
		variables: Record<string, unknown>;
	};
	return { url, method: init.method, headers, body };
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.url).toBe('https://api.enigma.com/graphql');
	expect(sent.method).toBe('POST');
	expect(sent.headers.get('x-api-key')).toBe(API_KEY);
	expect(sent.headers.get('authorization')).toBeNull();
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function rejection(promise: Promise<unknown>): Promise<EnigmaAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(EnigmaAPIError);
	if (!(error instanceof EnigmaAPIError)) throw error;
	return error;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('brands.match', () => {
	it('sends the brand search input and the card revenue filter', async () => {
		respond(searchResponse(brand));

		await invoke(Brands.match, {
			name: 'Starbucks',
			address: { state: 'NY', city: 'New York' },
			matchThreshold: 0.5,
		});

		expectAuthenticated();
		expect(lastRequest().body.variables).toMatchObject({
			searchInput: {
				entityType: 'BRAND',
				name: 'Starbucks',
				address: { state: 'NY', city: 'New York' },
				matchThreshold: 0.5,
			},
			cardTransactions: {
				filter: {
					AND: [
						{ EQ: ['period', '12m'] },
						{ EQ: ['quantityType', 'card_revenue_amount'] },
						{ EQ: ['rank', 0] },
					],
				},
			},
		});
		expect(lastRequest().body.query).toContain('... on Brand');
	});

	it('shapes the best match into a brand summary', async () => {
		respond(searchResponse(brand));

		const result = await invoke(Brands.match, { name: 'Starbucks' });

		expect(result).toEqual({
			brand: {
				id: brand.id,
				enigmaId: brand.enigmaId,
				names: ['STARBUCKS'],
				websites: ['https://www.starbucks.com'],
				industries: [
					{
						industryCode: '722515',
						industryDesc: 'Snack and Nonalcoholic Beverage Bars',
						industryType: 'naics_2022_code',
					},
				],
				operatingLocationCount: 20153,
				cardRevenue12m: {
					quantityType: 'card_revenue_amount',
					period: '12m',
					projectedQuantity: 1998052529.9,
					periodStartDate: '2025-10-01',
					periodEndDate: '2026-09-30',
				},
			},
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'enigma.brands.match',
			{ brandId: brand.id },
			'completed',
		);
	});

	it('returns a null brand when nothing matched', async () => {
		respond(noMatchResponse);

		const result = await invoke(Brands.match, { name: 'No Such Brand' });

		expect(result).toEqual({ brand: null });
	});

	it('skips null union members', async () => {
		respond(nullMatchResponse);

		const result = await invoke(Brands.match, { name: 'No Such Brand' });

		expect(result).toEqual({ brand: null });
	});

	it('rejects input with no match term', async () => {
		await expect(invoke(Brands.match, {})).rejects.toThrow(/at least one/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects prompt combined with name', async () => {
		await expect(
			invoke(Brands.match, { prompt: 'coffee shops', name: 'Starbucks' }),
		).rejects.toThrow(/prompt cannot be combined/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an HTTP error answer', async () => {
		respond(badKeyResponse, 401);

		const error = await rejection(invoke(Brands.match, { name: 'Starbucks' }));
		expect(error.status).toBe(401);
	});
});

describe('brands.get', () => {
	it('sends the brand id and the paging variables', async () => {
		respond(searchResponse(brandDetail));

		await invoke(Brands.get, {
			id: brand.id,
			locationsFirst: 20,
			locationsAfter: 'cursor-1',
			legalEntitiesFirst: 2,
		});

		expectAuthenticated();
		expect(lastRequest().body.variables).toMatchObject({
			searchInput: { entityType: 'BRAND', id: brand.id },
			cardTransactions: {
				filter: { AND: expect.arrayContaining([{ EQ: ['period', '12m'] }]) },
			},
			locationsFirst: 20,
			locationsAfter: 'cursor-1',
			legalEntitiesFirst: 2,
		});
		expect(lastRequest().body.query).toContain(
			'operatingLocations(first: $locationsFirst, after: $locationsAfter)',
		);
	});

	it('defaults the page sizes', async () => {
		respond(searchResponse(brandDetail));

		await invoke(Brands.get, { id: brand.id });

		expect(lastRequest().body.variables).toMatchObject({
			locationsFirst: 10,
			legalEntitiesFirst: 5,
		});
	});

	it('shapes locations, page cursors and legal entities', async () => {
		respond(searchResponse(brandDetail));

		const result = await invoke(Brands.get, { id: brand.id });

		expect(result).toEqual({
			brand: {
				id: brand.id,
				enigmaId: brand.enigmaId,
				names: ['STARBUCKS'],
				websites: ['https://www.starbucks.com'],
				industries: brand.industries.edges.map((edge) => edge.node),
				cardRevenue12m: {
					quantityType: 'card_revenue_amount',
					period: '12m',
					projectedQuantity: 1998052529.9,
					periodStartDate: '2025-10-01',
					periodEndDate: '2026-09-30',
				},
				operatingLocations: {
					items: [
						{
							id: brandLocation.id,
							names: ['STARBUCKS'],
							address: {
								fullAddress: '462 7th Ave, New York, NY 10018',
								streetAddress1: '462 7th Ave',
								streetAddress2: null,
								city: 'New York',
								state: 'NY',
								zip: '10018',
								county: 'New York County',
								country: 'US',
								latitude: 40.7538,
								longitude: -73.9919,
							},
							operatingStatus: 'Open',
							cardRevenue12m: {
								quantityType: 'card_revenue_amount',
								period: '12m',
								projectedQuantity: 2867450.12,
								periodStartDate: '2025-10-01',
								periodEndDate: '2026-09-30',
							},
						},
					],
					pageInfo: {
						hasNextPage: true,
						endCursor: 'b1c2d3e4-5f60-4a7b-8c9d-0e1f2a3b4c5d',
					},
				},
				legalEntities: {
					items: [
						{
							id: brandLegalEntity.id,
							enigmaId: brandLegalEntity.enigmaId,
							names: ['STARBUCKS CORPORATION'],
							legalEntityType: 'Corporation',
							registeredEntities: [
								{
									name: 'STARBUCKS CORPORATION',
									registeredEntityType: 'Corporation',
									formationDate: '1985-11-04',
								},
							],
						},
					],
					pageInfo: { hasNextPage: false, endCursor: null },
				},
			},
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'enigma.brands.get',
			{ brandId: brand.id, locationCount: 1 },
			'completed',
		);
	});

	it('returns a null brand for an unknown id', async () => {
		respond(noMatchResponse);

		const result = await invoke(Brands.get, { id: 'nope' });

		expect(result).toEqual({ brand: null });
	});

	it('rejects an empty id', async () => {
		await expect(invoke(Brands.get, { id: '' })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a GraphQL errors answer', async () => {
		respond(graphQLErrorResponse);

		const error = await rejection(invoke(Brands.get, { id: brand.id }));
		expect(error.message).toContain('Cannot query field');
	});
});

describe('locations.match', () => {
	it('sends the operating location search input', async () => {
		respond(searchResponse(locationDetail));

		await invoke(Locations.match, {
			name: 'Bluestone Lane',
			address: { city: 'New York', state: 'NY' },
		});

		expectAuthenticated();
		expect(lastRequest().body.variables).toMatchObject({
			searchInput: {
				entityType: 'OPERATING_LOCATION',
				name: 'Bluestone Lane',
				address: { city: 'New York', state: 'NY' },
			},
		});
		expect(lastRequest().body.query).toContain('... on OperatingLocation');
	});

	it('shapes the matched location', async () => {
		respond(searchResponse(locationDetail));

		const result = await invoke(Locations.match, { name: 'Bluestone Lane' });

		expect(result).toEqual({
			location: {
				id: locationDetail.id,
				names: ['BLUESTONE LANE'],
				address: {
					fullAddress: '35 W 8th St, New York, NY 10011',
					streetAddress1: '35 W 8th St',
					city: 'New York',
					state: 'NY',
					zip: '10011',
					county: 'New York County',
					country: 'US',
					latitude: 40.7321,
					longitude: -73.9976,
				},
				phoneNumbers: ['+12122550183'],
				websites: ['https://bluestonelane.com'],
				operatingStatus: 'Open',
				brands: [
					{
						id: 'e7f8a9b0-1c34-4d5e-9f6a-7b8c9d0e1f2a',
						enigmaId: 'ENIGMA-1a2b3c4d',
						names: ['BLUESTONE LANE'],
					},
				],
			},
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'enigma.locations.match',
			{ locationId: locationDetail.id },
			'completed',
		);
	});

	it('returns a null location when nothing matched', async () => {
		respond(noMatchResponse);

		const result = await invoke(Locations.match, {
			phoneNumber: '2122550183',
		});

		expect(result).toEqual({ location: null });
	});

	it('rejects an address with no fields', async () => {
		await expect(
			invoke(Locations.match, { name: 'Bluestone Lane', address: {} }),
		).rejects.toThrow(/at least one address field/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an HTTP error answer', async () => {
		respond(badKeyResponse, 403);

		const error = await rejection(
			invoke(Locations.match, { name: 'Bluestone Lane' }),
		);
		expect(error.status).toBe(403);
	});
});

describe('legalEntities.get', () => {
	it('sends the legal entity id', async () => {
		respond(searchResponse(legalEntityDetail));

		await invoke(LegalEntities.get, { id: legalEntityDetail.id });

		expectAuthenticated();
		expect(lastRequest().body.variables).toMatchObject({
			searchInput: { entityType: 'LEGAL_ENTITY', id: legalEntityDetail.id },
		});
		expect(lastRequest().body.query).toContain('... on LegalEntity');
	});

	it('accepts a name instead of an id', async () => {
		respond(searchResponse(legalEntityDetail));

		await invoke(LegalEntities.get, { name: 'Starbucks Corporation' });

		expect(lastRequest().body.variables).toMatchObject({
			searchInput: {
				entityType: 'LEGAL_ENTITY',
				name: 'Starbucks Corporation',
			},
		});
	});

	it('shapes the legal entity detail', async () => {
		respond(searchResponse(legalEntityDetail));

		const result = await invoke(LegalEntities.get, {
			id: legalEntityDetail.id,
		});

		expect(result).toEqual({
			legalEntity: {
				id: legalEntityDetail.id,
				enigmaId: legalEntityDetail.enigmaId,
				names: ['STARBUCKS CORPORATION'],
				legalEntityType: 'Corporation',
				registeredEntities: {
					items: [
						{
							name: 'STARBUCKS CORPORATION',
							registeredEntityType: 'Corporation',
							formationDate: '1985-11-04',
						},
					],
					pageInfo: { hasNextPage: false, endCursor: null },
				},
				addresses: {
					items: [
						{
							fullAddress: '2401 Utah Ave S, Seattle, WA 98134',
							streetAddress1: '2401 Utah Ave S',
							streetAddress2: null,
							city: 'Seattle',
							state: 'WA',
							zip: '98134',
							county: 'King County',
							country: 'US',
							latitude: 47.5814,
							longitude: -122.3342,
						},
					],
					pageInfo: { hasNextPage: false, endCursor: null },
				},
				brands: {
					items: [
						{
							id: brand.id,
							enigmaId: brand.enigmaId,
							names: ['STARBUCKS'],
						},
					],
					pageInfo: { hasNextPage: false, endCursor: null },
				},
			},
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'enigma.legalEntities.get',
			{ legalEntityId: legalEntityDetail.id },
			'completed',
		);
	});

	it('returns a null legal entity for no match', async () => {
		respond(noMatchResponse);

		const result = await invoke(LegalEntities.get, { name: 'No Such Corp' });

		expect(result).toEqual({ legalEntity: null });
	});

	it('rejects input with neither id nor name', async () => {
		await expect(invoke(LegalEntities.get, {})).rejects.toThrow(
			/Provide id or name/,
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a GraphQL errors answer', async () => {
		respond(graphQLErrorResponse);

		const error = await rejection(
			invoke(LegalEntities.get, { id: legalEntityDetail.id }),
		);
		expect(error.message).toContain('Cannot query field');
	});
});
