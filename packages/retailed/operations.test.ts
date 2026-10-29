import { logEventFromContext } from 'corsair/core';
import { makeRetailedRequest } from './client';
import { Goat, Products, StockX, Usage } from './endpoints';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('./client', () => ({
	makeRetailedRequest: jest.fn(),
}));

const mockRequest = jest.mocked(makeRetailedRequest);
const mockLog = jest.mocked(logEventFromContext);

type AnyEndpoint = (ctx: unknown, input?: unknown) => Promise<unknown>;

const product = {
	id: 'p1',
	productId: 'prod-1',
	name: 'Nike Air Max',
	url: 'https://example.com/p1',
	domain: 'stockx.com',
	price: 150,
};

const searchProductsResponse = {
	docs: [product],
	totalDocs: 1,
	limit: 10,
	totalPages: 1,
	page: 1,
	hasPrevPage: false,
	hasNextPage: false,
	prevPage: null,
	nextPage: null,
};

const goatPrice = {
	sizeOption: { value: 10, presentation: '10' },
	stockStatus: 'in_stock',
	boxCondition: 'good',
	shoeCondition: 'new',
	lowestPriceCents: { currency: 'USD' },
	lastSoldPriceCents: { currency: 'USD', amount: 15000 },
	instantShipLowestPriceCents: { currency: 'USD' },
};

function createContext() {
	return {
		key: JSON.stringify({ authType: 'api_key', credential: 'test-key' }),
		options: { authType: 'api_key' as const },
	};
}

describe('Retailed endpoint routing', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const cases: Array<{
		name: string;
		fn: AnyEndpoint;
		input?: Record<string, unknown>;
		path: string;
		response: unknown;
	}> = [
		{
			name: 'usage.get',
			fn: Usage.get as AnyEndpoint,
			input: {},
			path: 'usage',
			response: { plan: 'free', remaining: '100' },
		},
		{
			name: 'products.search',
			fn: Products.search as AnyEndpoint,
			input: { name: 'Nike' },
			path: 'db/products',
			response: searchProductsResponse,
		},
		{
			name: 'stockx.trends',
			fn: StockX.trends as AnyEndpoint,
			input: { query: 'nike' },
			path: 'scraper/stockx/trends',
			response: [product],
		},
		{
			name: 'stockx.search',
			fn: StockX.search as AnyEndpoint,
			input: { query: 'nike' },
			path: 'scraper/stockx/search',
			response: [product],
		},
		{
			name: 'stockx.product',
			fn: StockX.product as AnyEndpoint,
			input: { query: 'nike-air-max-1' },
			path: 'scraper/stockx/product',
			response: product,
		},
		{
			name: 'goat.prices',
			fn: Goat.prices as AnyEndpoint,
			input: { query: 'nike-air-max-1' },
			path: 'scraper/goat/prices',
			response: [goatPrice],
		},
	];

	it.each(cases)(
		'$name calls the expected path and validates output',
		async ({ fn, input, path, response }) => {
			mockRequest.mockResolvedValueOnce(response);
			const ctx = createContext();

			const result = await fn(ctx, input ?? {});

			expect(mockRequest).toHaveBeenCalledWith(
				path,
				ctx.key,
				expect.objectContaining({ method: 'GET' }),
			);
			expect(result).toEqual(response);
			expect(mockLog).toHaveBeenCalled();
		},
	);

	it('products.search puts name and sku in separate OR branches', async () => {
		mockRequest.mockResolvedValueOnce(searchProductsResponse);
		const ctx = createContext();

		await (Products.search as AnyEndpoint)(ctx, {
			name: 'Nike Air',
			sku: 'ABC123',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'db/products',
			ctx.key,
			expect.objectContaining({
				method: 'GET',
				query: expect.objectContaining({
					'where[or][0][name][equals]': 'Nike Air',
					'where[or][1][sku][equals]': 'ABC123',
				}),
			}),
		);
	});
});
