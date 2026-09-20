import { ApiError, request } from 'corsair/http';
import { makeBooqableRequest } from './client';
import { booqableRoutes } from './endpoints/routes';
import type { BooqableContext } from './index';
import { booqable, booqableEndpointSchemas } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

function countLeaves(tree: Record<string, unknown>): number {
	return Object.values(tree).reduce<number>((count, value) => {
		if (typeof value === 'function') return count + 1;
		if (value && typeof value === 'object') {
			return count + countLeaves(value as Record<string, unknown>);
		}
		return count;
	}, 0);
}

function endpointPaths(tree: Record<string, unknown>, prefix = ''): string[] {
	return Object.entries(tree).flatMap(([key, value]) => {
		const path = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') return [path];
		if (value && typeof value === 'object') {
			return endpointPaths(value as Record<string, unknown>, path);
		}
		return [];
	});
}

const mockCtx = {
	key: 'test-api-key',
	$getAccountId: () => 'test-account-id',
	options: {
		companySlug: 'demo-company',
	},
	keys: {
		get_api_key: jest.fn().mockResolvedValue('test-api-key'),
		get_tenant_external_id: jest.fn().mockResolvedValue('demo-company'),
	},
	logEvent: jest.fn(),
	db: {},
} as unknown as BooqableContext;

describe('Booqable plugin shape', () => {
	it('exposes every listed operation with schemas and no webhooks', () => {
		const plugin = booqable();
		const endpoints = plugin.endpoints as Record<string, unknown>;
		const paths = endpointPaths(endpoints).sort();

		expect(countLeaves(endpoints)).toBe(49);
		expect(Object.keys(plugin.endpointMeta ?? {})).toHaveLength(49);
		expect(Object.keys(booqableEndpointSchemas)).toHaveLength(49);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(paths);
		expect(Object.keys(booqableEndpointSchemas).sort()).toEqual(paths);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
	});

	it('uses api_key auth with tenant_external_id account field', () => {
		const plugin = booqable();
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['tenant_external_id'] },
		});
	});
});

describe('Booqable request client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ data: [] });
	});

	it('sends bearer auth to the company-scoped base URL', async () => {
		await makeBooqableRequest('/customers', 'test-api-key', 'demo-company', {
			method: 'GET',
			query: { 'page[number]': 1, 'page[size]': 25 },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://demo-company.booqable.com/api/4',
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer test-api-key',
					'Content-Type': 'application/json',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/customers',
				query: { 'page[number]': 1, 'page[size]': 25 },
			}),
		);
	});

	it('preserves ApiError metadata when wrapping failures', async () => {
		const apiError = new ApiError(
			{ url: '/customers', method: 'GET' },
			{
				url: '/customers',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: {},
			},
			'rate limited',
			{ retryAfter: 1500 },
		);
		mockRequest.mockRejectedValue(apiError);

		await expect(
			makeBooqableRequest('/customers', 'test-api-key', 'demo-company'),
		).rejects.toMatchObject({
			name: 'BooqableAPIError',
			status: 429,
			retryAfter: 1500,
		});
	});
});

