import { logEventFromContext } from 'corsair/core';
import { BESTBUY_API_BASE } from './client';
import * as Endpoints from './endpoints';
import { bestBuyEndpointMeta, bestBuyEndpointSchemas } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

type Ctx = Parameters<typeof Endpoints.getProducts>[0];

function makeCtx() {
	return { key: 'test-key' } as unknown as Ctx;
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
			statusText: status < 400 ? 'OK' : 'Error',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => payload,
			text: async () => JSON.stringify(payload),
		};
	}) as unknown as typeof global.fetch;
}

function parsed(): { path: string; query: URLSearchParams } {
	const url = new URL(captured?.url ?? 'http://invalid');
	return { path: url.pathname, query: url.searchParams };
}

describe('Best Buy endpoints', () => {
	it('products.list hits /v1/products with apiKey and format=json', async () => {
		mockFetch({ products: [{ sku: 1, name: 'TV' }], total: 1 });
		const out = await Endpoints.getProducts(makeCtx(), { pageSize: 10 });
		const { path, query } = parsed();
		expect(captured?.url.startsWith(`${BESTBUY_API_BASE}/products`)).toBe(true);
		expect(path).toBe('/v1/products');
		expect(query.get('apiKey')).toBe('test-key');
		expect(query.get('format')).toBe('json');
		expect(query.get('pageSize')).toBe('10');
		expect(out.products[0]?.sku).toBe(1);
	});

	it('products.list builds documented Remix filters', async () => {
		mockFetch({ products: [] });
		await Endpoints.getProducts(makeCtx(), {
			sku: '43900',
			categoryPathId: 'abcat0101000',
			salePrice: '>100',
			sort: 'salePrice.dsc',
		});
		const { path, query } = parsed();
		expect(decodeURIComponent(path)).toContain('sku=43900');
		expect(decodeURIComponent(path)).toContain('categoryPath.id=abcat0101000');
		expect(decodeURIComponent(path)).toContain('salePrice>100');
		expect(query.get('sort')).toBe('salePrice.dsc');
	});

	it('products.get uses /products/{sku}.json', async () => {
		mockFetch({ sku: 8880044, name: 'Batman' });
		const out = await Endpoints.getProductDetails(makeCtx(), {
			sku: '8880044',
			show: 'sku,name,salePrice',
		});
		const { path, query } = parsed();
		expect(path).toBe('/v1/products/8880044.json');
		expect(query.get('show')).toBe('sku,name,salePrice');
		expect(out.sku).toBe(8880044);
	});

	it('categories.list and categories.get use official paths', async () => {
		mockFetch({ categories: [{ id: 'abcat0100000' }] });
		await Endpoints.getCategories(makeCtx(), {
			id: 'abcat0100000|abcat0200000',
		});
		expect(decodeURIComponent(parsed().path)).toContain(
			'id in(abcat0100000,abcat0200000)',
		);

		mockFetch({ id: 'abcat0100000', name: 'TV & Home Theater' });
		const detail = await Endpoints.getCategoryDetails(makeCtx(), {
			id: 'abcat0100000',
		});
		expect(parsed().path).toBe('/v1/categories/abcat0100000.json');
		expect(detail.id).toBe('abcat0100000');
	});

	it('stores.list uses area() for geo search', async () => {
		mockFetch({ stores: [{ storeId: 281, city: 'Richfield' }] });
		await Endpoints.getStores(makeCtx(), {
			geo: { postalCode: '55423', distance: 10 },
			state: 'MN',
		});
		const path = decodeURIComponent(parsed().path);
		expect(path).toContain('area(55423,10)');
		expect(path).toContain('region=MN');
	});

	it('stores.get uses /stores/{storeId}.json', async () => {
		mockFetch({ storeId: 281, city: 'Richfield' });
		const out = await Endpoints.getStoreDetails(makeCtx(), {
			storeId: '281',
			show: 'all',
		});
		expect(parsed().path).toBe('/v1/stores/281.json');
		expect(parsed().query.get('show')).toBe('all');
		expect(out.storeId).toBe(281);
	});

	it('reviews.list filters sku, reviewer, and score', async () => {
		mockFetch({ reviews: [{ id: '9', sku: 43900, rating: 5 }] });
		const out = await Endpoints.getReviews(makeCtx(), {
			sku: '43900',
			reviewer: 'Pat',
			minScore: 4,
			maxScore: 5,
			sort: 'submissionTime.dsc',
		});
		const path = decodeURIComponent(parsed().path);
		expect(path).toContain('sku=43900');
		expect(path).toContain('reviewer.name=Pat');
		expect(path).toContain('rating>=4');
		expect(path).toContain('rating<=5');
		expect(out.reviews).toHaveLength(1);
	});

	it('reviews.get uses /reviews/{id}.json', async () => {
		mockFetch({ id: '123', comment: 'Great' });
		const out = await Endpoints.getReviewDetails(makeCtx(), { id: '123' });
		expect(parsed().path).toBe('/v1/reviews/123.json');
		expect(out.id).toBe('123');
	});

	it('covers every registered operation', () => {
		expect(Object.keys(bestBuyEndpointMeta).sort()).toEqual([
			'categories.get',
			'categories.list',
			'products.get',
			'products.list',
			'reviews.get',
			'reviews.list',
			'stores.get',
			'stores.list',
		]);
		expect(Object.keys(bestBuyEndpointSchemas).sort()).toEqual(
			Object.keys(bestBuyEndpointMeta).sort(),
		);
	});
});
