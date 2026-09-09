/**
 * Exercises every one of the 67 operations against a mocked transport: base
 * URL, the X-API-KEY header, method, and that the key never appears in the
 * query string. A coverage sweep asserts the fixture table below covers
 * exactly the registered operation set, so a loop over zero rows cannot pass
 * silently and a newly added operation cannot ship untested.
 */

import {
	Account,
	Colleagues,
	Contacts,
	CustomerFamilies,
	Customers,
	ProductFamilies,
	Products,
	PurchaseInvoices,
	Receipts,
	SaleCredits,
	SaleInvoices,
	SaleQuotes,
	Suppliers,
	WebhookSubscriptions,
} from './endpoints';
import { altovizEndpointsNested } from './index';
import {
	installFetchMock,
	lastCall,
	makeCtx,
	makeDb,
	queueResponse,
	recordedCalls,
	requestedHeaders,
	resetFetchMock,
} from './test-utils';

const BASE = 'https://api.altoviz.com';

const unit = {
	id: 1,
	code: 'H',
	name: 'Heures',
	type: 'Time',
	conversion: 1,
	decimals: 0,
};
const vat = { id: 2, rate: 20, region: 'FR', label: '20% - FR', default: true };
const customerFamily = { id: 3, label: 'Family', number: 'CRF-001' };
const productFamily = { id: 4, label: 'Product Family', number: 'PRF-001' };

function seededDb() {
	const db = makeDb();
	db.units.upsertByEntityId(String(unit.id), unit);
	db.vats.upsertByEntityId(String(vat.id), vat);
	db.customerFamilies.upsertByEntityId(
		String(customerFamily.id),
		customerFamily,
	);
	db.productFamilies.upsertByEntityId(String(productFamily.id), productFamily);
	return db;
}

type Fixture = {
	path: string;
	// biome-ignore lint/suspicious/noExplicitAny: a fixture table over 67 differently-typed handlers needs a common call shape
	fn: (ctx: any, input: any) => Promise<unknown>;
	input: Record<string, unknown>;
	method: string;
	urlIncludes: string;
	response: unknown;
};

const line = {
	type: 'Service',
	productId: 100,
	description: 'x',
	quantity: 1,
	taxExcludedPrice: 10,
	unitId: unit.id,
	vatId: vat.id,
};

