import {
	isUnauthorizedError,
	makeAuthenticatedZohoInventoryRequest,
	stripTrailingSlashes,
	ZohoInventoryAPIError,
	zohoInventoryApiBase,
	zohoInventoryOAuthAuthUrl,
	zohoInventoryOAuthTokenUrl,
} from './client';
import {
	ListContactsInputSchema,
	ListContactsResponseSchema,
	ListItemsInputSchema,
	ListItemsResponseSchema,
	ListOrganizationsInputSchema,
	ListOrganizationsResponseSchema,
	ListUsersInputSchema,
	ListUsersResponseSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { zohoinventory } from './index';
import { resolveZohoInventoryOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

describe('zohoinventory plugin initialization', () => {
	it('builds with default (US) region and core OAuth wiring', () => {
		const plugin = zohoinventory();
		expect(plugin.id).toBe('zohoinventory');
		expect(plugin.options?.authType).toBe('oauth_2');
		expect(plugin.authConfig?.oauth_2?.account).toEqual(['tenant_external_id']);
		expect(plugin.oauthConfig?.providerName).toBe('Zoho');
		expect(plugin.oauthConfig?.authUrl).toBe(
			'https://accounts.zoho.com/oauth/v2/auth',
		);
		expect(plugin.oauthConfig?.tokenUrl).toBe(
			'https://accounts.zoho.com/oauth/v2/token',
		);
		expect(plugin.oauthConfig?.scopes).toEqual([
			'ZohoInventory.settings.READ',
			'ZohoInventory.items.READ',
			'ZohoInventory.contacts.READ',
		]);
		expect(plugin.oauthConfig?.tokenAuthMethod).toBe('body');
	});

	it('exposes all required endpoints', () => {
		const plugin = zohoinventory();
		expect(typeof plugin.endpoints!.organizations.list).toBe('function');
		expect(typeof plugin.endpoints!.items.list).toBe('function');
		expect(typeof plugin.endpoints!.contacts.list).toBe('function');
		expect(typeof plugin.endpoints!.users.list).toBe('function');
	});

	it('configures proper read risk-levels on all endpoints', () => {
		const plugin = zohoinventory();
		expect(plugin.endpointMeta!['organizations.list']?.riskLevel).toBe('read');
		expect(plugin.endpointMeta!['items.list']?.riskLevel).toBe('read');
		expect(plugin.endpointMeta!['contacts.list']?.riskLevel).toBe('read');
		expect(plugin.endpointMeta!['users.list']?.riskLevel).toBe('read');
	});
});

describe('stripTrailingSlashes utility', () => {
	it('preserves domain without trailing slashes', () => {
		expect(stripTrailingSlashes('https://www.zohoapis.com')).toBe(
			'https://www.zohoapis.com',
		);
	});

	it('strips a single trailing slash', () => {
		expect(stripTrailingSlashes('https://www.zohoapis.com/')).toBe(
			'https://www.zohoapis.com',
		);
	});

	it('strips multiple trailing slashes', () => {
		expect(stripTrailingSlashes('https://www.zohoapis.com///')).toBe(
			'https://www.zohoapis.com',
		);
	});

	it('handles empty strings and only slashes', () => {
		expect(stripTrailingSlashes('')).toBe('');
		expect(stripTrailingSlashes('/')).toBe('');
		expect(stripTrailingSlashes('////')).toBe('');
	});
});

describe('zoho regional datacenter mapping', () => {
	it('maps each region to the correct API base URL', () => {
		expect(zohoInventoryApiBase('us')).toBe(
			'https://www.zohoapis.com/inventory/v1',
		);
		expect(zohoInventoryApiBase('eu')).toBe(
			'https://www.zohoapis.eu/inventory/v1',
		);
		expect(zohoInventoryApiBase('in')).toBe(
			'https://www.zohoapis.in/inventory/v1',
		);
		expect(zohoInventoryApiBase('au')).toBe(
			'https://www.zohoapis.com.au/inventory/v1',
		);
		expect(zohoInventoryApiBase('jp')).toBe(
			'https://www.zohoapis.jp/inventory/v1',
		);
		expect(zohoInventoryApiBase('ca')).toBe(
			'https://www.zohoapis.ca/inventory/v1',
		);
		expect(zohoInventoryApiBase('cn')).toBe(
			'https://www.zohoapis.com.cn/inventory/v1',
		);
		expect(zohoInventoryApiBase('sa')).toBe(
			'https://www.zohoapis.sa/inventory/v1',
		);
	});

	it('supports custom apiDomain override without trailing slashes', () => {
		expect(
			zohoInventoryApiBase(undefined, 'https://inventory.custom.zoho.com'),
		).toBe('https://inventory.custom.zoho.com/inventory/v1');
	});

	it('supports custom apiDomain override with one trailing slash', () => {
		expect(
			zohoInventoryApiBase(undefined, 'https://inventory.custom.zoho.com/'),
		).toBe('https://inventory.custom.zoho.com/inventory/v1');
	});

	it('supports custom apiDomain override with multiple trailing slashes', () => {
		expect(
			zohoInventoryApiBase(undefined, 'https://inventory.custom.zoho.com///'),
		).toBe('https://inventory.custom.zoho.com/inventory/v1');
	});

	it('handles custom apiDomain with whitespace and edge-cases', () => {
		expect(
			zohoInventoryApiBase(
				undefined,
				'  https://inventory.custom.zoho.com///  ',
			),
		).toBe('https://inventory.custom.zoho.com/inventory/v1');
		expect(zohoInventoryApiBase('eu', '')).toBe(
			'https://www.zohoapis.eu/inventory/v1',
		);
		expect(zohoInventoryApiBase('in', '   ')).toBe(
			'https://www.zohoapis.in/inventory/v1',
		);
	});

	it('maps OAuth auth and token URLs per region', () => {
		expect(zohoInventoryOAuthAuthUrl('eu')).toBe(
			'https://accounts.zoho.eu/oauth/v2/auth',
		);
		expect(zohoInventoryOAuthTokenUrl('eu')).toBe(
			'https://accounts.zoho.eu/oauth/v2/token',
		);
		expect(zohoInventoryOAuthAuthUrl('in')).toBe(
			'https://accounts.zoho.in/oauth/v2/auth',
		);
		expect(zohoInventoryOAuthTokenUrl('in')).toBe(
			'https://accounts.zoho.in/oauth/v2/token',
		);
	});
});

describe('endpoint schemas validation', () => {
	it('validates organizations list input and output', () => {
		const parsedInput = ListOrganizationsInputSchema.parse({});
		expect(parsedInput).toBeDefined();

		const validOutput = {
			code: 0,
			message: 'success',
			organizations: [
				{
					organization_id: '7891011',
					name: 'Acme Global',
					is_default_org: true,
					currency_code: 'USD',
					is_org_active: true,
				},
			],
		};
		const parsedOutput = ListOrganizationsResponseSchema.parse(validOutput);
		expect(parsedOutput.organizations[0]?.organization_id).toBe('7891011');
		expect(parsedOutput.organizations[0]?.is_default_org).toBe(true);
	});

	it('validates items list input and output', () => {
		const input = {
			organization_id: '7891011',
			page: 1,
			per_page: 50,
			search_text: 'Widget',
		};
		const parsedInput = ListItemsInputSchema.parse(input);
		expect(parsedInput.organization_id).toBe('7891011');

		const validOutput = {
			code: 0,
			message: 'success',
			items: [
				{
					item_id: '998877',
					name: 'Widget A',
					rate: 19.99,
					stock_on_hand: 150,
					status: 'active',
				},
			],
			page_context: {
				page: 1,
				per_page: 50,
				has_more_page: false,
			},
		};
		const parsedOutput = ListItemsResponseSchema.parse(validOutput);
		expect(parsedOutput.items[0]?.item_id).toBe('998877');
		expect(parsedOutput.page_context?.has_more_page).toBe(false);
	});

	it('validates contacts list input and output', () => {
		const input = {
			organization_id: '7891011',
			contact_type: 'customer' as const,
		};
		const parsedInput = ListContactsInputSchema.parse(input);
		expect(parsedInput.contact_type).toBe('customer');

		const validOutput = {
			code: 0,
			message: 'success',
			contacts: [
				{
					contact_id: '445566',
					contact_name: 'John Doe',
					company_name: 'Acme Corp',
					email: 'john@example.com',
					outstanding_receivable_amount: 500,
				},
			],
		};
		const parsedOutput = ListContactsResponseSchema.parse(validOutput);
		expect(parsedOutput.contacts[0]?.contact_id).toBe('445566');
		expect(parsedOutput.contacts[0]?.contact_name).toBe('John Doe');
	});

	it('validates users list input and output', () => {
		const input = {
			organization_id: '7891011',
			page: 1,
		};
		const parsedInput = ListUsersInputSchema.parse(input);
		expect(parsedInput.organization_id).toBe('7891011');

		const validOutput = {
			code: 0,
			message: 'success',
			users: [
				{
					user_id: '112233',
					name: 'Jane Admin',
					email: 'jane@example.com',
					user_role: 'Admin',
					status: 'active',
					is_current_user: true,
				},
			],
		};
		const parsedOutput = ListUsersResponseSchema.parse(validOutput);
		expect(parsedOutput.users[0]?.user_id).toBe('112233');
		expect(parsedOutput.users[0]?.is_current_user).toBe(true);
	});
});

describe('oauth tenant link resolution', () => {
	it('resolves direct tenant_external_id from tokens if present', async () => {
		const res = await resolveZohoInventoryOAuthWebhookTenantLink({
			tenant_external_id: 'org_12345',
		});
		expect(res).toEqual({
			linkType: 'tenant_external_id',
			externalId: 'org_12345',
		});
	});

	it('resolves direct organization_id from tokens if present', async () => {
		const res = await resolveZohoInventoryOAuthWebhookTenantLink({
			organization_id: 'org_67890',
		});
		expect(res).toEqual({
			linkType: 'tenant_external_id',
			externalId: 'org_67890',
		});
	});

	it('fetches organizations and selects the default organization', async () => {
		const originalFetch = globalThis.fetch;
		globalThis.fetch = jest.fn().mockResolvedValue({
			ok: true,
			json: async () => ({
				code: 0,
				message: 'success',
				organizations: [
					{ organization_id: 'org_secondary', is_default_org: false },
					{ organization_id: 'org_primary_default', is_default_org: true },
				],
			}),
		}) as unknown as typeof fetch;

		try {
			const res = await resolveZohoInventoryOAuthWebhookTenantLink({
				access_token: 'valid_mock_token',
			});
			expect(res).toEqual({
				linkType: 'tenant_external_id',
				externalId: 'org_primary_default',
			});
			expect(globalThis.fetch).toHaveBeenCalledWith(
				'https://www.zohoapis.com/inventory/v1/organizations',
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Zoho-oauthtoken valid_mock_token',
					}),
				}),
			);
		} finally {
			globalThis.fetch = originalFetch;
		}
	});

	it('falls back to the first organization when is_default_org is not set', async () => {
		const originalFetch = globalThis.fetch;
		globalThis.fetch = jest.fn().mockResolvedValue({
			ok: true,
			json: async () => ({
				code: 0,
				message: 'success',
				organizations: [
					{ organization_id: 'org_first' },
					{ organization_id: 'org_second' },
				],
			}),
		}) as unknown as typeof fetch;

		try {
			const res = await resolveZohoInventoryOAuthWebhookTenantLink({
				access_token: 'valid_mock_token',
			});
			expect(res).toEqual({
				linkType: 'tenant_external_id',
				externalId: 'org_first',
			});
		} finally {
			globalThis.fetch = originalFetch;
		}
	});

	it('returns null when fetch fails or returns empty organizations', async () => {
		const originalFetch = globalThis.fetch;
		globalThis.fetch = jest.fn().mockResolvedValue({
			ok: false,
			status: 401,
		}) as unknown as typeof fetch;

		try {
			const res = await resolveZohoInventoryOAuthWebhookTenantLink({
				access_token: 'expired_token',
			});
			expect(res).toBeNull();
		} finally {
			globalThis.fetch = originalFetch;
		}
	});

	it('returns null when access_token is missing', async () => {
		const res = await resolveZohoInventoryOAuthWebhookTenantLink({});
		expect(res).toBeNull();
	});
});

