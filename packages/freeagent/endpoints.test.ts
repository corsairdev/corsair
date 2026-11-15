import type { AccountKeyManagerFor, BoundEndpointTree } from 'corsair/core';
import * as corsairCore from 'corsair/core';
import {
	Company,
	Contacts,
	EmailAddresses,
	Invoices,
	Projects,
	RecurringInvoices,
	TrackingGroups,
} from './endpoints';
import type { FreeAgentContext } from './index';
import { freeAgentEndpointSchemas, freeagent } from './index';

// `unknown` because route tests compare parsed results without relying on handler-specific output types.
type WireHandler = (...args: never[]) => Promise<unknown>;
type WireCase = {
	name: string;
	handler: WireHandler;
	input: object;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	pathAndQuery: string;
	body: object | undefined;
	response: object | null;
	expected: object | undefined;
};

const pagination = {
	link: '<https://api.freeagent.com/v2/page?page=2>; rel="next"',
	total_count: '26',
};
const encodedId = 'record%2Fwith%20space%3F';
const contact = { organisation_name: 'Example Ltd' };
const project = { name: 'Example Project' };
const invoice = { status: 'Draft', reference: 'FA-001' };
const trackingGroup = {
	url: 'https://api.freeagent.com/v2/tracking_groups/1',
	name: 'Region',
	status: 'active',
	labels: [
		{
			url: 'https://api.freeagent.com/v2/tracking_group_labels/1',
			name: 'North',
			status: 'active',
		},
	],
	created_at: '2026-10-01T09:15:00.000Z',
	updated_at: '2026-10-14T11:42:03.000Z',
};
const recurringInvoice = {
	url: 'https://api.freeagent.com/v2/recurring_invoices/1',
	contact: 'https://api.freeagent.com/v2/contacts/1',
	contact_name: 'Example Ltd',
	dated_on: '2026-10-01',
	frequency: 'Monthly',
	next_recurs_on: '2026-11-01',
	recurring_end_date: '',
	recurring_status: 'Active',
	reference: 'FA-002',
	currency: 'GBP',
	exchange_rate: '1.0',
	net_value: '10.0',
	sales_tax_value: '2.0',
	total_value: '12.0',
	omit_header: false,
	always_show_bic_and_iban: false,
	payment_terms_in_days: 30,
	invoice_items: [
		{
			url: 'https://api.freeagent.com/v2/invoice_items/1',
			position: 1,
			description: 'Monthly service',
			item_type: 'Hours',
			price: '10.0',
			quantity: '1.0',
			sales_tax_rate: '20.0',
			sales_tax_status: 'TAXABLE',
			category: 'https://api.freeagent.com/v2/categories/001',
		},
	],
	payment_methods: { paypal: true, stripe: false },
};

