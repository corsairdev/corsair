import { createCorsair } from 'corsair/core';
import { nutshell } from './index';

// Responses as Nutshell documents them. The quote and invoice objects are the
// examples printed on the reference pages for GET /quotes and GET /invoices:
// an unset time, name or comment is `null`, not absent.
const documentedQuote = {
	id: '123-quotes',
	type: 'quotes',
	number: '1000-01',
	displayStatus: 'SENT',
	total: { amount: '5000.00', currency: 'USD', formatted: '$5,000.00' },
	productLineItems: [
		{
			id: '1-quoteProductLineItems',
			position: 0,
			product: '100-products',
			name: 'Consulting Services',
			description: 'Monthly consulting retainer',
			sku: 'CONS-001',
			quantity: 2,
			term: null,
			price: { amount: '2500.00', currency: 'USD', formatted: '$2,500.00' },
			total: { amount: '5000.00', currency: 'USD', formatted: '$5,000.00' },
			discountUnit: null,
			discountNumber: null,
		},
	],
	subtotalLineItems: [
		{
			id: '1-quoteSubtotalLineItems',
			position: 0,
			label: 'Discount',
			modifierUnit: '%',
			modifierValue: 10,
			operation: '-',
			total: { amount: '500.00', currency: 'USD', formatted: '$500.00' },
		},
	],
	recipient: {
		id: '321-contacts',
		name: 'Jane Doe',
		email: 'jane@example.com',
	},
	validThroughTime: '2024-12-31T23:59:59Z',
	createdTime: '2024-01-15T10:30:00Z',
	publishedTime: '2024-01-16T14:20:00Z',
	sentTime: '2024-01-17T09:15:00Z',
	acceptedTime: null,
	acceptedName: null,
	acceptedEmail: null,
	deletedTime: null,
	links: { lead: '456-leads' },
};

const documentedInvoice = {
	id: '790-quotes',
	type: 'invoices',
	number: '1000-02',
	displayStatus: 'SENT',
	total: { amount: '1500.00', currency: 'USD', formatted: '$1,500.00' },
	productLineItems: [
		{
			id: '2-quoteProductLineItems',
			position: 0,
			product: '101-products',
			name: 'Setup Fee',
			description: 'One-time setup',
			sku: 'SETUP-001',
			quantity: 1,
			term: null,
			price: { amount: '1500.00', currency: 'USD', formatted: '$1,500.00' },
			total: { amount: '1500.00', currency: 'USD', formatted: '$1,500.00' },
			discountUnit: null,
			discountNumber: null,
		},
	],
	subtotalLineItems: [],
	recipient: {
		id: '322-contacts',
		name: 'John Smith',
		email: 'john@example.com',
	},
	validThroughTime: '2024-11-30T23:59:59Z',
	createdTime: '2024-02-01T08:00:00Z',
	publishedTime: '2024-02-02T10:00:00Z',
	sentTime: '2024-02-03T11:00:00Z',
	paidTime: null,
	acceptedName: null,
	acceptedEmail: null,
	completionComment: null,
	deletedTime: null,
	links: { lead: '457-leads' },
};

const pageLinks = {
	self: '/rest/quotes?page[page]=0&page[limit]=25',
	first: '/rest/quotes?page[page]=0&page[limit]=25',
	last: '/rest/quotes?page[page]=0&page[limit]=25',
};

const corsair = createCorsair({
	plugins: [nutshell({ key: 'owner@example.com:api-key' })],
});
const api = corsair.nutshell.api;

// unknown: each case replies with a different provider payload.
function reply(body: unknown, status = 200) {
	return jest.spyOn(global, 'fetch').mockImplementation(
		async () =>
			new Response(JSON.stringify(body), {
				status,
				headers: { 'content-type': 'application/json' },
			}),
	);
}

describe('Nutshell responses with unset fields', () => {
	// No test here may reach the network: a call that a test did not mock
	// throws instead of going to Nutshell.
	beforeEach(() => {
		jest.spyOn(global, 'fetch').mockImplementation(async (url) => {
			throw new Error(`unmocked fetch: ${String(url)}`);
		});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('quotes.list returns the documented example, nulls and page links included', async () => {
		const body = {
			meta: { instanceId: '12345' },
			links: pageLinks,
			quotes: [documentedQuote],
		};
		reply(body);
		await expect(api.quotes.list({})).resolves.toEqual(body);
	});

	it('quotes.get and quotes.status return a quote that is not accepted or deleted', async () => {
		reply({ quotes: [documentedQuote] });
		await expect(api.quotes.get({ id: '123-quotes' })).resolves.toEqual({
			quotes: [documentedQuote],
		});
		await expect(
			api.quotes.status({ id: '123-quotes', body: { status: 'SENT' } }),
		).resolves.toEqual({ quotes: [documentedQuote] });
	});

	it('invoices.list, invoices.get and invoices.status return an unpaid invoice', async () => {
		const body = { invoices: [documentedInvoice] };
		reply(body);
		await expect(api.invoices.list({})).resolves.toEqual(body);
		await expect(api.invoices.get({ id: '790-quotes' })).resolves.toEqual(body);
		await expect(
			api.invoices.status({ id: '790-quotes', body: { status: 'SENT' } }),
		).resolves.toEqual(body);
	});

	it('quotes.createInvoice returns the new invoice', async () => {
		const body = { invoices: [documentedInvoice] };
		reply(body, 201);
		await expect(
			api.quotes.createInvoice({ id: '123-quotes' }),
		).resolves.toEqual(body);
	});

	it('keeps null for unset fields on the older resources', async () => {
		const tags = {
			tags: [
				{
					id: '15-tags',
					type: 'tags',
					name: 'VIP',
					count: 3,
					deletedTime: null,
				},
			],
		};
		reply(tags);
		await expect(api.tags.list({})).resolves.toEqual(tags);

		const installments = {
			installments: [
				{
					id: '9-installments',
					dueTime: '2026-01-01T00:00:00+0000',
					description: null,
					value: { currency: 'USD', amount: 100 },
					failedTime: null,
					isPaid: false,
				},
			],
		};
		reply(installments);
		await expect(api.leads.installments({ id: '7-leads' })).resolves.toEqual(
			installments,
		);
	});

	it('returns a value Nutshell adds to a documented set later', async () => {
		// filter[type] already accepts follow-ups, which the documented response
		// set (tasks, steps) does not list.
		const todos = {
			todos: [
				{
					id: '9-followUps',
					type: 'follow-ups',
					title: 'Call back',
					isComplete: false,
					isOverdue: false,
				},
			],
			meta: {
				count: 1,
				facets: { past: 0, today: 1, tomorrow: 0, future: 0 },
				page: { startIndex: 0, endIndex: 0, limit: 100 },
			},
		};
		reply(todos);
		await expect(
			api.todos.list({ 'filter[type]': ['follow-ups'] }),
		).resolves.toEqual(todos);

		const quotes = {
			quotes: [
				{
					...documentedQuote,
					subtotalLineItems: [
						{ id: '2-quoteSubtotalLineItems', operation: '*', label: 'Rate' },
					],
				},
			],
		};
		reply(quotes);
		await expect(api.quotes.get({ id: '123-quotes' })).resolves.toEqual(quotes);
	});
});
