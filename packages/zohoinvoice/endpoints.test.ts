import * as client from './client';
import {
	ZohoInvoiceEndpointInputSchemas,
	ZohoInvoiceEndpointOutputSchemas,
} from './endpoints/types';
import { zohoinvoice } from './index';
import { resolveZohoInvoiceOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

const { logEventFromContext } = jest.requireMock('corsair/core') as {
	logEventFromContext: jest.Mock;
};

const requestSpy = jest.spyOn(client, 'makeZohoInvoiceRequest');

function makeCtx() {
	return {
		key: 'test-token',
		options: { region: 'us' as const },
		database: { logEvent: jest.fn() },
	};
}

beforeEach(() => {
	requestSpy.mockReset();
	logEventFromContext.mockClear();
});

describe('Zoho Invoice endpoint contracts', () => {
	it('rejects incomplete create inputs', () => {
		expect(
			ZohoInvoiceEndpointInputSchemas.customersCreate.safeParse({
				organizationId: 'org-1',
				body: {},
			}).success,
		).toBe(false);
		expect(
			ZohoInvoiceEndpointInputSchemas.invoicesCreate.safeParse({
				organizationId: 'org-1',
				body: { customer_id: 'customer-1', date: '2026-01-01' },
			}).success,
		).toBe(false);
	});

	it('accepts pagination and validates the documented maximum page size', () => {
		expect(
			ZohoInvoiceEndpointInputSchemas.itemsList.safeParse({
				organizationId: 'org-1',
				page: 2,
				perPage: 200,
			}).success,
		).toBe(true);
		expect(
			ZohoInvoiceEndpointInputSchemas.itemsList.safeParse({
				organizationId: 'org-1',
				perPage: 201,
			}).success,
		).toBe(false);
	});

	it('registers oauth_2 by default with 34 resource operations', () => {
		const plugin = zohoinvoice();
		expect(plugin.options?.authType).toBe('oauth_2');
		expect(Object.keys(plugin.endpointMeta ?? {})).toHaveLength(34);
		expect(Object.keys(plugin.webhooks ?? {})).toHaveLength(0);
		expect(ZohoInvoiceEndpointOutputSchemas.invoicesGet).toBeDefined();
	});

	it('asks Zoho for comma-separated scopes, settings scopes for items', () => {
		const scopes = zohoinvoice().oauthConfig?.scopes ?? [];
		// Core joins the array with spaces; Zoho wants commas.
		expect(scopes).toHaveLength(1);
		const list = String(scopes[0]).split(',');
		expect(list).toContain('ZohoInvoice.settings.READ');
		expect(list).toContain('ZohoInvoice.settings.CREATE');
		expect(list.some((scope) => scope.startsWith('ZohoInvoice.items.'))).toBe(
			false,
		);
	});

	it('uses accounts.zohocloud.ca for Canada sign-in', () => {
		expect(zohoinvoice({ region: 'ca' }).oauthConfig?.tokenUrl).toBe(
			'https://accounts.zohocloud.ca/oauth/v2/token',
		);
	});

	it('marks sends, voids and deletes destructive', () => {
		const meta = zohoinvoice().endpointMeta as Record<
			string,
			{ riskLevel: string }
		>;
		for (const path of [
			'invoices.email',
			'invoices.remind',
			'estimates.email',
			'invoices.void',
			'invoices.delete',
			'customers.delete',
			'items.delete',
			'payments.delete',
			'estimates.delete',
		])
			expect(meta[path]?.riskLevel).toBe('destructive');
		expect(meta['invoices.markSent']?.riskLevel).toBe('write');
		expect(meta['payments.create']?.riskLevel).toBe('write');
	});
});

describe('Zoho Invoice endpoint handlers', () => {
	const organizationId = 'org-1';

	it.each([
		[
			'customers.list',
			'customersList',
			() => zohoinvoice().endpoints!.customers.list,
			'/contacts',
			'GET',
			{ contacts: [{ contact_id: '1', contact_name: 'Acme' }] },
			{ organizationId },
		],
		[
			'customers.get',
			'customersGet',
			() => zohoinvoice().endpoints!.customers.get,
			'/contacts/c1',
			'GET',
			{ contact: { contact_id: 'c1', contact_name: 'Acme' } },
			{ organizationId, contactId: 'c1' },
		],
		[
			'customers.create',
			'customersCreate',
			() => zohoinvoice().endpoints!.customers.create,
			'/contacts',
			'POST',
			{ contact: { contact_id: 'c1', contact_name: 'Acme' } },
			{ organizationId, body: { contact_name: 'Acme' } },
		],
		[
			'customers.update',
			'customersUpdate',
			() => zohoinvoice().endpoints!.customers.update,
			'/contacts/c1',
			'PUT',
			{ contact: { contact_id: 'c1', contact_name: 'Acme' } },
			{ organizationId, contactId: 'c1', body: { contact_name: 'Acme' } },
		],
		[
			'invoices.list',
			'invoicesList',
			() => zohoinvoice().endpoints!.invoices.list,
			'/invoices',
			'GET',
			{ invoices: [{ invoice_id: 'i1' }] },
			{ organizationId, page: 2, perPage: 50 },
		],
		[
			'invoices.get',
			'invoicesGet',
			() => zohoinvoice().endpoints!.invoices.get,
			'/invoices/i1',
			'GET',
			{ invoice: { invoice_id: 'i1' } },
			{ organizationId, invoiceId: 'i1' },
		],
		[
			'invoices.create',
			'invoicesCreate',
			() => zohoinvoice().endpoints!.invoices.create,
			'/invoices',
			'POST',
			{
				invoice: {
					invoice_id: 'i1',
					customer_id: 'c1',
					date: '2026-01-01',
					line_items: [],
				},
			},
			{
				organizationId,
				body: {
					customer_id: 'c1',
					date: '2026-01-01',
					line_items: [],
				},
			},
		],
		[
			'invoices.update',
			'invoicesUpdate',
			() => zohoinvoice().endpoints!.invoices.update,
			'/invoices/i1',
			'PUT',
			{ invoice: { invoice_id: 'i1' } },
			{ organizationId, invoiceId: 'i1', body: { status: 'sent' } },
		],
		[
			'invoices.delete',
			'invoicesDelete',
			() => zohoinvoice().endpoints!.invoices.delete,
			'/invoices/i1',
			'DELETE',
			{ code: 0, message: 'deleted' },
			{ organizationId, invoiceId: 'i1' },
		],
		[
			'items.list',
			'itemsList',
			() => zohoinvoice().endpoints!.items.list,
			'/items',
			'GET',
			{ items: [{ item_id: 'it1', name: 'Widget' }] },
			{ organizationId },
		],
		[
			'items.get',
			'itemsGet',
			() => zohoinvoice().endpoints!.items.get,
			'/items/it1',
			'GET',
			{ item: { item_id: 'it1', name: 'Widget' } },
			{ organizationId, itemId: 'it1' },
		],
		[
			'items.create',
			'itemsCreate',
			() => zohoinvoice().endpoints!.items.create,
			'/items',
			'POST',
			{ item: { item_id: 'it1', name: 'Widget' } },
			{ organizationId, body: { name: 'Widget', rate: 10 } },
		],
		[
			'items.update',
			'itemsUpdate',
			() => zohoinvoice().endpoints!.items.update,
			'/items/it1',
			'PUT',
			{ item: { item_id: 'it1', name: 'Widget' } },
			{ organizationId, itemId: 'it1', body: { rate: 12 } },
		],
		[
			'payments.list',
			'paymentsList',
			() => zohoinvoice().endpoints!.payments.list,
			'/customerpayments',
			'GET',
			{ customerpayments: [{ payment_id: 'p1' }] },
			{ organizationId },
		],
		[
			'payments.get',
			'paymentsGet',
			() => zohoinvoice().endpoints!.payments.get,
			'/customerpayments/p1',
			'GET',
			{ payment: { payment_id: 'p1' } },
			{ organizationId, paymentId: 'p1' },
		],
		[
			'estimates.list',
			'estimatesList',
			() => zohoinvoice().endpoints!.estimates.list,
			'/estimates',
			'GET',
			{ estimates: [{ estimate_id: 'e1' }] },
			{ organizationId },
		],
		[
			'estimates.get',
			'estimatesGet',
			() => zohoinvoice().endpoints!.estimates.get,
			'/estimates/e1',
			'GET',
			{ estimate: { estimate_id: 'e1' } },
			{ organizationId, estimateId: 'e1' },
		],
		[
			'estimates.create',
			'estimatesCreate',
			() => zohoinvoice().endpoints!.estimates.create,
			'/estimates',
			'POST',
			{ estimate: { estimate_id: 'e1' } },
			{
				organizationId,
				body: { customer_id: 'c1', line_items: [] },
			},
		],
		[
			'estimates.update',
			'estimatesUpdate',
			() => zohoinvoice().endpoints!.estimates.update,
			'/estimates/e1',
			'PUT',
			{ estimate: { estimate_id: 'e1' } },
			{ organizationId, estimateId: 'e1', body: { status: 'sent' } },
		],
		[
			'customers.delete',
			'customersDelete',
			() => zohoinvoice().endpoints!.customers.delete,
			'/contacts/c1',
			'DELETE',
			{ code: 0, message: 'The contact has been deleted.' },
			{ organizationId, contactId: 'c1' },
		],
		[
			'invoices.markSent',
			'invoicesMarkSent',
			() => zohoinvoice().endpoints!.invoices.markSent,
			'/invoices/i1/status/sent',
			'POST',
			{ code: 0, message: 'Invoice status has been changed to Sent.' },
			{ organizationId, invoiceId: 'i1' },
		],
		[
			'invoices.void',
			'invoicesVoid',
			() => zohoinvoice().endpoints!.invoices.void,
			'/invoices/i1/status/void',
			'POST',
			{ code: 0, message: 'Invoice status has been changed to Void.' },
			{ organizationId, invoiceId: 'i1' },
		],
		[
			'invoices.email',
			'invoicesEmail',
			() => zohoinvoice().endpoints!.invoices.email,
			'/invoices/i1/email',
			'POST',
			{ code: 0, message: 'Your invoice has been sent.' },
			{ organizationId, invoiceId: 'i1' },
		],
		[
			'invoices.remind',
			'invoicesRemind',
			() => zohoinvoice().endpoints!.invoices.remind,
			'/invoices/i1/paymentreminder',
			'POST',
			{ code: 0, message: 'Your payment reminder has been sent.' },
			{ organizationId, invoiceId: 'i1' },
		],
		[
			'invoices.listPayments',
			'invoicesListPayments',
			() => zohoinvoice().endpoints!.invoices.listPayments,
			'/invoices/i1/payments',
			'GET',
			{ payments: [{ payment_id: 'p1' }] },
			{ organizationId, invoiceId: 'i1' },
		],
		[
			'items.delete',
			'itemsDelete',
			() => zohoinvoice().endpoints!.items.delete,
			'/items/it1',
			'DELETE',
			{ code: 0, message: 'The item has been deleted.' },
			{ organizationId, itemId: 'it1' },
		],
		[
			'payments.create',
			'paymentsCreate',
			() => zohoinvoice().endpoints!.payments.create,
			'/customerpayments',
			'POST',
			{ payment: { payment_id: 'p1' } },
			{
				organizationId,
				body: { customer_id: 'c1', amount: 10, payment_mode: 'cash' },
			},
		],
		[
			'payments.delete',
			'paymentsDelete',
			() => zohoinvoice().endpoints!.payments.delete,
			'/customerpayments/p1',
			'DELETE',
			{ code: 0, message: 'The payment has been deleted.' },
			{ organizationId, paymentId: 'p1' },
		],
		[
			'estimates.delete',
			'estimatesDelete',
			() => zohoinvoice().endpoints!.estimates.delete,
			'/estimates/e1',
			'DELETE',
			{ code: 0, message: 'The estimate has been deleted.' },
			{ organizationId, estimateId: 'e1' },
		],
		[
			'estimates.markSent',
			'estimatesMarkSent',
			() => zohoinvoice().endpoints!.estimates.markSent,
			'/estimates/e1/status/sent',
			'POST',
			{ code: 0, message: 'Estimate status has been changed to Sent.' },
			{ organizationId, estimateId: 'e1' },
		],
		[
			'estimates.markAccepted',
			'estimatesMarkAccepted',
			() => zohoinvoice().endpoints!.estimates.markAccepted,
			'/estimates/e1/status/accepted',
			'POST',
			{ code: 0, message: 'Estimate status has been changed to Accepted.' },
			{ organizationId, estimateId: 'e1' },
		],
		[
			'estimates.markDeclined',
			'estimatesMarkDeclined',
			() => zohoinvoice().endpoints!.estimates.markDeclined,
			'/estimates/e1/status/declined',
			'POST',
			{ code: 0, message: 'Estimate status has been changed to Declined.' },
			{ organizationId, estimateId: 'e1' },
		],
		[
			'estimates.email',
			'estimatesEmail',
			() => zohoinvoice().endpoints!.estimates.email,
			'/estimates/e1/email',
			'POST',
			{ code: 0, message: 'Your estimate has been sent.' },
			{ organizationId, estimateId: 'e1' },
		],
	])(
		'%s calls %s with the expected route',
		async (_label, eventName, getEndpoint, path, method, response, input) => {
			requestSpy.mockResolvedValue(response);

			const endpoint = getEndpoint();
			const result = await endpoint(makeCtx() as never, input as never);

			expect(result).toEqual(response);
			expect(requestSpy).toHaveBeenCalledWith(
				path,
				'test-token',
				expect.any(Object),
			);
			const callOptions = requestSpy.mock.calls[0]?.[2];
			expect(callOptions?.organizationId).toBe(organizationId);
			expect(callOptions?.method ?? 'GET').toBe(method);
			const paginatedInput = input as {
				page?: number;
				perPage?: number;
			};
			if (method === 'GET' && paginatedInput.page !== undefined) {
				expect(requestSpy.mock.calls[0]?.[2]?.query).toMatchObject({
					page: paginatedInput.page,
					per_page: paginatedInput.perPage,
				});
			}
			const [, , eventPayload] = logEventFromContext.mock.calls[0] ?? [];
			expect(eventPayload).not.toHaveProperty('body');
			expect(logEventFromContext.mock.calls[0]?.[1]).toBe(
				`zohoinvoice.${eventName}`,
			);
		},
	);

	it('encodes path ids that contain reserved characters', async () => {
		requestSpy.mockResolvedValue({
			contact: { contact_id: 'a/b', contact_name: 'Acme' },
		});

		await zohoinvoice().endpoints!.customers.get(makeCtx() as never, {
			organizationId,
			contactId: 'a/b',
		});

		expect(requestSpy).toHaveBeenCalledWith(
			'/contacts/a%2Fb',
			'test-token',
			expect.any(Object),
		);
	});

	it('organizations.list sends no organization header', async () => {
		requestSpy.mockResolvedValue({
			organizations: [{ organization_id: '60096700553', name: 'Acme' }],
		});
		await zohoinvoice().endpoints!.organizations.list(makeCtx() as never, {});
		expect(requestSpy).toHaveBeenCalledWith(
			'/organizations',
			'test-token',
			expect.objectContaining({ organizationId: undefined }),
		);
	});

	it('uses the saved organization when the input has none', async () => {
		requestSpy.mockResolvedValue({ contacts: [] });
		const ctx = {
			...makeCtx(),
			keys: { get_organization_id: jest.fn().mockResolvedValue('saved-org') },
		};
		await zohoinvoice().endpoints!.customers.list(ctx as never, {});
		expect(requestSpy.mock.calls[0]?.[2]?.organizationId).toBe('saved-org');
	});

	it('looks up and saves the only organization when none is saved', async () => {
		requestSpy
			.mockResolvedValueOnce({ organizations: [{ organization_id: 'only' }] })
			.mockResolvedValueOnce({ contacts: [] });
		const set = jest.fn().mockResolvedValue(undefined);
		const ctx = {
			...makeCtx(),
			keys: {
				get_organization_id: jest.fn().mockResolvedValue(null),
				set_organization_id: set,
			},
		};
		await zohoinvoice().endpoints!.customers.list(ctx as never, {});
		expect(requestSpy.mock.calls[0]?.[0]).toBe('/organizations');
		expect(requestSpy.mock.calls[1]?.[2]?.organizationId).toBe('only');
		expect(set).toHaveBeenCalledWith('only');
	});

	it('asks for organizationId when the account has several', async () => {
		requestSpy.mockResolvedValueOnce({
			organizations: [{ organization_id: 'a' }, { organization_id: 'b' }],
		});
		await expect(
			zohoinvoice().endpoints!.customers.list(makeCtx() as never, {}),
		).rejects.toThrow(/organizationId/);
		expect(requestSpy).toHaveBeenCalledTimes(1);
	});

	it('accepts a contact with an empty email, as Zoho sends it', async () => {
		requestSpy.mockResolvedValue({
			contacts: [{ contact_id: '1', contact_name: 'Acme', email: '' }],
		});
		await expect(
			zohoinvoice().endpoints!.customers.list(makeCtx() as never, {
				organizationId,
			}),
		).resolves.toBeDefined();
	});

	it('stores records and removes them after a delete', async () => {
		const tableMock = {
			upsertByEntityId: jest.fn().mockResolvedValue(undefined),
			deleteByEntityId: jest.fn().mockResolvedValue(true),
		};
		const ctx = { ...makeCtx(), db: { invoices: tableMock } };
		requestSpy.mockResolvedValueOnce({
			invoices: [{ invoice_id: 'i1', status: 'draft' }],
		});
		await zohoinvoice().endpoints!.invoices.list(ctx as never, {
			organizationId,
		});
		expect(tableMock.upsertByEntityId).toHaveBeenCalledWith('i1', {
			id: 'i1',
			data: { invoice_id: 'i1', status: 'draft' },
		});
		requestSpy.mockResolvedValueOnce({ code: 0, message: 'deleted' });
		await zohoinvoice().endpoints!.invoices.delete(ctx as never, {
			organizationId,
			invoiceId: 'i1',
		});
		expect(tableMock.deleteByEntityId).toHaveBeenCalledWith('i1');
	});

	it('rejects malformed provider responses at the endpoint boundary', async () => {
		requestSpy.mockResolvedValue({ contact: { contact_id: 1 } });

		await expect(
			zohoinvoice().endpoints!.customers.get(makeCtx() as never, {
				organizationId,
				contactId: 'c1',
			}),
		).rejects.toThrow();
	});
});

describe('oauth tenant link', () => {
	const originalFetch = globalThis.fetch;

	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	it('uses a direct organization_id', async () => {
		await expect(
			resolveZohoInvoiceOAuthWebhookTenantLink({
				organization_id: 'org_67890',
			}),
		).resolves.toEqual({
			linkType: 'organization_id',
			externalId: 'org_67890',
		});
	});

	it('fetches organizations without duplicating the invoice API path', async () => {
		globalThis.fetch = jest.fn().mockResolvedValue({
			ok: true,
			json: async () => ({
				organizations: [
					{ organization_id: 'org_secondary', is_default_org: false },
					{ organization_id: 'org_primary_default', is_default_org: true },
				],
			}),
		}) as never;

		const res = await resolveZohoInvoiceOAuthWebhookTenantLink({
			access_token: 'tok',
		});

		expect(res?.externalId).toBe('org_primary_default');
		expect(String(jest.mocked(globalThis.fetch).mock.calls[0]?.[0])).toBe(
			'https://www.zohoapis.com/invoice/v3/organizations',
		);
	});

	it('uses api_domain from the token response when present', async () => {
		globalThis.fetch = jest.fn().mockResolvedValue({
			ok: true,
			json: async () => ({
				organizations: [{ organization_id: 'org_in', is_default_org: true }],
			}),
		}) as never;

		await resolveZohoInvoiceOAuthWebhookTenantLink({
			access_token: 'tok',
			api_domain: 'https://www.zohoapis.in',
		});

		expect(String(jest.mocked(globalThis.fetch).mock.calls[0]?.[0])).toBe(
			'https://www.zohoapis.in/invoice/v3/organizations',
		);
	});

	it('returns null when no unique default organization exists', async () => {
		globalThis.fetch = jest.fn().mockResolvedValue({
			ok: true,
			json: async () => ({
				organizations: [
					{ organization_id: 'org_a', is_default_org: false },
					{ organization_id: 'org_b', is_default_org: false },
				],
			}),
		}) as never;

		await expect(
			resolveZohoInvoiceOAuthWebhookTenantLink({ access_token: 'tok' }),
		).resolves.toBeNull();
	});
});

describe('live response shapes', () => {
	it('accepts an item whose tax_id is empty, as Zoho sends it', () => {
		// Live run 11-18: items.create returned tax_id "" on an untaxed item.
		expect(
			ZohoInvoiceEndpointOutputSchemas.itemsCreate.safeParse({
				code: 0,
				message: 'The item has been added.',
				item: {
					item_id: '3519',
					name: 'corsair-plugin-test',
					rate: 100,
					tax_id: '',
				},
			}).success,
		).toBe(true);
	});
});
