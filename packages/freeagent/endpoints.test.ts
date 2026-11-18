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
import { AccountingEndpoints } from './endpoints/accounting';
import { AssetEndpoints } from './endpoints/assets';
import { BankingEndpoints } from './endpoints/banking';
import { CatalogEndpoints } from './endpoints/catalog';
import { CreditNoteEndpoints } from './endpoints/credit-notes';
import { EstimateEndpoints } from './endpoints/estimates';
import { ExpensesBillsEndpoints } from './endpoints/expenses-bills';
import { TaxReturnEndpoints } from './endpoints/tax-returns';
import { TimeUserEndpoints } from './endpoints/time-users';
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
	apiVersion?: string;
};

const pagination = {
	link: '<https://api.freeagent.com/v2/page?page=2>; rel="next"',
	total_count: '26',
};
const encodedId = 'record%2Fwith%20space%3F';
const contact = { organisation_name: 'Example Ltd' };
const project = { name: 'Example Project' };
const invoice = {
	status: 'Draft',
	reference: 'FA-001',
	invoice_items: [
		{
			url: 'https://api.freeagent.com/v2/invoice_items/1',
			position: 1,
			description: 'Consulting services',
			item_type: 'Hours',
			price: '125.50',
			quantity: '2.0',
			sales_tax_rate: '20.0',
		},
	],
};
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
		response: { invoices: [invoice] },
		expected: { invoices: [invoice], pagination },
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
		input: {
			id: 'record/with space?',
			invoice: {
				comments: 'Updated',
				payment_methods: { gocardless_preauth: true, stripe: false },
			},
		},
		method: 'PUT',
		pathAndQuery: `/v2/invoices/${encodedId}`,
		body: {
			invoice: {
				comments: 'Updated',
				payment_methods: { gocardless_preauth: true, stripe: false },
			},
		},
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
	{
		name: 'attachments.get',
		handler: BankingEndpoints.attachments.get,
		input: { id: '1' },
		method: 'GET',
		pathAndQuery: '/v2/attachments/1',
		body: undefined,
		response: {
			attachment: {
				url: 'https://api.freeagent.com/v2/attachments/1',
				file_name: 'receipt.png',
			},
		},
		expected: {
			attachment: {
				url: 'https://api.freeagent.com/v2/attachments/1',
				file_name: 'receipt.png',
			},
		},
	},
	{
		name: 'attachments.delete',
		handler: BankingEndpoints.attachments.delete,
		input: { id: '1' },
		method: 'DELETE',
		pathAndQuery: '/v2/attachments/1',
		body: undefined,
		response: null,
		expected: undefined,
	},
	{
		name: 'bankAccounts.list',
		handler: BankingEndpoints.bankAccounts.list,
		input: { query: { page: 2, per_page: 50, view: 'standard_bank_accounts' } },
		method: 'GET',
		pathAndQuery:
			'/v2/bank_accounts?page=2&per_page=50&view=standard_bank_accounts',
		body: undefined,
		response: { bank_accounts: [] },
		expected: { bank_accounts: [], pagination },
	},
	{
		name: 'bankAccounts.get',
		handler: BankingEndpoints.bankAccounts.get,
		input: { id: '1' },
		method: 'GET',
		pathAndQuery: '/v2/bank_accounts/1',
		body: undefined,
		response: { bank_account: { name: 'Operating' } },
		expected: { bank_account: { name: 'Operating' } },
	},
	{
		name: 'bankAccounts.create',
		handler: BankingEndpoints.bankAccounts.create,
		input: { bank_account: { name: 'Operating', opening_balance: '0.0' } },
		method: 'POST',
		pathAndQuery: '/v2/bank_accounts',
		body: { bank_account: { name: 'Operating', opening_balance: '0.0' } },
		response: { bank_account: { name: 'Operating', opening_balance: '0.0' } },
		expected: { bank_account: { name: 'Operating', opening_balance: '0.0' } },
	},
	{
		name: 'bankAccounts.update',
		handler: BankingEndpoints.bankAccounts.update,
		input: { id: '1', bank_account: { name: 'Updated' } },
		method: 'PUT',
		pathAndQuery: '/v2/bank_accounts/1',
		body: { bank_account: { name: 'Updated' } },
		response: null,
		expected: undefined,
	},
	{
		name: 'bankAccounts.delete',
		handler: BankingEndpoints.bankAccounts.delete,
		input: { id: '1' },
		method: 'DELETE',
		pathAndQuery: '/v2/bank_accounts/1',
		body: undefined,
		response: null,
		expected: undefined,
	},
	{
		name: 'bankFeeds.list',
		handler: BankingEndpoints.bankFeeds.list,
		input: { query: { page: 1, per_page: 25 } },
		method: 'GET',
		pathAndQuery: '/v2/bank_feeds?page=1&per_page=25',
		body: undefined,
		response: { bank_feeds: [] },
		expected: { bank_feeds: [], pagination },
	},
	{
		name: 'bankFeeds.get',
		handler: BankingEndpoints.bankFeeds.get,
		input: { id: '1' },
		method: 'GET',
		pathAndQuery: '/v2/bank_feeds/1',
		body: undefined,
		response: { bank_feed: { feed_type: 'api', state: 'enabled' } },
		expected: { bank_feed: { feed_type: 'api', state: 'enabled' } },
	},
	{
		name: 'bankTransactions.list',
		handler: BankingEndpoints.bankTransactions.list,
		input: {
			query: {
				bank_account: 'https://api.freeagent.com/v2/bank_accounts/1',
				page: 2,
			},
		},
		method: 'GET',
		pathAndQuery:
			'/v2/bank_transactions?page=2&bank_account=https%3A%2F%2Fapi.freeagent.com%2Fv2%2Fbank_accounts%2F1',
		body: undefined,
		response: { bank_transactions: [] },
		expected: { bank_transactions: [], pagination },
	},
	{
		name: 'bankTransactions.get',
		handler: BankingEndpoints.bankTransactions.get,
		input: { id: '1' },
		method: 'GET',
		pathAndQuery: '/v2/bank_transactions/1',
		body: undefined,
		response: { bank_transaction: { amount: '-20.0', dated_on: '2026-10-01' } },
		expected: { bank_transaction: { amount: '-20.0', dated_on: '2026-10-01' } },
	},
	{
		name: 'bankTransactions.delete',
		handler: BankingEndpoints.bankTransactions.delete,
		input: { id: '1' },
		method: 'DELETE',
		pathAndQuery: '/v2/bank_transaction/1',
		body: undefined,
		response: null,
		expected: undefined,
	},
	{
		name: 'bankTransactions.uploadStatement',
		handler: BankingEndpoints.bankTransactions.uploadStatement,
		input: {
			bank_account: 'https://api.freeagent.com/v2/bank_accounts/1',
			statement: [
				{ dated_on: '2026-10-01', amount: -10, description: 'Purchase' },
			],
		},
		method: 'POST',
		pathAndQuery:
			'/v2/bank_transactions/statement?bank_account=https%3A%2F%2Fapi.freeagent.com%2Fv2%2Fbank_accounts%2F1',
		body: {
			statement: [
				{ dated_on: '2026-10-01', amount: -10, description: 'Purchase' },
			],
		},
		response: null,
		expected: undefined,
	},
	{
		name: 'bankTransactionExplanations.list',
		handler: BankingEndpoints.bankTransactionExplanations.list,
		input: {
			query: {
				bank_account: 'https://api.freeagent.com/v2/bank_accounts/1',
				from_date: '2026-10-01',
			},
		},
		method: 'GET',
		pathAndQuery:
			'/v2/bank_transaction_explanations?bank_account=https%3A%2F%2Fapi.freeagent.com%2Fv2%2Fbank_accounts%2F1&from_date=2026-10-01',
		body: undefined,
		response: { bank_transaction_explanations: [] },
		expected: { bank_transaction_explanations: [], pagination },
	},
	{
		name: 'bankTransactionExplanations.get',
		handler: BankingEndpoints.bankTransactionExplanations.get,
		input: { id: '1' },
		method: 'GET',
		pathAndQuery: '/v2/bank_transaction_explanations/1',
		body: undefined,
		response: {
			bank_transaction_explanation: {
				dated_on: '2026-10-01',
				gross_value: '-5.0',
			},
		},
		expected: {
			bank_transaction_explanation: {
				dated_on: '2026-10-01',
				gross_value: '-5.0',
			},
		},
	},
	{
		name: 'bankTransactionExplanations.create',
		handler: BankingEndpoints.bankTransactionExplanations.create,
		input: {
			explanation: {
				bank_account: 'https://api.freeagent.com/v2/bank_accounts/1',
				dated_on: '2026-10-01',
				gross_value: '-5.0',
			},
		},
		method: 'POST',
		pathAndQuery: '/v2/bank_transaction_explanations',
		body: {
			bank_transaction_explanation: {
				bank_account: 'https://api.freeagent.com/v2/bank_accounts/1',
				dated_on: '2026-10-01',
				gross_value: '-5.0',
			},
		},
		response: {
			bank_transaction_explanation: {
				dated_on: '2026-10-01',
				gross_value: '-5.0',
			},
		},
		expected: {
			bank_transaction_explanation: {
				dated_on: '2026-10-01',
				gross_value: '-5.0',
			},
		},
	},
	{
		name: 'bankTransactionExplanations.update',
		handler: BankingEndpoints.bankTransactionExplanations.update,
		input: { id: '1', explanation: { description: 'Updated' } },
		method: 'PUT',
		pathAndQuery: '/v2/bank_transaction_explanations/1',
		body: { bank_transaction_explanation: { description: 'Updated' } },
		response: null,
		expected: undefined,
	},
	{
		name: 'bankTransactionExplanations.delete',
		handler: BankingEndpoints.bankTransactionExplanations.delete,
		input: { id: '1' },
		method: 'DELETE',
		pathAndQuery: '/v2/bank_transaction_explanations/1',
		body: undefined,
		response: null,
		expected: undefined,
	},
	{
		name: 'bankTransactionExplanations.listAttachments',
		handler: BankingEndpoints.bankTransactionExplanations.listAttachments,
		input: { id: '1' },
		method: 'GET',
		pathAndQuery: '/v2/bank_transaction_explanations/1/attachments',
		body: undefined,
		response: { attachments: [] },
		expected: { attachments: [] },
		apiVersion: '2026-09-01',
	},
	{
		name: 'bankTransactionExplanations.createAttachments',
		handler: BankingEndpoints.bankTransactionExplanations.createAttachments,
		input: {
			id: '1',
			attachments: [
				{ data: 'YQ==', file_name: 'note.txt', content_type: 'text/plain' },
			],
		},
		method: 'POST',
		pathAndQuery: '/v2/bank_transaction_explanations/1/attachments',
		body: {
			attachments: [
				{ data: 'YQ==', file_name: 'note.txt', content_type: 'text/plain' },
			],
		},
		response: { attachments: [] },
		expected: { attachments: [] },
		apiVersion: '2026-09-01',
	},
	{
		name: 'bankTransactionExplanations.updateAttachments',
		handler: BankingEndpoints.bankTransactionExplanations.updateAttachments,
		input: {
			id: '1',
			attachments: [
				{ url: 'https://api.freeagent.com/v2/attachments/2', _destroy: 'true' },
			],
		},
		method: 'PUT',
		pathAndQuery: '/v2/bank_transaction_explanations/1/attachments',
		body: {
			attachments: [
				{ url: 'https://api.freeagent.com/v2/attachments/2', _destroy: 'true' },
			],
		},
		response: { attachments: [] },
		expected: { attachments: [] },
		apiVersion: '2026-09-01',
	},
	{
		name: 'bankTransactionExplanations.deleteAttachments',
		handler: BankingEndpoints.bankTransactionExplanations.deleteAttachments,
		input: { id: '1' },
		method: 'DELETE',
		pathAndQuery: '/v2/bank_transaction_explanations/1/attachments',
		body: undefined,
		response: { attachments: [] },
		expected: { attachments: [] },
		apiVersion: '2026-09-01',
	},
	{
		name: 'categories.list',
		handler: AccountingEndpoints.categories.list,
		input: { query: { page: 1, per_page: 25, sub_accounts: true } },
		method: 'GET',
		pathAndQuery: '/v2/categories?page=1&per_page=25&sub_accounts=true',
		body: undefined,
		response: {
			admin_expenses_categories: [],
			cost_of_sales_categories: [],
			income_categories: [],
			general_categories: [],
		},
		expected: {
			admin_expenses_categories: [],
			cost_of_sales_categories: [],
			income_categories: [],
			general_categories: [],
			pagination,
		},
	},
	{
		name: 'categories.get',
		handler: AccountingEndpoints.categories.get,
		input: { nominal_code: '001' },
		method: 'GET',
		pathAndQuery: '/v2/categories/001',
		body: undefined,
		response: {
			income_categories: { nominal_code: '001', description: 'Sales' },
		},
		expected: {
			income_categories: { nominal_code: '001', description: 'Sales' },
		},
	},
	{
		name: 'categories.create',
		handler: AccountingEndpoints.categories.create,
		input: {
			category: {
				description: 'Custom income',
				nominal_code: '047',
				category_group: 'income',
			},
		},
		method: 'POST',
		pathAndQuery: '/v2/categories',
		body: {
			category: {
				description: 'Custom income',
				nominal_code: '047',
				category_group: 'income',
			},
		},
		response: {
			income_categories: { nominal_code: '047', description: 'Custom income' },
		},
		expected: {
			income_categories: { nominal_code: '047', description: 'Custom income' },
		},
	},
	{
		name: 'categories.update',
		handler: AccountingEndpoints.categories.update,
		input: { nominal_code: '047', category: { description: 'Updated income' } },
		method: 'PUT',
		pathAndQuery: '/v2/categories/047',
		body: { category: { description: 'Updated income' } },
		response: {
			income_categories: { nominal_code: '047', description: 'Updated income' },
		},
		expected: {
			income_categories: { nominal_code: '047', description: 'Updated income' },
		},
	},
	{
		name: 'categories.delete',
		handler: AccountingEndpoints.categories.delete,
		input: { nominal_code: '047' },
		method: 'DELETE',
		pathAndQuery: '/v2/categories/047',
		body: undefined,
		response: {
			income_categories: { nominal_code: '047', description: 'Custom income' },
		},
		expected: {
			income_categories: { nominal_code: '047', description: 'Custom income' },
		},
	},
	{
		name: 'balanceSheet.get',
		handler: AccountingEndpoints.balanceSheet.get,
		input: { query: { as_at_date: '2026-10-01' } },
		method: 'GET',
		pathAndQuery: '/v2/accounting/balance_sheet?as_at_date=2026-10-01',
		body: undefined,
		response: { balance_sheet: { as_at_date: '2026-10-01', currency: 'GBP' } },
		expected: { balance_sheet: { as_at_date: '2026-10-01', currency: 'GBP' } },
	},
	{
		name: 'balanceSheet.openingBalances',
		handler: AccountingEndpoints.balanceSheet.openingBalances,
		input: {},
		method: 'GET',
		pathAndQuery: '/v2/accounting/balance_sheet/opening_balances',
		body: undefined,
		response: { balance_sheet: { currency: 'GBP' } },
		expected: { balance_sheet: { currency: 'GBP' } },
	},
	{
		name: 'cis.bands',
		handler: AccountingEndpoints.cis.bands,
		input: {},
		method: 'GET',
		pathAndQuery: '/v2/cis_bands',
		body: undefined,
		response: {
			available_bands: [
				{
					name: 'cis_standard',
					deduction_rate: '0.2',
					income_description: 'CIS Income (20%)',
					deduction_description: 'CIS Deduction (20%)',
					nominal_code: '062',
				},
			],
		},
		expected: {
			available_bands: [
				{
					name: 'cis_standard',
					deduction_rate: '0.2',
					income_description: 'CIS Income (20%)',
					deduction_description: 'CIS Deduction (20%)',
					nominal_code: '062',
				},
			],
		},
	},
	{
		name: 'cis.getSettings',
		handler: AccountingEndpoints.cis.getSettings,
		input: {},
		method: 'GET',
		pathAndQuery: '/v2/cis_settings',
		body: undefined,
		response: {
			cis_settings: { contractor_details: null, subcontractor_details: null },
		},
		expected: {
			cis_settings: { contractor_details: null, subcontractor_details: null },
		},
	},
	{
		name: 'cis.updateSettings',
		handler: AccountingEndpoints.cis.updateSettings,
		input: { cis_settings: { contractor_details: null } },
		method: 'PUT',
		pathAndQuery: '/v2/cis_settings',
		body: { cis_settings: { contractor_details: null } },
		response: {
			cis_settings: { contractor_details: null, subcontractor_details: null },
		},
		expected: {
			cis_settings: { contractor_details: null, subcontractor_details: null },
		},
	},
	{
		name: 'financialReports.cashflow',
		handler: AccountingEndpoints.financialReports.cashflow,
		input: { query: { from_date: '2026-07-01', to_date: '2026-09-30' } },
		method: 'GET',
		pathAndQuery: '/v2/cashflow?from_date=2026-07-01&to_date=2026-09-30',
		body: undefined,
		response: {
			cashflow: {
				from: '2026-07-01',
				to: '2026-09-30',
				incoming: { total: '5.0', months: [] },
				outgoing: { total: '3.0', months: [] },
				balance: '2.0',
			},
		},
		expected: {
			cashflow: {
				from: '2026-07-01',
				to: '2026-09-30',
				incoming: { total: '5.0', months: [] },
				outgoing: { total: '3.0', months: [] },
				balance: '2.0',
			},
		},
	},
	{
		name: 'financialReports.profitAndLoss',
		handler: AccountingEndpoints.financialReports.profitAndLoss,
		input: {
			query: {
				from_date: '2026-01-01',
				to_date: '2026-12-31',
				accounting_period: '2026/27',
			},
		},
		method: 'GET',
		pathAndQuery:
			'/v2/accounting/profit_and_loss/summary?from_date=2026-01-01&to_date=2026-12-31&accounting_period=2026%2F27',
		body: undefined,
		response: {
			profit_and_loss_summary: {
				from: '2026-01-01',
				to: '2026-12-31',
				income: '100.0',
				expenses: '50.0',
				operating_profit: '50.0',
				retained_profit: '50.0',
				retained_profit_brought_forward: '0',
				retained_profit_carried_forward: '50',
			},
		},
		expected: {
			profit_and_loss_summary: {
				from: '2026-01-01',
				to: '2026-12-31',
				income: '100.0',
				expenses: '50.0',
				operating_profit: '50.0',
				retained_profit: '50.0',
				retained_profit_brought_forward: '0',
				retained_profit_carried_forward: '50',
			},
		},
	},
	{
		name: 'financialReports.trialBalance',
		handler: AccountingEndpoints.financialReports.trialBalance,
		input: { query: { from_date: '2026-01-01', to_date: '2026-01-31' } },
		method: 'GET',
		pathAndQuery:
			'/v2/accounting/trial_balance/summary?from_date=2026-01-01&to_date=2026-01-31',
		body: undefined,
		response: { trial_balance_summary: [] },
		expected: { trial_balance_summary: [] },
	},
	{
		name: 'financialReports.trialBalanceOpeningBalances',
		handler: AccountingEndpoints.financialReports.trialBalanceOpeningBalances,
		input: {},
		method: 'GET',
		pathAndQuery: '/v2/accounting/trial_balance/summary/opening_balances',
		body: undefined,
		response: { trial_balance_summary: [] },
		expected: { trial_balance_summary: [] },
	},
	{
		name: 'financialReports.transactionsList',
		handler: AccountingEndpoints.financialReports.transactionsList,
		input: { query: { from_date: '2026-01-01', to_date: '2026-01-31' } },
		method: 'GET',
		pathAndQuery:
			'/v2/accounting/transactions?from_date=2026-01-01&to_date=2026-01-31',
		body: undefined,
		response: { transactions: [] },
		expected: { transactions: [], pagination },
	},
	{
		name: 'financialReports.transactionsGet',
		handler: AccountingEndpoints.financialReports.transactionsGet,
		input: { id: '1' },
		method: 'GET',
		pathAndQuery: '/v2/accounting/transactions/1',
		body: undefined,
		response: {
			transaction: {
				debit_value: '10.0',
				category: 'https://api.freeagent.com/v2/categories/001',
			},
		},
		expected: {
			transaction: {
				debit_value: '10.0',
				category: 'https://api.freeagent.com/v2/categories/001',
			},
		},
	},
	{
		name: 'journalSets.list',
		handler: AccountingEndpoints.journalSets.list,
		input: { query: { page: 1, per_page: 25, tag: 'app-run' } },
		method: 'GET',
		pathAndQuery: '/v2/journal_sets?page=1&per_page=25&tag=app-run',
		body: undefined,
		response: { journal_sets: [] },
		expected: { journal_sets: [], pagination },
	},
	{
		name: 'journalSets.get',
		handler: AccountingEndpoints.journalSets.get,
		input: { id: '1' },
		method: 'GET',
		pathAndQuery: '/v2/journal_sets/1',
		body: undefined,
		response: {
			journal_set: { description: 'Adjustment', journal_entries: [] },
		},
		expected: {
			journal_set: { description: 'Adjustment', journal_entries: [] },
		},
	},
	{
		name: 'journalSets.openingBalances',
		handler: AccountingEndpoints.journalSets.openingBalances,
		input: {},
		method: 'GET',
		pathAndQuery: '/v2/journal_sets/opening_balances',
		body: undefined,
		response: {
			journal_set: {
				description: 'Opening Balances Journal Set',
				journal_entries: [],
				bank_accounts: [],
				stock_items: [],
			},
		},
		expected: {
			journal_set: {
				description: 'Opening Balances Journal Set',
				journal_entries: [],
				bank_accounts: [],
				stock_items: [],
			},
		},
	},
	{
		name: 'journalSets.create',
		handler: AccountingEndpoints.journalSets.create,
		input: {
			journal_set: {
				dated_on: '2026-10-01',
				description: 'Adjustment',
				journal_entries: [
					{
						category: 'https://api.freeagent.com/v2/categories/001',
						debit_value: '10.0',
					},
					{
						category: 'https://api.freeagent.com/v2/categories/002',
						debit_value: '-10.0',
					},
				],
			},
		},
		method: 'POST',
		pathAndQuery: '/v2/journal_sets',
		body: {
			journal_set: {
				dated_on: '2026-10-01',
				description: 'Adjustment',
				journal_entries: [
					{
						category: 'https://api.freeagent.com/v2/categories/001',
						debit_value: '10.0',
					},
					{
						category: 'https://api.freeagent.com/v2/categories/002',
						debit_value: '-10.0',
					},
				],
			},
		},
		response: {
			journal_set: {
				dated_on: '2026-10-01',
				description: 'Adjustment',
				journal_entries: [],
			},
		},
		expected: {
			journal_set: {
				dated_on: '2026-10-01',
				description: 'Adjustment',
				journal_entries: [],
			},
		},
	},
	{
		name: 'journalSets.update',
		handler: AccountingEndpoints.journalSets.update,
		input: {
			id: '1',
			journal_set: {
				journal_entries: [
					{
						category: 'https://api.freeagent.com/v2/categories/001',
						debit_value: '10.0',
					},
					{
						category: 'https://api.freeagent.com/v2/categories/002',
						debit_value: '-10.0',
					},
				],
			},
		},
		method: 'PUT',
		pathAndQuery: '/v2/journal_sets/1',
		body: {
			journal_set: {
				journal_entries: [
					{
						category: 'https://api.freeagent.com/v2/categories/001',
						debit_value: '10.0',
					},
					{
						category: 'https://api.freeagent.com/v2/categories/002',
						debit_value: '-10.0',
					},
				],
			},
		},
		response: {
			journal_set: { description: 'Adjustment', journal_entries: [] },
		},
		expected: {
			journal_set: { description: 'Adjustment', journal_entries: [] },
		},
	},
	{
		name: 'journalSets.delete',
		handler: AccountingEndpoints.journalSets.delete,
		input: { id: '1' },
		method: 'DELETE',
		pathAndQuery: '/v2/journal_sets/1',
		body: undefined,
		response: null,
		expected: undefined,
	},
	{
		name: 'capitalAssetTypes.list',
		handler: AssetEndpoints.capitalAssetTypes.list,
		input: { query: { page: 1, per_page: 25 } },
		method: 'GET',
		pathAndQuery: '/v2/capital_asset_types?page=1&per_page=25',
		body: undefined,
		response: { capital_asset_types: [] },
		expected: { capital_asset_types: [], pagination },
	},
	{
		name: 'capitalAssetTypes.get',
		handler: AssetEndpoints.capitalAssetTypes.get,
		input: { id: '1' },
		method: 'GET',
		pathAndQuery: '/v2/capital_asset_types/1',
		body: undefined,
		response: {
			capital_asset_type: { name: 'Computer Equipment', system_default: true },
		},
		expected: {
			capital_asset_type: { name: 'Computer Equipment', system_default: true },
		},
	},
	{
		name: 'capitalAssetTypes.create',
		handler: AssetEndpoints.capitalAssetTypes.create,
		input: { capital_asset_type: { name: 'Specialized machinery' } },
		method: 'POST',
		pathAndQuery: '/v2/capital_asset_types',
		body: { capital_asset_type: { name: 'Specialized machinery' } },
		response: {
			capital_asset_type: {
				name: 'Specialized machinery',
				system_default: false,
			},
		},
		expected: {
			capital_asset_type: {
				name: 'Specialized machinery',
				system_default: false,
			},
		},
	},
	{
		name: 'capitalAssetTypes.update',
		handler: AssetEndpoints.capitalAssetTypes.update,
		input: { id: '4', capital_asset_type: { name: 'Updated type' } },
		method: 'PUT',
		pathAndQuery: '/v2/capital_asset_types/4',
		body: { capital_asset_type: { name: 'Updated type' } },
		response: {
			capital_asset_type: { name: 'Updated type', system_default: false },
		},
		expected: {
			capital_asset_type: { name: 'Updated type', system_default: false },
		},
	},
	{
		name: 'capitalAssetTypes.delete',
		handler: AssetEndpoints.capitalAssetTypes.delete,
		input: { id: '4' },
		method: 'DELETE',
		pathAndQuery: '/v2/capital_asset_types/4',
		body: undefined,
		response: {
			capital_asset_type: {
				name: 'Specialized machinery',
				system_default: false,
			},
		},
		expected: {
			capital_asset_type: {
				name: 'Specialized machinery',
				system_default: false,
			},
		},
	},
	{
		name: 'capitalAssets.list',
		handler: AssetEndpoints.capitalAssets.list,
		input: { query: { view: 'disposable', include_history: true } },
		method: 'GET',
		pathAndQuery: '/v2/capital_assets?view=disposable&include_history=true',
		body: undefined,
		response: { capital_assets: [] },
		expected: { capital_assets: [], pagination },
	},
	{
		name: 'capitalAssets.get',
		handler: AssetEndpoints.capitalAssets.get,
		input: { id: '2', query: { include_history: true } },
		method: 'GET',
		pathAndQuery: '/v2/capital_assets/2?include_history=true',
		body: undefined,
		response: {
			capital_asset: { description: 'Computer', capital_asset_history: [] },
		},
		expected: {
			capital_asset: { description: 'Computer', capital_asset_history: [] },
		},
	},
	{
		name: 'hirePurchases.list',
		handler: AssetEndpoints.hirePurchases.list,
		input: { query: { page: 1, per_page: 25 } },
		method: 'GET',
		pathAndQuery: '/v2/hire_purchases?page=1&per_page=25',
		body: undefined,
		response: { hire_purchases: [] },
		expected: { hire_purchases: [], pagination },
	},
	{
		name: 'hirePurchases.get',
		handler: AssetEndpoints.hirePurchases.get,
		input: { id: '1' },
		method: 'GET',
		pathAndQuery: '/v2/hire_purchases/1',
		body: undefined,
		response: {
			hire_purchase: { bill: 'https://api.freeagent.com/v2/bills/1' },
		},
		expected: {
			hire_purchase: { bill: 'https://api.freeagent.com/v2/bills/1' },
		},
	},
	{
		name: 'properties.list',
		handler: AssetEndpoints.properties.list,
		input: { query: { page: 1 } },
		method: 'GET',
		pathAndQuery: '/v2/properties?page=1',
		body: undefined,
		response: { properties: [] },
		expected: { properties: [], pagination },
	},
	{
		name: 'properties.get',
		handler: AssetEndpoints.properties.get,
		input: { id: '3' },
		method: 'GET',
		pathAndQuery: '/v2/properties/3',
		body: undefined,
		response: {
			property: {
				address1: 'Example address',
				town: null,
				country: 'United Kingdom',
			},
		},
		expected: {
			property: {
				address1: 'Example address',
				town: null,
				country: 'United Kingdom',
			},
		},
	},
	{
		name: 'properties.create',
		handler: AssetEndpoints.properties.create,
		input: { property: { address1: 'Example address', town: 'London' } },
		method: 'POST',
		pathAndQuery: '/v2/properties',
		body: { property: { address1: 'Example address', town: 'London' } },
		response: {
			property: {
				address1: 'Example address',
				town: 'London',
				country: 'United Kingdom',
			},
		},
		expected: {
			property: {
				address1: 'Example address',
				town: 'London',
				country: 'United Kingdom',
			},
		},
	},
	{
		name: 'properties.update',
		handler: AssetEndpoints.properties.update,
		input: { id: '3', property: { address2: 'Updated address' } },
		method: 'PUT',
		pathAndQuery: '/v2/properties/3',
		body: { property: { address2: 'Updated address' } },
		response: {
			property: { address1: 'Example address', address2: 'Updated address' },
		},
		expected: {
			property: { address1: 'Example address', address2: 'Updated address' },
		},
	},
	{
		name: 'properties.delete',
		handler: AssetEndpoints.properties.delete,
		input: { id: '3' },
		method: 'DELETE',
		pathAndQuery: '/v2/properties/3',
		body: undefined,
		response: null,
		expected: undefined,
	},
	{
		name: 'stockItems.list',
		handler: AssetEndpoints.stockItems.list,
		input: { query: { sort: '-updated_at', page: 2 } },
		method: 'GET',
		pathAndQuery: '/v2/stock_items?page=2&sort=-updated_at',
		body: undefined,
		response: { stock_items: [] },
		expected: { stock_items: [], pagination },
	},
	{
		name: 'stockItems.get',
		handler: AssetEndpoints.stockItems.get,
		input: { id: '3' },
		method: 'GET',
		pathAndQuery: '/v2/stock_items/3',
		body: undefined,
		response: {
			stock_item: {
				description: 'Apple',
				opening_quantity: '10.0',
				stock_on_hand: '10.0',
			},
		},
		expected: {
			stock_item: {
				description: 'Apple',
				opening_quantity: '10.0',
				stock_on_hand: '10.0',
			},
		},
	},
	{
		name: 'notes.list',
		handler: CatalogEndpoints.notes.list,
		input: {
			query: { contact: 'https://api.freeagent.com/v2/contacts/1', page: 2 },
		},
		method: 'GET',
		pathAndQuery:
			'/v2/notes?page=2&contact=https%3A%2F%2Fapi.freeagent.com%2Fv2%2Fcontacts%2F1',
		body: undefined,
		response: { notes: [] },
		expected: { notes: [], pagination },
	},
	{
		name: 'notes.get',
		handler: CatalogEndpoints.notes.get,
		input: { id: '1' },
		method: 'GET',
		pathAndQuery: '/v2/notes/1',
		body: undefined,
		response: {
			note: {
				note: 'Follow up',
				parent_url: 'https://api.freeagent.com/v2/contacts/1',
			},
		},
		expected: {
			note: {
				note: 'Follow up',
				parent_url: 'https://api.freeagent.com/v2/contacts/1',
			},
		},
	},
	{
		name: 'notes.create',
		handler: CatalogEndpoints.notes.create,
		input: {
			parent: { project: 'https://api.freeagent.com/v2/projects/1' },
			note: 'Meeting notes',
		},
		method: 'POST',
		pathAndQuery:
			'/v2/notes?project=https%3A%2F%2Fapi.freeagent.com%2Fv2%2Fprojects%2F1',
		body: { note: { note: 'Meeting notes' } },
		response: {
			note: {
				note: 'Meeting notes',
				parent_url: 'https://api.freeagent.com/v2/projects/1',
			},
		},
		expected: {
			note: {
				note: 'Meeting notes',
				parent_url: 'https://api.freeagent.com/v2/projects/1',
			},
		},
	},
	{
		name: 'notes.update',
		handler: CatalogEndpoints.notes.update,
		input: { id: '1', note: 'Updated note' },
		method: 'PUT',
		pathAndQuery: '/v2/notes/1',
		body: { note: { note: 'Updated note' } },
		response: { note: { note: 'Updated note' } },
		expected: { note: { note: 'Updated note' } },
	},
	{
		name: 'notes.delete',
		handler: CatalogEndpoints.notes.delete,
		input: { id: '1' },
		method: 'DELETE',
		pathAndQuery: '/v2/notes/1',
		body: undefined,
		response: null,
		expected: undefined,
	},
	{
		name: 'priceListItems.list',
		handler: CatalogEndpoints.priceListItems.list,
		input: { query: { page: 1, sort: '-created_at' } },
		method: 'GET',
		pathAndQuery: '/v2/price_list_items?page=1&sort=-created_at',
		body: undefined,
		response: { price_list_items: [] },
		expected: { price_list_items: [], pagination },
	},
	{
		name: 'priceListItems.get',
		handler: CatalogEndpoints.priceListItems.get,
		input: { id: '1' },
		method: 'GET',
		pathAndQuery: '/v2/price_list_items/1',
		body: undefined,
		response: {
			price_list_item: { code: 'A001', item_type: 'Products', price: '10.99' },
		},
		expected: {
			price_list_item: { code: 'A001', item_type: 'Products', price: '10.99' },
		},
	},
	{
		name: 'priceListItems.create',
		handler: CatalogEndpoints.priceListItems.create,
		input: {
			price_list_item: {
				code: 'A001',
				quantity: '1.0',
				item_type: 'Products',
				description: 'Apple',
				price: '1.99',
				vat_status: 'standard',
			},
		},
		method: 'POST',
		pathAndQuery: '/v2/price_list_items',
		body: {
			price_list_item: {
				code: 'A001',
				quantity: '1.0',
				item_type: 'Products',
				description: 'Apple',
				price: '1.99',
				vat_status: 'standard',
			},
		},
		response: {
			price_list_item: {
				code: 'A001',
				item_type: 'Products',
				quantity: '1.0',
				description: 'Apple',
				price: '1.99',
			},
		},
		expected: {
			price_list_item: {
				code: 'A001',
				item_type: 'Products',
				quantity: '1.0',
				description: 'Apple',
				price: '1.99',
			},
		},
	},
	{
		name: 'priceListItems.update',
		handler: CatalogEndpoints.priceListItems.update,
		input: {
			id: '1',
			price_list_item: { description: 'Green apple', price: '2.50' },
		},
		method: 'PUT',
		pathAndQuery: '/v2/price_list_items/1',
		body: { price_list_item: { description: 'Green apple', price: '2.50' } },
		response: null,
		expected: undefined,
	},
	{
		name: 'priceListItems.delete',
		handler: CatalogEndpoints.priceListItems.delete,
		input: { id: '1' },
		method: 'DELETE',
		pathAndQuery: '/v2/price_list_item/1',
		body: undefined,
		response: null,
		expected: undefined,
	},
	{
		name: 'salesTaxPeriods.list',
		handler: CatalogEndpoints.salesTaxPeriods.list,
		input: { query: { page: 2 } },
		method: 'GET',
		pathAndQuery: '/v2/sales_tax_periods?page=2',
		body: undefined,
		response: { sales_tax_periods: [] },
		expected: { sales_tax_periods: [], pagination },
	},
	{
		name: 'salesTaxPeriods.get',
		handler: CatalogEndpoints.salesTaxPeriods.get,
		input: { id: '1' },
		method: 'GET',
		pathAndQuery: '/v2/sales_tax_periods/1',
		body: undefined,
		response: {
			sales_tax_period: {
				sales_tax_name: 'Local tax',
				sales_tax_registration_status: 'Registered',
				sales_tax_rate_1: '2.0',
				sales_tax_is_value_added: true,
				effective_date: '2026-01-01',
			},
		},
		expected: {
			sales_tax_period: {
				sales_tax_name: 'Local tax',
				sales_tax_registration_status: 'Registered',
				sales_tax_rate_1: '2.0',
				sales_tax_is_value_added: true,
				effective_date: '2026-01-01',
			},
		},
	},
	{
		name: 'salesTaxPeriods.create',
		handler: CatalogEndpoints.salesTaxPeriods.create,
		input: {
			sales_tax_period: {
				sales_tax_name: 'Local tax',
				sales_tax_registration_status: 'Registered',
				sales_tax_rate_1: '2.0',
				sales_tax_is_value_added: true,
				effective_date: '2026-01-01',
			},
		},
		method: 'POST',
		pathAndQuery: '/v2/sales_tax_periods',
		body: {
			sales_tax_period: {
				sales_tax_name: 'Local tax',
				sales_tax_registration_status: 'Registered',
				sales_tax_rate_1: '2.0',
				sales_tax_is_value_added: true,
				effective_date: '2026-01-01',
			},
		},
		response: {
			sales_tax_period: {
				sales_tax_name: 'Local tax',
				sales_tax_registration_status: 'Registered',
				sales_tax_rate_1: '2.0',
				sales_tax_is_value_added: true,
				effective_date: '2026-01-01',
			},
		},
		expected: {
			sales_tax_period: {
				sales_tax_name: 'Local tax',
				sales_tax_registration_status: 'Registered',
				sales_tax_rate_1: '2.0',
				sales_tax_is_value_added: true,
				effective_date: '2026-01-01',
			},
		},
	},
	{
		name: 'salesTaxPeriods.update',
		handler: CatalogEndpoints.salesTaxPeriods.update,
		input: { id: '1', sales_tax_period: { sales_tax_rate_1: '3.0' } },
		method: 'PUT',
		pathAndQuery: '/v2/sales_tax_periods/1',
		body: { sales_tax_period: { sales_tax_rate_1: '3.0' } },
		response: null,
		expected: undefined,
	},
	{
		name: 'salesTaxPeriods.delete',
		handler: CatalogEndpoints.salesTaxPeriods.delete,
		input: { id: '1' },
		method: 'DELETE',
		pathAndQuery: '/v2/sales_tax_periods/1',
		body: undefined,
		response: null,
		expected: undefined,
	},
	{
		name: 'salesTax.rates',
		handler: CatalogEndpoints.salesTax.rates,
		input: { query: { country: 'Austria', date: '2026-01-01' } },
		method: 'GET',
		pathAndQuery: '/v2/ec_moss/sales_tax_rates?country=Austria&date=2026-01-01',
		body: undefined,
		response: { sales_tax_rates: [{ percentage: '20.0', band: 'Standard' }] },
		expected: { sales_tax_rates: [{ percentage: '20.0', band: 'Standard' }] },
	},
	{
		name: 'corporationTaxReturns.list',
		handler: TaxReturnEndpoints.corporationTaxReturns.list,
		input: { query: { page: 1 } },
		method: 'GET',
		pathAndQuery: '/v2/corporation_tax_returns?page=1',
		body: undefined,
		response: { corporation_tax_returns: [] },
		expected: { corporation_tax_returns: [], pagination },
	},
	{
		name: 'corporationTaxReturns.get',
		handler: TaxReturnEndpoints.corporationTaxReturns.get,
		input: { period_ends_on: '2024-12-31' },
		method: 'GET',
		pathAndQuery: '/v2/corporation_tax_returns/2024-12-31',
		body: undefined,
		response: {
			corporation_tax_return: {
				period_ends_on: '2024-12-31',
				filing_status: 'draft',
			},
		},
		expected: {
			corporation_tax_return: {
				period_ends_on: '2024-12-31',
				filing_status: 'draft',
			},
		},
	},
	{
		name: 'corporationTaxReturns.markAsFiled',
		handler: TaxReturnEndpoints.corporationTaxReturns.markAsFiled,
		input: { period_ends_on: '2024-12-31' },
		method: 'PUT',
		pathAndQuery: '/v2/corporation_tax_returns/2024-12-31/mark_as_filed',
		body: undefined,
		response: {
			corporation_tax_return: {
				period_ends_on: '2024-12-31',
				filing_status: 'marked_as_filed',
			},
		},
		expected: {
			corporation_tax_return: {
				period_ends_on: '2024-12-31',
				filing_status: 'marked_as_filed',
			},
		},
	},
	{
		name: 'corporationTaxReturns.markAsUnfiled',
		handler: TaxReturnEndpoints.corporationTaxReturns.markAsUnfiled,
		input: { period_ends_on: '2024-12-31' },
		method: 'PUT',
		pathAndQuery: '/v2/corporation_tax_returns/2024-12-31/mark_as_unfiled',
		body: undefined,
		response: {
			corporation_tax_return: {
				period_ends_on: '2024-12-31',
				filing_status: 'unfiled',
			},
		},
		expected: {
			corporation_tax_return: {
				period_ends_on: '2024-12-31',
				filing_status: 'unfiled',
			},
		},
	},
	{
		name: 'corporationTaxReturns.markAsPaid',
		handler: TaxReturnEndpoints.corporationTaxReturns.markAsPaid,
		input: { period_ends_on: '2024-12-31' },
		method: 'PUT',
		pathAndQuery: '/v2/corporation_tax_returns/2024-12-31/mark_as_paid',
		body: undefined,
		response: {
			corporation_tax_return: {
				period_ends_on: '2024-12-31',
				payment_status: 'marked_as_paid',
			},
		},
		expected: {
			corporation_tax_return: {
				period_ends_on: '2024-12-31',
				payment_status: 'marked_as_paid',
			},
		},
	},
	{
		name: 'corporationTaxReturns.markAsUnpaid',
		handler: TaxReturnEndpoints.corporationTaxReturns.markAsUnpaid,
		input: { period_ends_on: '2024-12-31' },
		method: 'PUT',
		pathAndQuery: '/v2/corporation_tax_returns/2024-12-31/mark_as_unpaid',
		body: undefined,
		response: {
			corporation_tax_return: {
				period_ends_on: '2024-12-31',
				payment_status: 'unpaid',
			},
		},
		expected: {
			corporation_tax_return: {
				period_ends_on: '2024-12-31',
				payment_status: 'unpaid',
			},
		},
	},
	{
		name: 'finalAccountsReports.list',
		handler: TaxReturnEndpoints.finalAccountsReports.list,
		input: { query: { per_page: 50 } },
		method: 'GET',
		pathAndQuery: '/v2/final_accounts_reports?per_page=50',
		body: undefined,
		response: { final_accounts_reports: [] },
		expected: { final_accounts_reports: [], pagination },
	},
	{
		name: 'finalAccountsReports.get',
		handler: TaxReturnEndpoints.finalAccountsReports.get,
		input: { period_ends_on: '2024-12-31' },
		method: 'GET',
		pathAndQuery: '/v2/final_accounts_reports/2024-12-31',
		body: undefined,
		response: {
			final_accounts_report: {
				period_ends_on: '2024-12-31',
				filing_status: 'draft',
			},
		},
		expected: {
			final_accounts_report: {
				period_ends_on: '2024-12-31',
				filing_status: 'draft',
			},
		},
	},
	{
		name: 'finalAccountsReports.markAsFiled',
		handler: TaxReturnEndpoints.finalAccountsReports.markAsFiled,
		input: { period_ends_on: '2024-12-31' },
		method: 'PUT',
		pathAndQuery: '/v2/final_accounts_reports/2024-12-31/mark_as_filed',
		body: undefined,
		response: {
			final_accounts_report: {
				period_ends_on: '2024-12-31',
				filing_status: 'marked_as_filed',
			},
		},
		expected: {
			final_accounts_report: {
				period_ends_on: '2024-12-31',
				filing_status: 'marked_as_filed',
			},
		},
	},
	{
		name: 'finalAccountsReports.markAsUnfiled',
		handler: TaxReturnEndpoints.finalAccountsReports.markAsUnfiled,
		input: { period_ends_on: '2024-12-31' },
		method: 'PUT',
		pathAndQuery: '/v2/final_accounts_reports/2024-12-31/mark_as_unfiled',
		body: undefined,
		response: {
			final_accounts_report: {
				period_ends_on: '2024-12-31',
				filing_status: 'unfiled',
			},
		},
		expected: {
			final_accounts_report: {
				period_ends_on: '2024-12-31',
				filing_status: 'unfiled',
			},
		},
	},
	{
		name: 'incomeTaxReturns.list',
		handler: TaxReturnEndpoints.incomeTaxReturns.list,
		input: { user_id: '119', query: { page: 1 } },
		method: 'GET',
		pathAndQuery: '/v2/users/119/self_assessment_returns?page=1',
		body: undefined,
		response: { self_assessment_returns: [] },
		expected: { self_assessment_returns: [], pagination },
	},
	{
		name: 'incomeTaxReturns.get',
		handler: TaxReturnEndpoints.incomeTaxReturns.get,
		input: { user_id: '119', period_ends_on: '2024-04-05' },
		method: 'GET',
		pathAndQuery: '/v2/users/119/self_assessment_returns/2024-04-05',
		body: undefined,
		response: {
			self_assessment_return: {
				period_ends_on: '2024-04-05',
				payments: [
					{
						label: 'Balancing Payment',
						due_on: '2025-01-31',
						amount_due: '-10.0',
					},
				],
			},
		},
		expected: {
			self_assessment_return: {
				period_ends_on: '2024-04-05',
				payments: [
					{
						label: 'Balancing Payment',
						due_on: '2025-01-31',
						amount_due: '-10.0',
					},
				],
			},
		},
	},
	{
		name: 'incomeTaxReturns.markAsFiled',
		handler: TaxReturnEndpoints.incomeTaxReturns.markAsFiled,
		input: { user_id: '119', period_ends_on: '2024-04-05' },
		method: 'PUT',
		pathAndQuery:
			'/v2/users/119/self_assessment_returns/2024-04-05/mark_as_filed',
		body: undefined,
		response: {
			self_assessment_return: {
				period_ends_on: '2024-04-05',
				filing_status: 'marked_as_filed',
			},
		},
		expected: {
			self_assessment_return: {
				period_ends_on: '2024-04-05',
				filing_status: 'marked_as_filed',
			},
		},
	},
	{
		name: 'incomeTaxReturns.markAsUnfiled',
		handler: TaxReturnEndpoints.incomeTaxReturns.markAsUnfiled,
		input: { user_id: '119', period_ends_on: '2024-04-05' },
		method: 'PUT',
		pathAndQuery:
			'/v2/users/119/self_assessment_returns/2024-04-05/mark_as_unfiled',
		body: undefined,
		response: {
			self_assessment_return: {
				period_ends_on: '2024-04-05',
				filing_status: 'unfiled',
			},
		},
		expected: {
			self_assessment_return: {
				period_ends_on: '2024-04-05',
				filing_status: 'unfiled',
			},
		},
	},
	{
		name: 'incomeTaxReturns.markPaymentAsPaid',
		handler: TaxReturnEndpoints.incomeTaxReturns.markPaymentAsPaid,
		input: {
			user_id: '119',
			period_ends_on: '2024-04-05',
			payment_date: '2025-01-31',
		},
		method: 'PUT',
		pathAndQuery:
			'/v2/users/119/self_assessment_returns/2024-04-05/payments/2025-01-31/mark_as_paid',
		body: undefined,
		response: {
			self_assessment_return: {
				period_ends_on: '2024-04-05',
				payments: [
					{
						label: 'Balancing Payment',
						due_on: '2025-01-31',
						amount_due: '10.0',
						status: 'marked_as_paid',
					},
				],
			},
		},
		expected: {
			self_assessment_return: {
				period_ends_on: '2024-04-05',
				payments: [
					{
						label: 'Balancing Payment',
						due_on: '2025-01-31',
						amount_due: '10.0',
						status: 'marked_as_paid',
					},
				],
			},
		},
	},
	{
		name: 'incomeTaxReturns.markPaymentAsUnpaid',
		handler: TaxReturnEndpoints.incomeTaxReturns.markPaymentAsUnpaid,
		input: {
			user_id: '119',
			period_ends_on: '2024-04-05',
			payment_date: '2025-01-31',
		},
		method: 'PUT',
		pathAndQuery:
			'/v2/users/119/self_assessment_returns/2024-04-05/payments/2025-01-31/mark_as_unpaid',
		body: undefined,
		response: {
			self_assessment_return: {
				period_ends_on: '2024-04-05',
				payments: [
					{
						label: 'Balancing Payment',
						due_on: '2025-01-31',
						amount_due: '10.0',
						status: 'unpaid',
					},
				],
			},
		},
		expected: {
			self_assessment_return: {
				period_ends_on: '2024-04-05',
				payments: [
					{
						label: 'Balancing Payment',
						due_on: '2025-01-31',
						amount_due: '10.0',
						status: 'unpaid',
					},
				],
			},
		},
	},
	{
		name: 'vatReturns.list',
		handler: TaxReturnEndpoints.vatReturns.list,
		input: { query: { page: 1 } },
		method: 'GET',
		pathAndQuery: '/v2/vat_returns?page=1',
		body: undefined,
		response: { vat_returns: [] },
		expected: { vat_returns: [], pagination },
	},
	{
		name: 'vatReturns.get',
		handler: TaxReturnEndpoints.vatReturns.get,
		input: { period_ends_on: '2024-07-31' },
		method: 'GET',
		pathAndQuery: '/v2/vat_returns/2024-07-31',
		body: undefined,
		response: {
			vat_return: {
				period_ends_on: '2024-07-31',
				payments: [
					{ label: 'Payment Due', due_on: '2024-09-07', amount_due: '50.0' },
				],
				breakdown: {
					title: 'VAT',
					rows: [
						{
							title: 'VAT due',
							value: '50.0',
							key: 'totalVatDue',
							box_number: 3,
						},
					],
				},
			},
		},
		expected: {
			vat_return: {
				period_ends_on: '2024-07-31',
				payments: [
					{ label: 'Payment Due', due_on: '2024-09-07', amount_due: '50.0' },
				],
				breakdown: {
					title: 'VAT',
					rows: [
						{
							title: 'VAT due',
							value: '50.0',
							key: 'totalVatDue',
							box_number: 3,
						},
					],
				},
			},
		},
	},
	{
		name: 'vatReturns.markAsFiled',
		handler: TaxReturnEndpoints.vatReturns.markAsFiled,
		input: { period_ends_on: '2024-07-31' },
		method: 'PUT',
		pathAndQuery: '/v2/vat_returns/2024-07-31/mark_as_filed',
		body: undefined,
		response: {
			vat_return: {
				period_ends_on: '2024-07-31',
				filing_status: 'marked_as_filed',
			},
		},
		expected: {
			vat_return: {
				period_ends_on: '2024-07-31',
				filing_status: 'marked_as_filed',
			},
		},
	},
	{
		name: 'vatReturns.markAsUnfiled',
		handler: TaxReturnEndpoints.vatReturns.markAsUnfiled,
		input: { period_ends_on: '2024-07-31' },
		method: 'PUT',
		pathAndQuery: '/v2/vat_returns/2024-07-31/mark_as_unfiled',
		body: undefined,
		response: {
			vat_return: { period_ends_on: '2024-07-31', filing_status: 'unfiled' },
		},
		expected: {
			vat_return: { period_ends_on: '2024-07-31', filing_status: 'unfiled' },
		},
	},
	{
		name: 'vatReturns.markPaymentAsPaid',
		handler: TaxReturnEndpoints.vatReturns.markPaymentAsPaid,
		input: { period_ends_on: '2024-07-31', payment_date: '2024-09-07' },
		method: 'PUT',
		pathAndQuery: '/v2/vat_returns/2024-07-31/payments/2024-09-07/mark_as_paid',
		body: undefined,
		response: {
			vat_return: {
				period_ends_on: '2024-07-31',
				payments: [
					{
						label: 'Payment Due',
						due_on: '2024-09-07',
						amount_due: '50.0',
						status: 'marked_as_paid',
					},
				],
			},
		},
		expected: {
			vat_return: {
				period_ends_on: '2024-07-31',
				payments: [
					{
						label: 'Payment Due',
						due_on: '2024-09-07',
						amount_due: '50.0',
						status: 'marked_as_paid',
					},
				],
			},
		},
	},
	{
		name: 'vatReturns.markPaymentAsUnpaid',
		handler: TaxReturnEndpoints.vatReturns.markPaymentAsUnpaid,
		input: { period_ends_on: '2024-07-31', payment_date: '2024-09-07' },
		method: 'PUT',
		pathAndQuery:
			'/v2/vat_returns/2024-07-31/payments/2024-09-07/mark_as_unpaid',
		body: undefined,
		response: {
			vat_return: {
				period_ends_on: '2024-07-31',
				payments: [
					{
						label: 'Payment Due',
						due_on: '2024-09-07',
						amount_due: '50.0',
						status: 'unpaid',
					},
				],
			},
		},
		expected: {
			vat_return: {
				period_ends_on: '2024-07-31',
				payments: [
					{
						label: 'Payment Due',
						due_on: '2024-09-07',
						amount_due: '50.0',
						status: 'unpaid',
					},
				],
			},
		},
	},
	{
		name: 'bills.list',
		handler: ExpensesBillsEndpoints.bills.list,
		input: { query: { page: 1, view: 'open', nested_bill_items: true } },
		method: 'GET',
		pathAndQuery: '/v2/bills?page=1&view=open&nested_bill_items=true',
		body: undefined,
		response: { bills: [] },
		expected: { bills: [], pagination },
	},
	{
		name: 'bills.get',
		handler: ExpensesBillsEndpoints.bills.get,
		input: { id: '1' },
		method: 'GET',
		pathAndQuery: '/v2/bills/1',
		body: undefined,
		response: {
			bill: {
				contact: 'https://api.freeagent.com/v2/contacts/1',
				reference: 'REF100',
				dated_on: '2026-10-01',
				due_on: '2026-10-31',
				bill_items: [],
			},
		},
		expected: {
			bill: {
				contact: 'https://api.freeagent.com/v2/contacts/1',
				reference: 'REF100',
				dated_on: '2026-10-01',
				due_on: '2026-10-31',
				bill_items: [],
			},
		},
	},
	{
		name: 'bills.create',
		handler: ExpensesBillsEndpoints.bills.create,
		input: {
			bill: {
				contact: 'https://api.freeagent.com/v2/contacts/1',
				reference: 'REF100',
				dated_on: '2026-10-01',
				due_on: '2026-10-31',
				bill_items: [
					{
						category: 'https://api.freeagent.com/v2/categories/285',
						total_value: '100.0',
						description: 'Travel',
					},
				],
			},
		},
		method: 'POST',
		pathAndQuery: '/v2/bills',
		body: {
			bill: {
				contact: 'https://api.freeagent.com/v2/contacts/1',
				reference: 'REF100',
				dated_on: '2026-10-01',
				due_on: '2026-10-31',
				bill_items: [
					{
						category: 'https://api.freeagent.com/v2/categories/285',
						total_value: '100.0',
						description: 'Travel',
					},
				],
			},
		},
		response: { bill: { reference: 'REF100', status: 'Open' } },
		expected: { bill: { reference: 'REF100', status: 'Open' } },
	},
	{
		name: 'bills.update',
		handler: ExpensesBillsEndpoints.bills.update,
		input: {
			id: '1',
			bill: {
				bill_items: [
					{ url: 'https://api.freeagent.com/v2/bill_items/7', _destroy: 1 },
				],
			},
		},
		method: 'PUT',
		pathAndQuery: '/v2/bills/1',
		body: {
			bill: {
				bill_items: [
					{ url: 'https://api.freeagent.com/v2/bill_items/7', _destroy: 1 },
				],
			},
		},
		response: null,
		expected: undefined,
	},
	{
		name: 'bills.delete',
		handler: ExpensesBillsEndpoints.bills.delete,
		input: { id: '1' },
		method: 'DELETE',
		pathAndQuery: '/v2/bills/1',
		body: undefined,
		response: null,
		expected: undefined,
	},
	{
		name: 'expenses.list',
		handler: ExpensesBillsEndpoints.expenses.list,
		input: { query: { page: 2, view: 'recent' } },
		method: 'GET',
		pathAndQuery: '/v2/expenses?page=2&view=recent',
		body: undefined,
		response: { expenses: [] },
		expected: { expenses: [], pagination },
	},
	{
		name: 'expenses.get',
		handler: ExpensesBillsEndpoints.expenses.get,
		input: { id: '1' },
		method: 'GET',
		pathAndQuery: '/v2/expenses/1',
		body: undefined,
		response: {
			expense: {
				user: 'https://api.freeagent.com/v2/users/1',
				category: 'https://api.freeagent.com/v2/categories/285',
				dated_on: '2026-10-01',
				description: 'Travel',
				gross_value: '-20.0',
			},
		},
		expected: {
			expense: {
				user: 'https://api.freeagent.com/v2/users/1',
				category: 'https://api.freeagent.com/v2/categories/285',
				dated_on: '2026-10-01',
				description: 'Travel',
				gross_value: '-20.0',
			},
		},
	},
	{
		name: 'expenses.create',
		handler: ExpensesBillsEndpoints.expenses.create,
		input: {
			expense: {
				user: 'https://api.freeagent.com/v2/users/1',
				category: 'https://api.freeagent.com/v2/categories/285',
				dated_on: '2026-10-01',
				description: 'Travel',
				gross_value: '-20.0',
			},
		},
		method: 'POST',
		pathAndQuery: '/v2/expenses',
		body: {
			expense: {
				user: 'https://api.freeagent.com/v2/users/1',
				category: 'https://api.freeagent.com/v2/categories/285',
				dated_on: '2026-10-01',
				description: 'Travel',
				gross_value: '-20.0',
			},
		},
		response: { expense: { description: 'Travel', gross_value: '-20.0' } },
		expected: { expense: { description: 'Travel', gross_value: '-20.0' } },
	},
	{
		name: 'expenses.batchCreate',
		handler: ExpensesBillsEndpoints.expenses.batchCreate,
		input: {
			expenses: [
				{
					user: 'https://api.freeagent.com/v2/users/1',
					category: 'https://api.freeagent.com/v2/categories/285',
					dated_on: '2026-10-01',
					description: 'First',
					gross_value: '10.0',
				},
				{
					user: 'https://api.freeagent.com/v2/users/1',
					category: 'https://api.freeagent.com/v2/categories/285',
					dated_on: '2026-10-01',
					description: 'Second',
					gross_value: '20.0',
				},
			],
		},
		method: 'POST',
		pathAndQuery: '/v2/expenses',
		body: {
			expenses: [
				{
					user: 'https://api.freeagent.com/v2/users/1',
					category: 'https://api.freeagent.com/v2/categories/285',
					dated_on: '2026-10-01',
					description: 'First',
					gross_value: '10.0',
				},
				{
					user: 'https://api.freeagent.com/v2/users/1',
					category: 'https://api.freeagent.com/v2/categories/285',
					dated_on: '2026-10-01',
					description: 'Second',
					gross_value: '20.0',
				},
			],
		},
		response: {
			expenses: [
				{ description: 'First', gross_value: '10.0' },
				{ description: 'Second', gross_value: '20.0' },
			],
		},
		expected: {
			expenses: [
				{ description: 'First', gross_value: '10.0' },
				{ description: 'Second', gross_value: '20.0' },
			],
		},
	},
	{
		name: 'expenses.update',
		handler: ExpensesBillsEndpoints.expenses.update,
		input: { id: '1', expense: { description: 'Updated travel' } },
		method: 'PUT',
		pathAndQuery: '/v2/expenses/1',
		body: { expense: { description: 'Updated travel' } },
		response: null,
		expected: undefined,
	},
	{
		name: 'expenses.delete',
		handler: ExpensesBillsEndpoints.expenses.delete,
		input: { id: '1' },
		method: 'DELETE',
		pathAndQuery: '/v2/expenses/1',
		body: undefined,
		response: null,
		expected: undefined,
	},
	{
		name: 'expenses.mileageSettings',
		handler: ExpensesBillsEndpoints.expenses.mileageSettings,
		input: {},
		method: 'GET',
		pathAndQuery: '/v2/expenses/mileage_settings',
		body: undefined,
		response: {
			mileage_settings: { engine_type_and_size_options: [], mileage_rates: [] },
		},
		expected: {
			mileage_settings: { engine_type_and_size_options: [], mileage_rates: [] },
		},
	},
	{
		name: 'creditNotes.list',
		handler: CreditNoteEndpoints.creditNotes.list,
		input: { query: { page: 1, view: 'open', nested_credit_note_items: true } },
		method: 'GET',
		pathAndQuery:
			'/v2/credit_notes?page=1&view=open&nested_credit_note_items=true',
		body: undefined,
		response: { credit_notes: [] },
		expected: { credit_notes: [], pagination },
	},
	{
		name: 'creditNotes.get',
		handler: CreditNoteEndpoints.creditNotes.get,
		input: { id: '1' },
		method: 'GET',
		pathAndQuery: '/v2/credit_notes/1',
		body: undefined,
		response: {
			credit_note: {
				contact: 'https://api.freeagent.com/v2/contacts/1',
				status: 'Open',
				credit_note_items: [],
			},
		},
		expected: {
			credit_note: {
				contact: 'https://api.freeagent.com/v2/contacts/1',
				status: 'Open',
				credit_note_items: [],
			},
		},
	},
	{
		name: 'creditNotes.pdf',
		handler: CreditNoteEndpoints.creditNotes.pdf,
		input: { id: '1' },
		method: 'GET',
		pathAndQuery: '/v2/credit_notes/1/pdf',
		body: undefined,
		response: { pdf: { content: 'JVBERi0xLjQ=' } },
		expected: { pdf: { content: 'JVBERi0xLjQ=' } },
	},
	{
		name: 'creditNotes.create',
		handler: CreditNoteEndpoints.creditNotes.create,
		input: {
			credit_note: {
				contact: 'https://api.freeagent.com/v2/contacts/1',
				dated_on: '2026-10-01',
				payment_terms_in_days: 30,
				credit_note_items: [
					{ description: 'Refund', price: '-10.0', quantity: '1.0' },
				],
			},
		},
		method: 'POST',
		pathAndQuery: '/v2/credit_notes',
		body: {
			credit_note: {
				contact: 'https://api.freeagent.com/v2/contacts/1',
				dated_on: '2026-10-01',
				payment_terms_in_days: 30,
				credit_note_items: [
					{ description: 'Refund', price: '-10.0', quantity: '1.0' },
				],
			},
		},
		response: { credit_note: { status: 'Draft', total_value: '-10.0' } },
		expected: { credit_note: { status: 'Draft', total_value: '-10.0' } },
	},
	{
		name: 'creditNotes.update',
		handler: CreditNoteEndpoints.creditNotes.update,
		input: {
			id: '1',
			credit_note: {
				credit_note_items: [
					{ id: 2, description: 'Updated refund' },
					{ id: 3, _destroy: 1 },
				],
			},
		},
		method: 'PUT',
		pathAndQuery: '/v2/credit_notes/1',
		body: {
			credit_note: {
				credit_note_items: [
					{ id: 2, description: 'Updated refund' },
					{ id: 3, _destroy: 1 },
				],
			},
		},
		response: null,
		expected: undefined,
	},
	{
		name: 'creditNotes.delete',
		handler: CreditNoteEndpoints.creditNotes.delete,
		input: { id: '1' },
		method: 'DELETE',
		pathAndQuery: '/v2/credit_notes/1',
		body: undefined,
		response: null,
		expected: undefined,
	},
	{
		name: 'creditNotes.sendEmail',
		handler: CreditNoteEndpoints.creditNotes.sendEmail,
		input: { id: '1', email: { use_template: true, email_to_sender: false } },
		method: 'POST',
		pathAndQuery: '/v2/credit_notes/1/send_email',
		body: {
			credit_note: { email: { use_template: true, email_to_sender: false } },
		},
		response: null,
		expected: undefined,
	},
	{
		name: 'creditNotes.markSent',
		handler: CreditNoteEndpoints.creditNotes.markSent,
		input: { id: '1' },
		method: 'PUT',
		pathAndQuery: '/v2/credit_notes/1/transitions/mark_as_sent',
		body: undefined,
		response: null,
		expected: undefined,
	},
	{
		name: 'creditNotes.markDraft',
		handler: CreditNoteEndpoints.creditNotes.markDraft,
		input: { id: '1' },
		method: 'PUT',
		pathAndQuery: '/v2/credit_notes/1/transitions/mark_as_draft',
		body: undefined,
		response: null,
		expected: undefined,
	},
	{
		name: 'creditNoteReconciliations.list',
		handler: CreditNoteEndpoints.creditNoteReconciliations.list,
		input: { query: { page: 1, from_date: '2026-01-01' } },
		method: 'GET',
		pathAndQuery: '/v2/credit_note_reconciliations?page=1&from_date=2026-01-01',
		body: undefined,
		response: { credit_note_reconciliations: [] },
		expected: { credit_note_reconciliations: [], pagination },
	},
	{
		name: 'creditNoteReconciliations.get',
		handler: CreditNoteEndpoints.creditNoteReconciliations.get,
		input: { id: '1' },
		method: 'GET',
		pathAndQuery: '/v2/credit_note_reconciliations/1',
		body: undefined,
		response: {
			credit_note_reconciliations: {
				invoice: 'https://api.freeagent.com/v2/invoices/1',
				credit_note: 'https://api.freeagent.com/v2/credit_notes/1',
				gross_value: '10.0',
			},
		},
		expected: {
			credit_note_reconciliations: {
				invoice: 'https://api.freeagent.com/v2/invoices/1',
				credit_note: 'https://api.freeagent.com/v2/credit_notes/1',
				gross_value: '10.0',
			},
		},
	},
	{
		name: 'creditNoteReconciliations.create',
		handler: CreditNoteEndpoints.creditNoteReconciliations.create,
		input: {
			credit_note_reconciliation: {
				gross_value: '10.0',
				invoice: 'https://api.freeagent.com/v2/invoices/1',
				credit_note: 'https://api.freeagent.com/v2/credit_notes/1',
			},
		},
		method: 'POST',
		pathAndQuery: '/v2/credit_note_reconciliations',
		body: {
			credit_note_reconciliation: {
				gross_value: '10.0',
				invoice: 'https://api.freeagent.com/v2/invoices/1',
				credit_note: 'https://api.freeagent.com/v2/credit_notes/1',
			},
		},
		response: { credit_note_reconciliation: { gross_value: '10.0' } },
		expected: { credit_note_reconciliation: { gross_value: '10.0' } },
	},
	{
		name: 'creditNoteReconciliations.update',
		handler: CreditNoteEndpoints.creditNoteReconciliations.update,
		input: { id: '1', credit_note_reconciliation: { gross_value: '5.0' } },
		method: 'PUT',
		pathAndQuery: '/v2/credit_note_reconciliations/1',
		body: { credit_note_reconciliation: { gross_value: '5.0' } },
		response: null,
		expected: undefined,
	},
	{
		name: 'creditNoteReconciliations.delete',
		handler: CreditNoteEndpoints.creditNoteReconciliations.delete,
		input: { id: '1' },
		method: 'DELETE',
		pathAndQuery: '/v2/credit_note_reconciliations/1',
		body: undefined,
		response: null,
		expected: undefined,
	},
	{
		name: 'estimates.list',
		handler: EstimateEndpoints.estimates.list,
		input: { query: { page: 1, view: 'recent', nested_estimate_items: true } },
		method: 'GET',
		pathAndQuery: '/v2/estimates?page=1&view=recent&nested_estimate_items=true',
		body: undefined,
		response: { estimates: [] },
		expected: { estimates: [], pagination },
	},
	{
		name: 'estimates.get',
		handler: EstimateEndpoints.estimates.get,
		input: { id: '1' },
		method: 'GET',
		pathAndQuery: '/v2/estimates/1',
		body: undefined,
		response: {
			estimate: {
				estimate_type: 'Estimate',
				status: 'Draft',
				estimate_items: [],
			},
		},
		expected: {
			estimate: {
				estimate_type: 'Estimate',
				status: 'Draft',
				estimate_items: [],
			},
		},
	},
	{
		name: 'estimates.pdf',
		handler: EstimateEndpoints.estimates.pdf,
		input: { id: '1' },
		method: 'GET',
		pathAndQuery: '/v2/estimates/1/pdf',
		body: undefined,
		response: { pdf: { content: 'JVBERi0xLjQ=' } },
		expected: { pdf: { content: 'JVBERi0xLjQ=' } },
	},
	{
		name: 'estimates.create',
		handler: EstimateEndpoints.estimates.create,
		input: {
			estimate: {
				status: 'Draft',
				estimate_type: 'Estimate',
				contact: 'https://api.freeagent.com/v2/contacts/1',
				reference: 'E-001',
				dated_on: '2026-10-01',
				currency: 'GBP',
				estimate_items: [
					{
						item_type: 'Hours',
						quantity: '1.0',
						price: '50.0',
						description: 'Consulting',
					},
				],
			},
		},
		method: 'POST',
		pathAndQuery: '/v2/estimates',
		body: {
			estimate: {
				status: 'Draft',
				estimate_type: 'Estimate',
				contact: 'https://api.freeagent.com/v2/contacts/1',
				reference: 'E-001',
				dated_on: '2026-10-01',
				currency: 'GBP',
				estimate_items: [
					{
						item_type: 'Hours',
						quantity: '1.0',
						price: '50.0',
						description: 'Consulting',
					},
				],
			},
		},
		response: { estimate: { status: 'Draft', reference: 'E-001' } },
		expected: { estimate: { status: 'Draft', reference: 'E-001' } },
	},
	{
		name: 'estimates.update',
		handler: EstimateEndpoints.estimates.update,
		input: { id: '1', estimate: { notes: 'Updated terms' } },
		method: 'PUT',
		pathAndQuery: '/v2/estimates/1',
		body: { estimate: { notes: 'Updated terms' } },
		response: null,
		expected: undefined,
	},
	{
		name: 'estimates.createItem',
		handler: EstimateEndpoints.estimates.createItem,
		input: {
			estimate: 'https://api.freeagent.com/v2/estimates/1',
			estimate_item: {
				item_type: 'Hours',
				quantity: '1.0',
				price: '50.0',
				description: 'Consulting',
			},
		},
		method: 'POST',
		pathAndQuery: '/v2/estimate_items',
		body: {
			estimate: 'https://api.freeagent.com/v2/estimates/1',
			estimate_item: {
				item_type: 'Hours',
				quantity: '1.0',
				price: '50.0',
				description: 'Consulting',
			},
		},
		response: { estimate_item: { description: 'Consulting', quantity: '1.0' } },
		expected: { estimate_item: { description: 'Consulting', quantity: '1.0' } },
	},
	{
		name: 'estimates.updateItem',
		handler: EstimateEndpoints.estimates.updateItem,
		input: { id: '2', estimate_item: { description: 'Updated line' } },
		method: 'PUT',
		pathAndQuery: '/v2/estimate_items/2',
		body: { estimate_item: { description: 'Updated line' } },
		response: null,
		expected: undefined,
	},
	{
		name: 'estimates.duplicate',
		handler: EstimateEndpoints.estimates.duplicate,
		input: { id: '1' },
		method: 'POST',
		pathAndQuery: '/v2/estimates/1/duplicate',
		body: undefined,
		response: { estimate: { status: 'Draft', reference: 'E-002' } },
		expected: { estimate: { status: 'Draft', reference: 'E-002' } },
	},
	{
		name: 'estimates.deleteItem',
		handler: EstimateEndpoints.estimates.deleteItem,
		input: { id: '2' },
		method: 'DELETE',
		pathAndQuery: '/v2/estimate_items/2',
		body: undefined,
		response: null,
		expected: undefined,
	},
	{
		name: 'estimates.delete',
		handler: EstimateEndpoints.estimates.delete,
		input: { id: '1' },
		method: 'DELETE',
		pathAndQuery: '/v2/estimates/1',
		body: undefined,
		response: null,
		expected: undefined,
	},
	{
		name: 'estimates.sendEmail',
		handler: EstimateEndpoints.estimates.sendEmail,
		input: { id: '1', email: { use_template: true } },
		method: 'POST',
		pathAndQuery: '/v2/estimates/1/send_email',
		body: { estimate: { email: { use_template: true } } },
		response: null,
		expected: undefined,
	},
	{
		name: 'estimates.markSent',
		handler: EstimateEndpoints.estimates.markSent,
		input: { id: '1' },
		method: 'PUT',
		pathAndQuery: '/v2/estimates/1/transitions/mark_as_sent',
		body: undefined,
		response: null,
		expected: undefined,
	},
	{
		name: 'estimates.markDraft',
		handler: EstimateEndpoints.estimates.markDraft,
		input: { id: '1' },
		method: 'PUT',
		pathAndQuery: '/v2/estimates/1/transitions/mark_as_draft',
		body: undefined,
		response: null,
		expected: undefined,
	},
	{
		name: 'estimates.markApproved',
		handler: EstimateEndpoints.estimates.markApproved,
		input: { id: '1' },
		method: 'PUT',
		pathAndQuery: '/v2/estimates/1/transitions/mark_as_approved',
		body: undefined,
		response: null,
		expected: undefined,
	},
	{
		name: 'estimates.markRejected',
		handler: EstimateEndpoints.estimates.markRejected,
		input: { id: '1' },
		method: 'PUT',
		pathAndQuery: '/v2/estimates/1/transitions/mark_as_rejected',
		body: undefined,
		response: null,
		expected: undefined,
	},
	{
		name: 'estimates.convertToInvoice',
		handler: EstimateEndpoints.estimates.convertToInvoice,
		input: { id: '1' },
		method: 'PUT',
		pathAndQuery: '/v2/estimates/1/transitions/convert_to_invoice',
		body: undefined,
		response: {
			estimate: {
				status: 'Invoiced',
				invoice: 'https://api.freeagent.com/v2/invoices/1',
			},
		},
		expected: {
			estimate: {
				status: 'Invoiced',
				invoice: 'https://api.freeagent.com/v2/invoices/1',
			},
		},
	},
	{
		name: 'estimates.getDefaultAdditionalText',
		handler: EstimateEndpoints.estimates.getDefaultAdditionalText,
		input: {},
		method: 'GET',
		pathAndQuery: '/v2/estimates/default_additional_text',
		body: undefined,
		response: { default_additional_text: 'Respond within 21 days' },
		expected: { default_additional_text: 'Respond within 21 days' },
	},
	{
		name: 'estimates.updateDefaultAdditionalText',
		handler: EstimateEndpoints.estimates.updateDefaultAdditionalText,
		input: { default_additional_text: 'Respond within 7 days' },
		method: 'PUT',
		pathAndQuery: '/v2/estimates/default_additional_text',
		body: { default_additional_text: 'Respond within 7 days' },
		response: { default_additional_text: 'Respond within 7 days' },
		expected: { default_additional_text: 'Respond within 7 days' },
	},
	{
		name: 'estimates.deleteDefaultAdditionalText',
		handler: EstimateEndpoints.estimates.deleteDefaultAdditionalText,
		input: {},
		method: 'DELETE',
		pathAndQuery: '/v2/estimates/default_additional_text',
		body: undefined,
		response: null,
		expected: undefined,
	},
	{
		name: 'payroll.list',
		handler: TimeUserEndpoints.payroll.list,
		input: { year: '2026' },
		method: 'GET',
		pathAndQuery: '/v2/payroll/2026',
		body: undefined,
		response: { periods: [], payments: [] },
		expected: { periods: [], payments: [] },
	},
	{
		name: 'payroll.get',
		handler: TimeUserEndpoints.payroll.get,
		input: { year: '2026', period: 0 },
		method: 'GET',
		pathAndQuery: '/v2/payroll/2026/0',
		body: undefined,
		response: { period: { period: 0, status: 'filed', payslips: [] } },
		expected: { period: { period: 0, status: 'filed', payslips: [] } },
	},
	{
		name: 'payroll.markPaymentAsPaid',
		handler: TimeUserEndpoints.payroll.markPaymentAsPaid,
		input: { year: '2026', payment_date: '2026-05-22' },
		method: 'PUT',
		pathAndQuery: '/v2/payroll/2026/payments/2026-05-22/mark_as_paid',
		body: undefined,
		response: {
			periods: [],
			payments: [{ due_on: '2026-05-22', amount_due: '100.0', status: 'paid' }],
		},
		expected: {
			periods: [],
			payments: [{ due_on: '2026-05-22', amount_due: '100.0', status: 'paid' }],
		},
	},
	{
		name: 'payroll.markPaymentAsUnpaid',
		handler: TimeUserEndpoints.payroll.markPaymentAsUnpaid,
		input: { year: '2026', payment_date: '2026-05-22' },
		method: 'GET',
		pathAndQuery: '/v2/payroll/2026/payments/2026-05-22/mark_as_unpaid',
		body: undefined,
		response: {
			periods: [],
			payments: [
				{ due_on: '2026-05-22', amount_due: '100.0', status: 'unpaid' },
			],
		},
		expected: {
			periods: [],
			payments: [
				{ due_on: '2026-05-22', amount_due: '100.0', status: 'unpaid' },
			],
		},
	},
	{
		name: 'payrollProfiles.list',
		handler: TimeUserEndpoints.payrollProfiles.list,
		input: {
			year: '2026',
			query: { user: 'https://api.freeagent.com/v2/users/1' },
		},
		method: 'GET',
		pathAndQuery:
			'/v2/payroll_profiles/2026?user=https%3A%2F%2Fapi.freeagent.com%2Fv2%2Fusers%2F1',
		body: undefined,
		response: {
			profiles: [
				{
					user: 'https://api.freeagent.com/v2/users/1',
					date_of_birth: '1990-08-17',
					total_pay_in_previous_employment: '1000.0',
				},
			],
		},
		expected: {
			profiles: [
				{
					user: 'https://api.freeagent.com/v2/users/1',
					date_of_birth: '1990-08-17',
					total_pay_in_previous_employment: '1000.0',
				},
			],
		},
	},
	{
		name: 'users.list',
		handler: TimeUserEndpoints.users.list,
		input: { query: { page: 1, view: 'active_staff' } },
		method: 'GET',
		pathAndQuery: '/v2/users?page=1&view=active_staff',
		body: undefined,
		response: { users: [] },
		expected: { users: [], pagination },
	},
	{
		name: 'users.get',
		handler: TimeUserEndpoints.users.get,
		input: { id: '1' },
		method: 'GET',
		pathAndQuery: '/v2/users/1',
		body: undefined,
		response: {
			user: {
				first_name: 'Example',
				last_name: 'Person',
				email: 'person@example.test',
				role: 'Director',
			},
		},
		expected: {
			user: {
				first_name: 'Example',
				last_name: 'Person',
				email: 'person@example.test',
				role: 'Director',
			},
		},
	},
	{
		name: 'users.me',
		handler: TimeUserEndpoints.users.me,
		input: {},
		method: 'GET',
		pathAndQuery: '/v2/users/me',
		body: undefined,
		response: {
			user: {
				first_name: 'Example',
				last_name: 'Person',
				email: 'person@example.test',
				role: 'Director',
			},
		},
		expected: {
			user: {
				first_name: 'Example',
				last_name: 'Person',
				email: 'person@example.test',
				role: 'Director',
			},
		},
	},
	{
		name: 'users.create',
		handler: TimeUserEndpoints.users.create,
		input: {
			user: {
				email: 'new@example.test',
				first_name: 'New',
				last_name: 'User',
				role: 'Employee',
				opening_mileage: 0,
				send_invitation: false,
			},
		},
		method: 'POST',
		pathAndQuery: '/v2/users',
		body: {
			user: {
				email: 'new@example.test',
				first_name: 'New',
				last_name: 'User',
				role: 'Employee',
				opening_mileage: 0,
				send_invitation: false,
			},
		},
		response: {
			user: {
				email: 'new@example.test',
				first_name: 'New',
				last_name: 'User',
				role: 'Employee',
			},
		},
		expected: {
			user: {
				email: 'new@example.test',
				first_name: 'New',
				last_name: 'User',
				role: 'Employee',
			},
		},
	},
	{
		name: 'users.update',
		handler: TimeUserEndpoints.users.update,
		input: { id: '1', user: { permission_level: 3 } },
		method: 'PUT',
		pathAndQuery: '/v2/users/1',
		body: { user: { permission_level: 3 } },
		response: null,
		expected: undefined,
	},
	{
		name: 'users.updateMe',
		handler: TimeUserEndpoints.users.updateMe,
		input: { user: { first_name: 'Updated' } },
		method: 'PUT',
		pathAndQuery: '/v2/users/me',
		body: { user: { first_name: 'Updated' } },
		response: null,
		expected: undefined,
	},
	{
		name: 'users.delete',
		handler: TimeUserEndpoints.users.delete,
		input: { id: '2' },
		method: 'DELETE',
		pathAndQuery: '/v2/users/2',
		body: undefined,
		response: null,
		expected: undefined,
	},
	{
		name: 'tasks.list',
		handler: TimeUserEndpoints.tasks.list,
		input: {
			query: {
				page: 1,
				view: 'completed',
				project: 'https://api.freeagent.com/v2/projects/1',
			},
		},
		method: 'GET',
		pathAndQuery:
			'/v2/tasks?page=1&view=completed&project=https%3A%2F%2Fapi.freeagent.com%2Fv2%2Fprojects%2F1',
		body: undefined,
		response: { tasks: [] },
		expected: { tasks: [], pagination },
	},
	{
		name: 'tasks.get',
		handler: TimeUserEndpoints.tasks.get,
		input: { id: '1' },
		method: 'GET',
		pathAndQuery: '/v2/tasks/1',
		body: undefined,
		response: {
			task: { name: 'Development', status: 'Active', is_billable: true },
		},
		expected: {
			task: { name: 'Development', status: 'Active', is_billable: true },
		},
	},
	{
		name: 'tasks.create',
		handler: TimeUserEndpoints.tasks.create,
		input: {
			project: 'https://api.freeagent.com/v2/projects/1',
			task: { name: 'Development', status: 'Active', is_billable: true },
		},
		method: 'POST',
		pathAndQuery:
			'/v2/tasks?project=https%3A%2F%2Fapi.freeagent.com%2Fv2%2Fprojects%2F1',
		body: {
			task: { name: 'Development', status: 'Active', is_billable: true },
		},
		response: {
			task: { name: 'Development', status: 'Active', is_billable: true },
		},
		expected: {
			task: { name: 'Development', status: 'Active', is_billable: true },
		},
	},
	{
		name: 'tasks.update',
		handler: TimeUserEndpoints.tasks.update,
		input: { id: '1', task: { status: 'Completed' } },
		method: 'PUT',
		pathAndQuery: '/v2/tasks/1',
		body: { task: { status: 'Completed' } },
		response: null,
		expected: undefined,
	},
	{
		name: 'timeslips.list',
		handler: TimeUserEndpoints.timeslips.list,
		input: { query: { page: 1, nested: true, view: 'running' } },
		method: 'GET',
		pathAndQuery: '/v2/timeslips?page=1&view=running&nested=true',
		body: undefined,
		response: { timeslips: [] },
		expected: { timeslips: [], pagination },
	},
	{
		name: 'timeslips.get',
		handler: TimeUserEndpoints.timeslips.get,
		input: { id: '1' },
		method: 'GET',
		pathAndQuery: '/v2/timeslips/1',
		body: undefined,
		response: {
			timeslip: {
				task: 'https://api.freeagent.com/v2/tasks/1',
				hours: '1.5',
				dated_on: '2026-10-01',
			},
		},
		expected: {
			timeslip: {
				task: 'https://api.freeagent.com/v2/tasks/1',
				hours: '1.5',
				dated_on: '2026-10-01',
			},
		},
	},
	{
		name: 'timeslips.create',
		handler: TimeUserEndpoints.timeslips.create,
		input: {
			timeslip: {
				task: 'https://api.freeagent.com/v2/tasks/1',
				user: 'https://api.freeagent.com/v2/users/1',
				project: 'https://api.freeagent.com/v2/projects/1',
				dated_on: '2026-10-01',
				hours: '1.5',
				comment: 'Worked',
			},
		},
		method: 'POST',
		pathAndQuery: '/v2/timeslips',
		body: {
			timeslip: {
				task: 'https://api.freeagent.com/v2/tasks/1',
				user: 'https://api.freeagent.com/v2/users/1',
				project: 'https://api.freeagent.com/v2/projects/1',
				dated_on: '2026-10-01',
				hours: '1.5',
				comment: 'Worked',
			},
		},
		response: { timeslip: { hours: '1.5', comment: 'Worked' } },
		expected: { timeslip: { hours: '1.5', comment: 'Worked' } },
	},
	{
		name: 'timeslips.update',
		handler: TimeUserEndpoints.timeslips.update,
		input: { id: '1', timeslip: { comment: 'Updated' } },
		method: 'PUT',
		pathAndQuery: '/v2/timeslips/1',
		body: { timeslip: { comment: 'Updated' } },
		response: null,
		expected: undefined,
	},
	{
		name: 'timeslips.delete',
		handler: TimeUserEndpoints.timeslips.delete,
		input: { id: '1' },
		method: 'DELETE',
		pathAndQuery: '/v2/timeslips/1',
		body: undefined,
		response: null,
		expected: undefined,
	},
	{
		name: 'timeslips.startTimer',
		handler: TimeUserEndpoints.timeslips.startTimer,
		input: { id: '1' },
		method: 'POST',
		pathAndQuery: '/v2/timeslips/1/timer',
		body: undefined,
		response: {
			timeslip: {
				timer: { running: true, start_from: '2026-10-01T10:00:00Z' },
			},
		},
		expected: {
			timeslip: {
				timer: { running: true, start_from: '2026-10-01T10:00:00Z' },
			},
		},
	},
	{
		name: 'timeslips.stopTimer',
		handler: TimeUserEndpoints.timeslips.stopTimer,
		input: { id: '1' },
		method: 'DELETE',
		pathAndQuery: '/v2/timeslips/1/timer',
		body: undefined,
		response: { timeslip: { hours: '1.5' } },
		expected: { timeslip: { hours: '1.5' } },
	},
];

const endpoints = {
	test: async () => undefined,
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
				expect(headers.get('X-Api-Version')).toBe(testCase.apiVersion ?? null);
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
