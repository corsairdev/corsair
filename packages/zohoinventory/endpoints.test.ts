import { zohoinventory } from './index';

const ORG = 'org-1';

type Case = {
	key: string;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	input: Record<string, unknown>;
	org?: boolean;
};

const CASES: Case[] = [
	{
		key: 'organizations.list',
		method: 'GET',
		path: '/organizations',
		input: {},
		org: false,
	},
	{
		key: 'items.list',
		method: 'GET',
		path: '/items',
		input: { organization_id: ORG },
	},
	{
		key: 'items.create',
		method: 'POST',
		path: '/items',
		input: { organization_id: ORG, name: 'Widget' },
	},
	{
		key: 'items.deactivate',
		method: 'POST',
		path: '/items/item-1/inactive',
		input: { organization_id: ORG, item_id: 'item-1' },
	},
	{
		key: 'items.delete',
		method: 'DELETE',
		path: '/items/item-1',
		input: { organization_id: ORG, item_id: 'item-1' },
	},
	{
		key: 'items.deleteImage',
		method: 'DELETE',
		path: '/items/item-1/image',
		input: { organization_id: ORG, item_id: 'item-1' },
	},
	{
		key: 'itemGroups.list',
		method: 'GET',
		path: '/itemgroups',
		input: { organization_id: ORG },
	},
	{
		key: 'itemGroups.create',
		method: 'POST',
		path: '/itemgroups',
		input: { organization_id: ORG, group_name: 'Shirts' },
	},
	{
		key: 'itemGroups.deactivate',
		method: 'POST',
		path: '/itemgroups/g-1/inactive',
		input: { organization_id: ORG, itemgroup_id: 'g-1' },
	},
	{
		key: 'itemGroups.delete',
		method: 'DELETE',
		path: '/itemgroups/g-1',
		input: { organization_id: ORG, itemgroup_id: 'g-1' },
	},
	{
		key: 'compositeItems.delete',
		method: 'DELETE',
		path: '/compositeitems/c-1',
		input: { organization_id: ORG, composite_item_id: 'c-1' },
	},
	{
		key: 'contacts.list',
		method: 'GET',
		path: '/contacts',
		input: { organization_id: ORG },
	},
	{
		key: 'contacts.create',
		method: 'POST',
		path: '/contacts',
		input: { organization_id: ORG, contact_name: 'Acme' },
	},
	{
		key: 'contacts.get',
		method: 'GET',
		path: '/contacts/ct-1',
		input: { organization_id: ORG, contact_id: 'ct-1' },
	},
	{
		key: 'contacts.getAddress',
		method: 'GET',
		path: '/contacts/ct-1/address',
		input: { organization_id: ORG, contact_id: 'ct-1' },
	},
	{
		key: 'contacts.deactivate',
		method: 'POST',
		path: '/contacts/ct-1/inactive',
		input: { organization_id: ORG, contact_id: 'ct-1' },
	},
	{
		key: 'contacts.delete',
		method: 'DELETE',
		path: '/contacts/ct-1',
		input: { organization_id: ORG, contact_id: 'ct-1' },
	},
	{
		key: 'contacts.email',
		method: 'POST',
		path: '/contacts/ct-1/email',
		input: { organization_id: ORG, contact_id: 'ct-1', subject: 'Hi' },
	},
	{
		key: 'contacts.emailStatement',
		method: 'POST',
		path: '/contacts/ct-1/statements/email',
		input: { organization_id: ORG, contact_id: 'ct-1' },
	},
	{
		key: 'contacts.createPerson',
		method: 'POST',
		path: '/contacts/ct-1/contactpersons',
		input: { organization_id: ORG, contact_id: 'ct-1', first_name: 'Pat' },
	},
	{
		key: 'contacts.deletePerson',
		method: 'DELETE',
		path: '/contacts/contactpersons/cp-1',
		input: { organization_id: ORG, contact_person_id: 'cp-1' },
	},
	{
		key: 'currencies.list',
		method: 'GET',
		path: '/settings/currencies',
		input: { organization_id: ORG },
	},
	{
		key: 'users.getCurrent',
		method: 'GET',
		path: '/users/me',
		input: { organization_id: ORG },
	},
	{
		key: 'salesOrders.list',
		method: 'GET',
		path: '/salesorders',
		input: { organization_id: ORG },
	},
	{
		key: 'salesOrders.get',
		method: 'GET',
		path: '/salesorders/so-1',
		input: { organization_id: ORG, salesorder_id: 'so-1' },
	},
	{
		key: 'salesOrders.create',
		method: 'POST',
		path: '/salesorders',
		input: { organization_id: ORG, customer_id: 'ct-1' },
	},
	{
		key: 'salesOrders.delete',
		method: 'DELETE',
		path: '/salesorders/so-1',
		input: { organization_id: ORG, salesorder_id: 'so-1' },
	},
	{
		key: 'salesOrders.bulkDelete',
		method: 'DELETE',
		path: '/salesorders',
		input: { organization_id: ORG, salesorder_ids: ['so-1', 'so-2'] },
	},
	{
		key: 'invoices.list',
		method: 'GET',
		path: '/invoices',
		input: { organization_id: ORG },
	},
	{
		key: 'invoices.create',
		method: 'POST',
		path: '/invoices',
		input: { organization_id: ORG, customer_id: 'ct-1' },
	},
	{
		key: 'invoices.delete',
		method: 'DELETE',
		path: '/invoices/inv-1',
		input: { organization_id: ORG, invoice_id: 'inv-1' },
	},
	{
		key: 'invoices.addComment',
		method: 'POST',
		path: '/invoices/inv-1/comments',
		input: { organization_id: ORG, invoice_id: 'inv-1', description: 'note' },
	},
	{
		key: 'invoices.deleteComment',
		method: 'DELETE',
		path: '/invoices/inv-1/comments/cm-1',
		input: { organization_id: ORG, invoice_id: 'inv-1', comment_id: 'cm-1' },
	},
	{
		key: 'invoices.addAttachment',
		method: 'POST',
		path: '/invoices/inv-1/attachment',
		input: {
			organization_id: ORG,
			invoice_id: 'inv-1',
			filename: 'a.pdf',
			content_base64: 'YQ==',
		},
	},
	{
		key: 'invoices.deleteAttachment',
		method: 'DELETE',
		path: '/invoices/inv-1/attachment',
		input: { organization_id: ORG, invoice_id: 'inv-1' },
	},
	{
		key: 'invoices.email',
		method: 'POST',
		path: '/invoices/inv-1/email',
		input: { organization_id: ORG, invoice_id: 'inv-1' },
	},
	{
		key: 'invoices.bulkEmail',
		method: 'POST',
		path: '/invoices/email',
		input: { organization_id: ORG, invoice_ids: ['inv-1'], contact_id: 'ct-1' },
	},
	{
		key: 'invoices.bulkExport',
		method: 'GET',
		path: '/invoices/pdf',
		input: { organization_id: ORG, invoice_ids: ['inv-1'] },
	},
	{
		key: 'invoices.bulkPrint',
		method: 'GET',
		path: '/invoices/print',
		input: { organization_id: ORG, invoice_ids: ['inv-1'] },
	},
	{
		key: 'invoices.cancelWriteOff',
		method: 'POST',
		path: '/invoices/inv-1/writeoff/cancel',
		input: { organization_id: ORG, invoice_id: 'inv-1' },
	},
	{
		key: 'invoices.disablePaymentReminder',
		method: 'POST',
		path: '/invoices/inv-1/paymentreminder/disable',
		input: { organization_id: ORG, invoice_id: 'inv-1' },
	},
	{
		key: 'invoices.enablePaymentReminder',
		method: 'POST',
		path: '/invoices/inv-1/paymentreminder/enable',
		input: { organization_id: ORG, invoice_id: 'inv-1' },
	},
	{
		key: 'invoices.listPayments',
		method: 'GET',
		path: '/invoices/inv-1/payments',
		input: { organization_id: ORG, invoice_id: 'inv-1' },
	},
	{
		key: 'creditNotes.list',
		method: 'GET',
		path: '/creditnotes',
		input: { organization_id: ORG },
	},
	{
		key: 'creditNotes.get',
		method: 'GET',
		path: '/creditnotes/cn-1',
		input: { organization_id: ORG, creditnote_id: 'cn-1' },
	},
	{
		key: 'creditNotes.create',
		method: 'POST',
		path: '/creditnotes',
		input: { organization_id: ORG, customer_id: 'ct-1' },
	},
	{
		key: 'creditNotes.addComment',
		method: 'POST',
		path: '/creditnotes/cn-1/comments',
		input: { organization_id: ORG, creditnote_id: 'cn-1', description: 'note' },
	},
	{
		key: 'creditNotes.email',
		method: 'POST',
		path: '/creditnotes/cn-1/email',
		input: { organization_id: ORG, creditnote_id: 'cn-1' },
	},
	{
		key: 'creditNotes.getEmailContent',
		method: 'GET',
		path: '/creditnotes/cn-1/email',
		input: { organization_id: ORG, creditnote_id: 'cn-1' },
	},
	{
		key: 'creditNotes.applyCredits',
		method: 'POST',
		path: '/creditnotes/cn-1/invoices',
		input: {
			organization_id: ORG,
			creditnote_id: 'cn-1',
			invoices: [{ invoice_id: 'inv-1', amount_applied: 1 }],
		},
	},
	{
		key: 'packages.create',
		method: 'POST',
		path: '/packages',
		input: { organization_id: ORG, salesorder_id: 'so-1' },
	},
	{
		key: 'packages.delete',
		method: 'DELETE',
		path: '/packages/pk-1',
		input: { organization_id: ORG, package_id: 'pk-1' },
	},
	{
		key: 'packages.bulkPrint',
		method: 'GET',
		path: '/packages/print',
		input: { organization_id: ORG, package_ids: ['pk-1'] },
	},
	{
		key: 'purchaseOrders.list',
		method: 'GET',
		path: '/purchaseorders',
		input: { organization_id: ORG },
	},
	{
		key: 'purchaseOrders.create',
		method: 'POST',
		path: '/purchaseorders',
		input: { organization_id: ORG, vendor_id: 'vd-1' },
	},
	{
		key: 'bills.list',
		method: 'GET',
		path: '/bills',
		input: { organization_id: ORG },
	},
	{
		key: 'bills.create',
		method: 'POST',
		path: '/bills',
		input: { organization_id: ORG, vendor_id: 'vd-1' },
	},
	{
		key: 'customerPayments.create',
		method: 'POST',
		path: '/customerpayments',
		input: { organization_id: ORG, customer_id: 'ct-1', amount: 10 },
	},
];

