import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { AccountKeyManagerFor } from 'corsair/core';
import { AccountingEndpointSchemas } from './endpoints/accounting';
import { AssetEndpointSchemas } from './endpoints/assets';
import { BankingEndpointSchemas } from './endpoints/banking';
import { CatalogEndpointSchemas } from './endpoints/catalog';
import { CreditNoteEndpointSchemas } from './endpoints/credit-notes';
import { EstimateEndpointSchemas } from './endpoints/estimates';
import { ExpensesBillsEndpointSchemas } from './endpoints/expenses-bills';
import { TaxReturnEndpointSchemas } from './endpoints/tax-returns';
import { TimeUserEndpointSchemas } from './endpoints/time-users';
import {
	FreeAgentEndpointInputSchemas,
	FreeAgentEndpointOutputSchemas,
} from './endpoints/types';
import { freeagent } from './index';
import { FreeAgentSchema } from './schema';

describe('FreeAgent schemas', () => {
	it('declares a semver schema with no persisted entities', () => {
		expect(FreeAgentSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(FreeAgentSchema.entities).toEqual({});
	});

	it('rejects undocumented top-level request fields on every operation', () => {
		for (const schema of Object.values(FreeAgentEndpointInputSchemas)) {
			expect(schema.safeParse({ unexpected: true }).success).toBe(false);
		}
		for (const { input } of [
			...Object.values(BankingEndpointSchemas),
			...Object.values(AccountingEndpointSchemas),
			...Object.values(AssetEndpointSchemas),
			...Object.values(CatalogEndpointSchemas),
			...Object.values(TaxReturnEndpointSchemas),
			...Object.values(ExpensesBillsEndpointSchemas),
			...Object.values(CreditNoteEndpointSchemas),
			...Object.values(EstimateEndpointSchemas),
			...Object.values(TimeUserEndpointSchemas),
		]) {
			expect(input.safeParse({ unexpected: true }).success).toBe(false);
		}
	});

	it('validates documented response envelopes', () => {
		expect(
			FreeAgentEndpointOutputSchemas.contactsList.safeParse({
				contacts: [],
				pagination: { link: null, total_count: '0' },
			}).success,
		).toBe(true);
		expect(
			FreeAgentEndpointOutputSchemas.contactsList.safeParse({
				contacts: 'not-an-array',
				pagination: { link: null, total_count: null },
			}).success,
		).toBe(false);
		expect(
			FreeAgentEndpointOutputSchemas.contactsList.safeParse({
				contacts: [],
				pagination: { link: null, total_count: 'not-a-count' },
			}).success,
		).toBe(false);
		expect(
			FreeAgentEndpointOutputSchemas.invoicesGet.safeParse({
				invoice: {
					status: 'Open',
					invoice_items: [
						{
							url: 'https://api.freeagent.com/v2/invoice_items/1',
							price: '125.50',
							quantity: '2.0',
							sales_tax_rate: '20.0',
						},
					],
				},
			}).success,
		).toBe(true);
		expect(
			FreeAgentEndpointOutputSchemas.invoicesGet.safeParse({ invoices: [] })
				.success,
		).toBe(false);
		expect(
			FreeAgentEndpointOutputSchemas.companyBusinessCategories.safeParse({
				business_categories: ['Accounting & Bookkeeping'],
			}).success,
		).toBe(true);
		expect(
			FreeAgentEndpointOutputSchemas.companyTaxTimeline.safeParse({
				timeline_items: [
					{
						description: 'VAT Return',
						nature: 'Payment Due',
						dated_on: '2025-03-31',
						amount_due: '100.00',
						is_personal: false,
					},
				],
			}).success,
		).toBe(true);
		expect(
			FreeAgentEndpointOutputSchemas.invoicesPdf.safeParse({
				pdf: { content: 'JVBERi0xLjQ=' },
			}).success,
		).toBe(true);
		expect(
			FreeAgentEndpointOutputSchemas.invoicesConvertToCreditNote.safeParse({
				credit_note: { status: 'Draft', total_value: '-120.00' },
			}).success,
		).toBe(true);
		expect(
			FreeAgentEndpointOutputSchemas.invoicesTimeline.safeParse({
				invoice_timeline_items: [
					{
						reference: '001',
						summary: 'Invoice paid',
						description: 'Payment received',
						dated_on: '2025-03-31',
						amount: '10.00',
					},
				],
			}).success,
		).toBe(true);
		expect(
			FreeAgentEndpointOutputSchemas.invoicesDirectDebit.safeParse(undefined)
				.success,
		).toBe(true);
		expect(
			FreeAgentEndpointOutputSchemas.contactsDelete.safeParse(undefined)
				.success,
		).toBe(true);
		expect(
			FreeAgentEndpointOutputSchemas.emailAddressesList.safeParse({
				email_addresses: ['Example Sender <sender@example.test>'],
				pagination: { link: null, total_count: '1' },
			}).success,
		).toBe(true);
		expect(
			FreeAgentEndpointOutputSchemas.trackingGroupsGet.safeParse({
				tracking_group: {
					url: 'https://api.freeagent.com/v2/tracking_groups/1',
					name: 'Region',
					status: 'active',
					labels: [],
					created_at: '2026-10-01T09:15:00.000Z',
					updated_at: '2026-10-14T11:42:03.000Z',
				},
			}).success,
		).toBe(true);
		expect(
			FreeAgentEndpointOutputSchemas.recurringInvoicesList.safeParse({
				recurring_invoices: [
					{
						url: 'https://api.freeagent.com/v2/recurring_invoices/1',
						contact: 'https://api.freeagent.com/v2/contacts/1',
						dated_on: '2026-10-01',
						frequency: 'Monthly',
						next_recurs_on: '2026-11-01',
						recurring_end_date: '',
						recurring_status: 'Active',
					},
				],
				pagination: { link: null, total_count: '1' },
			}).success,
		).toBe(true);
	});

	it('validates documented pagination bounds and dates', () => {
		expect(
			FreeAgentEndpointInputSchemas.contactsList.safeParse({
				query: { per_page: 100, page: 1 },
			}).success,
		).toBe(true);
		expect(
			FreeAgentEndpointInputSchemas.contactsList.safeParse({
				query: { per_page: 101 },
			}).success,
		).toBe(false);
		expect(
			FreeAgentEndpointInputSchemas.contactsList.safeParse({
				query: { from_date: '2025-02-30' },
			}).success,
		).toBe(false);
	});

	it('enforces the documented recurrence values for bills and expenses', () => {
		expect(
			ExpensesBillsEndpointSchemas['bills.create'].input.safeParse({
				bill: {
					contact: 'https://api.freeagent.com/v2/contacts/1',
					reference: 'TWO-MONTHLY',
					dated_on: '2026-01-01',
					due_on: '2026-01-31',
					recurring: 'Two Monthly',
					bill_items: [
						{
							category: 'https://api.freeagent.com/v2/categories/285',
							total_value: '10.0',
						},
					],
				},
			}).success,
		).toBe(true);
		expect(
			ExpensesBillsEndpointSchemas['bills.create'].input.safeParse({
				bill: {
					contact: 'https://api.freeagent.com/v2/contacts/1',
					reference: 'MONTHLY',
					dated_on: '2026-01-01',
					due_on: '2026-01-31',
					recurring: 'Monthly',
					bill_items: [
						{
							category: 'https://api.freeagent.com/v2/categories/285',
							total_value: '10.0',
						},
					],
				},
			}).success,
		).toBe(false);
		expect(
			ExpensesBillsEndpointSchemas['expenses.create'].input.safeParse({
				expense: {
					user: 'https://api.freeagent.com/v2/users/1',
					category: 'https://api.freeagent.com/v2/categories/285',
					dated_on: '2026-01-01',
					description: 'Monthly expense',
					gross_value: '10.0',
					recurring: 'Two Monthly',
				},
			}).success,
		).toBe(true);
		expect(
			ExpensesBillsEndpointSchemas['expenses.create'].input.safeParse({
				expense: {
					user: 'https://api.freeagent.com/v2/users/1',
					category: 'https://api.freeagent.com/v2/categories/285',
					dated_on: '2026-01-01',
					description: 'Monthly expense',
					gross_value: '10.0',
					recurring: 'Monthly',
				},
			}).success,
		).toBe(false);
	});

	it('validates versioned attachment changes and banking filters', () => {
		expect(
			BankingEndpointSchemas['bankTransactions.list'].input.safeParse({
				query: {
					bank_account: 'https://api.freeagent.com/v2/bank_accounts/1',
					view: 'unexplained',
					from_date: '2026-10-01',
					last_uploaded: true,
				},
			}).success,
		).toBe(true);
		expect(
			BankingEndpointSchemas['bankTransactions.list'].input.safeParse({
				query: {
					bank_account: 'https://api.freeagent.com/v2/bank_accounts/1',
					view: 'guessed',
				},
			}).success,
		).toBe(false);
		expect(
			BankingEndpointSchemas[
				'bankTransactionExplanations.updateAttachments'
			].input.safeParse({
				id: '1',
				attachments: [
					{
						url: 'https://api.freeagent.com/v2/attachments/1',
						_destroy: 'true',
					},
				],
			}).success,
		).toBe(true);
		expect(
			BankingEndpointSchemas[
				'bankTransactionExplanations.createAttachments'
			].input.safeParse({
				id: '1',
				attachments: Array.from({ length: 11 }, () => ({
					data: 'YQ==',
					file_name: 'receipt.png',
					content_type: 'image/png',
				})),
			}).success,
		).toBe(false);
	});

	it('validates accounting, capital asset, landlord property, and stock contracts', () => {
		expect(
			AccountingEndpointSchemas['categories.create'].input.safeParse({
				category: {
					description: 'Income',
					nominal_code: '047',
					category_group: 'income',
				},
			}).success,
		).toBe(true);
		expect(
			AccountingEndpointSchemas['categories.create'].input.safeParse({
				category: {
					description: 'Income',
					nominal_code: '200',
					category_group: 'income',
				},
			}).success,
		).toBe(false);
		expect(
			AccountingEndpointSchemas['cis.updateSettings'].input.safeParse({
				cis_settings: {
					contractor_details: null,
					subcontractor_details: { prior_deductions: null },
				},
			}).success,
		).toBe(true);
		expect(
			AssetEndpointSchemas['properties.create'].input.safeParse({
				property: { address1: 'Example address', country: 'United States' },
			}).success,
		).toBe(false);
		expect(
			AssetEndpointSchemas['capitalAssets.list'].input.safeParse({
				query: { view: 'disposable', include_history: true, page: 1 },
			}).success,
		).toBe(true);
		expect(
			AssetEndpointSchemas['stockItems.list'].input.safeParse({
				query: { sort: '-updated_at', per_page: 100 },
			}).success,
		).toBe(true);
	});

	it('validates Account Locks and distinct journal-set create/update shapes', () => {
		expect(
			AccountingEndpointSchemas['accountLocks.list'].output.safeParse({
				account_locks: [
					{
						locked_to_date: '2024-03-31',
						user_lock: true,
						locked_by_description: 'Nathan Barley',
						locked_by_url: 'https://api.freeagent.com/v2/users/1',
					},
					{
						locked_to_date: '2023-12-31',
						locked_by_description: 'Accounting Year End 2023/23',
					},
				],
				earliest_lock_date: '2024-01-01',
				latest_lock_date: '2024-12-31',
			}).success,
		).toBe(true);
		expect(
			AccountingEndpointSchemas['accountLocks.list'].output.safeParse({
				account_locks: [{ locked_to_date: '2024-02-30' }],
			}).success,
		).toBe(false);
		expect(
			AccountingEndpointSchemas['accountLocks.update'].input.safeParse({
				account_lock: { locked_to_date: '2024-12-31' },
			}).success,
		).toBe(true);
		expect(
			AccountingEndpointSchemas['accountLocks.update'].input.safeParse({
				account_lock: { locked_to_date: '2024-12-31', user_lock: true },
			}).success,
		).toBe(false);

		expect(
			AccountingEndpointSchemas['journalSets.update'].input.safeParse({
				id: '37',
				journal_set: {
					journal_entries: [
						{
							url: 'https://api.freeagent.com/v2/journal_sets/37/journal_entries/18',
							debit_value: '-20.0',
						},
					],
				},
			}).success,
		).toBe(true);
		expect(
			AccountingEndpointSchemas['journalSets.update'].input.safeParse({
				id: '37',
				journal_set: {
					journal_entries: [
						{
							url: 'https://api.freeagent.com/v2/journal_sets/37/journal_entries/17',
							_destroy: true,
						},
					],
				},
			}).success,
		).toBe(true);
		expect(
			AccountingEndpointSchemas['journalSets.update'].input.safeParse({
				id: '37',
				journal_set: {
					journal_entries: [
						{
							category: 'https://api.freeagent.com/v2/categories/001',
							debit_value: '-20.0',
						},
					],
				},
			}).success,
		).toBe(true);
		expect(
			AccountingEndpointSchemas['journalSets.create'].input.safeParse({
				journal_set: {
					dated_on: '2026-10-01',
					description: 'Single entry is invalid on create',
					journal_entries: [
						{
							category: 'https://api.freeagent.com/v2/categories/001',
							debit_value: '10.0',
						},
					],
				},
			}).success,
		).toBe(false);
	});

	it('validates note parent selection, price items, and tax resource inputs', () => {
		expect(
			CatalogEndpointSchemas['notes.list'].input.safeParse({
				query: { contact: 'https://api.freeagent.com/v2/contacts/1', page: 1 },
			}).success,
		).toBe(true);
		expect(
			CatalogEndpointSchemas['notes.list'].input.safeParse({
				query: {
					contact: 'https://api.freeagent.com/v2/contacts/1',
					project: 'https://api.freeagent.com/v2/projects/1',
				},
			}).success,
		).toBe(false);
		expect(
			CatalogEndpointSchemas['priceListItems.create'].input.safeParse({
				price_list_item: {
					code: 'A001',
					quantity: '1.0',
					item_type: 'Products',
					description: 'Apple',
					price: '1.99',
				},
			}).success,
		).toBe(true);
		expect(
			CatalogEndpointSchemas['salesTaxPeriods.create'].input.safeParse({
				sales_tax_period: {
					sales_tax_name: 'Local tax',
					sales_tax_registration_status: 'Registered',
					sales_tax_rate_1: '2.0',
					sales_tax_is_value_added: true,
					effective_date: '2026-01-01',
				},
			}).success,
		).toBe(true);
		expect(
			CatalogEndpointSchemas['salesTax.rates'].input.safeParse({
				query: { country: 'Austria', date: '2026-01-01' },
			}).success,
		).toBe(true);
	});

	it('keeps estimate creation statuses to the provider-verified create values', () => {
		const estimate = {
			estimate_type: 'Estimate',
			contact: 'https://api.freeagent.com/v2/contacts/1',
			reference: 'E-001',
			dated_on: '2026-10-01',
			currency: 'GBP',
		};
		for (const status of ['Draft', 'Approved', 'Rejected']) {
			expect(
				EstimateEndpointSchemas['estimates.create'].input.safeParse({
					estimate: { ...estimate, status },
				}).success,
			).toBe(true);
		}
		for (const status of ['Sent', 'Open', 'Invoiced']) {
			expect(
				EstimateEndpointSchemas['estimates.create'].input.safeParse({
					estimate: { ...estimate, status },
				}).success,
			).toBe(false);
		}
	});

	it('requires documented operation identifiers and resource envelopes', () => {
		expect(
			FreeAgentEndpointInputSchemas.contactsGet.safeParse({ id: '' }).success,
		).toBe(false);
		expect(
			FreeAgentEndpointInputSchemas.contactsCreate.safeParse({
				contact: { organisation_name: 'Example Ltd' },
			}).success,
		).toBe(true);
		expect(
			FreeAgentEndpointInputSchemas.contactsCreate.safeParse({
				contact: { first_name: 'A' },
			}).success,
		).toBe(false);
		expect(
			FreeAgentEndpointInputSchemas.projectsCreate.safeParse({
				project: { name: 'Missing required data' },
			}).success,
		).toBe(false);
		expect(
			FreeAgentEndpointInputSchemas.invoicesCreate.safeParse({
				invoice: {
					contact: 'https://api.freeagent.com/v2/contacts/1',
					dated_on: '2025-01-15',
				},
			}).success,
		).toBe(false);
		expect(
			FreeAgentEndpointInputSchemas.invoicesCreate.safeParse({
				invoice: {
					contact: 'https://api.freeagent.com/v2/contacts/1',
					dated_on: '2025-01-15',
					payment_terms_in_days: 30,
					invoice_items: [
						{ description: 'Consulting services', price: 125.5, quantity: 2 },
					],
				},
			}).success,
		).toBe(true);
		expect(
			FreeAgentEndpointInputSchemas.invoicesCreate.safeParse({
				invoice: {
					contact: 'https://api.freeagent.com/v2/contacts/1',
					dated_on: '2025-01-15',
					payment_terms_in_days: 30,
					invoice_items: [
						{
							url: 'https://api.freeagent.com/v2/invoice_items/1',
							description: 'Consulting services',
							price: '125.50',
						},
					],
				},
			}).success,
		).toBe(false);
		expect(
			FreeAgentEndpointInputSchemas.invoicesCreate.safeParse({
				invoice: { undocumented: true },
			}).success,
		).toBe(false);
		expect(
			FreeAgentEndpointInputSchemas.invoicesSendEmail.safeParse({
				id: '1',
				email: {
					attachments: [
						{
							content_type: 'text/plain',
							data: 'dGVzdA==',
							file_name: 'note.txt',
						},
					],
				},
			}).success,
		).toBe(true);
		expect(
			FreeAgentEndpointInputSchemas.invoicesSendEmail.safeParse({
				id: '1',
				email: {
					attachments: [
						{
							content_type: 'text/plain',
							data: 'A'.repeat(7_000_000),
							file_name: 'large.txt',
						},
					],
				},
			}).success,
		).toBe(false);
		expect(
			FreeAgentEndpointInputSchemas.recurringInvoicesList.safeParse({
				query: { view: 'active', page: 2, per_page: 50 },
			}).success,
		).toBe(true);
		expect(
			FreeAgentEndpointInputSchemas.recurringInvoicesList.safeParse({
				query: { view: 'pending' },
			}).success,
		).toBe(false);
		expect(
			FreeAgentEndpointInputSchemas.trackingGroupsList.safeParse({
				query: {
					include_hidden: true,
					order_by: 'labels_count',
					reverse: true,
				},
			}).success,
		).toBe(true);
		expect(
			FreeAgentEndpointInputSchemas.trackingGroupsList.safeParse({
				query: { order_by: 'count' },
			}).success,
		).toBe(false);
	});

	it('validates current online payment-method keys and their documented mutual exclusion', () => {
		expect(
			FreeAgentEndpointInputSchemas.invoicesUpdate.safeParse({
				id: '1',
				invoice: {
					payment_methods: { gocardless_instant_bank_pay: true, tyl: false },
				},
			}).success,
		).toBe(true);
		expect(
			FreeAgentEndpointInputSchemas.invoicesUpdate.safeParse({
				id: '1',
				invoice: { payment_methods: { unsupported_gateway: true } },
			}).success,
		).toBe(false);
		expect(
			FreeAgentEndpointInputSchemas.invoicesUpdate.safeParse({
				id: '1',
				invoice: {
					payment_methods: { stripe: true, gocardless_preauth: true },
				},
			}).success,
		).toBe(false);
	});

	it('documents invoice item request and response shapes separately', () => {
		const apiDocs = readFileSync(
			join(__dirname, '../../docs/plugins/freeagent/api.mdx'),
			'utf8',
		);
		for (const operation of [
			'invoices.create',
			'invoices.duplicate',
			'invoices.get',
			'invoices.list',
		]) {
			const snippetStart = apiDocs.indexOf(
				`await corsair.freeagent.api.${operation}(`,
			);
			const inputStart = apiDocs.indexOf('**Input**', snippetStart);
			const outputStart = apiDocs.indexOf('**Output**', inputStart);
			const operationEnd = apiDocs.indexOf('\n---', outputStart);
			const inputDocs = apiDocs.slice(inputStart, outputStart);
			const outputDocs = apiDocs.slice(outputStart, operationEnd);

			expect(snippetStart).toBeGreaterThanOrEqual(0);
			expect(inputStart).toBeGreaterThan(snippetStart);
			expect(outputStart).toBeGreaterThan(inputStart);
			expect(operationEnd).toBeGreaterThan(outputStart);
			expect(outputDocs).toContain('url?: string');
			expect(outputDocs).toContain('description?: string');
			expect(outputDocs).toContain('price?: string | number');
			expect(outputDocs).toContain('quantity?: string | number');
			expect(outputDocs).toContain('sales_tax_rate?: string | number');
			if (operation === 'invoices.create') {
				expect(inputDocs).toContain('description: string');
				expect(inputDocs).toContain('price?: number');
				expect(inputDocs).not.toContain('price?: string | number');
			}
		}
	});
});

describe('FreeAgent shapes seen on the live sandbox API (11-16)', () => {
	it('reads project decimals as strings and a nested contact object', () => {
		const project = {
			url: 'https://api.sandbox.freeagent.com/v2/projects/1',
			name: 'corsair-plugin-test project',
			currency: 'GBP',
			budget: 10,
			status: 'Active',
			budget_units: 'Hours',
			normal_billing_rate: '50.0',
			hours_per_day: '8.0',
			uses_project_invoice_sequence: false,
			billing_period: 'hour',
			include_unbilled_time_in_profitability: true,
			contact: { url: 'https://api.sandbox.freeagent.com/v2/contacts/1' },
		};
		expect(() =>
			FreeAgentEndpointOutputSchemas.projectsGet.parse({ project }),
		).not.toThrow();
		expect(() =>
			FreeAgentEndpointOutputSchemas.projectsList.parse({
				projects: [project],
				pagination: { link: null, total_count: '1' },
			}),
		).not.toThrow();
	});

	it('reads an empty default additional text', () => {
		expect(
			FreeAgentEndpointOutputSchemas.invoicesDefaultAdditionalTextGet.parse({}),
		).toEqual({});
	});

	it('accepts invoice line ids on update, and _destroy to remove a line', () => {
		// `unknown[]` is needed because the invalid test inputs intentionally have shapes outside the accepted invoice-item union.
		const parse = (items: unknown[]) =>
			FreeAgentEndpointInputSchemas.invoicesUpdate.safeParse({
				id: '7',
				invoice: { invoice_items: items },
			}).success;
		expect(parse([{ id: '12', description: 'Revised', price: 60 }])).toBe(true);
		expect(parse([{ id: 12, _destroy: 1 }])).toBe(true);
		expect(parse([{ description: 'New line', price: 5 }])).toBe(true);
		expect(parse([{ id: 12, _destroy: 1, price: 5 }])).toBe(false);
		expect(
			FreeAgentEndpointInputSchemas.invoicesCreate.safeParse({
				invoice: {
					contact: 'https://api.freeagent.com/v2/contacts/1',
					dated_on: '2026-11-16',
					payment_terms_in_days: 30,
					invoice_items: [{ id: '12', description: 'x' }],
				},
			}).success,
		).toBe(false);
	});
});

describe('FreeAgent OAuth', () => {
	it('declares the OAuth app URLs, production by default and sandbox on request', () => {
		expect(freeagent().oauthConfig).toMatchObject({
			authUrl: 'https://api.freeagent.com/v2/approve_app',
			tokenUrl: 'https://api.freeagent.com/v2/token_endpoint',
			tokenAuthMethod: 'basic',
		});
		expect(freeagent({ sandbox: true }).oauthConfig).toMatchObject({
			authUrl: 'https://api.sandbox.freeagent.com/v2/approve_app',
			tokenUrl: 'https://api.sandbox.freeagent.com/v2/token_endpoint',
		});
	});

	it('refreshes an expired access token instead of returning it', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(
				JSON.stringify({
					access_token: 'fresh-token',
					refresh_token: 'refresh-token',
					expires_in: 3600,
					token_type: 'bearer',
				}),
				{ status: 200, headers: { 'Content-Type': 'application/json' } },
			),
		);
		const stored: Record<string, string | null> = {
			access: 'expired-token',
			refresh: 'refresh-token',
			expires: '1',
		};
		try {
			const plugin = freeagent();
			const keys = {
				get_dek: async () => '',
				issue_new_dek: async () => '',
				get_integration_credentials: async () => ({
					client_id: 'client-id',
					client_secret: 'client-secret',
					redirect_url: null,
				}),
				get_access_token: async () => stored.access ?? null,
				set_access_token: async (value: string | null) => {
					stored.access = value;
				},
				get_refresh_token: async () => stored.refresh ?? null,
				set_refresh_token: async (value: string | null) => {
					stored.refresh = value;
				},
				get_expires_at: async () => stored.expires ?? null,
				set_expires_at: async (value: string | null) => {
					stored.expires = value;
				},
				get_scope: async () => null,
				set_scope: async () => {},
				get_webhook_signature: async () => null,
				set_webhook_signature: async () => {},
			} satisfies AccountKeyManagerFor<'oauth_2'>;
			const refreshContext = {
				authType: 'oauth_2',
				tenantId: 'tenant-test',
				options: plugin.options ?? {},
				keys,
			} satisfies Parameters<NonNullable<typeof plugin.keyBuilder>>[0];
			const token = await plugin.keyBuilder?.(refreshContext, 'endpoint');
			expect(token).toBe('fresh-token');
			expect(String(fetchMock.mock.calls[0]?.[0])).toBe(
				'https://api.freeagent.com/v2/token_endpoint',
			);
		} finally {
			fetchMock.mockRestore();
		}
	});
});
