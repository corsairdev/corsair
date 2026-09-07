import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import { makeWixRequest } from './client';
import { wixEndpointSchemas } from './endpoints';
import { getRoute, resolvePath } from './endpoints/factory';
import { wixRoutes } from './endpoints/routes';
import {
	WixEndpointInputSchemas,
	WixEndpointOutputSchemas,
} from './endpoints/types';
import { wix, wixAuthConfig, wixEndpointMeta } from './index';

jest.mock('./client', () => {
	const original = jest.requireActual('./client');
	return {
		...original,
		makeWixRequest: jest.fn(),
	};
});

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockMakeWixRequest = makeWixRequest as jest.Mock;
const mockLogEvent = logEventFromContext as jest.Mock;

// plugin endpoint trees and sample inputs are json bags across 143 ops;
// a per-operation union is not practical in shared test helpers
type JsonBag = Record<string, unknown>;

// unused mock-call fields stay unknown: tests assert a few keys only, and
// each of the 143 request bodies has a different shape
type Unused = unknown;

type InputSchemaKey = keyof typeof WixEndpointInputSchemas;
type OutputSchemaKey = keyof typeof WixEndpointOutputSchemas;

function inputSchema(key: string) {
	return WixEndpointInputSchemas[key as InputSchemaKey];
}

function outputSchema(key: string) {
	return WixEndpointOutputSchemas[key as OutputSchemaKey];
}

type TestCtx = {
	key: string;
	options?: {
		authType?: 'api_key' | 'oauth_2';
		siteId?: string;
	};
};

const mockCtx: TestCtx = {
	key: 'test-api-key',
	options: {},
};

// endpoints is a nested binder map; tests only need (ctx, input) so the
// tree is walked as json bags instead of the 143-operation handler union
function endpointFn(group: string, name: string) {
	const plugin = wix();
	const tree = plugin.endpoints as Record<string, JsonBag>;
	const fn = tree[group]?.[name];
	if (typeof fn !== 'function') {
		throw new Error(`[wix] missing endpoint: ${group}.${name}`);
	}
	return fn as (ctx: TestCtx, input: JsonBag) => Unused;
}

// required fields differ per route; a single sample bag is filled and
// trimmed by the per-op zod schema rather than a 143-member input union
function sampleInput(route: (typeof wixRoutes)[number]): JsonBag {
	const input: JsonBag = {
		siteId: 'test-site-id',
		filter: { id: { $exists: true } },
		email: 'test@example.com',
		password: 'test-password',
		domainName: 'example.com',
		text: 'hello world',
		mimeType: 'image/jpeg',
		moderationStatus: 'APPROVED',
		labels: ['label-1'],
		ids: ['id-1'],
		names: ['name-1'],
		labelKeys: ['key-1'],
		categoryIds: ['category-1'],
		menuIds: ['menu-1'],
		orderIds: ['order-1'],
		appIds: ['app-1'],
		memberIds: ['member-1'],
		roleIds: ['role-1'],
		fileIds: ['file-1'],
		products: [{ name: 'product-1' }],
		updates: [{ id: 'update-1' }],
		orders: [{ order: { id: 'order-1' } }],
		info: { name: { first: 'Ada' } },
		fieldMask: { paths: ['info.name.first'] },
		loginId: { email: 'test@example.com' },
		revision: '1',
		formIds: ['form-1'],
		formId: 'form-1',
		fieldsIds: ['field-1'],
		items: [{ id: 'item-1' }],
		choices: [{ name: 'choice-1' }],
		assignTags: ['tag-1'],
		infoSectionIds: ['section-1'],
		eventId: 'event-1',
		country: 'US',
		fieldKeys: ['field-1'],
		url: 'https://example.com/file.jpg',
		itemIds: ['item-1'],
		limit: 5,
		offset: 0,
	};
	// GraphQL routes require a non-empty GraphQL document.
	if (route.graphql) input.query = 'query Events { events { id } }';
	for (const param of route.pathParams ?? []) {
		if (input[param] === undefined) input[param] = `test-${param}`;
	}
	return input;
}

