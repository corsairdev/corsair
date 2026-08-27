import { logEventFromContext } from 'corsair/core';
import {
	deleteItem,
	deleteLocation,
	getItem,
	getItemAttribute,
	getLocation,
	getMember,
	getTeamInfo,
	listBasic,
	listItemAttributes,
	listItems,
	listLocation,
	listLocations,
	listMembers,
	listPartners,
} from './endpoints';
import { boxheroEndpointMeta, boxheroEndpointSchemas } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

type Ctx = Parameters<typeof getTeamInfo>[0];

function makeCtx() {
	return { key: 'test-token', options: {} } as unknown as Ctx;
}

let captured: { url: string; method: string } | undefined;

const realFetch = global.fetch;
afterEach(() => {
	global.fetch = realFetch;
	mockLogEvent.mockClear();
});

function mockFetch(payload: unknown, status = 200) {
	captured = undefined;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		captured = {
			url: String(url),
			method: init?.method ?? 'GET',
		};
		return {
			ok: status < 400,
			status,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => payload,
			text: async () => JSON.stringify(payload),
		};
	}) as unknown as typeof global.fetch;
}

function pathAndQuery(): { path: string; query: URLSearchParams } {
	const url = new URL(captured?.url ?? 'http://invalid');
	return { path: url.pathname, query: url.searchParams };
}

const team = {
	id: 1,
	name: 'g',
	mode: 2,
	currency_symbol: '$',
	currency_code: 'USD',
	price_decimal_places: 2,
	memo: null,
};

const location = { id: 10, name: 'Warehouse', quantity: 1, memo: '' };
const member = { id: 1001, name: 'Pat', role: 'admin' as const };
const attr = { id: 7, attr_type: 'text' as const, attr_name: 'Brand', rank: 1 };
const item = {
	id: 9,
	name: 'Powder',
	sku: 'SKU-1',
	barcode: '123',
	photo_url: null,
	attrs: [{ id: 7, type: 'text' as const, name: 'Brand', value: 'Acme' }],
	cost: '1.00',
	price: '2.00',
	quantity: 1,
	quantities: [{ location_id: 10, quantity: 1 }],
};
const tx = {
	id: 5,
	type: 'in' as const,
	to_location: { id: 10, name: 'Warehouse', deleted: false },
	transaction_time: '2026-01-16T11:00:00.000Z',
	created_at: '2026-01-16T11:00:00.000Z',
	created_by: { id: 1001, name: 'Pat', deleted: false },
	count_of_items: 1,
	total_quantity: 1,
	url: 'https://app.boxhero-app.com/transactions/5',
	memo: '',
	revision: 1,
};
const page = {
	items: [tx],
	count: 1,
	limit: 100,
	cursor: null,
	has_more: false,
};

describe('BoxHero endpoints', () => {
	it('teams.getInfo calls GET /v1/teams/linked', async () => {
		mockFetch(team);
		const out = await getTeamInfo(makeCtx(), {});
		expect(pathAndQuery().path).toBe('/v1/teams/linked');
		expect(out.id).toBe(1);
		expect(out.mode).toBe(2);
	});

	it('locations.list calls GET /v1/locations', async () => {
		mockFetch({ items: [location], count: 1 });
		const out = await listLocations(makeCtx(), {});
		expect(pathAndQuery().path).toBe('/v1/locations');
		expect(out.items[0]?.name).toBe('Warehouse');
	});

	it('locations.get wraps the location in item', async () => {
		mockFetch({ item: location });
		const out = await getLocation(makeCtx(), { location_id: 10 });
		expect(pathAndQuery().path).toBe('/v1/locations/10');
		expect(out.item.id).toBe(10);
	});

	it('locations.delete calls DELETE /v1/locations/{id}', async () => {
		mockFetch({});
		await deleteLocation(makeCtx(), { location_id: 10 });
		expect(captured?.method).toBe('DELETE');
		expect(pathAndQuery().path).toBe('/v1/locations/10');
	});

	it('transactions.listBasic calls GET /v1/transactions', async () => {
		mockFetch(page);
		const out = await listBasic(makeCtx(), { type: 'in', limit: 2 });
		const { path, query } = pathAndQuery();
		expect(path).toBe('/v1/transactions');
		expect(query.get('type')).toBe('in');
		expect(query.get('limit')).toBe('2');
		expect(out.items[0]?.type).toBe('in');
	});

	it('transactions.listLocation uses GET /v1/transactions, not location-txs', async () => {
		mockFetch(page);
		await listLocation(makeCtx(), {});
		expect(pathAndQuery().path).toBe('/v1/transactions');
	});

	it('partners.list forwards type and pagination', async () => {
		mockFetch({
			items: [
				{
					id: 1,
					type: 0,
					name: 'Acme',
					phone: '',
					email: '',
					address: '',
					memo: '',
				},
			],
			count: 1,
			limit: 100,
			cursor: null,
			has_more: false,
		});
		await listPartners(makeCtx(), { type: 0, cursor: 1, limit: 10 });
		const { path, query } = pathAndQuery();
		expect(path).toBe('/v1/partners');
		expect(query.get('type')).toBe('0');
		expect(query.get('cursor')).toBe('1');
		expect(query.get('limit')).toBe('10');
	});

	it('items.list and items.get hit /v1/items', async () => {
		mockFetch({
			items: [item],
			count: 1,
			limit: 100,
			cursor: null,
			has_more: false,
		});
		await listItems(makeCtx(), { location_ids: [10], limit: 1 });
		expect(pathAndQuery().path).toBe('/v1/items');
		expect(pathAndQuery().query.get('limit')).toBe('1');

		mockFetch({ item });
		const got = await getItem(makeCtx(), { item_id: 9 });
		expect(pathAndQuery().path).toBe('/v1/items/9');
		expect(got.item.sku).toBe('SKU-1');
	});

	it('items.delete calls DELETE /v1/items/{id}', async () => {
		mockFetch({});
		await deleteItem(makeCtx(), { item_id: 9 });
		expect(captured?.method).toBe('DELETE');
		expect(pathAndQuery().path).toBe('/v1/items/9');
	});

	it('item-attrs list and get use /v1/item-attrs', async () => {
		mockFetch({ items: [attr], count: 1 });
		await listItemAttributes(makeCtx(), {});
		expect(pathAndQuery().path).toBe('/v1/item-attrs');

		mockFetch({ item: attr });
		const got = await getItemAttribute(makeCtx(), { attr_id: 7 });
		expect(pathAndQuery().path).toBe('/v1/item-attrs/7');
		expect(got.item.attr_name).toBe('Brand');
	});

	it('members list and get use /v1/members', async () => {
		mockFetch({ items: [member], count: 1 });
		await listMembers(makeCtx(), {});
		expect(pathAndQuery().path).toBe('/v1/members');

		mockFetch({ item: member });
		const got = await getMember(makeCtx(), { member_id: 1001 });
		expect(pathAndQuery().path).toBe('/v1/members/1001');
		expect(got.item.role).toBe('admin');
	});

	it('covers every registered operation', () => {
		expect(Object.keys(boxheroEndpointMeta).sort()).toEqual(
			Object.keys(boxheroEndpointSchemas).sort(),
		);
	});
});