describe('error handlers', () => {
	it('matches RATE_LIMIT_ERROR for 429 and error code 43', () => {
		const rateLimit429 = new ZohoInventoryAPIError('Rate limit exceeded', 429);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimit429)).toBe(true);

		const rateLimitCode43 = new ZohoInventoryAPIError(
			'Maximum number of requests exceeded',
			undefined,
			43,
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimitCode43)).toBe(true);
	});

	it('matches AUTH_ERROR for 401 and error code 57 (invalid_oauthtoken)', () => {
		const auth401 = new ZohoInventoryAPIError('Unauthorized', 401);
		expect(errorHandlers.AUTH_ERROR.match(auth401)).toBe(true);

		const authCode57 = new ZohoInventoryAPIError(
			'Invalid OAuth token',
			undefined,
			57,
		);
		expect(errorHandlers.AUTH_ERROR.match(authCode57)).toBe(true);
	});

	it('matches PERMISSION_ERROR for 403 and error code 4', () => {
		const perm403 = new ZohoInventoryAPIError('Forbidden', 403);
		expect(errorHandlers.PERMISSION_ERROR.match(perm403)).toBe(true);

		const permCode4 = new ZohoInventoryAPIError('Access Denied', undefined, 4);
		expect(errorHandlers.PERMISSION_ERROR.match(permCode4)).toBe(true);
	});

	it('matches NOT_FOUND_ERROR for 404 and invalid organization code 14', () => {
		const notFound404 = new ZohoInventoryAPIError('Not found', 404);
		expect(errorHandlers.NOT_FOUND_ERROR.match(notFound404)).toBe(true);

		const invalidOrg = new ZohoInventoryAPIError(
			'Invalid value passed for organization_id',
			undefined,
			14,
		);
		expect(errorHandlers.NOT_FOUND_ERROR.match(invalidOrg)).toBe(true);
	});

	it('matches DEFAULT as fallback', () => {
		const genericError = new Error('Some unexpected internal error');
		expect(errorHandlers.DEFAULT.match(genericError)).toBe(true);
	});
});