function expectedPath(
	route: (typeof wixRoutes)[number],
	input: JsonBag,
): string {
	let index = 0;
	return (route.path.split('?')[0] ?? route.path).replace(
		/\{([^}]+)\}/g,
		() => {
			const key = route.pathParams?.[index];
			index += 1;
			return encodeURIComponent(String(key ? input[key] : ''));
		},
	);
}

function requiredShapeKeys(key: string): string[] {
	const schema = inputSchema(key);
	if (!(schema instanceof z.ZodObject)) return [];
	return Object.entries(schema.shape)
		.filter(([, field]) => {
			const check = field as { isOptional?: () => boolean };
			return typeof check.isOptional === 'function'
				? !check.isOptional()
				: false;
		})
		.map(([name]) => name);
}

describe('Wix plugin shape', () => {
	it('exposes all 143 operations with schemas and no webhooks', () => {
		const plugin = wix();
		const endpoints = plugin.endpoints as JsonBag;

		const leaves: string[] = [];
		const collect = (tree: JsonBag, prefix = '') => {
			for (const [key, value] of Object.entries(tree)) {
				const path = prefix ? `${prefix}.${key}` : key;
				if (typeof value === 'function') leaves.push(path);
				else if (value && typeof value === 'object') {
					collect(value as JsonBag, path);
				}
			}
		};
		collect(endpoints);

		expect(wixRoutes).toHaveLength(143);
		expect(leaves).toHaveLength(143);
		expect(Object.keys(plugin.endpointMeta ?? {})).toHaveLength(143);
		expect(Object.keys(wixEndpointSchemas)).toHaveLength(143);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(
			leaves.sort(),
		);
		expect(Object.keys(wixEndpointSchemas).sort()).toEqual(leaves.sort());
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
	});

	it('covers every oss spec op code exactly once', () => {
		const codes = wixRoutes.map((route) => route.specCode);
		expect(new Set(codes).size).toBe(143);
		expect(codes).toContain('WIX_QUERY_CONTACTS');
		expect(codes).toContain('WIX_SEARCH_PRODUCTS');
		expect(codes).toContain('WIX_QUERY_E_COMMERCE_ORDERS');
	});

	it('has input and output schemas for every route', () => {
		for (const route of wixRoutes) {
			expect(inputSchema(route.key)).toBeDefined();
			expect(outputSchema(route.key)).toBeDefined();
		}
		expect(Object.keys(WixEndpointInputSchemas)).toHaveLength(143);
		expect(Object.keys(WixEndpointOutputSchemas)).toHaveLength(143);
	});
});

