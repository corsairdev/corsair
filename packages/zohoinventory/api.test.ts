import {
	applyPathTemplate,
	isAllowedZohoApiDomain,
	isUnauthorizedError,
	makeAuthenticatedZohoInventoryRequest,
	makeZohoInventoryRequest,
	stripTrailingSlashes,
	ZohoInventoryAPIError,
	zohoInventoryApiBase,
	zohoInventoryOAuthAuthUrl,
	zohoInventoryOAuthTokenUrl,
} from './client';
import { ZohoInventoryEndpointInputSchemas } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { zohoinventory } from './index';
import { resolveZohoInventoryOAuthWebhookTenantLink } from './oauth-tenant-link';

function jsonResponse(body: unknown, status = 200) {
	return {
		ok: status < 400,
		status,
		statusText: status === 200 ? 'OK' : 'Error',
		headers: new Headers({ 'content-type': 'application/json' }),
		text: async () => JSON.stringify(body),
		json: async () => body,
		arrayBuffer: async () => Buffer.from(JSON.stringify(body)),
	};
}

function mockCtx() {
	return {
		key: 'test_token',
		options: { region: 'us' as const },
		db: {},
		$getAccountId: async () => 'acct',
		database: { logEvent: jest.fn().mockResolvedValue({}) },
	};
}

describe('zohoinventory plugin initialization', () => {
	it('builds OAuth wiring and 58 endpoints', () => {
		const plugin = zohoinventory();
		expect(plugin.id).toBe('zohoinventory');
		expect(plugin.options?.authType).toBe('oauth_2');
		expect(plugin.oauthConfig?.scopes).toEqual([
			'ZohoInventory.FullAccess.all',
		]);
		expect(plugin.oauthConfig?.authUrl).toBe(
			'https://accounts.zoho.com/oauth/v2/auth',
		);
		expect(Object.keys(plugin.endpointMeta ?? {}).length).toBe(58);
		expect(typeof plugin.endpoints!.organizations.list).toBe('function');
		expect(typeof plugin.endpoints!.invoices.bulkEmail).toBe('function');
		expect(typeof plugin.endpoints!.users.getCurrent).toBe('function');
		expect(plugin.endpointMeta!['invoices.delete']?.riskLevel).toBe(
			'destructive',
		);
	});
});

describe('regional hosts', () => {
	it('maps API and OAuth hosts from official docs', () => {
		expect(zohoInventoryApiBase('us')).toBe(
			'https://www.zohoapis.com/inventory/v1',
		);
		expect(zohoInventoryApiBase('ca')).toBe(
			'https://www.zohoapis.ca/inventory/v1',
		);
		expect(zohoInventoryOAuthAuthUrl('ca')).toBe(
			'https://accounts.zohocloud.ca/oauth/v2/auth',
		);
		expect(zohoInventoryOAuthTokenUrl('ca')).toBe(
			'https://accounts.zohocloud.ca/oauth/v2/token',
		);
		expect(zohoInventoryOAuthAuthUrl('eu')).toBe(
			'https://accounts.zoho.eu/oauth/v2/auth',
		);
	});

	it('fills path templates without interpolating ids into the template string', () => {
		expect(
			applyPathTemplate('/invoices/{invoice_id}/comments/{comment_id}', {
				invoice_id: 'i',
				comment_id: 'c',
			}),
		).toBe('/invoices/i/comments/c');
	});

	it('allowlists only HTTPS zohoapis hosts', () => {
		expect(isAllowedZohoApiDomain('https://www.zohoapis.eu')).toBe(true);
		expect(isAllowedZohoApiDomain('http://www.zohoapis.com')).toBe(false);
		expect(isAllowedZohoApiDomain('https://evil.example')).toBe(false);
		expect(zohoInventoryApiBase('us', 'https://evil.example')).toBe(
			'https://www.zohoapis.com/inventory/v1',
		);
		expect(zohoInventoryApiBase(undefined, 'https://www.zohoapis.in/')).toBe(
			'https://www.zohoapis.in/inventory/v1',
		);
		expect(stripTrailingSlashes('https://www.zohoapis.com///')).toBe(
			'https://www.zohoapis.com',
		);
	});
});