const FIXTURES: Fixture[] = [
	{
		path: 'customers.create',
		fn: Customers.create,
		input: { type: 'Business', companyName: 'Acme' },
		method: 'POST',
		urlIncludes: 'v1/customers',
		response: { id: 1 },
	},
	{
		path: 'customers.update',
		fn: Customers.update,
		input: { customerId: 1, companyName: 'Acme 2' },
		method: 'PUT',
		urlIncludes: 'v1/customers/1',
		response: { id: 1 },
	},
	{
		path: 'customers.delete',
		fn: Customers.delete,
		input: { customerId: 1 },
		method: 'DELETE',
		urlIncludes: 'v1/customers/1',
		response: [],
	},
	{
		path: 'customers.get',
		fn: Customers.get,
		input: { customerId: 1 },
		method: 'GET',
		urlIncludes: 'v1/customers/1',
		response: { id: 1 },
	},
	{
		path: 'customers.getByInternalId',
		fn: Customers.getByInternalId,
		input: { internalId: 'ext-1' },
		method: 'GET',
		urlIncludes: 'v1/customers/getbyinternalid/ext-1',
		response: { id: 1 },
	},
	{
		path: 'customers.find',
		fn: Customers.find,
		input: { email: 'a@example.com' },
		method: 'GET',
		urlIncludes: 'v1/customers/find',
		response: [],
	},
	{
		path: 'customers.list',
		fn: Customers.list,
		input: { pageIndex: 1 },
		method: 'GET',
		urlIncludes: 'v1/customers',
		response: [],
	},
	{
		path: 'customers.getContacts',
		fn: Customers.getContacts,
		input: { customerId: 1 },
		method: 'GET',
		urlIncludes: 'v1/customers/1/contacts',
		response: [],
	},

	{
		path: 'customerFamilies.create',
		fn: CustomerFamilies.create,
		input: { label: 'F' },
		method: 'POST',
		urlIncludes: 'v1/customerfamilies',
		response: { id: 3 },
	},
	{
		path: 'customerFamilies.get',
		fn: CustomerFamilies.get,
		input: { familyId: 3 },
		method: 'GET',
		urlIncludes: 'v1/customerfamilies/3',
		response: { id: 3 },
	},
	{
		path: 'customerFamilies.delete',
		fn: CustomerFamilies.delete,
		input: { familyId: 3 },
		method: 'DELETE',
		urlIncludes: 'v1/customerfamilies/3',
		response: {},
	},
	{
		path: 'customerFamilies.list',
		fn: CustomerFamilies.list,
		input: { pageIndex: 1 },
		method: 'GET',
		urlIncludes: 'v1/customerfamilies',
		response: [],
	},

	{
		path: 'suppliers.get',
		fn: Suppliers.get,
		input: { supplierId: 1 },
		method: 'GET',
		urlIncludes: 'v1/suppliers/1',
		response: { id: 1 },
	},
	{
		path: 'suppliers.list',
		fn: Suppliers.list,
		input: { pageIndex: 1 },
		method: 'GET',
		urlIncludes: 'v1/suppliers',
		response: [],
	},
	{
		path: 'suppliers.update',
		fn: Suppliers.update,
		input: { supplierId: 1, name: 'S' },
		method: 'PUT',
		urlIncludes: 'v1/suppliers/1',
		response: { id: 1 },
	},
	{
		path: 'suppliers.delete',
		fn: Suppliers.delete,
		input: { supplierId: 1 },
		method: 'DELETE',
		urlIncludes: 'v1/suppliers/1',
		response: [],
	},
	{
		path: 'suppliers.getContacts',
		fn: Suppliers.getContacts,
		input: { supplierId: 1 },
		method: 'GET',
		urlIncludes: 'v1/suppliers/1/contacts',
		response: [],
	},

	{
		path: 'contacts.create',
		fn: Contacts.create,
		input: { firstName: 'A', lastName: 'B' },
		method: 'POST',
		urlIncludes: 'v1/contacts',
		response: { id: 1 },
	},
	{
		path: 'contacts.get',
		fn: Contacts.get,
		input: { contactId: 1 },
		method: 'GET',
		urlIncludes: 'v1/contacts/1',
		response: { id: 1 },
	},
	{
		path: 'contacts.find',
		fn: Contacts.find,
		input: { email: 'a@example.com' },
		method: 'GET',
		urlIncludes: 'v1/contacts/find',
		response: [],
	},
	{
		path: 'contacts.list',
		fn: Contacts.list,
		input: { pageIndex: 1 },
		method: 'GET',
		urlIncludes: 'v1/contacts',
		response: [],
	},

	{
		path: 'colleagues.get',
		fn: Colleagues.get,
		input: { colleagueId: 1 },
		method: 'GET',
		urlIncludes: 'v1/colleagues/1',
		response: { id: 1 },
	},
	{
		path: 'colleagues.list',
		fn: Colleagues.list,
		input: { pageIndex: 1 },
		method: 'GET',
		urlIncludes: 'v1/colleagues',
		response: [],
	},
	{
		path: 'colleagues.update',
		fn: Colleagues.update,
		input: { colleagueId: 1, firstName: 'A' },
		method: 'PUT',
		urlIncludes: 'v1/colleagues/1',
		response: { id: 1 },
	},
	{
		path: 'colleagues.delete',
		fn: Colleagues.delete,
		input: { colleagueId: 1 },
		method: 'DELETE',
		urlIncludes: 'v1/colleagues/1',
		response: {},
	},

	{
		path: 'account.getCurrentUser',
		fn: Account.getCurrentUser,
		input: {},
		method: 'GET',
		urlIncludes: 'v1/users/me',
		response: { userId: 'u1' },
	},
	{
		path: 'account.testApiKey',
		fn: Account.testApiKey,
		input: {},
		method: 'GET',
		urlIncludes: 'hello',
		response: { apiKeyName: 'k' },
	},
	{
		path: 'account.getSettings',
		fn: Account.getSettings,
		input: {},
		method: 'GET',
		urlIncludes: 'v1/settings',
		response: {},
	},
	{
		path: 'account.getUnits',
		fn: Account.getUnits,
		input: {},
		method: 'GET',
		urlIncludes: 'v1/units',
		response: [unit],
	},
	{
		path: 'account.getVats',
		fn: Account.getVats,
		input: {},
		method: 'GET',
		urlIncludes: 'v1/vats',
		response: [vat],
	},
	{
		path: 'account.getClassifications',
		fn: Account.getClassifications,
		input: {},
		method: 'GET',
		urlIncludes: 'v1/classifications',
		response: [],
	},

	{
		path: 'webhookSubscriptions.list',
		fn: WebhookSubscriptions.list,
		input: {},
		method: 'GET',
		urlIncludes: 'v1/webhooks',
		response: [],
	},
	{
		path: 'webhookSubscriptions.register',
		fn: WebhookSubscriptions.register,
		input: {
			name: 'W',
			url: 'https://example.com/wh',
			types: ['CustomerCreated'],
		},
		method: 'POST',
		urlIncludes: 'v1/webhooks',
		response: { id: 0 },
	},
	{
		path: 'webhookSubscriptions.unregister',
		fn: WebhookSubscriptions.unregister,
		input: { webhookId: 9 },
		method: 'DELETE',
		urlIncludes: 'v1/webhooks',
		response: {},
	},

	{
		path: 'products.create',
		fn: Products.create,
		input: {
			name: 'P',
			type: 'Service',
			unitId: unit.id,
			vatId: vat.id,
			familyId: productFamily.id,
		},
		method: 'POST',
		urlIncludes: 'v1/products',
		response: { id: 1 },
	},
	{
		path: 'products.delete',
		fn: Products.delete,
		input: { productId: 1 },
		method: 'DELETE',
		urlIncludes: 'v1/products/1',
		response: {},
	},
	{
		path: 'products.get',
		fn: Products.get,
		input: { productId: 1 },
		method: 'GET',
		urlIncludes: 'v1/products/1',
		response: { id: 1 },
	},
	{
		path: 'products.find',
		fn: Products.find,
		input: { number: 'SKU-1' },
		method: 'GET',
		urlIncludes: 'v1/products/find',
		response: [],
	},
	{
		path: 'products.findByNumberOrId',
		fn: Products.findByNumberOrId,
		input: { number: 'SKU-1' },
		method: 'GET',
		urlIncludes: 'v1/products/find',
		response: [],
	},

	{
		path: 'productFamilies.create',
		fn: ProductFamilies.create,
		input: { label: 'F' },
		method: 'POST',
		urlIncludes: 'v1/productfamilies',
		response: { id: 4 },
	},
	{
		path: 'productFamilies.get',
		fn: ProductFamilies.get,
		input: { familyId: 4 },
		method: 'GET',
		urlIncludes: 'v1/productfamilies/4',
		response: { id: 4 },
	},
	{
		path: 'productFamilies.delete',
		fn: ProductFamilies.delete,
		input: { familyId: 4 },
		method: 'DELETE',
		urlIncludes: 'v1/productfamilies/4',
		response: {},
	},
	{
		path: 'productFamilies.list',
		fn: ProductFamilies.list,
		input: { pageIndex: 1 },
		method: 'GET',
		urlIncludes: 'v1/productfamilies',
		response: [],
	},

	{
		path: 'saleInvoices.create',
		fn: SaleInvoices.create,
		input: { customerId: 1, date: '2026-01-01', lines: [line] },
		method: 'POST',
		urlIncludes: 'v1/saleinvoices',
		response: { id: 1 },
	},
	{
		path: 'saleInvoices.get',
		fn: SaleInvoices.get,
		input: { invoiceId: 1 },
		method: 'GET',
		urlIncludes: 'v1/saleinvoices/1',
		response: { id: 1 },
	},
	{
		path: 'saleInvoices.find',
		fn: SaleInvoices.find,
		input: { internalId: 'x' },
		method: 'GET',
		urlIncludes: 'v1/saleinvoices/find',
		response: [],
	},
	{
		path: 'saleInvoices.list',
		fn: SaleInvoices.list,
		input: { pageIndex: 1 },
		method: 'GET',
		urlIncludes: 'v1/saleinvoices',
		response: [],
	},
	{
		path: 'saleInvoices.delete',
		fn: SaleInvoices.delete,
		input: { invoiceId: 1 },
		method: 'DELETE',
		urlIncludes: 'v1/saleinvoices/1',
		response: {},
	},
	{
		path: 'saleInvoices.download',
		fn: SaleInvoices.download,
		input: { invoiceId: 1 },
		method: 'GET',
		urlIncludes: 'v1/saleinvoices/download/1',
		response: '%PDF-1.4',
	},

	{
		path: 'saleCredits.create',
		fn: SaleCredits.create,
		input: { customerId: 1, date: '2026-01-01', lines: [line] },
		method: 'POST',
		urlIncludes: 'v1/salecredits',
		response: { id: 1 },
	},
	{
		path: 'saleCredits.update',
		fn: SaleCredits.update,
		input: { creditId: 1, lines: [line] },
		method: 'PUT',
		urlIncludes: 'v1/salecredits/1',
		response: { id: 1 },
	},
	{
		path: 'saleCredits.get',
		fn: SaleCredits.get,
		input: { creditId: 1 },
		method: 'GET',
		urlIncludes: 'v1/salecredits/1',
		response: { id: 1 },
	},
	{
		path: 'saleCredits.find',
		fn: SaleCredits.find,
		input: { internalId: 'x' },
		method: 'GET',
		urlIncludes: 'v1/salecredits/find',
		response: [],
	},
	{
		path: 'saleCredits.list',
		fn: SaleCredits.list,
		input: { pageIndex: 1 },
		method: 'GET',
		urlIncludes: 'v1/salecredits',
		response: [],
	},
	{
		path: 'saleCredits.delete',
		fn: SaleCredits.delete,
		input: { creditId: 1 },
		method: 'DELETE',
		urlIncludes: 'v1/salecredits/1',
		response: {},
	},
	{
		path: 'saleCredits.download',
		fn: SaleCredits.download,
		input: { creditId: 1 },
		method: 'GET',
		urlIncludes: 'v1/salecredits/download/1',
		response: '%PDF-1.4',
	},

	{
		path: 'saleQuotes.find',
		fn: SaleQuotes.find,
		input: { internalId: 'x' },
		method: 'GET',
		urlIncludes: 'v1/salequotes/find',
		response: [],
	},
	{
		path: 'saleQuotes.list',
		fn: SaleQuotes.list,
		input: { pageIndex: 1 },
		method: 'GET',
		urlIncludes: 'v1/salequotes',
		response: [],
	},
	{
		path: 'saleQuotes.delete',
		fn: SaleQuotes.delete,
		input: { quoteId: 1 },
		method: 'DELETE',
		urlIncludes: 'v1/salequotes/1',
		response: {},
	},

	{
		path: 'receipts.create',
		fn: Receipts.create,
		input: { amount: 10, date: '2026-01-01', paymentMethod: 'Transfer' },
		method: 'POST',
		urlIncludes: 'v1/receipts',
		response: { id: 1 },
	},
	{
		path: 'receipts.update',
		fn: Receipts.update,
		input: { receiptId: 1, amount: 20 },
		method: 'PUT',
		urlIncludes: 'v1/receipts/1',
		response: { id: 1 },
	},
	{
		path: 'receipts.get',
		fn: Receipts.get,
		input: { receiptId: 1 },
		method: 'GET',
		urlIncludes: 'v1/receipts/1',
		response: { id: 1 },
	},
	{
		path: 'receipts.find',
		fn: Receipts.find,
		input: { internalId: 'x' },
		method: 'GET',
		urlIncludes: 'v1/receipts/find',
		response: [],
	},
	{
		path: 'receipts.list',
		fn: Receipts.list,
		input: { pageIndex: 1 },
		method: 'GET',
		urlIncludes: 'v1/receipts',
		response: [],
	},
	{
		path: 'receipts.delete',
		fn: Receipts.delete,
		input: { receiptId: 1 },
		method: 'DELETE',
		urlIncludes: 'v1/receipts/1',
		response: {},
	},

	{
		path: 'purchaseInvoices.upload',
		fn: PurchaseInvoices.upload,
		input: {
			fileBase64: Buffer.from('hi').toString('base64'),
			fileName: 'a.pdf',
			mimeType: 'application/pdf',
		},
		method: 'POST',
		urlIncludes: 'v1/purchaseinvoices/file',
		response: { id: 1 },
	},
	{
		path: 'purchaseInvoices.download',
		fn: PurchaseInvoices.download,
		input: { purchaseInvoiceId: 1 },
		method: 'GET',
		urlIncludes: 'v1/purchaseinvoices/download/1',
		response: '%PDF-1.4',
	},
];