describe('Wix endpoints', () => {
	beforeEach(() => {
		mockMakeWixRequest.mockReset();
		mockMakeWixRequest.mockResolvedValue({ success: true });
		mockLogEvent.mockClear();
	});

	it.each(wixRoutes.map((route) => [route.key, route] as const))(
		'%s calls the documented method and exact path',
		async (_key, route) => {
			const fn = endpointFn(route.group, route.name);
			expect(typeof fn).toBe('function');

			const input = sampleInput(route);
			inputSchema(route.key).parse(input);

			await fn(mockCtx, input);

			expect(mockMakeWixRequest).toHaveBeenCalledTimes(1);
			const [path, token, options] = mockMakeWixRequest.mock.calls[0] as [
				string,
				string,
				{
					method: string;
					body?: Unused;
					query?: Unused;
					siteId?: string;
				},
			];
			expect(token).toBe('test-api-key');
			expect(options.method).toBe(route.method);
			expect(path).toBe(expectedPath(route, input));
			expect(options.siteId).toBe('test-site-id');
			if (route.queryBody) {
				expect(options.body).toHaveProperty('query');
			}
			if (route.searchBody) {
				expect(options.body).toHaveProperty('search');
			}

			const parsed = outputSchema(route.key).parse({ success: true });
			expect(parsed).toBeDefined();

			expect(mockLogEvent).toHaveBeenCalledWith(
				expect.anything(),
				`wix.${route.group}.${route.name}`,
				expect.objectContaining({ method: route.method }),
				'completed',
			);
		},
	);

	it.each(
		wixRoutes
			.filter((route) => (route.pathParams ?? []).length > 0)
			.map((route) => [route.key, route] as const),
	)('%s throws when a path param is missing', async (_key, route) => {
		const fn = endpointFn(route.group, route.name);
		const input = sampleInput(route);
		for (const param of route.pathParams ?? []) {
			if (param === 'siteId') continue;
			const { [param]: _dropped, ...without } = input;
			await expect(fn(mockCtx, without)).rejects.toThrow();
			expect(mockMakeWixRequest).not.toHaveBeenCalled();
			mockMakeWixRequest.mockClear();
		}
	});

	it.each(wixRoutes.map((route) => [route.key, route] as const))(
		'%s enforces every required input field',
		(_key, route) => {
			const sample = sampleInput(route);
			inputSchema(route.key).parse(sample);

			const required = requiredShapeKeys(route.key).filter(
				(name) => sample[name] !== undefined,
			);
			const notEnforced: string[] = [];
			for (const name of required) {
				const { [name]: _dropped, ...without } = sample;
				if (inputSchema(route.key).safeParse(without).success) {
					notEnforced.push(`${route.key} should require ${name}`);
				}
			}
			expect(notEnforced).toEqual([]);
		},
	);

	it('wraps limit/offset into query.paging for query endpoints', async () => {
		const fn = endpointFn('contacts', 'query');
		await fn(mockCtx, { siteId: 's', limit: 5, offset: 10 });

		const [, , options] = mockMakeWixRequest.mock.calls[0] as [
			string,
			string,
			{ body?: { query?: { paging?: Unused } } },
		];
		expect(options.body?.query?.paging).toEqual({ limit: 5, offset: 10 });
	});

	it('preserves input.query in the body for queryBody routes', async () => {
		const fn = endpointFn('contacts', 'query');
		await fn(mockCtx, { siteId: 's', query: { filter: { firstName: 'Ada' } } });

		const [path, , options] = mockMakeWixRequest.mock.calls[0] as [
			string,
			string,
			{
				body?: { query?: { filter?: Unused } };
				query?: JsonBag;
			},
		];
		expect(options.body?.query?.filter).toEqual({ firstName: 'Ada' });
		expect(options.query).toBeUndefined();
		expect(path).toBe('/contacts/v4/contacts/query');
	});

	it('accepts Wix scalar equality shorthand in the typed filter field', async () => {
		const fn = endpointFn('contacts', 'query');
		await fn(mockCtx, { siteId: 's', filter: { status: 'DONE' } });

		const [, , options] = mockMakeWixRequest.mock.calls[0] as [
			string,
			string,
			{ body?: { query?: { filter?: Unused } } },
		];
		expect(options.body?.query?.filter).toEqual({ status: 'DONE' });
	});

	it('accepts explicit operator objects alongside the scalar shorthand', async () => {
		const fn = endpointFn('contacts', 'query');
		await fn(mockCtx, {
			siteId: 's',
			filter: { lastName: { $startsWith: 'Mu' } },
		});

		const [, , options] = mockMakeWixRequest.mock.calls[0] as [
			string,
			string,
			{ body?: { query?: { filter?: Unused } } },
		];
		expect(options.body?.query?.filter).toEqual({
			lastName: { $startsWith: 'Mu' },
		});
	});

	it('rejects non-JSON filter values before reaching the API', async () => {
		const fn = endpointFn('contacts', 'query');
		await expect(
			fn(mockCtx, { siteId: 's', filter: { status: () => 'oops' } }),
		).rejects.toThrow();
		expect(mockMakeWixRequest).not.toHaveBeenCalled();
	});

	it('excludes snake_case path param duplicates from the request body', async () => {
		const fn = endpointFn('contacts', 'addLabels');
		await fn(mockCtx, {
			contactId: 'contact-1',
			// resolvePath also accepts the snake_case alias; it must never leak
			// into the request body as a duplicate field.
			contact_id: 'contact-1',
			labelKeys: ['vip'],
		});

		const [path, , options] = mockMakeWixRequest.mock.calls[0] as [
			string,
			string,
			{ body?: JsonBag },
		];
		expect(path).toBe('/contacts/v4/contacts/contact-1/labels');
		expect(options.body).toEqual({ labelKeys: ['vip'] });
		expect(options.body?.contact_id).toBeUndefined();
	});

	it('unlabels a contact with DELETE and labelKeys as query params', async () => {
		const fn = endpointFn('contacts', 'unlabel');
		await fn(mockCtx, {
			contactId: 'contact-1',
			labelKeys: ['vip'],
		});

		const [path, , options] = mockMakeWixRequest.mock.calls[0] as [
			string,
			string,
			{ method?: string; query?: Unused; body?: Unused },
		];
		expect(options.method).toBe('DELETE');
		expect(path).toBe('/contacts/v4/contacts/contact-1/labels');
		expect(options.query).toEqual({ labelKeys: ['vip'] });
		expect(options.body).toBeUndefined();
	});

	it('bulk-updates contacts on the v4 bulk path with info and fieldMask.paths', async () => {
		const fn = endpointFn('contacts', 'bulkUpdate');
		await fn(mockCtx, {
			info: { name: { first: 'Ada' } },
			fieldMask: { paths: ['info.name.first'] },
		});

		const [path, , options] = mockMakeWixRequest.mock.calls[0] as [
			string,
			string,
			{ body?: JsonBag },
		];
		expect(path).toBe('/contacts/v4/bulk/contacts/update');
		expect(options.body).toMatchObject({
			info: { name: { first: 'Ada' } },
			fieldMask: { paths: ['info.name.first'] },
		});
		expect(options.body).not.toHaveProperty('items');
	});

	it('bulk-updates orders on the ecom bulk path with orders[].order', async () => {
		const fn = endpointFn('orders', 'bulkUpdate');
		await fn(mockCtx, {
			orders: [{ order: { id: 'order-1' } }],
		});

		const [path, , options] = mockMakeWixRequest.mock.calls[0] as [
			string,
			string,
			{ body?: JsonBag },
		];
		expect(path).toBe('/ecom/v1/bulk/orders/update');
		expect(options.body).toEqual({ orders: [{ order: { id: 'order-1' } }] });
	});

	it('deletes a loyalty coupon with revision on the loyalty-coupons path', async () => {
		const fn = endpointFn('marketing', 'deleteLoyaltyCoupon');
		await fn(mockCtx, { couponId: 'coupon-1', revision: '3' });

		const [path, , options] = mockMakeWixRequest.mock.calls[0] as [
			string,
			string,
			{ method?: string; query?: Unused },
		];
		expect(options.method).toBe('DELETE');
		expect(path).toBe('/loyalty-coupons/v1/coupons/coupon-1');
		expect(options.query).toEqual({ revision: '3' });
	});

	it('registers a member through IAM Register V2', async () => {
		const fn = endpointFn('members', 'register');
		await fn(mockCtx, {
			loginId: { email: 'member@example.com' },
			password: 'secret',
		});

		const [path, , options] = mockMakeWixRequest.mock.calls[0] as [
			string,
			string,
			{ body?: JsonBag },
		];
		expect(path).toBe('/_api/iam/authentication/v2/register');
		expect(options.body).toEqual({
			loginId: { email: 'member@example.com' },
			password: 'secret',
		});
	});

	it('uses site-media, bookings-reader, and form v4 paths', async () => {
		await endpointFn('media', 'generateFileUploadUrl')(mockCtx, {
			mimeType: 'image/jpeg',
		});
		expect(mockMakeWixRequest.mock.calls[0]?.[0]).toBe(
			'/site-media/v1/files/generate-upload-url',
		);

		mockMakeWixRequest.mockClear();
		await endpointFn('bookings', 'queryExtendedBookings')(mockCtx, {});
		expect(mockMakeWixRequest.mock.calls[0]?.[0]).toBe(
			'/_api/bookings-reader/v2/extended-bookings/query',
		);

		mockMakeWixRequest.mockClear();
		await endpointFn('forms', 'bulkDeleteSchemas')(mockCtx, {
			formIds: ['form-1'],
		});
		expect(mockMakeWixRequest.mock.calls[0]?.[0]).toBe(
			'/forms/v4/bulk/forms/delete',
		);
		expect(
			(
				mockMakeWixRequest.mock.calls[0]?.[2] as {
					body?: JsonBag;
				}
			).body,
		).toEqual({ formIds: ['form-1'] });

		mockMakeWixRequest.mockClear();
		await endpointFn('forms', 'removeDeletedFields')(mockCtx, {
			formId: 'form-1',
			fieldsIds: ['field-1'],
		});
		expect(mockMakeWixRequest.mock.calls[0]?.[0]).toBe(
			'/form-schema-service/v4/forms/fields/delete',
		);
	});

	it('falls back to the plugin-level siteId when the call omits it', async () => {
		const fn = endpointFn('contacts', 'list');
		await fn({ ...mockCtx, options: { siteId: 'plugin-site' } }, {});

		const [, , options] = mockMakeWixRequest.mock.calls[0] as [
			string,
			string,
			{ siteId?: string; accountId?: string },
		];
		expect(options.siteId).toBe('plugin-site');
		expect(options.accountId).toBeUndefined();
	});

	it('suppresses the plugin-level siteId for explicit account calls', async () => {
		const fn = endpointFn('sites', 'queryFolders');
		await fn(
			{ ...mockCtx, options: { siteId: 'plugin-site' } },
			{
				accountId: 'account-1',
			},
		);

		const [, , options] = mockMakeWixRequest.mock.calls[0] as [
			string,
			string,
			{ siteId?: string; accountId?: string },
		];
		expect(options.siteId).toBeUndefined();
		expect(options.accountId).toBe('account-1');
	});

	it('rejects invalid input through the schema before any request', async () => {
		const fn = endpointFn('contacts', 'query');
		await expect(fn(mockCtx, { limit: 'not-a-number' })).rejects.toThrow();
		expect(mockMakeWixRequest).not.toHaveBeenCalled();
	});

	it('rejects malformed responses through the output schema', async () => {
		mockMakeWixRequest.mockResolvedValueOnce({ contacts: 'not-an-array' });
		const fn = endpointFn('contacts', 'query');
		await expect(fn(mockCtx, { siteId: 's' })).rejects.toThrow();
	});

	it('rejects response items containing non-JSON values', async () => {
		mockMakeWixRequest.mockResolvedValueOnce({
			contacts: [{ id: 'c1', nested: { callback: () => 'oops' } }],
		});
		const fn = endpointFn('contacts', 'query');
		await expect(fn(mockCtx, { siteId: 's' })).rejects.toThrow(/non-JSON/i);
		expect(mockMakeWixRequest).toHaveBeenCalledTimes(1);
	});

	it('accepts response items whose nested values are all JSON', async () => {
		mockMakeWixRequest.mockResolvedValueOnce({
			contacts: [
				{
					id: 'c1',
					revision: '1',
					info: { phones: [{ tag: 'MAIN', number: '+15550001' }] },
				},
			],
		});
		const fn = endpointFn('contacts', 'query');
		const result = (await fn(mockCtx, { siteId: 's' })) as {
			contacts?: { id?: string }[];
		};
		expect(result.contacts?.[0]?.id).toBe('c1');
	});

	it('rejects typed-entity violations in query responses', async () => {
		mockMakeWixRequest.mockResolvedValueOnce({
			orders: [{ id: 'o1', revision: '1', status: 5 }],
		});
		const fn = endpointFn('orders', 'query');
		await expect(fn(mockCtx, { siteId: 's' })).rejects.toThrow();

		mockMakeWixRequest.mockResolvedValueOnce({
			products: [{ id: 'p1', revision: '1', name: 123 }],
		});
		const search = endpointFn('stores', 'searchProducts');
		await expect(search(mockCtx, { siteId: 's' })).rejects.toThrow();
	});

	it('accepts valid typed-entity response items', async () => {
		mockMakeWixRequest.mockResolvedValueOnce({
			orders: [{ id: 'o1', revision: '1', status: 'INITIALIZED' }],
		});
		const fn = endpointFn('orders', 'query');
		const result = (await fn(mockCtx, { siteId: 's' })) as {
			orders?: { status?: string }[];
		};
		expect(result.orders?.[0]?.status).toBe('INITIALIZED');
	});

	it('rejects malformed typed fields in bulk product payloads', async () => {
		const fn = endpointFn('stores', 'bulkCreateProductsWithInventory');
		await expect(
			fn(mockCtx, {
				siteId: 's',
				products: [{ name: 123 }],
			} as never),
		).rejects.toThrow();
	});

	it('rejects typed-entity violations in inventory and coupon responses', async () => {
		mockMakeWixRequest.mockResolvedValueOnce({
			inventoryItems: [{ id: 'inv-1', quantity: 'ten' }],
		});
		const inventory = endpointFn('stores', 'queryInventory');
		await expect(inventory(mockCtx, { siteId: 's' })).rejects.toThrow();

		mockMakeWixRequest.mockResolvedValueOnce({
			coupons: [{ id: 'c1', code: 123 }],
		});
		const coupons = endpointFn('stores', 'queryCoupons');
		await expect(coupons(mockCtx, { siteId: 's' })).rejects.toThrow();
	});

	it('sends GET query params as query, not body', async () => {
		const fn = endpointFn('contacts', 'list');
		await fn(mockCtx, { siteId: 's', limit: 5, offset: 0 });

		const [, , options] = mockMakeWixRequest.mock.calls[0] as [
			string,
			string,
			{ body?: Unused; query?: JsonBag },
		];
		expect(options.body).toBeUndefined();
		expect(options.query).toMatchObject({ limit: 5, offset: 0 });
	});

	it('passes accountId through for account-level calls', async () => {
		const fn = endpointFn('sites', 'queryFolders');
		await fn(mockCtx, { accountId: 'account-1', limit: 5 });

		const [, , options] = mockMakeWixRequest.mock.calls[0] as [
			string,
			string,
			{ accountId?: string; siteId?: string },
		];
		expect(options.accountId).toBe('account-1');
		expect(options.siteId).toBeUndefined();
	});

	it('forwards the configured authType to makeWixRequest', async () => {
		const fn = endpointFn('contacts', 'list');
		await fn(
			{ ...mockCtx, options: { authType: 'api_key' } },
			{
				siteId: 's',
				limit: 1,
			},
		);

		const [, , options] = mockMakeWixRequest.mock.calls[0] as [
			string,
			string,
			{ authType?: string },
		];
		expect(options.authType).toBe('api_key');
	});

	it('sends the Wix search envelope for searchProducts', async () => {
		const fn = endpointFn('stores', 'searchProducts');
		await fn(mockCtx, { siteId: 's', search: 'running shoes' });

		const [path, , options] = mockMakeWixRequest.mock.calls[0] as [
			string,
			string,
			{ body?: { search?: { search?: Unused }; query?: Unused } },
		];
		expect(path).toBe('/stores/v3/products/search');
		expect(options.body?.search).toEqual({
			search: { expression: 'running shoes' },
		});
		expect(options.body).not.toHaveProperty('query');
	});

	it('wraps an object search expression in the Wix search envelope', async () => {
		const fn = endpointFn('stores', 'searchProducts');
		await fn(mockCtx, { siteId: 's', search: { expression: 'shoes' } });

		const [, , options] = mockMakeWixRequest.mock.calls[0] as [
			string,
			string,
			{ body?: { search?: Unused } },
		];
		expect(options.body?.search).toEqual({
			search: { expression: 'shoes' },
		});
	});

	it('keeps a nested object search document in the Wix envelope', async () => {
		const fn = endpointFn('stores', 'searchProducts');
		await fn(mockCtx, {
			siteId: 's',
			search: { search: { expression: 'boots' }, paging: { limit: 10 } },
		});

		const [, , options] = mockMakeWixRequest.mock.calls[0] as [
			string,
			string,
			{ body?: { search?: Unused } },
		];
		expect(options.body?.search).toEqual({
			search: { expression: 'boots' },
			paging: { limit: 10 },
		});
	});

	it('does not let a raw body bypass query wrapping', async () => {
		const fn = endpointFn('contacts', 'query');
		await fn(mockCtx, {
			siteId: 's',
			filter: { status: 'ACTIVE' },
			body: { filter: { leaked: true } },
		});

		const [, , options] = mockMakeWixRequest.mock.calls[0] as [
			string,
			string,
			{ body?: { query?: Unused; filter?: Unused } },
		];
		expect(options.body).toEqual({
			query: { filter: { status: 'ACTIVE' } },
		});
	});

	it('rejects empty filters on irreversible by-filter deletes', async () => {
		const rsvps = endpointFn('events', 'bulkDeleteRsvpsByFilter');
		await expect(rsvps(mockCtx, { siteId: 's', filter: {} })).rejects.toThrow();
		expect(mockMakeWixRequest).not.toHaveBeenCalled();

		const benefits = endpointFn('benefits', 'bulkDeleteBenefitItemsByFilter');
		await expect(benefits(mockCtx, { siteId: 's' })).rejects.toThrow();
		await expect(
			benefits(mockCtx, { siteId: 's', filter: {} }),
		).rejects.toThrow();
		expect(mockMakeWixRequest).not.toHaveBeenCalled();
	});

	it('rejects GraphQL mutations on the read-only events query', async () => {
		const fn = endpointFn('events', 'queryEventsGraphql');
		await expect(
			fn(mockCtx, {
				siteId: 's',
				query: 'mutation Wipe { deleteEvent(id: "1") { id } }',
			}),
		).rejects.toThrow();
		expect(mockMakeWixRequest).not.toHaveBeenCalled();
	});

	it('rejects siteId and accountId together before transport', async () => {
		const fn = endpointFn('contacts', 'list');
		await expect(
			fn(mockCtx, { siteId: 's', accountId: 'a', limit: 1 }),
		).rejects.toThrow('mutually exclusive');
		expect(mockMakeWixRequest).not.toHaveBeenCalled();
	});

	it('sends the GraphQL body contract for queryEventsGraphql', async () => {
		const fn = endpointFn('events', 'queryEventsGraphql');
		await fn(mockCtx, {
			siteId: 's',
			query: 'query Events { events { id } }',
			filter: { status: 'PUBLISHED' },
		} as never);

		const [, , options] = mockMakeWixRequest.mock.calls[0] as [
			string,
			string,
			{
				body?: {
					query?: Unused;
					variables?: { filter?: Unused };
				};
				query?: JsonBag;
			},
		];
		expect(typeof options.body?.query).toBe('string');
		expect(options.body?.variables?.filter).toEqual({
			status: 'PUBLISHED',
		});
		expect(options.query).toBeUndefined();
		expect((mockMakeWixRequest.mock.calls[0] as [string])[0]).toBe('/graphql');
	});

	it('sends a top-level filter for countExtendedBookings (no query envelope)', async () => {
		const fn = endpointFn('bookings', 'countExtendedBookings');
		await fn(mockCtx, { siteId: 's', filter: { status: 'CONFIRMED' } });

		const [, , options] = mockMakeWixRequest.mock.calls[0] as [
			string,
			string,
			{ body?: JsonBag },
		];
		expect(options.body).toEqual({ filter: { status: 'CONFIRMED' } });
	});
});

