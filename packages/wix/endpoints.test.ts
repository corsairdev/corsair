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
import type { WixContext } from './index';
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

type InputSchemaKey = keyof typeof WixEndpointInputSchemas;
type OutputSchemaKey = keyof typeof WixEndpointOutputSchemas;

function inputSchema(key: string) {
	return WixEndpointInputSchemas[key as InputSchemaKey];
}

function outputSchema(key: string) {
	return WixEndpointOutputSchemas[key as OutputSchemaKey];
}

const mockCtx = {
	key: 'test-api-key',
	options: {},
	logEvent: jest.fn(),
	db: {},
} as unknown as WixContext;

function endpointFn(group: string, name: string) {
	const plugin = wix();
	const tree = plugin.endpoints as Record<string, Record<string, unknown>>;
	const fn = tree[group]?.[name];
	if (typeof fn !== 'function') {
		throw new Error(`[wix] missing endpoint: ${group}.${name}`);
	}
	return fn as (ctx: WixContext, input: Record<string, unknown>) => unknown;
}

function sampleInput(
	route: (typeof wixRoutes)[number],
): Record<string, unknown> {
	const input: Record<string, unknown> = {
		siteId: 'test-site-id',
		filter: {},
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
	input: Record<string, unknown>,
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
		const endpoints = plugin.endpoints as Record<string, unknown>;

		const leaves: string[] = [];
		const collect = (tree: Record<string, unknown>, prefix = '') => {
			for (const [key, value] of Object.entries(tree)) {
				const path = prefix ? `${prefix}.${key}` : key;
				if (typeof value === 'function') leaves.push(path);
				else if (value && typeof value === 'object') {
					collect(value as Record<string, unknown>, path);
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
					body?: unknown;
					query?: unknown;
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
			await expect(fn(mockCtx, without)).rejects.toThrow(
				'missing required path parameter',
			);
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
			{ body?: { query?: { paging?: unknown } } },
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
				body?: { query?: { filter?: unknown } };
				query?: Record<string, unknown>;
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
			{ body?: { query?: { filter?: unknown } } },
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
			{ body?: { query?: { filter?: unknown } } },
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
			{ body?: Record<string, unknown> },
		];
		expect(path).toBe('/contacts/v4/contacts/contact-1/label');
		expect(options.body).toEqual({ labelKeys: ['vip'] });
		expect(options.body?.contact_id).toBeUndefined();
	});

	it('falls back to the plugin-level siteId when the call omits it', async () => {
		const fn = endpointFn('contacts', 'list');
		await fn(
			{ ...mockCtx, options: { siteId: 'plugin-site' } } as WixContext,
			{},
		);

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
		await fn({ ...mockCtx, options: { siteId: 'plugin-site' } } as WixContext, {
			accountId: 'account-1',
		});

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

	it('sends GET query params as query, not body', async () => {
		const fn = endpointFn('contacts', 'list');
		await fn(mockCtx, { siteId: 's', limit: 5, offset: 0 });

		const [, , options] = mockMakeWixRequest.mock.calls[0] as [
			string,
			string,
			{ body?: unknown; query?: Record<string, unknown> },
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
		await fn({ ...mockCtx, options: { authType: 'api_key' } } as WixContext, {
			siteId: 's',
			limit: 1,
		});

		const [, , options] = mockMakeWixRequest.mock.calls[0] as [
			string,
			string,
			{ authType?: string },
		];
		expect(options.authType).toBe('api_key');
	});

	it('sends search inside the query envelope for query-body endpoints', async () => {
		const fn = endpointFn('stores', 'searchProducts');
		await fn(mockCtx, { siteId: 's', search: 'running shoes' });

		const [, , options] = mockMakeWixRequest.mock.calls[0] as [
			string,
			string,
			{ body?: { query?: { search?: unknown; filter?: unknown } } },
		];
		expect(options.body?.query?.search).toBe('running shoes');
		expect(options.body).not.toHaveProperty('search');
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
					query?: unknown;
					variables?: { filter?: unknown };
				};
				query?: Record<string, unknown>;
			},
		];
		expect(typeof options.body?.query).toBe('string');
		expect(options.body?.variables?.filter).toEqual({
			status: 'PUBLISHED',
		});
		// The GraphQL document must never leak into URL parameters.
		expect(options.query).toBeUndefined();
	});

	it('sends a top-level filter for countExtendedBookings (no query envelope)', async () => {
		const fn = endpointFn('bookings', 'countExtendedBookings');
		await fn(mockCtx, { siteId: 's', filter: { status: 'CONFIRMED' } });

		const [, , options] = mockMakeWixRequest.mock.calls[0] as [
			string,
			string,
			{ body?: Record<string, unknown> },
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
	function keyBuilderOf(plugin: { keyBuilder?: unknown }) {
		const keyBuilder = plugin.keyBuilder;
		if (typeof keyBuilder !== 'function') {
			throw new Error('keyBuilder is not registered');
		}
		return keyBuilder as (ctx: unknown, source: string) => Promise<string>;
	}

	function flattenEndpoints(plugin: ReturnType<typeof wix>): string[] {
		const groups = plugin.endpoints as unknown as Record<
			string,
			Record<string, unknown>
		>;
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
