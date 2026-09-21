import { request } from 'corsair/http';
import { booqableRoutes } from './endpoints/routes';
import { BooqableEndpointOutputSchemas } from './endpoints/types';
import type { BooqableContext } from './index';
import { booqable } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

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
	// Test double: `unknown` hop is intentional — the mock only implements the
	// context surface this suite exercises, narrowed to BooqableContext once.
} as unknown as BooqableContext;

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
		// Test-only view: `unknown` hops are intentional — the mock context and
		// open-ended endpoint inputs/outputs are narrowed per assertion below
		// instead of using `any`.
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
			// `unknown` values are intentional: path-param values are built at
			// runtime and stringified by the factory under test.
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

			// `unknown` is intentional: the mocked call args are untyped and
			// narrowed with typeof checks below instead of an `any` cast.
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

describe('Booqable output schemas', () => {
	// Independent contract, hardcoded from the Booqable API v4 JSON:API
	// surface (developers.booqable.com/v4.html — "Response types").
	// Intentionally NOT derived from the implementation, so a weakened
	// schema (e.g. z.unknown()) or a wrong resource type fails here.
	// kind: "single" for fetch/create/update responses, "collection" for
	// list/search responses, "archived" for DELETE (archive) responses.
	type ExpectedOutputContract = {
		key: keyof typeof BooqableEndpointOutputSchemas;
		kind: 'single' | 'collection' | 'archived';
		type: string;
	};
	const EXPECTED_OUTPUT_CONTRACT: readonly ExpectedOutputContract[] = [
		{ key: 'createCustomer', kind: 'single', type: 'customers' },
		{ key: 'deleteCustomer', kind: 'archived', type: 'customers' },
		{ key: 'getCustomer', kind: 'single', type: 'customers' },
		{ key: 'getCustomers', kind: 'collection', type: 'customers' },
		{ key: 'searchCustomers', kind: 'collection', type: 'customers' },
		{ key: 'createOrder', kind: 'single', type: 'orders' },
		{ key: 'deleteOrder', kind: 'archived', type: 'orders' },
		{ key: 'getNewOrder', kind: 'single', type: 'orders' },
		{ key: 'getOrder', kind: 'single', type: 'orders' },
		{ key: 'listOrders', kind: 'collection', type: 'orders' },
		{ key: 'searchOrders', kind: 'collection', type: 'orders' },
		{ key: 'createProductGroup', kind: 'single', type: 'product_groups' },
		{ key: 'deleteProductGroup', kind: 'archived', type: 'product_groups' },
		{ key: 'getProductGroup', kind: 'single', type: 'product_groups' },
		{ key: 'listProductGroups', kind: 'collection', type: 'product_groups' },
		{ key: 'getProduct', kind: 'single', type: 'products' },
		{ key: 'listProducts', kind: 'collection', type: 'products' },
		{ key: 'updateCompany', kind: 'single', type: 'companies' },
		{
			key: 'getInventoryLevels',
			kind: 'collection',
			type: 'inventory_levels',
		},
		{ key: 'listBarcodes', kind: 'collection', type: 'barcodes' },
		{ key: 'listBundleItems', kind: 'collection', type: 'bundle_items' },
		{ key: 'searchBundles', kind: 'collection', type: 'bundles' },
		{ key: 'listClusters', kind: 'collection', type: 'clusters' },
		{ key: 'listCoupons', kind: 'collection', type: 'coupons' },
		{
			key: 'listDefaultProperties',
			kind: 'collection',
			type: 'default_properties',
		},
		{ key: 'listDocuments', kind: 'collection', type: 'documents' },
		{ key: 'searchDocuments', kind: 'collection', type: 'documents' },
		{
			key: 'listEmailTemplates',
			kind: 'collection',
			type: 'email_templates',
		},
		{ key: 'listEmployees', kind: 'collection', type: 'employees' },
		{
			key: 'listInventoryBreakdowns',
			kind: 'collection',
			type: 'inventory_breakdowns',
		},
		{ key: 'listItems', kind: 'collection', type: 'items' },
		{ key: 'searchItems', kind: 'collection', type: 'items' },
		{ key: 'listLines', kind: 'collection', type: 'lines' },
		{ key: 'listLocations', kind: 'collection', type: 'locations' },
		{ key: 'listNotes', kind: 'collection', type: 'notes' },
		{
			key: 'listPaymentMethods',
			kind: 'collection',
			type: 'payment_methods',
		},
		{ key: 'listPayments', kind: 'collection', type: 'payments' },
		{ key: 'listPhotos', kind: 'collection', type: 'photos' },
		{ key: 'listPlannings', kind: 'collection', type: 'plannings' },
		{ key: 'searchPlannings', kind: 'collection', type: 'plannings' },
		{
			key: 'listPriceRulesets',
			kind: 'collection',
			type: 'price_rulesets',
		},
		{
			key: 'listPriceStructures',
			kind: 'collection',
			type: 'price_structures',
		},
		{ key: 'listProperties', kind: 'collection', type: 'properties' },
		{ key: 'listProvinces', kind: 'collection', type: 'provinces' },
		{
			key: 'listStockItemPlannings',
			kind: 'collection',
			type: 'stock_item_plannings',
		},
		{ key: 'listStockItems', kind: 'collection', type: 'stock_items' },
		{ key: 'listTaxRates', kind: 'collection', type: 'tax_rates' },
		{ key: 'listTaxValues', kind: 'collection', type: 'tax_values' },
		{ key: 'listUsers', kind: 'collection', type: 'users' },
	];

	it('declares an output schema for every operation', () => {
		expect(EXPECTED_OUTPUT_CONTRACT).toHaveLength(49);
		expect(Object.keys(BooqableEndpointOutputSchemas)).toHaveLength(
			EXPECTED_OUTPUT_CONTRACT.length,
		);
		for (const expected of EXPECTED_OUTPUT_CONTRACT) {
			expect(BooqableEndpointOutputSchemas[expected.key]).toBeDefined();
		}
	});

	it('validates endpoint-specific JSON:API contracts instead of accepting anything', () => {
		for (const expected of EXPECTED_OUTPUT_CONTRACT) {
			const schema = BooqableEndpointOutputSchemas[expected.key];

			// A bare unknown() schema would accept these; real contracts must not.
			expect(schema.safeParse(42).success).toBe(false);
			expect(schema.safeParse('ok').success).toBe(false);
			expect(schema.safeParse(null).success).toBe(false);
			expect(schema.safeParse({}).success).toBe(false);
			expect(schema.safeParse({ unexpected: 'shape' }).success).toBe(false);

			const resource = {
				id: '54808378-a247-4715-89f6-0a8da2e7ad62',
				type: expected.type,
				attributes: { name: 'John Doe' },
				relationships: {
					customer: {
						data: { type: 'customers', id: 'customer-1' },
					},
				},
			};

			if (expected.kind === 'collection') {
				expect(
					schema.safeParse({
						data: [resource],
						links: { self: 'api/4/orders?page%5Bnumber%5D=1' },
						meta: { stats: { total: { count: 1 } } },
					}).success,
				).toBe(true);
				expect(schema.safeParse({ data: [] }).success).toBe(true);
				// Wrong envelope shape or wrong resource type must fail.
				expect(schema.safeParse({ data: resource }).success).toBe(false);
				expect(
					schema.safeParse({
						data: [{ ...resource, type: 'something_else' }],
					}).success,
				).toBe(false);
				expect(schema.safeParse({ data: [{ id: 'no-type' }] }).success).toBe(
					false,
				);
			} else {
				expect(
					schema.safeParse({
						data: resource,
						included: [
							{
								id: 'customer-1',
								type: 'customers',
								attributes: { name: 'John Doe' },
							},
						],
						links: { self: 'api/4/orders/1' },
						meta: {},
					}).success,
				).toBe(true);
				// Wrong envelope shape or wrong resource type must fail.
				expect(schema.safeParse({ data: [resource] }).success).toBe(false);
				expect(
					schema.safeParse({
						data: { ...resource, type: 'something_else' },
					}).success,
				).toBe(false);
				expect(schema.safeParse({ data: { id: 'no-type' } }).success).toBe(
					false,
				);
			}

			if (expected.kind === 'archived') {
				expect(schema.safeParse({ data: null }).success).toBe(true);
			} else {
				expect(schema.safeParse({ data: null }).success).toBe(false);
			}
		}
	});
});
