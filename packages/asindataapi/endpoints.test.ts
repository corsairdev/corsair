import { logEventFromContext } from 'corsair/core';
import { ASINDATAAPI_API_BASE } from './client';
import { Categories } from './endpoints/categories';
import { Collections } from './endpoints/collections';
import { Destinations } from './endpoints/destinations';
import { Identifiers } from './endpoints/identifiers';
import { Offers } from './endpoints/offers';
import { Products } from './endpoints/products';
import { Requests } from './endpoints/requests';
import { ResultSets } from './endpoints/result-sets';
import { Search } from './endpoints/search';
import { asinDataApiEndpointMeta } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

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

type Ctx = Parameters<typeof Collections.get>[0];

function makeCtx() {
	const db = {
		collections: makeStore(),
		destinations: makeStore(),
		requests: makeStore(),
		resultSets: makeStore(),
	};
	const ctx = {
		key: 'test-api-key',
		db,
	} as unknown as Ctx;
	return { ctx, db };
}

let captured:
	| {
			url: string;
			method: string;
			body?: string;
	  }
	| undefined;

function mockFetch(payload: unknown, status = 200) {
	captured = undefined;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
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
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => payload,
			text: async () => JSON.stringify(payload),
		};
	}) as unknown as typeof global.fetch;
}

function calledUrl() {
	return new URL(captured?.url ?? 'https://invalid.example');
}

