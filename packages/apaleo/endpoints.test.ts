import { logEventFromContext } from 'corsair/core';
import { ApaleoAPIError, makeApaleoRequest } from './client';
import * as Properties from './endpoints/properties';
import * as UnitAttributes from './endpoints/unit-attributes';
import * as UnitGroups from './endpoints/unit-groups';
import * as Units from './endpoints/units';
import { apaleoEndpointMeta } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

void logEventFromContext;

type Store = {
	upsertByEntityId: jest.Mock;
	deleteByEntityId: jest.Mock;
};

function makeStore(): Store {
	return {
		upsertByEntityId: jest.fn(async () => undefined),
		deleteByEntityId: jest.fn(async () => true),
	};
}

function makeCtx() {
	const db = {
		properties: makeStore(),
		units: makeStore(),
		unitGroups: makeStore(),
		unitAttributes: makeStore(),
	};
	return {
		// unknown: test stub is not the full plugin context
		ctx: { key: 'test-token', db } as unknown as Parameters<
			typeof Properties.list
		>[0],
		db,
	};
}

let captured: { url: string; method: string; body?: string } | undefined;

function mockFetch(payload: object | undefined, status = 200) {
	captured = undefined;
	// unknown: jest stub is not a full Response
	global.fetch = (async (url: string | URL, init?: RequestInit) => {
		captured = {
			url: String(url),
			method: init?.method ?? 'GET',
			body: typeof init?.body === 'string' ? init.body : undefined,
		};
		return {
			ok: status < 400,
			status,
			statusText: status < 400 ? 'OK' : 'Error',
			url: String(url),
			headers: new Headers(
				payload === undefined ? {} : { 'Content-Type': 'application/json' },
			),
			json: async () => payload,
			text: async () => (payload === undefined ? '' : JSON.stringify(payload)),
		};
	}) as unknown as typeof global.fetch;
}

const property = {
	id: 'MUC',
	code: 'MUC',
	isTemplate: false,
	name: { en: 'Demo Hotel Munich' },
	companyName: 'Hotel Münchner GmbH',
	commercialRegisterEntry: 'HRB 1',
	taxId: 'DE1',
	location: {
		addressLine1: 'Marienplatz 1',
		postalCode: '80331',
		city: 'München',
		countryCode: 'DE',
	},
	paymentTerms: { en: 'Pay on checkout' },
	timeZone: 'Europe/Berlin',
	currencyCode: 'EUR',
	created: '2020-04-08T21:53:26+02:00',
	status: 'Test',
	isArchived: false,
};
const unit = {
	id: 'MUC-MTA',
	name: 'A.101',
	description: { en: 'Room' },
	property: { id: 'MUC' },
	status: { isOccupied: false, condition: 'Clean' },
	maxPersons: 2,
	created: '2020-04-08T21:53:26+02:00',
};
const group = {
	id: 'MUC-DBL',
	code: 'DBL',
	property: { id: 'MUC' },
	name: { en: 'Double' },
	description: { en: 'Double' },
	memberCount: 1,
	maxPersons: 2,
	type: 'BedRoom',
};
const attribute = { id: 'KQOSXHLS', name: 'Floor 3' };

const createProperty = {
	code: 'CRS',
	name: { en: 'Probe' },
	companyName: 'Probe GmbH',
	commercialRegisterEntry: 'HRB 1',
	taxId: 'DE1',
	location: {
		addressLine1: 'Street 1',
		postalCode: '10115',
		city: 'Berlin',
		countryCode: 'DE',
	},
	paymentTerms: { en: 'Pay on checkout' },
	timeZone: 'Europe/Berlin',
	defaultCheckInTime: '17:00:00',
	defaultCheckOutTime: '11:00:00',
	currencyCode: 'EUR',
};