describe('endpoint handlers', () => {
	const originalFetch = globalThis.fetch;

	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	it('lists organizations and forwards the Zoho token', async () => {
		globalThis.fetch = jest.fn().mockResolvedValue(
			jsonResponse({
				code: 0,
				message: 'success',
				organizations: [{ organization_id: '10234695', name: 'Zillum' }],
			}),
		) as unknown as typeof fetch;

		const plugin = zohoinventory();
		const result = (await plugin.endpoints!.organizations.list(
			mockCtx() as never,
			{},
		)) as { organizations: Array<{ organization_id: string }> };
		expect(result.organizations[0]?.organization_id).toBe('10234695');
		expect(String(jest.mocked(globalThis.fetch).mock.calls[0]?.[0])).toBe(
			'https://www.zohoapis.com/inventory/v1/organizations',
		);
	});

	it('sends organization_id on POST create item', async () => {
		globalThis.fetch = jest.fn().mockResolvedValue(
			jsonResponse({
				code: 0,
				message: 'success',
				item: { item_id: '1', name: 'Widget' },
			}),
		) as unknown as typeof fetch;

		const plugin = zohoinventory();
		await plugin.endpoints!.items.create(mockCtx() as never, {
			organization_id: '10234695',
			name: 'Widget',
		});
		const url = String(jest.mocked(globalThis.fetch).mock.calls[0]?.[0]);
		expect(url).toContain('/items?');
		expect(url).toContain('organization_id=10234695');
	});

	it('forwards configured apiDomain to handlers', async () => {
		globalThis.fetch = jest
			.fn()
			.mockResolvedValue(jsonResponse({ code: 0, items: [] })) as never;
		const plugin = zohoinventory({ apiDomain: 'https://www.zohoapis.eu' });
		await plugin.endpoints!.items.list(
			{
				...mockCtx(),
				options: { region: 'us', apiDomain: 'https://www.zohoapis.eu' },
			} as never,
			{ organization_id: '1' },
		);
		expect(String(jest.mocked(globalThis.fetch).mock.calls[0]?.[0])).toContain(
			'https://www.zohoapis.eu/inventory/v1/items',
		);
	});

	it('bulk emails invoices and loads customer_id when contact_id is omitted', async () => {
		globalThis.fetch = jest.fn().mockImplementation(async (url: string) => {
			if (
				String(url).includes('/invoices/inv-1?') ||
				String(url).endsWith('/invoices/inv-1')
			) {
				return jsonResponse({
					code: 0,
					invoice: { invoice_id: 'inv-1', customer_id: 'cust-9' },
				});
			}
			return jsonResponse({ code: 0, message: 'success' });
		}) as never;

		const plugin = zohoinventory();
		await plugin.endpoints!.invoices.bulkEmail(mockCtx() as never, {
			organization_id: 'org-1',
			invoice_ids: ['inv-1'],
		});
		const urls = jest
			.mocked(globalThis.fetch)
			.mock.calls.map((call) => String(call[0]));
		expect(urls.some((url) => url.includes('/invoices/inv-1'))).toBe(true);
		expect(urls.some((url) => url.includes('/invoices/email'))).toBe(true);
		expect(urls.some((url) => url.includes('contact_id=cust-9'))).toBe(true);
	});

	it('maps official invoice and sales-order paths', async () => {
		globalThis.fetch = jest
			.fn()
			.mockResolvedValue(
				jsonResponse({ code: 0, message: 'success' }),
			) as never;
		const plugin = zohoinventory();
		const ctx = mockCtx() as never;
		await plugin.endpoints!.invoices.deleteComment(ctx, {
			organization_id: 'o',
			invoice_id: 'i',
			comment_id: 'c',
		});
		await plugin.endpoints!.salesOrders.bulkDelete(ctx, {
			organization_id: 'o',
			salesorder_ids: ['a', 'b'],
		});
		const urls = jest
			.mocked(globalThis.fetch)
			.mock.calls.map((call) => String(call[0]));
		expect(urls[0]).toContain('/invoices/i/comments/c');
		expect(urls[1]).toContain('/salesorders?');
		expect(urls[1]).toContain('salesorder_ids=a%2Cb');
	});
});

describe('schemas', () => {
	it('requires official create fields', () => {
		expect(() =>
			ZohoInventoryEndpointInputSchemas.itemsCreate.parse({
				organization_id: '1',
			}),
		).toThrow();
		expect(
			ZohoInventoryEndpointInputSchemas.contactsCreate.parse({
				organization_id: '1',
				contact_name: 'Acme',
			}).contact_name,
		).toBe('Acme');
	});
});