describe('Booqable endpoints', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ data: [] });
	});

	it('routes every operation to its independently-contracted path and method', async () => {
		const plugin = booqable({
			companySlug: 'demo-company',
			key: 'test-api-key',
		});
		const endpoints = plugin.endpoints as unknown as Record<
			string,
			Record<
				string,
				(
					ctx: BooqableContext,
					input: Record<string, unknown>,
				) => Promise<unknown>
			>
		>;

		// Independent contract, hardcoded from the Booqable API surface.
		// Intentionally NOT derived from booqableRoutes, so a wrong route fails.
		type ExpectedBooqableRoute = {
			group: string;
			name: string;
			method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
			path: string;
		};
		const EXPECTED_BOOQABLE_CONTRACT: readonly ExpectedBooqableRoute[] = [
			{
				group: 'customers',
				name: 'createCustomer',
				method: 'POST',
				path: '/customers',
			},
			{
				group: 'customers',
				name: 'deleteCustomer',
				method: 'DELETE',
				path: '/customers/{id}',
			},
			{
				group: 'customers',
				name: 'getCustomer',
				method: 'GET',
				path: '/customers/{id}',
			},
			{
				group: 'customers',
				name: 'getCustomers',
				method: 'GET',
				path: '/customers',
			},
			{
				group: 'customers',
				name: 'searchCustomers',
				method: 'POST',
				path: '/customers/search',
			},
			{ group: 'orders', name: 'createOrder', method: 'POST', path: '/orders' },
			{
				group: 'orders',
				name: 'deleteOrder',
				method: 'DELETE',
				path: '/orders/{id}',
			},
			{
				group: 'orders',
				name: 'getNewOrder',
				method: 'GET',
				path: '/orders/new',
			},
			{
				group: 'orders',
				name: 'getOrder',
				method: 'GET',
				path: '/orders/{id}',
			},
			{ group: 'orders', name: 'listOrders', method: 'GET', path: '/orders' },
			{
				group: 'orders',
				name: 'searchOrders',
				method: 'POST',
				path: '/orders/search',
			},
			{
				group: 'productGroups',
				name: 'createProductGroup',
				method: 'POST',
				path: '/product_groups',
			},
			{
				group: 'productGroups',
				name: 'deleteProductGroup',
				method: 'DELETE',
				path: '/product_groups/{id}',
			},
			{
				group: 'productGroups',
				name: 'getProductGroup',
				method: 'GET',
				path: '/product_groups/{id}',
			},
			{
				group: 'productGroups',
				name: 'listProductGroups',
				method: 'GET',
				path: '/product_groups',
			},
			{
				group: 'products',
				name: 'getProduct',
				method: 'GET',
				path: '/products/{id}',
			},
			{
				group: 'products',
				name: 'listProducts',
				method: 'GET',
				path: '/products',
			},
			{
				group: 'companies',
				name: 'updateCompany',
				method: 'PUT',
				path: '/companies/current',
			},
			{
				group: 'inventoryLevels',
				name: 'getInventoryLevels',
				method: 'GET',
				path: '/inventory_levels',
			},
			{
				group: 'barcodes',
				name: 'listBarcodes',
				method: 'GET',
				path: '/barcodes',
			},
			{
				group: 'bundleItems',
				name: 'listBundleItems',
				method: 'GET',
				path: '/bundle_items',
			},
			{
				group: 'bundles',
				name: 'searchBundles',
				method: 'POST',
				path: '/bundles/search',
			},
			{
				group: 'clusters',
				name: 'listClusters',
				method: 'GET',
				path: '/clusters',
			},
			{
				group: 'coupons',
				name: 'listCoupons',
				method: 'GET',
				path: '/coupons',
			},
			{
				group: 'defaultProperties',
				name: 'listDefaultProperties',
				method: 'GET',
				path: '/default_properties',
			},
			{
				group: 'documents',
				name: 'listDocuments',
				method: 'GET',
				path: '/documents',
			},
			{
				group: 'documents',
				name: 'searchDocuments',
				method: 'POST',
				path: '/documents/search',
			},
			{
				group: 'emailTemplates',
				name: 'listEmailTemplates',
				method: 'GET',
				path: '/email_templates',
			},
			{
				group: 'employees',
				name: 'listEmployees',
				method: 'GET',
				path: '/employees',
			},
			{
				group: 'inventoryBreakdowns',
				name: 'listInventoryBreakdowns',
				method: 'GET',
				path: '/inventory_breakdowns',
			},
			{ group: 'items', name: 'listItems', method: 'GET', path: '/items' },
			{
				group: 'items',
				name: 'searchItems',
				method: 'POST',
				path: '/items/search',
			},
			{ group: 'lines', name: 'listLines', method: 'GET', path: '/lines' },
			{
				group: 'locations',
				name: 'listLocations',
				method: 'GET',
				path: '/locations',
			},
			{ group: 'notes', name: 'listNotes', method: 'GET', path: '/notes' },
			{
				group: 'paymentMethods',
				name: 'listPaymentMethods',
				method: 'GET',
				path: '/payment_methods',
			},
			{
				group: 'payments',
				name: 'listPayments',
				method: 'GET',
				path: '/payments',
			},
			{ group: 'photos', name: 'listPhotos', method: 'GET', path: '/photos' },
			{
				group: 'plannings',
				name: 'listPlannings',
				method: 'GET',
				path: '/plannings',
			},
			{
				group: 'plannings',
				name: 'searchPlannings',
				method: 'POST',
				path: '/plannings/search',
			},
			{
				group: 'priceRulesets',
				name: 'listPriceRulesets',
				method: 'GET',
				path: '/price_rulesets',
			},
			{
				group: 'priceStructures',
				name: 'listPriceStructures',
				method: 'GET',
				path: '/price_structures',
			},
			{
				group: 'properties',
				name: 'listProperties',
				method: 'GET',
				path: '/properties',
			},
			{
				group: 'provinces',
				name: 'listProvinces',
				method: 'GET',
				path: '/provinces',
			},
			{
				group: 'stockItemPlannings',
				name: 'listStockItemPlannings',
				method: 'GET',
				path: '/stock_item_plannings',
			},
			{
				group: 'stockItems',
				name: 'listStockItems',
				method: 'GET',
				path: '/stock_items',
			},
			{
				group: 'taxRates',
				name: 'listTaxRates',
				method: 'GET',
				path: '/tax_rates',
			},
			{
				group: 'taxValues',
				name: 'listTaxValues',
				method: 'GET',
				path: '/tax_values',
			},
			{ group: 'users', name: 'listUsers', method: 'GET', path: '/users' },
		];

		expect(EXPECTED_BOOQABLE_CONTRACT).toHaveLength(49);
		expect(booqableRoutes).toHaveLength(EXPECTED_BOOQABLE_CONTRACT.length);

		for (const expected of EXPECTED_BOOQABLE_CONTRACT) {
			const actual = booqableRoutes.find(
				(candidate) =>
					candidate.group === expected.group &&
					candidate.name === expected.name,
			);
			expect(actual).toBeDefined();
			expect(actual?.method).toBe(expected.method);
			expect(actual?.path).toBe(expected.path);
		}

		for (const expected of EXPECTED_BOOQABLE_CONTRACT) {
			const handler = endpoints[expected.group]?.[expected.name];
			if (!handler) {
				throw new Error(
					`[test] missing endpoint ${expected.group}.${expected.name}`,
				);
			}

			const placeholders = [...expected.path.matchAll(/\{([^}]+)\}/g)]
				.map((match) => match[1])
				.filter((name): name is string => typeof name === 'string');
			const input: Record<string, unknown> = {};
			let expectedUrl: string = expected.path;
			for (const param of placeholders) {
				const value = `test-${param}`;
				input[param] = value;
				expectedUrl = expectedUrl.replace(`{${param}}`, value);
			}

			mockRequest.mockClear();
			mockRequest.mockResolvedValue({ data: [] });
			await handler(mockCtx, input);

			const rawCall: unknown = mockRequest.mock.calls[0]?.[1];
			if (typeof rawCall !== 'object' || rawCall === null) {
				throw new Error(
					`[test] missing request for ${expected.group}.${expected.name}`,
				);
			}
			expect(rawCall).toMatchObject({
				method: expected.method,
				url: expectedUrl,
			});
			if ('url' in rawCall && typeof rawCall.url === 'string') {
				expect(rawCall.url).not.toContain('{');
			} else {
				throw new Error(
					`[test] missing url for ${expected.group}.${expected.name}`,
				);
			}
		}
	});

	it('rejects invalid company slug overrides before sending requests', async () => {
		const plugin = booqable({
			companySlug: 'demo-company',
			key: 'test-api-key',
		});
		const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints>;

		await expect(
			endpoints.customers.getCustomers(mockCtx, {
				companySlug: 'attacker.example/',
			}),
		).rejects.toThrow(/company slug is invalid/);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('maps representative operations to API routes', async () => {
		const plugin = booqable({
			companySlug: 'demo-company',
			key: 'test-api-key',
		});
		const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints>;

		await endpoints.customers.getCustomers(mockCtx, {
			query: { 'page[number]': 1 },
		});
		expect(mockRequest).toHaveBeenLastCalledWith(
			expect.objectContaining({
				BASE: 'https://demo-company.booqable.com/api/4',
			}),
			expect.objectContaining({ method: 'GET', url: '/customers' }),
		);

		await endpoints.customers.createCustomer(mockCtx, {
			body: { data: { type: 'customers', attributes: { name: 'Jane' } } },
		});
		expect(mockRequest).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: '/customers',
				body: { data: { type: 'customers', attributes: { name: 'Jane' } } },
			}),
		);

		await endpoints.orders.searchOrders(mockCtx, {
			body: { filter: { status: 'reserved' } },
		});
		expect(mockRequest).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({ method: 'POST', url: '/orders/search' }),
		);

		await endpoints.customers.getCustomer(mockCtx, { id: 'cust-1' });
		expect(mockRequest).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({ method: 'GET', url: '/customers/cust-1' }),
		);
	});
});