const wireCases: readonly WireCase[] = [
	{
		name: 'company.get',
		handler: Company.get,
		input: {},
		method: 'GET',
		pathAndQuery: '/v2/company',
		body: undefined,
		response: { company: { name: 'Example Ltd' } },
		expected: { company: { name: 'Example Ltd' } },
	},
	{
		name: 'company.businessCategories',
		handler: Company.businessCategories,
		input: {},
		method: 'GET',
		pathAndQuery: '/v2/company/business_categories',
		body: undefined,
		response: { business_categories: ['Accounting & Bookkeeping'] },
		expected: { business_categories: ['Accounting & Bookkeeping'] },
	},
	{
		name: 'company.taxTimeline',
		handler: Company.taxTimeline,
		input: {},
		method: 'GET',
		pathAndQuery: '/v2/company/tax_timeline',
		body: undefined,
		response: {
			timeline_items: [
				{
					description: 'VAT return',
					nature: 'Payment Due',
					dated_on: '2026-11-07',
					amount_due: '120.00',
					is_personal: false,
				},
			],
		},
		expected: {
			timeline_items: [
				{
					description: 'VAT return',
					nature: 'Payment Due',
					dated_on: '2026-11-07',
					amount_due: '120.00',
					is_personal: false,
				},
			],
		},
	},
	{
		name: 'emailAddresses.list',
		handler: EmailAddresses.list,
		input: { query: { page: 2, per_page: 50 } },
		method: 'GET',
		pathAndQuery: '/v2/email_addresses?page=2&per_page=50',
		body: undefined,
		response: { email_addresses: ['Example Sender <sender@example.test>'] },
		expected: {
			email_addresses: ['Example Sender <sender@example.test>'],
			pagination,
		},
	},
	{
		name: 'contacts.list',
		handler: Contacts.list,
		input: { query: { page: 2, per_page: 25 } },
		method: 'GET',
		pathAndQuery: '/v2/contacts?page=2&per_page=25',
		body: undefined,
		response: { contacts: [] },
		expected: { contacts: [], pagination },
	},
	{
		name: 'contacts.get',
		handler: Contacts.get,
		input: { id: 'record/with space?' },
		method: 'GET',
		pathAndQuery: `/v2/contacts/${encodedId}`,
		body: undefined,
		response: { contact },
		expected: { contact },
	},
	{
		name: 'contacts.create',
		handler: Contacts.create,
		input: {
			contact: {
				organisation_name: 'Example Ltd',
				email: 'billing@example.test',
			},
		},
		method: 'POST',
		pathAndQuery: '/v2/contacts',
		body: {
			contact: {
				organisation_name: 'Example Ltd',
				email: 'billing@example.test',
			},
		},
		response: { contact: { ...contact, email: 'billing@example.test' } },
		expected: { contact: { ...contact, email: 'billing@example.test' } },
	},
	{
		name: 'contacts.update',
		handler: Contacts.update,
		input: {
			id: 'record/with space?',
			contact: { organisation_name: 'Updated Ltd' },
		},
		method: 'PUT',
		pathAndQuery: `/v2/contacts/${encodedId}`,
		body: { contact: { organisation_name: 'Updated Ltd' } },
		response: null,
		expected: undefined,
	},
	{
		name: 'contacts.delete',
		handler: Contacts.remove,
		input: { id: 'record/with space?' },
		method: 'DELETE',
		pathAndQuery: `/v2/contacts/${encodedId}`,
		body: undefined,
		response: null,
		expected: undefined,
	},
	{
		name: 'projects.list',
		handler: Projects.list,
		input: { query: { page: 3, per_page: 10, nested: true } },
		method: 'GET',
		pathAndQuery: '/v2/projects?page=3&per_page=10&nested=true',
		body: undefined,
		response: { projects: [] },
		expected: { projects: [], pagination },
	},
	{
		name: 'projects.get',
		handler: Projects.get,
		input: { id: 'record/with space?' },
		method: 'GET',
		pathAndQuery: `/v2/projects/${encodedId}`,
		body: undefined,
		response: { project },
		expected: { project },
	},
	{
		name: 'projects.create',
		handler: Projects.create,
		input: {
			project: {
				contact: 'https://api.freeagent.com/v2/contacts/1',
				name: 'Example Project',
				status: 'Active',
				currency: 'GBP',
				budget_units: 'Hours',
			},
		},
		method: 'POST',
		pathAndQuery: '/v2/projects',
		body: {
			project: {
				contact: 'https://api.freeagent.com/v2/contacts/1',
				name: 'Example Project',
				status: 'Active',
				currency: 'GBP',
				budget_units: 'Hours',
			},
		},
		response: { project },
		expected: { project },
	},
	{
		name: 'projects.update',
		handler: Projects.update,
		input: { id: 'record/with space?', project: { name: 'Updated Project' } },
		method: 'PUT',
		pathAndQuery: `/v2/projects/${encodedId}`,
		body: { project: { name: 'Updated Project' } },
		response: null,
		expected: undefined,
	},
	{
		name: 'projects.delete',
		handler: Projects.remove,
		input: { id: 'record/with space?' },
		method: 'DELETE',
		pathAndQuery: `/v2/projects/${encodedId}`,
		body: undefined,
		response: null,
		expected: undefined,
	},
	{
		name: 'invoices.list',
		handler: Invoices.list,
		input: {
			query: {
				page: 2,
				per_page: 25,
				contact: 'https://api.freeagent.com/v2/contacts/1',
			},
		},
		method: 'GET',
		pathAndQuery:
			'/v2/invoices?page=2&per_page=25&contact=https%3A%2F%2Fapi.freeagent.com%2Fv2%2Fcontacts%2F1',
		body: undefined,
		response: { invoices: [] },
		expected: { invoices: [], pagination },
	},
	{
		name: 'invoices.get',
		handler: Invoices.get,
		input: { id: 'record/with space?' },
		method: 'GET',
		pathAndQuery: `/v2/invoices/${encodedId}`,
		body: undefined,
		response: { invoice },
		expected: { invoice },
	},
	{
		name: 'invoices.create',
		handler: Invoices.create,
		input: {
			invoice: {
				contact: 'https://api.freeagent.com/v2/contacts/1',
				dated_on: '2026-10-15',
				payment_terms_in_days: 30,
			},
		},
		method: 'POST',
		pathAndQuery: '/v2/invoices',
		body: {
			invoice: {
				contact: 'https://api.freeagent.com/v2/contacts/1',
				dated_on: '2026-10-15',
				payment_terms_in_days: 30,
			},
		},
		response: { invoice },
		expected: { invoice },
	},
	{
		name: 'invoices.update',
		handler: Invoices.update,
		input: { id: 'record/with space?', invoice: { comments: 'Updated' } },
		method: 'PUT',
		pathAndQuery: `/v2/invoices/${encodedId}`,
		body: { invoice: { comments: 'Updated' } },
		response: null,
		expected: undefined,
	},
	{
		name: 'invoices.delete',
		handler: Invoices.remove,
		input: { id: 'record/with space?' },
		method: 'DELETE',
		pathAndQuery: `/v2/invoices/${encodedId}`,
		body: undefined,
		response: null,
		expected: undefined,
	},
	{
		name: 'invoices.markSent',
		handler: Invoices.markSent,
		input: { id: 'record/with space?' },
		method: 'PUT',
		pathAndQuery: `/v2/invoices/${encodedId}/transitions/mark_as_sent`,
		body: undefined,
		response: null,
		expected: undefined,
	},
	{
		name: 'invoices.sendEmail',
		handler: Invoices.sendEmail,
		input: { id: 'record/with space?', email: { use_template: true } },
		method: 'POST',
		pathAndQuery: `/v2/invoices/${encodedId}/send_email`,
		body: { invoice: { email: { use_template: true } } },
		response: null,
		expected: undefined,
	},
	{
		name: 'invoices.duplicate',
		handler: Invoices.duplicate,
		input: { id: 'record/with space?' },
		method: 'POST',
		pathAndQuery: `/v2/invoices/${encodedId}/duplicate`,
		body: undefined,
		response: { invoice },
		expected: { invoice },
	},
	{
		name: 'invoices.markScheduled',
		handler: Invoices.markScheduled,
		input: { id: 'record/with space?' },
		method: 'PUT',
		pathAndQuery: `/v2/invoices/${encodedId}/transitions/mark_as_scheduled`,
		body: undefined,
		response: null,
		expected: undefined,
	},
	{
		name: 'invoices.markDraft',
		handler: Invoices.markDraft,
		input: { id: 'record/with space?' },
		method: 'PUT',
		pathAndQuery: `/v2/invoices/${encodedId}/transitions/mark_as_draft`,
		body: undefined,
		response: null,
		expected: undefined,
	},
	{
		name: 'invoices.markCancelled',
		handler: Invoices.markCancelled,
		input: { id: 'record/with space?' },
		method: 'PUT',
		pathAndQuery: `/v2/invoices/${encodedId}/transitions/mark_as_cancelled`,
		body: undefined,
		response: null,
		expected: undefined,
	},
	{
		name: 'invoices.directDebit',
		handler: Invoices.directDebit,
		input: { id: 'record/with space?' },
		method: 'POST',
		pathAndQuery: `/v2/invoices/${encodedId}/direct_debit`,
		body: undefined,
		response: null,
		expected: undefined,
	},
	{
		name: 'invoices.timeline',
		handler: Invoices.timeline,
		input: {},
		method: 'GET',
		pathAndQuery: '/v2/invoices/timeline',
		body: undefined,
		response: {
			invoice_timeline_items: [
				{
					reference: 'FA-001',
					summary: 'Invoice paid',
					description: 'Payment received',
					dated_on: '2026-10-01',
					amount: '12.00',
				},
			],
		},
		expected: {
			invoice_timeline_items: [
				{
					reference: 'FA-001',
					summary: 'Invoice paid',
					description: 'Payment received',
					dated_on: '2026-10-01',
					amount: '12.00',
				},
			],
		},
	},
	{
		name: 'invoices.getDefaultAdditionalText',
		handler: Invoices.getDefaultAdditionalText,
		input: {},
		method: 'GET',
		pathAndQuery: '/v2/invoices/default_additional_text',
		body: undefined,
		response: { default_additional_text: 'Thank you for your business' },
		expected: { default_additional_text: 'Thank you for your business' },
	},
	{
		name: 'invoices.updateDefaultAdditionalText',
		handler: Invoices.updateDefaultAdditionalText,
		input: { default_additional_text: 'Pay within 7 days' },
		method: 'PUT',
		pathAndQuery: '/v2/invoices/default_additional_text',
		body: { default_additional_text: 'Pay within 7 days' },
		response: { default_additional_text: 'Pay within 7 days' },
		expected: { default_additional_text: 'Pay within 7 days' },
	},
	{
		name: 'invoices.deleteDefaultAdditionalText',
		handler: Invoices.deleteDefaultAdditionalText,
		input: {},
		method: 'DELETE',
		pathAndQuery: '/v2/invoices/default_additional_text',
		body: undefined,
		response: null,
		expected: undefined,
	},
	{
		name: 'invoices.pdf',
		handler: Invoices.pdf,
		input: { id: 'record/with space?' },
		method: 'GET',
		pathAndQuery: `/v2/invoices/${encodedId}/pdf`,
		body: undefined,
		response: { pdf: { content: 'JVBERi0xLjQ=' } },
		expected: { pdf: { content: 'JVBERi0xLjQ=' } },
	},
	{
		name: 'invoices.convertToCreditNote',
		handler: Invoices.convertToCreditNote,
		input: { id: 'record/with space?' },
		method: 'PUT',
		pathAndQuery: `/v2/invoices/${encodedId}/transitions/convert_to_credit_note`,
		body: undefined,
		response: { credit_note: { status: 'Draft', total_value: '-12.00' } },
		expected: { credit_note: { status: 'Draft', total_value: '-12.00' } },
	},
	{
		name: 'recurringInvoices.list',
		handler: RecurringInvoices.list,
		input: {
			query: {
				view: 'active',
				page: 2,
				per_page: 10,
				contact: 'https://api.freeagent.com/v2/contacts/1',
			},
		},
		method: 'GET',
		pathAndQuery:
			'/v2/recurring_invoices?page=2&per_page=10&view=active&contact=https%3A%2F%2Fapi.freeagent.com%2Fv2%2Fcontacts%2F1',
		body: undefined,
		response: { recurring_invoices: [recurringInvoice] },
		expected: { recurring_invoices: [recurringInvoice], pagination },
	},
	{
		name: 'recurringInvoices.get',
		handler: RecurringInvoices.get,
		input: { id: 'record/with space?' },
		method: 'GET',
		pathAndQuery: `/v2/recurring_invoices/${encodedId}`,
		body: undefined,
		response: { recurring_invoice: recurringInvoice },
		expected: { recurring_invoice: recurringInvoice },
	},
	{
		name: 'trackingGroups.list',
		handler: TrackingGroups.list,
		input: {
			query: {
				include_hidden: true,
				order_by: 'labels_count',
				reverse: true,
				page: 1,
				per_page: 50,
			},
		},
		method: 'GET',
		pathAndQuery:
			'/v2/tracking_groups?page=1&per_page=50&include_hidden=true&order_by=labels_count&reverse=true',
		body: undefined,
		response: { tracking_groups: [trackingGroup] },
		expected: { tracking_groups: [trackingGroup], pagination },
	},
	{
		name: 'trackingGroups.get',
		handler: TrackingGroups.get,
		input: { id: 'record/with space?' },
		method: 'GET',
		pathAndQuery: `/v2/tracking_groups/${encodedId}`,
		body: undefined,
		response: { tracking_group: trackingGroup },
		expected: { tracking_group: trackingGroup },
	},
];