describe('oauth tenant link', () => {
	const originalFetch = globalThis.fetch;
	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	it('uses a direct organization_id', async () => {
		await expect(
			resolveZohoInventoryOAuthWebhookTenantLink({
				organization_id: 'org_67890',
			}),
		).resolves.toEqual({
			linkType: 'tenant_external_id',
			externalId: 'org_67890',
		});
	});

	it('ignores untrusted api_domain when fetching organizations', async () => {
		globalThis.fetch = jest.fn().mockResolvedValue(
			jsonResponse({
				code: 0,
				organizations: [{ organization_id: 'org_first' }],
			}),
		) as never;
		await resolveZohoInventoryOAuthWebhookTenantLink({
			access_token: 'tok',
			api_domain: 'https://evil.example',
		});
		expect(String(jest.mocked(globalThis.fetch).mock.calls[0]?.[0])).toBe(
			'https://www.zohoapis.com/inventory/v1/organizations',
		);
	});

	it('uses an allowlisted api_domain from the token response', async () => {
		globalThis.fetch = jest.fn().mockResolvedValue(
			jsonResponse({
				code: 0,
				organizations: [
					{ organization_id: 'org_secondary', is_default_org: false },
					{ organization_id: 'org_primary_default', is_default_org: true },
				],
			}),
		) as never;
		const res = await resolveZohoInventoryOAuthWebhookTenantLink({
			access_token: 'tok',
			api_domain: 'https://www.zohoapis.in',
		});
		expect(res?.externalId).toBe('org_primary_default');
		expect(String(jest.mocked(globalThis.fetch).mock.calls[0]?.[0])).toBe(
			'https://www.zohoapis.in/inventory/v1/organizations',
		);
	});
});

describe('errors and refresh', () => {
	it('matches rate-limit codes from the official docs', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(
				new ZohoInventoryAPIError('blocked', 429, 44),
			),
		).toBe(true);
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(
				new ZohoInventoryAPIError('daily', undefined, 45),
			),
		).toBe(true);
	});

	it('parses Retry-After on binary error responses', async () => {
		const originalFetch = globalThis.fetch;
		globalThis.fetch = jest.fn().mockResolvedValue({
			ok: false,
			status: 429,
			statusText: 'Too Many Requests',
			headers: new Headers({ 'retry-after': '2' }),
			json: async () => {
				throw new Error('not json');
			},
		}) as never;
		try {
			await makeZohoInventoryRequest('/invoices/pdf', 'tok', { binary: true });
			throw new Error('expected rate limit');
		} catch (error) {
			expect(error).toBeInstanceOf(ZohoInventoryAPIError);
			expect((error as ZohoInventoryAPIError).retryAfter).toBe(2000);
		} finally {
			globalThis.fetch = originalFetch;
		}
	});

	it('forwards retryAfter from ZohoInventoryAPIError', async () => {
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
			new ZohoInventoryAPIError('slow down', 429, 44, undefined, 2500),
		);
		expect(result.headersRetryAfterMs).toBe(2500);
	});

	it('retries once on 401', async () => {
		let calls = 0;
		const originalFetch = globalThis.fetch;
		globalThis.fetch = jest.fn().mockImplementation(async (_url, options) => {
			calls += 1;
			const auth =
				options?.headers instanceof Headers
					? options.headers.get('authorization')
					: (options?.headers as { Authorization?: string })?.Authorization;
			if (auth === 'Zoho-oauthtoken expired_token') {
				return jsonResponse({ code: 57, message: 'Invalid OAuth token' }, 401);
			}
			return jsonResponse({ code: 0, organizations: [] });
		}) as never;
		try {
			const refreshAuthMock = jest.fn().mockResolvedValue('fresh_token_123');
			const result = await makeAuthenticatedZohoInventoryRequest<{
				code: number;
			}>('/organizations', {
				key: 'expired_token',
				_refreshAuth: refreshAuthMock,
			});
			expect(refreshAuthMock).toHaveBeenCalledTimes(1);
			expect(result.code).toBe(0);
			expect(calls).toBe(2);
			expect(isUnauthorizedError(new ZohoInventoryAPIError('x', 401))).toBe(
				true,
			);
		} finally {
			globalThis.fetch = originalFetch;
		}
	});
});

describe('live API', () => {
	const token = process.env.ZOHO_INVENTORY_ACCESS_TOKEN;
	const organizationId = process.env.ZOHO_INVENTORY_ORGANIZATION_ID;

	it('lists organizations against the live API when credentials are set', async () => {
		if (!token) return;
		const plugin = zohoinventory();
		const result = (await plugin.endpoints!.organizations.list(
			{
				key: token,
				options: {},
				db: {},
				database: { logEvent: async () => ({}) },
			} as never,
			{},
		)) as { organizations: unknown[] };
		expect(Array.isArray(result.organizations)).toBe(true);
		if (organizationId) {
			const items = (await plugin.endpoints!.items.list(
				{
					key: token,
					options: {},
					db: {},
					database: { logEvent: async () => ({}) },
				} as never,
				{ organization_id: organizationId, per_page: 1 },
			)) as { items: unknown[] };
			expect(Array.isArray(items.items)).toBe(true);
		}
	});
});