describe('ASIN Data API endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('PRODUCTS_GET hits /request?type=product and parses the product', async () => {
		const { ctx } = makeCtx();
		mockFetch({
			request_info: { success: true },
			product: { asin: 'B00I8RKMSM', title: 'Probe' },
		});

		const result = await Products.get(ctx, {
			asin: 'B00I8RKMSM',
			amazon_domain: 'amazon.com',
		});

		expect(calledUrl().pathname).toBe('/request');
		expect(calledUrl().searchParams.get('type')).toBe('product');
		expect(calledUrl().searchParams.get('asin')).toBe('B00I8RKMSM');
		expect(result.request_info.success).toBe(true);
		expect(result).toEqual(
			expect.objectContaining({
				product: expect.objectContaining({ asin: 'B00I8RKMSM' }),
			}),
		);
	});

	it('SEARCH_GET hits /request?type=search', async () => {
		const { ctx } = makeCtx();
		mockFetch({
			request_info: { success: true },
			search_results: [{ asin: 'B00I8RKMSM', title: 'Probe' }],
		});

		const result = await Search.get(ctx, {
			search_term: 'usb hub',
			amazon_domain: 'amazon.com',
		});

		expect(calledUrl().searchParams.get('type')).toBe('search');
		expect(calledUrl().searchParams.get('search_term')).toBe('usb hub');
		expect(result.search_results?.[0]?.asin).toBe('B00I8RKMSM');
	});

	it('OFFERS_GET hits /request?type=offers', async () => {
		const { ctx } = makeCtx();
		mockFetch({
			request_info: { success: true },
			offers: [{ offer_id: 'OFF1', is_prime: true }],
		});

		const result = await Offers.get(ctx, {
			asin: 'B00I8RKMSM',
			amazon_domain: 'amazon.com',
		});

		expect(calledUrl().searchParams.get('type')).toBe('offers');
		expect(result.offers?.[0]?.offer_id).toBe('OFF1');
	});

	it('CATEGORIES_GET hits /request?type=category', async () => {
		const { ctx } = makeCtx();
		mockFetch({
			request_info: { success: true },
			category_results: [{ asin: 'B00I8RKMSM', title: 'Probe' }],
		});

		const result = await Categories.get(ctx, {
			category_id: '123',
			amazon_domain: 'amazon.com',
		});

		expect(calledUrl().searchParams.get('type')).toBe('category');
		expect(result.category_results?.[0]?.asin).toBe('B00I8RKMSM');
	});

	it('IDENTIFIERS_RESOLVE hits /request?type=product with gtin', async () => {
		const { ctx } = makeCtx();
		mockFetch({
			request_info: { success: true },
			product: { asin: 'B00I8RKMSM' },
		});

		const result = await Identifiers.resolve(ctx, { gtin: '0885909463972' });

		expect(calledUrl().searchParams.get('type')).toBe('product');
		expect(calledUrl().searchParams.get('gtin')).toBe('0885909463972');
		expect(result).toEqual(
			expect.objectContaining({
				product: expect.objectContaining({ asin: 'B00I8RKMSM' }),
			}),
		);
	});

	it('CREATE_COLLECTION POSTs /collections and upserts', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({
			request_info: { success: true },
			collection: { id: 'ABC123', name: 'Probe', schedule_type: 'manual' },
		});

		const result = await Collections.create(ctx, {
			name: 'Probe',
			schedule_type: 'manual',
		});

		expect(captured?.method).toBe('POST');
		expect(calledUrl().pathname).toBe('/collections');
		expect(result.collection.id).toBe('ABC123');
		expect(db.collections.upsertByEntityId).toHaveBeenCalledWith(
			'ABC123',
			expect.objectContaining({ name: 'Probe' }),
		);
	});

	it('LIST_COLLECTIONS GETs /collections and upserts each', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({
			request_info: { success: true },
			collections: [{ id: 'ABC123', name: 'Probe' }],
		});

		await Collections.list(ctx, { page: 1 });

		expect(calledUrl().pathname).toBe('/collections');
		expect(calledUrl().searchParams.get('page')).toBe('1');
		expect(db.collections.upsertByEntityId).toHaveBeenCalledWith(
			'ABC123',
			expect.objectContaining({ name: 'Probe' }),
		);
	});

	it('UPDATE_COLLECTION PUTs /collections/{id} without the id in the body', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({
			request_info: { success: true },
			collection: { id: 'ABC123', name: 'Renamed' },
		});

		await Collections.update(ctx, {
			collection_id: 'ABC123',
			name: 'Renamed',
		});

		expect(captured?.method).toBe('PUT');
		expect(calledUrl().pathname).toBe('/collections/ABC123');
		expect(JSON.parse(captured?.body ?? 'null')).toEqual({ name: 'Renamed' });
		expect(db.collections.upsertByEntityId).toHaveBeenCalledWith(
			'ABC123',
			expect.objectContaining({ name: 'Renamed' }),
		);
	});

	it('DELETE_COLLECTION DELETEs /collections/{id} and evicts', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({ request_info: { success: true } });

		await Collections.delete(ctx, { collection_id: 'ABC123' });

		expect(captured?.method).toBe('DELETE');
		expect(calledUrl().pathname).toBe('/collections/ABC123');
		expect(db.collections.deleteByEntityId).toHaveBeenCalledWith('ABC123');
	});

	it('DELETE_REQUEST DELETEs /collections/{id}/{requestId} and evicts', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({ request_info: { success: true } });

		await Requests.delete(ctx, {
			collection_id: 'ABC123',
			request_id: 'REQ1',
		});

		expect(captured?.method).toBe('DELETE');
		expect(calledUrl().pathname).toBe('/collections/ABC123/REQ1');
		expect(db.requests.deleteByEntityId).toHaveBeenCalledWith('REQ1');
	});

	it('LIST_RESULT_SETS GETs /collections/{id}/results and upserts', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({
			request_info: { success: true },
			results: [{ id: 4, requests_completed: 1 }],
		});

		await ResultSets.list(ctx, { collection_id: 'ABC123' });

		expect(calledUrl().pathname).toBe('/collections/ABC123/results');
		expect(db.resultSets.upsertByEntityId).toHaveBeenCalledWith(
			'4',
			expect.objectContaining({ id: 4, collection_id: 'ABC123' }),
		);
	});

	it('GET_RESULT_SET GETs /collections/{id}/results/{resultSetId}', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({
			request_info: { success: true },
			result: { id: 4, requests_completed: 1 },
		});

		await ResultSets.get(ctx, {
			collection_id: 'ABC123',
			result_set_id: 4,
		});

		expect(calledUrl().pathname).toBe('/collections/ABC123/results/4');
		expect(db.resultSets.upsertByEntityId).toHaveBeenCalledWith(
			'4',
			expect.objectContaining({ id: 4 }),
		);
	});

	it('CREATE_DESTINATION POSTs /destinations and upserts', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({
			request_info: { success: true },
			destination: { id: 'ABCDEFG', name: 'S3', type: 's3', enabled: true },
		});

		await Destinations.create(ctx, {
			name: 'S3',
			type: 's3',
			enabled: true,
			s3_bucket_name: 'bucket',
		});

		expect(captured?.method).toBe('POST');
		expect(calledUrl().pathname).toBe('/destinations');
		expect(db.destinations.upsertByEntityId).toHaveBeenCalledWith(
			'ABCDEFG',
			expect.objectContaining({ type: 's3' }),
		);
	});

	it('rejects a successful product payload that omits product', async () => {
		const { ctx } = makeCtx();
		mockFetch({ request_info: { success: true } });

		await expect(
			Products.get(ctx, { asin: 'B00I8RKMSM', amazon_domain: 'amazon.com' }),
		).rejects.toThrow();
	});

	it('GET_COLLECTION hits /collections/{id} and mirrors official keys', async () => {
		const { ctx, db } = makeCtx();
		const collection = {
			id: 'ABC123',
			name: 'Probe',
			status: 'idle',
			schedule_type: 'manual',
			request_total_count: 0,
		};
		mockFetch({ request_info: { success: true }, collection });

		const result = await Collections.get(ctx, { collection_id: 'ABC123' });

		expect(calledUrl().pathname).toBe('/collections/ABC123');
		expect(calledUrl().searchParams.get('api_key')).toBe('test-api-key');
		expect(result.collection.id).toBe('ABC123');
		expect(db.collections.upsertByEntityId).toHaveBeenCalledWith(
			'ABC123',
			expect.objectContaining({ schedule_type: 'manual' }),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'asindataapi.collections.get',
			{ collection_id: 'ABC123' },
			'completed',
		);
	});

	it('LIST_COLLECTION_REQUESTS pages at /collections/{id}/requests/{page}', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({
			request_info: { success: true },
			collection_id: 'ABC123',
			requests_page_current: 1,
			requests_page_count: 1,
			requests: [
				{ id: 'REQ1', asin: 'B00I8RKMSM', amazon_domain: 'amazon.com' },
			],
		});

		await Requests.list(ctx, { collection_id: 'ABC123' });

		expect(calledUrl().pathname).toBe('/collections/ABC123/requests/1');
		expect(db.requests.upsertByEntityId).toHaveBeenCalledWith(
			'REQ1',
			expect.objectContaining({ id: 'REQ1', asin: 'B00I8RKMSM' }),
		);
	});

	it('CLEAR_COLLECTION_REQUESTS DELETEs /collections/{id}/requests with request_ids', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({
			request_info: { success: true, message: 'Request deleted' },
		});

		await Requests.clear(ctx, {
			collection_id: 'ABC123',
			request_ids: ['REQ1', 'REQ2'],
		});

		expect(captured?.method).toBe('DELETE');
		expect(calledUrl().pathname).toBe('/collections/ABC123/requests');
		expect(JSON.parse(captured?.body ?? 'null')).toEqual(['REQ1', 'REQ2']);
		expect(db.requests.deleteByEntityId).toHaveBeenCalledWith('REQ1');
		expect(db.requests.deleteByEntityId).toHaveBeenCalledWith('REQ2');
	});

	it('LIST_DESTINATIONS sends official query params and usage', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({
			request_info: { success: true },
			usage: { used: 1, limit: 50, available: 49 },
			destinations: [
				{
					id: 'ABCDEFG',
					name: 'S3',
					type: 's3',
					enabled: true,
					used_by: 0,
					s3_bucket_name: 'bucket',
				},
			],
		});

		const result = await Destinations.list(ctx, {
			page: 1,
			search_term: 'S3',
			sort_by: 'name',
			sort_direction: 'ascending',
		});

		expect(calledUrl().pathname).toBe('/destinations');
		expect(calledUrl().searchParams.get('page')).toBe('1');
		expect(calledUrl().searchParams.get('search_term')).toBe('S3');
		expect(calledUrl().searchParams.get('sort_by')).toBe('name');
		expect(result.usage?.limit).toBe(50);
		expect(db.destinations.upsertByEntityId).toHaveBeenCalledWith(
			'ABCDEFG',
			expect.objectContaining({ type: 's3' }),
		);
	});

	it('UPDATE_DESTINATION PUTs /destinations/{id} without the id in the body', async () => {
		const { ctx } = makeCtx();
		mockFetch({
			request_info: { success: true },
			destination: { id: 'ABCDEFG', name: 'Renamed', enabled: false },
		});

		await Destinations.update(ctx, {
			destination_id: 'ABCDEFG',
			name: 'Renamed',
			enabled: false,
		});

		expect(captured?.method).toBe('PUT');
		expect(calledUrl().pathname).toBe('/destinations/ABCDEFG');
		expect(JSON.parse(captured?.body ?? 'null')).toEqual({
			name: 'Renamed',
			enabled: false,
		});
	});

	it('DELETE_DESTINATION DELETEs /destinations/{id}', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({
			request_info: { success: true, message: '1 Destination deleted' },
		});

		await Destinations.delete(ctx, { destination_id: 'ABCDEFG' });

		expect(captured?.method).toBe('DELETE');
		expect(calledUrl().pathname).toBe('/destinations/ABCDEFG');
		expect(captured?.body).toBeUndefined();
		expect(db.destinations.deleteByEntityId).toHaveBeenCalledWith('ABCDEFG');
	});

	it('START_COLLECTION refreshes the collection cache after start', async () => {
		const { ctx, db } = makeCtx();
		let calls = 0;
		global.fetch = (async (url: unknown) => {
			calls += 1;
			const path = new URL(String(url)).pathname;
			const payload = path.endsWith('/start')
				? { request_info: { success: true } }
				: {
						request_info: { success: true },
						collection: {
							id: 'ABC123',
							name: 'Probe',
							status: 'queued',
							schedule_type: 'manual',
						},
					};
			return {
				ok: true,
				status: 200,
				statusText: 'OK',
				url: String(url),
				headers: new Headers({ 'Content-Type': 'application/json' }),
				json: async () => payload,
				text: async () => JSON.stringify(payload),
			};
		}) as unknown as typeof global.fetch;

		await Collections.start(ctx, { collection_id: 'ABC123' });

		expect(calls).toBe(2);
		expect(db.collections.upsertByEntityId).toHaveBeenCalledWith(
			'ABC123',
			expect.objectContaining({ status: 'queued' }),
		);
	});

	it('ADD_REQUESTS upserts collection when the response includes one', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({
			request_info: { success: true },
			collection: {
				id: 'ABC123',
				name: 'Probe',
				request_total_count: 1,
			},
		});

		await Requests.add(ctx, {
			collection_id: 'ABC123',
			requests: [{ asin: 'B00I8RKMSM', amazon_domain: 'amazon.com' }],
		});

		expect(db.collections.upsertByEntityId).toHaveBeenCalledWith(
			'ABC123',
			expect.objectContaining({ request_total_count: 1 }),
		);
	});

	it('UPDATE_REQUEST evicts the cache when the response omits request.id', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({
			request_info: { success: true },
			request: { asin: 'B00I8RKMSM' },
		});

		await Requests.update(ctx, {
			collection_id: 'ABC123',
			request_id: 'REQ1',
			asin: 'B00I8RKMSM',
		});

		expect(db.requests.upsertByEntityId).not.toHaveBeenCalled();
		expect(db.requests.deleteByEntityId).toHaveBeenCalledWith('REQ1');
	});

	it('encodes collection ids in the path', async () => {
		const { ctx } = makeCtx();
		mockFetch({
			request_info: { success: true },
			collection: { id: 'A/B', name: 'slash' },
		});

		await Collections.get(ctx, { collection_id: 'A/B' });

		expect(captured?.url).toContain('/collections/A%2FB');
	});

	it('uses the documented API host', () => {
		expect(ASINDATAAPI_API_BASE).toBe('https://api.asindataapi.com');
	});

	it('registers every implemented endpoint in meta', () => {
		expect(Object.keys(asinDataApiEndpointMeta).sort()).toEqual(
			[
				'products.get',
				'search.get',
				'offers.get',
				'categories.get',
				'identifiers.resolve',
				'collections.create',
				'collections.list',
				'collections.get',
				'collections.update',
				'collections.delete',
				'collections.start',
				'requests.list',
				'requests.add',
				'requests.update',
				'requests.clear',
				'requests.delete',
				'resultSets.list',
				'resultSets.get',
				'destinations.list',
				'destinations.create',
				'destinations.update',
				'destinations.delete',
			].sort(),
		);
	});
});