function handler(
	plugin: ReturnType<typeof zohoinventory>,
	key: string,
): (ctx: unknown, input: Record<string, unknown>) => Promise<unknown> {
	const [group, name] = key.split('.');
	const node = (
		plugin.endpoints as Record<string, Record<string, unknown>> | undefined
	)?.[group ?? ''];
	const fn = node?.[name ?? ''];
	if (typeof fn !== 'function') {
		throw new Error(`missing endpoint ${key}`);
	}
	return fn as (
		ctx: unknown,
		input: Record<string, unknown>,
	) => Promise<unknown>;
}

describe('every zohoinventory endpoint', () => {
	const originalFetch = globalThis.fetch;
	const plugin = zohoinventory();

	beforeEach(() => {
		globalThis.fetch = jest.fn().mockResolvedValue({
			ok: true,
			status: 200,
			statusText: 'OK',
			headers: new Headers({ 'content-type': 'application/json' }),
			text: async () => JSON.stringify({ code: 0, message: 'success' }),
			json: async () => ({ code: 0, message: 'success' }),
			arrayBuffer: async () => Buffer.from(JSON.stringify({ code: 0 })),
		}) as unknown as typeof fetch;
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	it('covers all 58 registered endpoints', () => {
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(
			CASES.map((c) => c.key).sort(),
		);
		expect(CASES).toHaveLength(58);
	});

	it.each(CASES)('$key $method $path', async (c) => {
		const ctx = {
			key: 'test_token',
			options: { region: 'us' as const },
			db: {},
			$getAccountId: async () => 'acct',
			database: { logEvent: jest.fn().mockResolvedValue({}) },
		};
		await handler(plugin, c.key)(ctx, c.input);
		expect(globalThis.fetch).toHaveBeenCalled();
		const [url, init] = jest.mocked(globalThis.fetch).mock.calls[0] ?? [];
		expect(String(url)).toContain(c.path);
		expect((init as RequestInit | undefined)?.method ?? 'GET').toBe(c.method);
		if (c.org !== false) {
			expect(String(url)).toContain(`organization_id=${ORG}`);
		}
	});
});