const endpoints = {
	test: async (_args: unknown) => undefined,
} satisfies BoundEndpointTree;

const emptyKey = async () => null;
const keys = {
	get_dek: async () => '',
	issue_new_dek: async () => '',
	get_access_token: async () => 'access-token',
	set_access_token: async (_value: string | null) => {},
	get_refresh_token: emptyKey,
	set_refresh_token: async (_value: string | null) => {},
	get_expires_at: emptyKey,
	set_expires_at: async (_value: string | null) => {},
	get_scope: emptyKey,
	set_scope: async (_value: string | null) => {},
	get_webhook_signature: emptyKey,
	set_webhook_signature: async (_value: string | null) => {},
	get_integration_credentials: async () => ({
		client_id: null,
		client_secret: null,
		redirect_url: null,
	}),
} satisfies AccountKeyManagerFor<'oauth_2'>;

const ctx = {
	key: 'access-token',
	database: undefined,
	db: {},
	options: {},
	keys,
	$getAccountId: async () => 'account-test',
	endpoints,
} satisfies FreeAgentContext;

describe('FreeAgent endpoint registry and wire contracts', () => {
	const plugin = freeagent();

	it('keeps endpoint handlers, schemas, and metadata aligned', () => {
		const schemaNames = Object.keys(freeAgentEndpointSchemas).sort();
		expect(Object.keys(plugin.endpointSchemas ?? {}).sort()).toEqual(
			schemaNames,
		);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(schemaNames);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.options?.authType).toBe('oauth_2');
		expect(wireCases.map(({ name }) => name).sort()).toEqual(schemaNames);
	});

	it.each(wireCases)(
		'$name sends the documented request and parses its response',
		async (testCase) => {
			const calls: Array<{ url: string; init: RequestInit }> = [];
			const fetchMock = jest
				.spyOn(globalThis, 'fetch')
				.mockImplementation(async (request, init) => {
					calls.push({ url: String(request), init: init ?? {} });
					return testCase.response === null
						? new Response(null, { status: 204 })
						: new Response(JSON.stringify(testCase.response), {
								status: 200,
								headers: {
									'Content-Type': 'application/json',
									Link: pagination.link,
									'X-Total-Count': pagination.total_count,
								},
							});
				});
			try {
				// `unknown` because Reflect.apply invokes the typed endpoint from a minimal runtime test context.
				const result: unknown = await Reflect.apply(
					testCase.handler,
					undefined,
					[ctx, testCase.input],
				);
				expect(result).toEqual(testCase.expected);
				expect(calls).toHaveLength(1);
				expect(calls[0]?.url).toBe(
					`https://api.freeagent.com${testCase.pathAndQuery}`,
				);
				expect(calls[0]?.init.method).toBe(testCase.method);
				const headers = new Headers(calls[0]?.init.headers);
				expect(headers.get('Authorization')).toBe('Bearer access-token');
				expect(headers.get('Accept')).toBe('application/json');
				expect(headers.get('User-Agent')).toBe('Corsair FreeAgent integration');
				if (testCase.body === undefined) {
					expect(calls[0]?.init.body).toBeUndefined();
				} else {
					expect(JSON.parse(String(calls[0]?.init.body))).toEqual(
						testCase.body,
					);
				}
			} finally {
				fetchMock.mockRestore();
			}
		},
	);

	it('rejects invalid input for every operation before making a request', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch');
		try {
			for (const testCase of wireCases) {
				await expect(
					Reflect.apply(testCase.handler, undefined, [
						ctx,
						{ unexpected: true },
					]),
				).rejects.toThrow();
			}
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			fetchMock.mockRestore();
		}
	});

	it('logs only collection counts, not customer data', async () => {
		const logSpy = jest.spyOn(corsairCore, 'logEventFromContext');
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(
				JSON.stringify({
					contacts: [
						{
							organisation_name: 'Private Customer Ltd',
							email: 'private@example.test',
						},
					],
				}),
				{
					status: 200,
					headers: {
						'Content-Type': 'application/json',
						'X-Total-Count': '1',
					},
				},
			),
		);
		try {
			await Contacts.list(ctx, {});
			expect(logSpy).toHaveBeenCalledWith(
				ctx,
				'freeagent.contacts.list',
				{ count: 1 },
				'completed',
			);
			expect(JSON.stringify(logSpy.mock.calls)).not.toContain(
				'private@example.test',
			);
			expect(JSON.stringify(logSpy.mock.calls)).not.toContain(
				'Private Customer Ltd',
			);
		} finally {
			fetchMock.mockRestore();
			logSpy.mockRestore();
		}
	});

	it('marks financial document actions with their documented write risks', () => {
		expect(plugin.endpointMeta?.['invoices.sendEmail']?.riskLevel).toBe(
			'destructive',
		);
		expect(plugin.endpointMeta?.['invoices.markSent']?.riskLevel).toBe(
			'destructive',
		);
		expect(plugin.endpointMeta?.['invoices.create']?.riskLevel).toBe('write');
		expect(plugin.endpointMeta?.['invoices.directDebit']?.riskLevel).toBe(
			'destructive',
		);
		expect(plugin.endpointMeta?.['invoices.markCancelled']?.riskLevel).toBe(
			'destructive',
		);
		expect(
			plugin.endpointMeta?.['invoices.convertToCreditNote']?.riskLevel,
		).toBe('destructive');
		expect(plugin.endpointMeta?.['trackingGroups.list']?.riskLevel).toBe(
			'read',
		);
		expect(plugin.endpointMeta?.['recurringInvoices.get']?.riskLevel).toBe(
			'read',
		);
	});
});