describe('client request and refresh retry', () => {
	it('identifies 401 unauthorized errors', () => {
		expect(
			isUnauthorizedError(new ZohoInventoryAPIError('Unauthorized', 401)),
		).toBe(true);
		expect(
			isUnauthorizedError(
				new ZohoInventoryAPIError('invalid_oauthtoken', undefined, 57),
			),
		).toBe(true);
		expect(
			isUnauthorizedError(new ZohoInventoryAPIError('Not found', 404)),
		).toBe(false);
	});

	it('retries once on 401 with refreshed token when _refreshAuth is provided', async () => {
		let callCount = 0;
		const originalFetch = globalThis.fetch;
		globalThis.fetch = jest.fn().mockImplementation(async (_url, options) => {
			callCount++;
			let authHeader: string | null = null;
			if (options?.headers instanceof Headers) {
				authHeader = options.headers.get('authorization');
			} else if (
				options?.headers &&
				typeof options.headers.get === 'function'
			) {
				authHeader = options.headers.get('authorization');
			} else if (options?.headers) {
				authHeader =
					options.headers.Authorization || options.headers.authorization;
			}

			if (authHeader === 'Zoho-oauthtoken expired_token') {
				return {
					ok: false,
					status: 401,
					statusText: 'Unauthorized',
					headers: new Headers({ 'content-type': 'application/json' }),
					text: async () =>
						JSON.stringify({ code: 57, message: 'Invalid OAuth token' }),
					json: async () => ({ code: 57, message: 'Invalid OAuth token' }),
				};
			}
			return {
				ok: true,
				status: 200,
				statusText: 'OK',
				headers: new Headers({ 'content-type': 'application/json' }),
				text: async () =>
					JSON.stringify({
						code: 0,
						message: 'success',
						organizations: [],
					}),
				json: async () => ({
					code: 0,
					message: 'success',
					organizations: [],
				}),
			};
		}) as unknown as typeof fetch;

		try {
			const refreshAuthMock = jest.fn().mockResolvedValue('fresh_token_123');
			const ctx = {
				key: 'expired_token',
				_refreshAuth: refreshAuthMock,
			};

			const result = await makeAuthenticatedZohoInventoryRequest<{
				code: number;
				organizations: unknown[];
			}>('/organizations', ctx);

			expect(refreshAuthMock).toHaveBeenCalledTimes(1);
			expect(result.code).toBe(0);
			expect(callCount).toBe(2);
		} finally {
			globalThis.fetch = originalFetch;
		}
	});
});