describe('Apaleo endpoints', () => {
	const { ctx, db } = makeCtx();

	it('exposes meta for every nested endpoint', () => {
		expect(Object.keys(apaleoEndpointMeta)).toHaveLength(29);
	});

	it('GET properties list', async () => {
		mockFetch({ properties: [property], count: 1 });
		const result = await Properties.list(ctx, { pageNumber: 1, pageSize: 50 });
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toContain('/inventory/v1/properties');
		expect(captured?.url).toContain('pageNumber=1');
		expect(result.count).toBe(1);
		expect(db.properties.upsertByEntityId).toHaveBeenCalledWith(
			'MUC',
			expect.objectContaining({ id: 'MUC' }),
		);
	});

	it('POST create property', async () => {
		mockFetch({ id: 'CRS' }, 201);
		const result = await Properties.create(ctx, createProperty);
		expect(captured?.method).toBe('POST');
		expect(JSON.parse(captured?.body ?? '{}').code).toBe('CRS');
		expect(result.id).toBe('CRS');
	});

	it('GET properties count', async () => {
		mockFetch({ count: 3 });
		const result = await Properties.count(ctx, undefined);
		expect(captured?.url).toContain('/inventory/v1/properties/$count');
		expect(result.count).toBe(3);
	});

	it('HEAD property exists', async () => {
		mockFetch(undefined, 200);
		await expect(Properties.exists(ctx, { id: 'MUC' })).resolves.toEqual({
			exists: true,
		});
		expect(captured?.method).toBe('HEAD');
	});

	it('HEAD property missing is exists:false', async () => {
		mockFetch(undefined, 404);
		await expect(Properties.exists(ctx, { id: 'NOPE' })).resolves.toEqual({
			exists: false,
		});
	});

	it('GET property by id', async () => {
		mockFetch(property);
		const result = await Properties.get(ctx, { id: 'MUC' });
		expect(captured?.url).toContain('/inventory/v1/properties/MUC');
		expect(result.id).toBe('MUC');
	});

	it('POST clone property', async () => {
		mockFetch({ id: 'BER' }, 201);
		const result = await Properties.clone(ctx, {
			id: 'MUC',
			...createProperty,
			code: 'BER',
		});
		expect(captured?.url).toContain('/inventory/v1/property-actions/MUC/clone');
		expect(JSON.parse(captured?.body ?? '{}').code).toBe('BER');
		expect(JSON.parse(captured?.body ?? '{}').id).toBeUndefined();
		expect(result.id).toBe('BER');
	});

	it('PUT archive / set-live / reset', async () => {
		mockFetch(undefined, 204);
		await expect(Properties.archive(ctx, { id: 'MUC' })).resolves.toEqual({
			ok: true,
		});
		expect(db.properties.deleteByEntityId).toHaveBeenCalledWith('MUC');
		expect(captured?.url).toContain('/property-actions/MUC/archive');
		await expect(Properties.setLive(ctx, { id: 'MUC' })).resolves.toEqual({
			ok: true,
		});
		expect(db.properties.deleteByEntityId).toHaveBeenCalledWith('MUC');
		expect(captured?.url).toContain('/set-live');
		await expect(Properties.reset(ctx, { id: 'MUC' })).resolves.toEqual({
			ok: true,
		});
		expect(captured?.url).toContain('/reset');
	});

	it('GET supported countries', async () => {
		mockFetch({ countryCodes: ['DE', 'AT'] });
		const result = await Properties.countries(ctx, undefined);
		expect(captured?.url).toContain('/inventory/v1/types/countries');
		expect(result.countryCodes).toEqual(['DE', 'AT']);
	});

	it('units get / exists / list / count / create / bulk / delete', async () => {
		mockFetch(unit);
		await expect(Units.get(ctx, { id: 'MUC-MTA' })).resolves.toMatchObject({
			id: 'MUC-MTA',
		});
		mockFetch(undefined, 200);
		await expect(Units.exists(ctx, { id: 'MUC-MTA' })).resolves.toEqual({
			exists: true,
		});
		mockFetch({ units: [unit], count: 1 });
		await expect(Units.list(ctx, { propertyId: 'MUC' })).resolves.toMatchObject(
			{
				count: 1,
			},
		);
		expect(captured?.url).toContain('propertyId=MUC');
		mockFetch({ count: 1 });
		await expect(Units.count(ctx, { propertyId: 'MUC' })).resolves.toEqual({
			count: 1,
		});
		mockFetch({ id: 'MUC-NEW' }, 201);
		await expect(
			Units.create(ctx, {
				propertyId: 'MUC',
				name: 'A.201',
				description: { en: 'Room' },
				maxPersons: 2,
			}),
		).resolves.toEqual({ id: 'MUC-NEW' });
		mockFetch({ ids: ['MUC-A', 'MUC-B'] }, 201);
		await expect(
			Units.createBulk(ctx, {
				units: [
					{
						propertyId: 'MUC',
						name: 'A.301',
						description: { en: 'Room' },
						maxPersons: 2,
					},
					{
						propertyId: 'MUC',
						name: 'A.302',
						description: { en: 'Room' },
						maxPersons: 2,
					},
				],
			}),
		).resolves.toEqual({ ids: ['MUC-A', 'MUC-B'] });
		expect(captured?.url).toContain('/inventory/v1/units/bulk');
		mockFetch(undefined, 204);
		await expect(Units.remove(ctx, { id: 'MUC-NEW' })).resolves.toEqual({
			ok: true,
		});
		expect(db.units.deleteByEntityId).toHaveBeenCalledWith('MUC-NEW');
	});

	it('unit groups create / list / count / exists / get / replace / delete', async () => {
		mockFetch({ id: 'MUC-DBL' }, 201);
		await expect(
			UnitGroups.create(ctx, {
				code: 'DBL',
				propertyId: 'MUC',
				name: { en: 'Double' },
				description: { en: 'Double' },
				maxPersons: 2,
			}),
		).resolves.toEqual({ id: 'MUC-DBL' });
		mockFetch({ unitGroups: [group], count: 1 });
		await expect(
			UnitGroups.list(ctx, { propertyId: 'MUC' }),
		).resolves.toMatchObject({ count: 1 });
		mockFetch({ count: 1 });
		await expect(UnitGroups.count(ctx, { propertyId: 'MUC' })).resolves.toEqual(
			{ count: 1 },
		);
		mockFetch(undefined, 200);
		await expect(UnitGroups.exists(ctx, { id: 'MUC-DBL' })).resolves.toEqual({
			exists: true,
		});
		mockFetch(group);
		await expect(UnitGroups.get(ctx, { id: 'MUC-DBL' })).resolves.toMatchObject(
			{
				id: 'MUC-DBL',
			},
		);
		mockFetch(undefined, 204);
		await expect(
			UnitGroups.replace(ctx, {
				id: 'MUC-DBL',
				name: { en: 'Double room' },
				description: { en: 'Double' },
			}),
		).resolves.toEqual({ ok: true });
		expect(db.unitGroups.deleteByEntityId).toHaveBeenCalledWith('MUC-DBL');
		expect(captured?.method).toBe('PUT');
		expect(JSON.parse(captured?.body ?? '{}').id).toBeUndefined();
		mockFetch(undefined, 204);
		await expect(UnitGroups.remove(ctx, { id: 'MUC-DBL' })).resolves.toEqual({
			ok: true,
		});
	});

	it('unit attributes get / exists / list / create / delete', async () => {
		mockFetch(attribute);
		await expect(
			UnitAttributes.get(ctx, { id: 'KQOSXHLS' }),
		).resolves.toMatchObject({ id: 'KQOSXHLS' });
		mockFetch(undefined, 200);
		await expect(
			UnitAttributes.exists(ctx, { id: 'KQOSXHLS' }),
		).resolves.toEqual({ exists: true });
		mockFetch({ unitAttributes: [attribute], count: 1 });
		await expect(UnitAttributes.list(ctx, undefined)).resolves.toMatchObject({
			count: 1,
		});
		mockFetch({ id: 'NEWATTR' }, 201);
		await expect(
			UnitAttributes.create(ctx, { name: 'Sea view' }),
		).resolves.toEqual({ id: 'NEWATTR' });
		mockFetch(undefined, 204);
		await expect(
			UnitAttributes.remove(ctx, { id: 'NEWATTR' }),
		).resolves.toEqual({ ok: true });
	});

	it('maps Retry-After seconds and HTTP-date to milliseconds', async () => {
		global.fetch = (async (_url: unknown, _init?: RequestInit) => ({
			ok: false,
			status: 429,
			statusText: 'Too Many Requests',
			headers: new Headers({
				'Retry-After': '2',
				'Content-Type': 'application/json',
			}),
			json: async () => ({ message: 'slow' }),
		})) as unknown as typeof global.fetch;
		await expect(
			makeApaleoRequest('/inventory/v1/properties', 't'),
		).rejects.toMatchObject({ retryAfter: 2000 });

		const until = new Date(Date.now() + 4000).toUTCString();
		global.fetch = (async (_url: unknown, _init?: RequestInit) => ({
			ok: false,
			status: 429,
			statusText: 'Too Many Requests',
			headers: new Headers({
				'Retry-After': until,
				'Content-Type': 'application/json',
			}),
			json: async () => ({ message: 'slow' }),
		})) as unknown as typeof global.fetch;
		try {
			await makeApaleoRequest('/inventory/v1/properties', 't');
			throw new Error('expected ApaleoAPIError');
		} catch (error) {
			expect(error).toBeInstanceOf(ApaleoAPIError);
			expect((error as ApaleoAPIError).retryAfter).toBeGreaterThanOrEqual(0);
			expect((error as ApaleoAPIError).retryAfter).toBeLessThanOrEqual(4000);
		}
	});
});
