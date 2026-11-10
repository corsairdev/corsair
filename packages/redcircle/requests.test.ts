import * as Endpoints from './endpoints/endpoints';
import {
	ACCOUNT,
	CATEGORIES_PAGE,
	PRODUCT,
	PRODUCT_RESULT,
	REVIEWS_PAGE,
	SEARCH_LAST_PAGE,
	SEARCH_PAGE,
	TCIN,
} from './test-fixtures';
import { invoke, lastRequest, respond, spyOnFetch } from './test-support';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = spyOnFetch();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('search.products', () => {
	it('searches by term with the live response shape', async () => {
		respond(fetchMock, SEARCH_PAGE);

		const result = (await invoke(Endpoints.searchProducts, {
			search_term: 'highlighter pens',
			sort_by: 'best_seller',
		})) as Awaited<ReturnType<typeof Endpoints.searchProducts>>;

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/request');
		expect(request.query).toEqual({
			type: 'search',
			search_term: 'highlighter pens',
			sort_by: 'best_seller',
			api_key: 'redcircle-test-key',
		});
		expect(result.search_results).toHaveLength(1);
		expect(result.search_results[0]?.position).toBe(1);
		expect(result.search_results[0]?.product?.tcin).toBe(TCIN);
		// The live pagination block: `next.page` becomes `next_page`.
		expect(result.next_page).toBe(2);
		expect(result.current_page).toBe(1);
		expect(result.total_pages).toBe(10);
		expect(result.total_results).toBe(217);
	});

	it('stops paging when the next block is null', async () => {
		respond(fetchMock, SEARCH_LAST_PAGE);

		const result = (await invoke(Endpoints.searchProducts, {
			search_term: 'pens',
			page: 10,
		})) as Awaited<ReturnType<typeof Endpoints.searchProducts>>;

		expect(result.next_page).toBeNull();
		expect(result.current_page).toBe(10);
	});

	it('sends a delivery filter and zipcode together', async () => {
		respond(fetchMock, SEARCH_PAGE);

		await invoke(Endpoints.searchProducts, {
			search_term: 'pens',
			delivery_type: 'in_store_pickup',
			customer_zipcode: '94105',
		});

		expect(lastRequest(fetchMock).query).toMatchObject({
			delivery_type: 'in_store_pickup',
			customer_zipcode: '94105',
		});
	});

	it('rejects a search with no term and no url', async () => {
		await expect(
			invoke(Endpoints.searchProducts, { sort_by: 'best_seller' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a sort Radar does not define', async () => {
		await expect(
			invoke(Endpoints.searchProducts, {
				search_term: 'pens',
				sort_by: 'cheapest',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a max_page above the credit cap', async () => {
		await expect(
			invoke(Endpoints.searchProducts, {
				search_term: 'pens',
				max_page: 11,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('products.get', () => {
	it('reads a product by tcin', async () => {
		respond(fetchMock, PRODUCT_RESULT);

		const result = (await invoke(Endpoints.productsGet, {
			tcin: TCIN,
		})) as Awaited<ReturnType<typeof Endpoints.productsGet>>;

		expect(lastRequest(fetchMock).query).toEqual({
			type: 'product',
			tcin: TCIN,
			api_key: 'redcircle-test-key',
		});
		expect(result.product.title).toBe(PRODUCT.title);
		expect(result.product.price?.value).toBe(8.99);
		expect(result.product.eligibility).toBeUndefined();
	});

	it('rejects a product request with no selector', async () => {
		await expect(invoke(Endpoints.productsGet, {})).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts a gtin instead of a tcin', async () => {
		respond(fetchMock, PRODUCT_RESULT);

		await invoke(Endpoints.productsGet, { gtin: '00716641094907' });

		expect(lastRequest(fetchMock).query).toMatchObject({
			type: 'product',
			gtin: '00716641094907',
		});
	});
});

describe('reviews.list', () => {
	it('lists a product’s reviews with paging', async () => {
		respond(fetchMock, REVIEWS_PAGE);

		const result = (await invoke(Endpoints.reviewsList, {
			tcin: TCIN,
			sort_by: 'most_recent',
		})) as Awaited<ReturnType<typeof Endpoints.reviewsList>>;

		expect(lastRequest(fetchMock).query).toEqual({
			type: 'reviews',
			tcin: TCIN,
			sort_by: 'most_recent',
			api_key: 'redcircle-test-key',
		});
		expect(result.reviews[0]?.rating).toBe(5);
		expect(result.next_page).toBe(2);
	});

	it('rejects a review sort Radar does not define', async () => {
		await expect(
			invoke(Endpoints.reviewsList, { tcin: TCIN, sort_by: 'newest' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('categories.list', () => {
	it('lists root categories', async () => {
		respond(fetchMock, CATEGORIES_PAGE);

		const result = (await invoke(Endpoints.categoriesList, {})) as Awaited<
			ReturnType<typeof Endpoints.categoriesList>
		>;

		expect(lastRequest(fetchMock).path).toBe('/categories');
		expect(result.categories?.[0]?.is_root).toBe(true);
		expect(result.categories?.[0]?.has_children).toBe(true);
	});

	it('rejects two mutually exclusive selectors', async () => {
		await expect(
			invoke(Endpoints.categoriesList, {
				parent_id: '5xt1a',
				search_term: 'office',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('account.get', () => {
	it('reads the account and strips the echoed api_key', async () => {
		respond(fetchMock, ACCOUNT);

		const result = (await invoke(Endpoints.accountGet, {})) as Awaited<
			ReturnType<typeof Endpoints.accountGet>
		>;

		expect(lastRequest(fetchMock).path).toBe('/account');
		expect(result.account.credits_remaining).toBe(14885);
		expect(result.account.plan).toBe('Plan Name');
		// RedCircle echoes the key back; it must not reach a caller.
		expect(result.account).not.toHaveProperty('api_key');
		expect(JSON.stringify(result)).not.toContain('demo');
	});
});

describe('envelope handling', () => {
	it('fails rather than inventing an empty list when the key is missing', async () => {
		respond(fetchMock, { request_info: { success: true } });

		await expect(
			invoke(Endpoints.searchProducts, {
				search_term: 'pens',
			}),
		).rejects.toThrow();
	});
});