describe('routing', () => {
	beforeEach(() => {
		resetFetchMock();
		installFetchMock();
	});

	test('coverage sweep: the fixture table covers exactly the registered operation set', () => {
		const registered = new Set<string>();
		for (const [group, ops] of Object.entries(altovizEndpointsNested)) {
			for (const op of Object.keys(ops as Record<string, unknown>)) {
				registered.add(`${group}.${op}`);
			}
		}
		expect(registered.size).toBe(67);

		const fixtured = new Set(FIXTURES.map((f) => f.path));
		expect(fixtured.size).toBe(FIXTURES.length);
		expect([...fixtured].sort()).toEqual([...registered].sort());
	});

	test.each(FIXTURES)(
		'$path: correct URL, method, auth header',
		async (fixture) => {
			const { ctx } = makeCtx(seededDb());
			queueResponse(fixture.response, {
				status:
					fixture.method === 'POST' && fixture.urlIncludes === 'v1/webhooks'
						? 201
						: 200,
				contentType:
					typeof fixture.response === 'string'
						? 'application/pdf'
						: 'application/json; charset=utf-8',
				repeat: true,
			});

			await fixture.fn(ctx, fixture.input);

			const call = lastCall();
			expect(new URL(call.url).origin).toBe(new URL(BASE).origin);
			expect(call.url).toContain(fixture.urlIncludes);
			expect(call.init.method).toBe(fixture.method);

			const headers = requestedHeaders(call);
			expect(headers['x-api-key'] ?? headers['X-API-KEY']).toBe(
				'fake-altoviz-key-for-tests-only',
			);

			// the key must never appear in the query string
			expect(call.url).not.toContain('fake-altoviz-key-for-tests-only');
			for (const recorded of recordedCalls()) {
				expect(recorded.url).not.toContain('/undefined');
				expect(recorded.url).not.toContain('undefined/');
			}
		},
	);

	test('customers.getByInternalId URL-encodes the caller-supplied internalId', async () => {
		const { ctx } = makeCtx();
		queueResponse({ id: 1 });
		await Customers.getByInternalId(ctx, { internalId: 'ext id/with space' });
		expect(lastCall().url).toContain(encodeURIComponent('ext id/with space'));
	});

	test('unregister by url echoes the url, not a fabricated id 0', async () => {
		const { ctx } = makeCtx();
		queueResponse({});
		const byUrl = await WebhookSubscriptions.unregister(ctx, {
			url: 'https://example.com/wh',
		});
		expect(byUrl).toEqual({ deleted: true, url: 'https://example.com/wh' });

		queueResponse({});
		const byId = await WebhookSubscriptions.unregister(ctx, { webhookId: 9 });
		expect(byId).toEqual({ deleted: true, id: 9 });
	});
});