describe('Wix route helpers', () => {
	it('resolvePath substitutes every placeholder', () => {
		const route = getRoute('deleteBookingsAddOnGroup');
		const path = resolvePath(route.path, {
			serviceId: 'svc-1',
			addOnGroupId: 'addon-1',
		});
		expect(path).toBe('/bookings/v1/services/svc-1/add-on-groups/addon-1');
	});

	it('resolvePath throws on missing path params', () => {
		const route = getRoute('getMember');
		expect(() => resolvePath(route.path, {})).toThrow(
			'missing required path parameter',
		);
	});

	it('getRoute throws on unknown keys', () => {
		expect(() => getRoute('doesNotExist')).toThrow('missing route');
	});
});

describe('Wix plugin registration', () => {
	// keyBuilder is an optional plugin hook; tests only invoke it as
	// (ctx, source) => string and cannot name the runtime context type
	function keyBuilderOf(plugin: { keyBuilder?: Unused }) {
		const keyBuilder = plugin.keyBuilder;
		if (typeof keyBuilder !== 'function') {
			throw new Error('keyBuilder is not registered');
		}
		return keyBuilder as (ctx: Unused, source: string) => Promise<string>;
	}

	function flattenEndpoints(plugin: ReturnType<typeof wix>): string[] {
		const groups = plugin.endpoints as Record<string, JsonBag>;
		return Object.entries(groups)
			.flatMap(([group, ops]) => Object.keys(ops).map((op) => `${group}.${op}`))
			.sort();
	}

	const plugin = wix();

	it('exposes all 143 operations across 19 groups', () => {
		const ops = flattenEndpoints(plugin);
		expect(ops).toHaveLength(143);
		expect(ops).toContain('contacts.query');
		expect(ops).toContain('stores.searchProducts');
		expect(ops).toContain('orders.query');
		expect(ops).toContain('members.register');
		expect(ops).toContain('system.getAppInstance');
	});

	it('registers api_key and oauth_2 with oauth_2 default', () => {
		expect(Object.keys(wixAuthConfig).sort()).toEqual(['api_key', 'oauth_2']);
		expect(plugin.options?.authType).toBe('oauth_2');
	});

	it('has input, output, and meta for every endpoint', () => {
		expect(Object.keys(wixEndpointSchemas).sort()).toEqual(
			flattenEndpoints(plugin),
		);
		expect(Object.keys(wixEndpointMeta).sort()).toEqual(
			flattenEndpoints(plugin),
		);
	});

	it('marks destructive endpoints irreversible', () => {
		const meta = wixEndpointMeta as Record<
			string,
			{ riskLevel: string; irreversible?: boolean }
		>;
		expect(meta['stores.bulkDeleteProducts']?.riskLevel).toBe('destructive');
		expect(meta['stores.bulkDeleteProducts']?.irreversible).toBe(true);
		expect(meta['forms.removeDeletedFields']?.riskLevel).toBe('destructive');
		expect(meta['events.deleteScheduleItem']?.riskLevel).toBe('destructive');
		expect(meta['stores.bulkRemoveInfoSectionsByFilter']?.riskLevel).toBe(
			'destructive',
		);
		expect(meta['contacts.query']?.riskLevel).toBe('read');
	});

	it('registers no webhooks', () => {
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
	});

	it('returns a direct key when provided', async () => {
		const keyed = wix({ key: 'direct-token' });
		const token = await keyBuilderOf(keyed)(
			{ authType: 'oauth_2' },
			'endpoint',
		);
		expect(token).toBe('direct-token');
	});

	it('resolves the api_key from stored keys', async () => {
		const token = await keyBuilderOf(plugin)(
			{
				authType: 'api_key',
				keys: { get_api_key: async () => 'stored-key' },
			},
			'endpoint',
		);
		expect(token).toBe('stored-key');
	});

	it('resolves the oauth_2 access token from stored keys', async () => {
		const token = await keyBuilderOf(plugin)(
			{
				authType: 'oauth_2',
				keys: { get_access_token: async () => 'stored-token' },
			},
			'endpoint',
		);
		expect(token).toBe('stored-token');
	});

	it('throws AuthMissingError when no key is stored', async () => {
		const keyBuilder = keyBuilderOf(plugin);
		await expect(
			keyBuilder(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => null },
				},
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(
			keyBuilder(
				{
					authType: 'oauth_2',
					keys: { get_access_token: async () => null },
				},
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
